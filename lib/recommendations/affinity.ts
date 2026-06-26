// Hardcoded affinity weights between category pairs (symmetric)
// These override or augment the Jaccard score when categories don't overlap
export const CROSS_CATEGORY_AFFINITY: Record<string, Record<string, number>> = {
  Sneakers: {
    Accessories: 0.7, // socks, laces, shoe care — natural companions
    Clothes: 0.55, // outfit building
    Carry: 0.3, // backpacks, bags matching the look
    Heritage: 0.25, // collector overlap
  },
  Clothes: {
    Accessories: 0.6, // belts, hats, scarves
    Sneakers: 0.55,
    Watches: 0.35,
    Carry: 0.3,
  },
  Watches: {
    Accessories: 0.55, // stacking with bracelets, rings
    Heritage: 0.45, // collector mindset
    Clothes: 0.35,
  },
  Fragrance: {
    Beauty: 0.65, // grooming ecosystem
    Lifestyle: 0.4,
    Accessories: 0.25,
  },
  Heritage: {
    Art: 0.6, // collector crossover
    Watches: 0.45,
    Lifestyle: 0.35,
  },
  Tech: {
    Carry: 0.55, // EDC (everyday carry) mindset
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
  candidateCategories: string[]
): number {
  let maxBonus = 0;
  for (const src of sourceCategories) {
    for (const cand of candidateCategories) {
      if (src.toLowerCase() === cand.toLowerCase()) continue;
      const bonus =
        CROSS_CATEGORY_AFFINITY[src]?.[cand] ??
        CROSS_CATEGORY_AFFINITY[cand]?.[src] ??
        0;
      maxBonus = Math.max(maxBonus, bonus);
    }
  }
  return maxBonus;
}
