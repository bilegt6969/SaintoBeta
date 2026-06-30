/**
 * Minimal product shape needed to build the bundle affinity map.
 * Using this instead of the full RecommendationProduct lets us fetch
 * a lightweight payload from Sanity when warming the cache.
 */
export interface BundleProduct {
  id: string;
  categories: string[];
  purchaseBundles?: {
    single?: any;
    twoPack?: any;
    stylingKit?: any;
  };
}

/**
 * Build a map of product IDs → Set of product IDs that are "bundle-affine"
 * (i.e. commonly purchased together via two-pack or styling-kit bundles
 * within the same category).
 *
 * This is pre-computed once and cached — not rebuilt per request.
 */
export function buildBundleAffinityMap(
  products: BundleProduct[],
): Map<string, Set<string>> {
  const affinityMap = new Map<string, Set<string>>();

  for (const product of products) {
    if (!product.purchaseBundles) continue;

    const bundleTypes: string[] = [];
    if (product.purchaseBundles.twoPack) bundleTypes.push("two-pack");
    if (product.purchaseBundles.stylingKit) bundleTypes.push("styling-kit");

    if (bundleTypes.length === 0) continue;

    for (const bundleType of bundleTypes) {
      const peers = products.filter(
        (p) =>
          p.id !== product.id &&
          p.purchaseBundles &&
          ((bundleType === "two-pack" && p.purchaseBundles.twoPack) ||
            (bundleType === "styling-kit" && p.purchaseBundles.stylingKit)) &&
          p.categories.some((c) => product.categories.includes(c)),
      );

      if (peers.length > 0) {
        if (!affinityMap.has(product.id)) {
          affinityMap.set(product.id, new Set());
        }
        peers.forEach((p) => affinityMap.get(product.id)!.add(p.id));
      }
    }
  }

  return affinityMap;
}

export function scoreBundleAffinity(
  sourceId: string,
  candidateId: string,
  affinityMap: Map<string, Set<string>>,
): number {
  return affinityMap.get(sourceId)?.has(candidateId) ? 1.0 : 0;
}
