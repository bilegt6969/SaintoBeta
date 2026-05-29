import type { Product } from "lib/commerce";

const STAFF_PICK_TAG = "staff-pick";

export function isStaffPick(product: Product): boolean {
  return product.tags.some((tag) => tag.toLowerCase() === STAFF_PICK_TAG);
}

function isMetaTag(tag: string): boolean {
  const lower = tag.toLowerCase();
  return (
    lower === STAFF_PICK_TAG ||
    lower.startsWith("brand:") ||
    lower.startsWith("category:")
  );
}

export function getProductBrand(product: Product): string {
  // Use brand field if available (from Sanity)
  if (product.brand) return product.brand;

  // Fallback to tag-based method for backwards compatibility
  const brandTag = product.tags.find((tag) =>
    tag.toLowerCase().startsWith("brand:"),
  );
  if (brandTag) return brandTag.slice("brand:".length).trim();
  return product.tags.find((tag) => !isMetaTag(tag)) ?? "Goods";
}

export function getProductCategory(product: Product): string {
  if (product.categoryTitle) {
    return product.categoryTitle;
  }

  const categoryTag = product.tags.find((tag) =>
    tag.toLowerCase().startsWith("category:"),
  );
  if (categoryTag) return categoryTag.slice("category:".length).trim();
  const plainTags = product.tags.filter((tag) => !isMetaTag(tag));
  return plainTags[1] ?? plainTags[0] ?? "Lifestyle";
}
