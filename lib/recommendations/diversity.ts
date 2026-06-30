import type { DiversityConstraints, ScoredProduct } from "./types";

/**
 * Inject diversity into a sorted (highest-score-first) list of products
 * by capping how many items from the same brand or primary category can appear.
 *
 * This prevents a single well-matched brand from dominating the widget.
 * Run AFTER scoring and sorting; before slicing to the final limit.
 */
export function injectDiversity(
  scoredProducts: ScoredProduct[],
  constraints: DiversityConstraints = { maxPerBrand: 2, maxPerCategory: 3 },
): ScoredProduct[] {
  const brandCount: Record<string, number> = {};
  const categoryCount: Record<string, number> = {};
  const result: ScoredProduct[] = [];

  for (const scored of scoredProducts) {
    const { product } = scored;
    const brandKey = product.brand.toLowerCase();
    const primaryCategory = (
      product.categories?.[0] ?? "unknown"
    ).toLowerCase();

    const brandOk = (brandCount[brandKey] ?? 0) < constraints.maxPerBrand;
    const categoryOk =
      (categoryCount[primaryCategory] ?? 0) < constraints.maxPerCategory;

    if (brandOk && categoryOk) {
      result.push(scored);
      brandCount[brandKey] = (brandCount[brandKey] ?? 0) + 1;
      categoryCount[primaryCategory] =
        (categoryCount[primaryCategory] ?? 0) + 1;
    }
  }

  return result;
}
