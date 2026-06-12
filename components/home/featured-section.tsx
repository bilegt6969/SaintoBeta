import { BlackCard } from "components/home/black-card";
import { HomeProductCard } from "components/home/product-card";
import { ProductGridShell } from "components/home/product-grid-shell";
import type { HomeConfig } from "lib/commerce";
import { resolveCategoryNavLinks } from "lib/navigation";

export function FeaturedSection({ homeConfig }: { homeConfig: HomeConfig }) {
  const categories = resolveCategoryNavLinks([]); // Empty categories for featured section

  if (
    !homeConfig.featuredProducts ||
    homeConfig.featuredProducts.length === 0
  ) {
    return null;
  }

  return (
    <ProductGridShell
      variant="home"
      sidebar={
        <BlackCard
          siteName={process.env.SITE_NAME || "Sainto"}
          categories={categories}
          logoHref="/"
          logo={{
            url: "/Lelogo.svg",
            altText: "Sainto",
            width: 800,
            height: 200,
          }}
          showNav={true}
        />
      }
      emptyMessage="No featured products yet. Add products in the Home Configuration in Sanity."
    >
      {homeConfig.featuredProducts.slice(0, 5).map((product, index) => (
        <HomeProductCard
          key={product.id}
          product={product}
          priority={index < 6}
        />
      ))}
    </ProductGridShell>
  );
}
