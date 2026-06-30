import { extractStyleTags, getCrossCategoryBonus } from "./affinity";
import { scoreBundleAffinity } from "./bundles";
import type {
    RecommendationProduct,
    ScoringContext,
    UserContext,
} from "./types";

// ─── Helpers ────────────────────────────────────────────────────────────────

function jaccard(setA: Set<string>, setB: Set<string>): number {
  if (setA.size === 0 && setB.size === 0) return 0;
  const intersection = [...setA].filter((x) => setB.has(x)).length;
  const union = new Set([...setA, ...setB]).size;
  return union === 0 ? 0 : intersection / union;
}

const CONDITION_RANK: Record<string, number> = {
  new: 4,
  "like-new": 3,
  good: 2,
  fair: 1,
};

function conditionRank(condition?: string): number {
  return condition ? (CONDITION_RANK[condition] ?? 2.5) : 2.5;
}

/**
 * Thrift-specific availability gate.
 * Unlike regular e-commerce, a sold thrift item is gone forever —
 * there's no point surfacing it as a recommendation at all.
 */
function availabilityMultiplier(candidate: RecommendationProduct): number {
  if (!candidate.availableForSale) return 0; // Hard zero — sold = gone
  if (candidate.outOfStock) return 0.2; // Almost gone — heavily deprioritised
  return 1.0;
}

// ─── Pre-computation ─────────────────────────────────────────────────────────

/**
 * Pre-compute all source-product signals that don't change across candidates.
 * Call this ONCE before iterating over candidates — not inside the loop.
 */
export interface PrecomputedSource {
  categorySet: Set<string>;
  cleanTagSet: Set<string>;
  styleTagSet: Set<string>;
  price: number;
  condRank: number;
  isOnSale: boolean;
}

const isSystemTag = (t: string) =>
  t.startsWith("brand:") || t.startsWith("category:");

export function precomputeSource(
  source: RecommendationProduct,
): PrecomputedSource {
  const price = parseFloat(source.priceRange?.maxVariantPrice?.amount ?? "0");

  return {
    categorySet: new Set((source.categories ?? []).map((c) => c.toLowerCase())),
    cleanTagSet: new Set(
      source.tags.filter((t) => !isSystemTag(t)).map((t) => t.toLowerCase()),
    ),
    styleTagSet: extractStyleTags(source.tags),
    price,
    condRank: conditionRank(source.condition),
    isOnSale: (source.compareAtPrice ?? price) > price,
  };
}

// ─── Main scoring function ───────────────────────────────────────────────────

/**
 * Score a candidate product against a source product using 10 weighted signals.
 *
 * Signals 1–9 are content-based (tuned for thrift).
 * Signal 10 activates UserContext for lightweight personalisation.
 *
 * @param precomputed  Source signals pre-computed once outside the loop
 * @param source       Full source product (needed for cross-category lookup)
 * @param candidate    Product to score
 * @param ctx          Scoring context (bundle map + resolved weights)
 * @param userCtx      Optional user behaviour context
 */
