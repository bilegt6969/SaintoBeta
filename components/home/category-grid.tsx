import { BlackCard } from "components/home/black-card";
import { HomeProductCard } from "components/home/product-card";
import { ProductGridShell } from "components/home/product-grid-shell";
import type { CategoryPage } from "lib/commerce/types";
import { getCategoryPages } from "lib/commerce";
import { resolveCategoryNavLinks } from "lib/navigation";

export async function CategoryGrid({ category }: { category: CategoryPage }) {
  const categoryPages = await getCategoryPages();
  const navCategories = resolveCategoryNavLinks(categoryPages);

  return (
    <ProductGridShell
      variant="category"
      sidebar={
        <BlackCard
          variant="bento"
          siteName={category.title}
          logoHref={category.path}
          logo={category.logo}
          categories={navCategories}
          activeCategoryHref={category.path}
        />
      }
      emptyMessage={`No products in ${category.title} yet. Open a product in Sanity and choose this category under “Category”.`}
    >
      {category.products.map((product, index) => (
        <HomeProductCard
          key={product.handle}
          product={product}
          priority={index < 6}
          density="compact"
        />
      ))}
    </ProductGridShell>
  );
}
