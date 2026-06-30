import type { RecommendationProduct } from "./types";

/**
 * Filter candidates to only those that share at least one available size
 * with the source product.
 *
 * If the source has no available sizes (e.g. non-sized items like accessories),
 * the filter is skipped and all candidates are returned unchanged.
 */
export function filterByVariantAvailability(
  products: RecommendationProduct[],
  sourceProduct: RecommendationProduct,
): RecommendationProduct[] {
  const sourceSizes = new Set(
    sourceProduct.variants
      .filter((v: any) => v.availableForSale)
      .flatMap((v: any) => v.selectedOptions ?? [])
      .filter((opt: any) => opt.name?.toLowerCase() === "size")
      .map((opt: any) => (opt.value as string).toLowerCase()),
  );

  // No size variants on source — size filter doesn't apply (e.g. accessories)
  if (sourceSizes.size === 0) return products;

  return products.filter((p) =>
    p.variants.some(
      (v: any) =>
        v.availableForSale &&
        (v.selectedOptions ?? []).some(
          (opt: any) =>
            opt.name?.toLowerCase() === "size" &&
            sourceSizes.has((opt.value as string).toLowerCase()),
        ),
    ),
  );
}
