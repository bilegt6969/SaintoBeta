import type { ScoredProduct } from "./types";
import type { DiversityConstraints } from "./types";

export function injectDiversity(
  scoredProducts: ScoredProduct[],
  constraints: DiversityConstraints = { maxPerBrand: 2, maxPerCategory: 3 }
): ScoredProduct[] {
  const brandCount: Record<string, number> = {};
  const categoryCount: Record<string, number> = {};
  const result: ScoredProduct[] = [];

  for (const scored of scoredProducts) {
    const { product } = scored;
    const brandKey = product.brand.toLowerCase();
    const primaryCategory = product.categories?.[0] ?? "unknown";

    const brandOk = (brandCount[brandKey] ?? 0) < constraints.maxPerBrand;
    const categoryOk =
      (categoryCount[primaryCategory] ?? 0) < constraints.maxPerCategory;

    if (brandOk && categoryOk) {
      result.push(scored);
      brandCount[brandKey] = (brandCount[brandKey] ?? 0) + 1;
      categoryCount[primaryCategory] = (categoryCount[primaryCategory] ?? 0) + 1;
    }
  }

  return result;
}
