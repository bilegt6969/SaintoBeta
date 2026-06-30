/**
 * Cross-category affinity matrix — tuned for a thrift clothing platform.
 * Values represent how complementary two categories are in an outfit-building context.
 * Range: 0 (unrelated) to 1 (almost always paired).
 *
 * To update: add new category keys and their affinities. The lookup is
 * bidirectional (A→B falls back to B→A), so you only need to define one direction.
 */
export const CROSS_CATEGORY_AFFINITY: Record<string, Record<string, number>> = {
  Sneakers: {
    Accessories: 0.7,
    Clothes: 0.65, // Bumped: thrift outfit building is core use case
    Carry: 0.35,
    Heritage: 0.25,
    Hats: 0.5,
    Bottoms: 0.6,
    Tops: 0.55,
    Outerwear: 0.45,
  },
  Tops: {
    Bottoms: 0.85, // Highest: tops and bottoms are always paired
    Sneakers: 0.55,
    Accessories: 0.5,
    Outerwear: 0.6,
    Hats: 0.4,
    Carry: 0.25,
  },
  Bottoms: {
    Tops: 0.85,
    Sneakers: 0.6,
    Accessories: 0.45,
    Outerwear: 0.55,
    Hats: 0.35,
    Carry: 0.25,
  },
  Outerwear: {
    Tops: 0.6,
    Bottoms: 0.55,
    Accessories: 0.5,
    Hats: 0.45,
    Sneakers: 0.4,
    Carry: 0.3,
  },
  Clothes: {
    // Generic "Clothes" bucket — for catalogs that haven't split Tops/Bottoms yet
    Accessories: 0.65,
    Sneakers: 0.65,
    Watches: 0.35,
    Carry: 0.3,
    Hats: 0.55,
    Outerwear: 0.7,
  },
  Hats: {
    Clothes: 0.55,
    Tops: 0.5,
    Sneakers: 0.5,
    Accessories: 0.45,
    Outerwear: 0.45,
  },
  Watches: {
    Accessories: 0.55,
    Heritage: 0.45,
    Clothes: 0.35,
    Tops: 0.3,
  },
  Fragrance: {
    Beauty: 0.65,
    Lifestyle: 0.4,
    Accessories: 0.25,
  },
  Heritage: {
    Art: 0.6,
    Watches: 0.45,
    Lifestyle: 0.35,
  },
  Tech: {
    Carry: 0.55,
    Lifestyle: 0.4,
    Accessories: 0.3,
  },
  Beauty: {
    Fragrance: 0.65,
    Lifestyle: 0.35,
  },
};

export function getCrossCategoryBonus(
  sourceCategories: string[],
  candidateCategories: string[],
): number {
  let maxBonus = 0;
  for (const src of sourceCategories) {
    for (const cand of candidateCategories) {
      if (src.toLowerCase() === cand.toLowerCase()) continue;
      // Capitalize for matrix lookup
      const srcKey = src.charAt(0).toUpperCase() + src.slice(1).toLowerCase();
      const candKey =
        cand.charAt(0).toUpperCase() + cand.slice(1).toLowerCase();
      const bonus =
        CROSS_CATEGORY_AFFINITY[srcKey]?.[candKey] ??
        CROSS_CATEGORY_AFFINITY[candKey]?.[srcKey] ?? // bidirectional fallback
        0;
      maxBonus = Math.max(maxBonus, bonus);
    }
  }
  return maxBonus;
}

/**
 * Known thrift aesthetic tags that carry strong style-matching signal.
 * When two products share a style tag (e.g. both "y2k"), that's a much
 * stronger signal than sharing a generic tag like "sale".
 *
 * Add to this list as your catalog's tagging vocabulary grows.
 */
export const STYLE_TAGS = new Set([
  "y2k",
  "vintage",
  "90s",
  "80s",
  "70s",
  "60s",
  "retro",
  "grunge",
  "streetwear",
  "workwear",
  "preppy",
  "minimalist",
  "boho",
  "cottagecore",
  "dark-academia",
  "gorpcore",
  "techwear",
  "normcore",
  "old-money",
  "coastal-grandmother",
  "coquette",
  "indie",
  "skater",
  "hip-hop",
  "athletic",
  "luxe",
  "punk",
  "soft-girl",
  "clean-girl",
  "mob-wife",
  "quiet-luxury",
]);

/**
 * Extract known style/aesthetic tags from a product's tag array.
 * Handles both plain tags ("y2k") and prefixed tags ("style:y2k").
 */
export function extractStyleTags(tags: string[]): Set<string> {
  return new Set(
    tags
      .map((t) => t.toLowerCase().replace(/^style:/, ""))
      .filter((t) => STYLE_TAGS.has(t)),
  );
}
