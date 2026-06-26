import type { RecommendationProduct } from "./types";

// Build a bundle affinity map from the product catalog at startup
// This runs once per cache cycle, not per recommendation request
export function buildBundleAffinityMap(
  products: RecommendationProduct[],
): Map<string, Set<string>> {
  const affinityMap = new Map<string, Set<string>>();

  for (const product of products) {
    if (!product.purchaseBundles) continue;

    const bundleTypes = [];
    if (product.purchaseBundles.single) bundleTypes.push("single");
    if (product.purchaseBundles.twoPack) bundleTypes.push("two-pack");
    if (product.purchaseBundles.stylingKit) bundleTypes.push("styling-kit");

    if (bundleTypes.length === 0) continue;

    // A product with bundles implies it's meant to be bought with something else.
    // Cross-reference by looking at products that share these bundle types.
    for (const bundleType of bundleTypes) {
      if (bundleType === "styling-kit" || bundleType === "two-pack") {
        if (!affinityMap.has(product.id)) {
          affinityMap.set(product.id, new Set());
        }
        // Products sharing a bundle type in the same category are likely companions
        products
          .filter(
            (p) =>
              p.id !== product.id &&
              p.purchaseBundles &&
              ((bundleType === "two-pack" && p.purchaseBundles.twoPack) ||
                (bundleType === "styling-kit" &&
                  p.purchaseBundles.stylingKit)) &&
              p.categories &&
              product.categories &&
              p.categories.some((c) => product.categories!.includes(c)),
          )
          .forEach((p) => affinityMap.get(product.id)!.add(p.id));
      }
    }
  }

  return affinityMap;
}

// Scoring bonus: +0.2 if candidate is in source's bundle affinity map
export function scoreBundleAffinity(
  sourceId: string,
  candidateId: string,
  affinityMap: Map<string, Set<string>>,
): number {
  return affinityMap.get(sourceId)?.has(candidateId) ? 0.2 : 0;
}
