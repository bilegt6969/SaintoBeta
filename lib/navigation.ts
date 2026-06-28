import type { CategoryPage } from "lib/commerce/types";

export const PRODUCT_CATEGORIES = [
  { label: "Sneakers", value: "sneakers" },
  { label: "Clothes", value: "clothes" },
  { label: "Accessories", value: "accessories" },
  { label: "Carry", value: "carry" },
  { label: "Watches", value: "watches" },
  { label: "Lifestyle", value: "lifestyle" },
  { label: "Fragrance", value: "fragrance" },
  { label: "Home", value: "home" },
  { label: "Tech", value: "tech" },
  { label: "Heritage", value: "heritage" },
  { label: "Art", value: "art" },
  { label: "Beauty", value: "beauty" },
] as const;

export const NAV_CATEGORIES = [
  { label: "Tech", href: "/search/tech" },
  { label: "Lifestyle", href: "/search/lifestyle" },
  { label: "Home", href: "/search/home" },
  { label: "Workspace", href: "/search/workspace" },
  { label: "Carry", href: "/search/carry" },
  { label: "Personal", href: "/search/personal" },
] as const;

export type NavLink = { label: string; href: string };

export function categoryPagesToNavLinks(
  categoryPages: CategoryPage[],
): NavLink[] {
  return categoryPages.map((page) => ({
    label: page.title,
    href: page.path,
  }));
}

export function resolveCategoryNavLinks(
  categoryPages: CategoryPage[],
): NavLink[] {
  // Use product categories directly, mapped to category pages if they exist
  const categoryMap = new Map(
    categoryPages.map((page) => [page.category, page.path]),
  );

  return PRODUCT_CATEGORIES.map((cat) => ({
    label: cat.label,
    href: categoryMap.get(cat.value) || `/category/${cat.value}`,
  }));
}
