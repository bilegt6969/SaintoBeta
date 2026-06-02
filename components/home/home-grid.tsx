import { BlackCard } from "components/home/black-card";
import { HomeProductCard } from "components/home/product-card";
import { ProductGridShell } from "components/home/product-grid-shell";
import { getCategoryPages, getCategoryPagesForHome } from "lib/commerce";
import { resolveCategoryNavLinks } from "lib/navigation";

export async function HomeGrid() {
  const [categoryPages, homeCategories] = await Promise.all([
    getCategoryPages(),
    getCategoryPagesForHome(),
  ]);

  const navCategories = resolveCategoryNavLinks(categoryPages);

  return (
    <ProductGridShell
      variant="home"
      sidebar={
        <BlackCard
          siteName={process.env.SITE_NAME || "Sainto"}
          categories={navCategories}
        />
      }
      emptyMessage="No categories on the homepage yet. Create Category Pages in Sanity, pick a category face product, and enable “Show on homepage”."
    >
      {homeCategories.map((category, index) => {
        const product = category.featuredProduct;
        if (!product) return null;

        return (
          <HomeProductCard
            key={category.handle}
            product={product}
            href={category.path}
            priority={index < 6}
          />
        );
      })}
    </ProductGridShell>
  );
}
