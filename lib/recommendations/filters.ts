import type { RecommendationProduct } from "./types";

// Pre-filter candidates by size availability
export function filterByVariantAvailability(
  products: RecommendationProduct[],
  targetProduct: RecommendationProduct,
): RecommendationProduct[] {
  // Extract the sizes available in the target product
  const targetSizes = new Set(
    targetProduct.variants
      .filter((v: any) => v.availableForSale)
      .flatMap((v: any) => v.selectedOptions)
      .filter((opt: any) => opt.name.toLowerCase() === "size")
      .map((opt: any) => opt.value.toLowerCase()),
  );

  if (targetSizes.size === 0) return products; // no size data, skip filter

  return products.filter((p) =>
    p.variants.some(
      (v: any) =>
        v.availableForSale &&
        v.selectedOptions.some(
          (opt: any) =>
            opt.name.toLowerCase() === "size" &&
            targetSizes.has(opt.value.toLowerCase()),
        ),
    ),
  );
}
