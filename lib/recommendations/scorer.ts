import { getCrossCategoryBonus } from "./affinity";
import { scoreBundleAffinity } from "./bundles";
import type { RecommendationProduct, ScoringContext } from "./types";

// Jaccard similarity for sets
function jaccard(setA: Set<string>, setB: Set<string>): number {
  const intersection = new Set([...setA].filter((x) => setB.has(x)));
  const union = new Set([...setA, ...setB]);
  return union.size === 0 ? 0 : intersection.size / union.size;
}

// Sale alignment scoring
function scoreSaleAlignment(
  source: RecommendationProduct,
  candidate: RecommendationProduct,
): number {
  const sourcePrice = source.priceRange?.maxVariantPrice?.amount
    ? parseFloat(source.priceRange.maxVariantPrice.amount)
    : 0;
  const candidatePrice = candidate.priceRange?.maxVariantPrice?.amount
    ? parseFloat(candidate.priceRange.maxVariantPrice.amount)
    : 0;

  const sourceCompareAt = source.compareAtPrice ?? sourcePrice;
  const candidateCompareAt = candidate.compareAtPrice ?? candidatePrice;

  const sourceIsOnSale = sourceCompareAt > sourcePrice;
  const candidateIsOnSale = candidateCompareAt > candidatePrice;

  if (!sourceIsOnSale) return 0; // neutral if source isn't a sale item
  return candidateIsOnSale ? 0.1 : 0; // boost other sale items for sale-seekers
}

// Main scoring function
export function scoreProductPair(
  source: RecommendationProduct,
  candidate: RecommendationProduct,
  ctx: ScoringContext,
): number {
  // ── Signal 1: Category (Jaccard + cross-category affinity) ───────────────
  const srcCats = new Set(
    (source.categories ?? []).map((c) => c.toLowerCase()),
  );
  const candCats = new Set(
    (candidate.categories ?? []).map((c) => c.toLowerCase()),
  );
  const jaccardCat = jaccard(srcCats, candCats);
  const crossCatBonus =
    jaccardCat > 0
      ? 0 // already overlapping categories, no cross-category bonus
      : getCrossCategoryBonus(
          source.categories ?? [],
          candidate.categories ?? [],
        ) * 0.4;
  const categoryScore = jaccardCat * 0.35 + crossCatBonus;

  // ── Signal 2: Brand ───────────────────────────────────────────────────────
  const brandScore =
    source.brand.toLowerCase() === candidate.brand.toLowerCase() ? 0.2 : 0;

  // ── Signal 3: Tags (Jaccard, de-prefixed) ────────────────────────────────
  const cleanTag = (t: string) =>
    !t.startsWith("brand:") && !t.startsWith("category:");
  const srcTags = new Set(
    source.tags.filter(cleanTag).map((t) => t.toLowerCase()),
  );
  const candTags = new Set(
    candidate.tags.filter(cleanTag).map((t) => t.toLowerCase()),
  );
  const tagScore = jaccard(srcTags, candTags) * 0.15;

  // ── Signal 4: Price (log-scale proximity, normalized) ────────────────────
  const sourcePrice = source.priceRange?.maxVariantPrice?.amount
    ? parseFloat(source.priceRange.maxVariantPrice.amount)
    : 0;
  const candidatePrice = candidate.priceRange?.maxVariantPrice?.amount
    ? parseFloat(candidate.priceRange.maxVariantPrice.amount)
    : 0;
  const logDiff = Math.abs(
    Math.log(sourcePrice + 1) - Math.log(candidatePrice + 1),
  );
  const priceScore = Math.exp(-logDiff) * 0.1;

  // ── Signal 5: Condition ───────────────────────────────────────────────────
  const CONDITION_RANK: Record<string, number> = {
    new: 4,
    "like-new": 3,
    good: 2,
    fair: 1,
  };
  const r1 = source.condition ? (CONDITION_RANK[source.condition] ?? 2.5) : 2.5;
  const r2 = candidate.condition
    ? (CONDITION_RANK[candidate.condition] ?? 2.5)
    : 2.5;
  const conditionScore = (1 - Math.abs(r1 - r2) / 3) * 0.08;

  // ── Signal 6: Recency ─────────────────────────────────────────────────────
  const daysSince =
    (Date.now() - new Date(candidate.updatedAt).getTime()) / 86_400_000;
  const recencyScore = Math.max(0, 1 - daysSince / 180) * 0.05;

  // ── Signal 7: Sale alignment ──────────────────────────────────────────────
  const saleScore = scoreSaleAlignment(source, candidate);

  // ── Signal 8: Bundle affinity ─────────────────────────────────────────────
  const bundleScore = scoreBundleAffinity(
    source.id,
    candidate.id,
    ctx.bundleAffinityMap,
  );

  // ── Signal 9: Beauty (bestFor match) ─────────────────────────────────────
  let beautyScore = 0;
  if (source.bestFor && candidate.bestFor) {
    // Check if both products have matching bestFor labels
    const hairTypeMatch =
      source.bestFor.hairType?.label === candidate.bestFor.hairType?.label;
    const hairLengthMatch =
      source.bestFor.hairLength?.label === candidate.bestFor.hairLength?.label;
    const matches = (hairTypeMatch ? 1 : 0) + (hairLengthMatch ? 1 : 0);
    const possible =
      (source.bestFor.hairType ? 1 : 0) + (source.bestFor.hairLength ? 1 : 0);
    beautyScore = possible > 0 ? (matches / possible) * 0.07 : 0;
  }

  // ── Multipliers ───────────────────────────────────────────────────────────
  const availabilityMultiplier = !candidate.availableForSale
    ? 0.05
    : candidate.outOfStock
      ? 0.5
      : 1.0;

  const staffPickBoost = candidate.tags.includes("staff-pick") ? 1.15 : 1.0;

  // ── Assemble ──────────────────────────────────────────────────────────────
  const base =
    categoryScore +
    brandScore +
    tagScore +
    priceScore +
    conditionScore +
    recencyScore +
    saleScore +
    bundleScore +
    beautyScore;

  return base * availabilityMultiplier * staffPickBoost;
}

// Trending-specific scoring (for Phase 1 trending strategy)
export function scoreTrending(
  candidate: RecommendationProduct,
  viewCount?: number,
): number {
  const daysSince =
    (Date.now() - new Date(candidate.updatedAt).getTime()) / 86_400_000;
  // Half-life of 15 days: items 30 days old score ~0.25
  const recency = Math.exp(-daysSince / 15);

  const candidatePrice = candidate.priceRange?.maxVariantPrice?.amount
    ? parseFloat(candidate.priceRange.maxVariantPrice.amount)
    : 0;
  const candidateCompareAt = candidate.compareAtPrice ?? candidatePrice;
  const isOnSale = candidateCompareAt > candidatePrice ? 1.1 : 1.0;

  const staffPick = candidate.tags.includes("staff-pick") ? 1.15 : 1.0;

  const available = !candidate.availableForSale
    ? 0.05
    : candidate.outOfStock
      ? 0.5
      : 1;

  // View count scoring: normalize using log scale to prevent domination
  // Views with log scaling: 10 views ≈ 1.0, 100 views ≈ 1.5, 1000 views ≈ 2.0
  const viewScore = viewCount ? Math.log10(viewCount + 1) * 0.3 : 0;

  return recency * isOnSale * staffPick * available + viewScore;
}
