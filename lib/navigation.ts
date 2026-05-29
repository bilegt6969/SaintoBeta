import type { CategoryPage } from "lib/commerce/types";

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
  const fromSanity = categoryPagesToNavLinks(categoryPages);
  return fromSanity.length > 0 ? fromSanity : [...NAV_CATEGORIES];
}