export function scoreProductPair(
  precomputed: PrecomputedSource,
  source: RecommendationProduct,
  candidate: RecommendationProduct,
  ctx: ScoringContext,
  userCtx?: UserContext,
): number {
  const { weights } = ctx;

  // ── Availability gate (thrift: sold items get hard zero) ──────────────────
  const avail = availabilityMultiplier(candidate);
  if (avail === 0) return 0;

  // ── Signal 1: Category — Jaccard similarity + cross-category affinity ─────
  const candCats = new Set(
    (candidate.categories ?? []).map((c) => c.toLowerCase()),
  );
  const jaccardCat = jaccard(precomputed.categorySet, candCats);
  // Cross-category bonus only fires when there is NO direct category overlap
  const crossCatBonus =
    jaccardCat > 0
      ? 0
      : getCrossCategoryBonus(
          source.categories ?? [],
          candidate.categories ?? [],
        ) * 0.4;
  const categoryScore = jaccardCat * weights.category + crossCatBonus;

  // ── Signal 2: Brand ───────────────────────────────────────────────────────
  const brandScore =
    source.brand.toLowerCase() === candidate.brand.toLowerCase()
      ? weights.brand
      : 0;

  // ── Signal 3: Tags — split into style tags (1.5× boost) + general tags ───
  // Style tags ("y2k", "vintage") are the strongest signal on a thrift platform
  const candCleanTags = new Set(
    candidate.tags.filter((t) => !isSystemTag(t)).map((t) => t.toLowerCase()),
  );
  const candStyleTags = extractStyleTags(candidate.tags);

  const generalTagSimilarity = jaccard(precomputed.cleanTagSet, candCleanTags);
  const styleTagSimilarity = jaccard(precomputed.styleTagSet, candStyleTags);
  // Weighted blend: style tags count 1.5× more than general tags
  const tagScore =
    ((generalTagSimilarity * 1.0 + styleTagSimilarity * 1.5) / 2.5) *
    weights.tags;

  // ── Signal 4: Price — log-scale proximity ─────────────────────────────────
  const candPrice = parseFloat(
    candidate.priceRange?.maxVariantPrice?.amount ?? "0",
  );
  const logDiff = Math.abs(
    Math.log(precomputed.price + 1) - Math.log(candPrice + 1),
  );
  const priceScore = Math.exp(-logDiff) * weights.price;

  // ── Signal 5: Condition — thrift buyers care about grade consistency ───────
  const r2 = conditionRank(candidate.condition);
  const conditionScore =
    (1 - Math.abs(precomputed.condRank - r2) / 3) * weights.condition;

  // ── Signal 6: Recency — uses listedAt, NOT updatedAt ─────────────────────
  // listedAt = _createdAt: when the item entered the catalog.
  // updatedAt resets on every edit (typo fix, image update, etc.)
  // and would unfairly boost recently-edited older items.
  const listedAt = candidate.listedAt ?? candidate.updatedAt;
  const daysSinceListed =
    (Date.now() - new Date(listedAt).getTime()) / 86_400_000;
  const recencyScore = Math.max(0, 1 - daysSinceListed / 180) * weights.recency;

  // ── Signal 7: Sale alignment ───────────────────────────────────────────────
  const candCompareAt = candidate.compareAtPrice ?? candPrice;
  const candOnSale = candCompareAt > candPrice;
  const saleScore = precomputed.isOnSale && candOnSale ? weights.sale : 0;

  // ── Signal 8: Bundle affinity ─────────────────────────────────────────────
  const bundleScore =
    scoreBundleAffinity(source.id, candidate.id, ctx.bundleAffinityMap) *
    weights.bundle;

  // ── Signal 9: Beauty / bestFor attribute match ────────────────────────────
  let beautyScore = 0;
  if (source.bestFor && candidate.bestFor) {
    const hairTypeMatch =
      source.bestFor.hairType?.label === candidate.bestFor.hairType?.label;
    const hairLengthMatch =
      source.bestFor.hairLength?.label === candidate.bestFor.hairLength?.label;
    const matches = (hairTypeMatch ? 1 : 0) + (hairLengthMatch ? 1 : 0);
    const possible =
      (source.bestFor.hairType ? 1 : 0) + (source.bestFor.hairLength ? 1 : 0);
    beautyScore = possible > 0 ? (matches / possible) * weights.beauty : 0;
  }

  // ── Signal 10: User preference — lightweight personalisation ─────────────
  let userScore = 0;
  if (userCtx) {
    // Brand preference: did the user previously browse/buy this brand?
    const brandBoost = userCtx.preferredBrands
      .map((b) => b.toLowerCase())
      .includes(candidate.brand.toLowerCase())
      ? 0.6
      : 0;

    // Category preference: does this candidate match categories the user explored?
    const viewedCatSet = new Set(
      userCtx.viewedCategories.map((c) => c.toLowerCase()),
    );
    const categoryBoost = jaccard(viewedCatSet, candCats) * 0.4;

    // Condition preference: does the user prefer thrift-grade or new items?
    const condBoost =
      (userCtx.conditionPreference === "thrift" &&
        ["fair", "good", "like-new"].includes(candidate.condition ?? "")) ||
      (userCtx.conditionPreference === "new" && candidate.condition === "new")
        ? 0.2
        : 0;

    userScore =
      Math.min(1, brandBoost + categoryBoost + condBoost) *
      weights.userPreference;
  }

  // ── Multipliers ───────────────────────────────────────────────────────────
  const staffPickBoost = candidate.tags.includes("staff-pick") ? 1.15 : 1.0;

  const base =
    categoryScore +
    brandScore +
    tagScore +
    priceScore +
    conditionScore +
    recencyScore +
    saleScore +
    bundleScore +
    beautyScore +
    userScore;

  return base * avail * staffPickBoost;
}

// ─── Strategy-specific scorers ───────────────────────────────────────────────

/**
 * Trending score: exponential recency decay (15-day half-life) × sale × staff-pick.
 * Uses listedAt so that editing a product description doesn't make it "trend".
 */
export function scoreTrending(candidate: RecommendationProduct): number {
  const listedAt = candidate.listedAt ?? candidate.updatedAt;
  const daysSince = (Date.now() - new Date(listedAt).getTime()) / 86_400_000;
  const recency = Math.exp(-daysSince / 15);

  const candPrice = parseFloat(
    candidate.priceRange?.maxVariantPrice?.amount ?? "0",
  );
  const saleBoost =
    (candidate.compareAtPrice ?? candPrice) > candPrice ? 1.1 : 1.0;
  const staffPick = candidate.tags.includes("staff-pick") ? 1.15 : 1.0;

  return recency * saleBoost * staffPick * availabilityMultiplier(candidate);
}

/**
 * New-arrivals score: linear 30-day recency window.
 * Shows only freshly listed items; drops anything older than a month to zero.
 */
export function scoreNewArrivals(candidate: RecommendationProduct): number {
  const listedAt = candidate.listedAt ?? candidate.updatedAt;
  const daysSince = (Date.now() - new Date(listedAt).getTime()) / 86_400_000;
  const recency = Math.max(0, 1 - daysSince / 30);

  return recency * availabilityMultiplier(candidate);
}
