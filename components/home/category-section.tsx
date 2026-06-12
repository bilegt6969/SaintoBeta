import { BlackCard } from "components/home/black-card";
import { HomeProductCard } from "components/home/product-card";
import { ProductGridShell } from "components/home/product-grid-shell";
import type { HomeConfig } from "lib/commerce";
import { resolveCategoryNavLinks } from "lib/navigation";

export function CategorySections({ homeConfig }: { homeConfig: HomeConfig }) {
  const allCategories = resolveCategoryNavLinks([]);

  if (
    !homeConfig.categorySections ||
    homeConfig.categorySections.length === 0
  ) {
    return null;
  }

  return (
    <>
      {homeConfig.categorySections
        .filter(
          (section) => section.enabled && section.category.products.length > 0,
        )
        .map((section) => (
          <ProductGridShell
            key={section.category.id}
            variant="home"
            sidebar={
              <BlackCard
                siteName={section.category.title}
                logoHref={section.category.path}
                logo={section.category.logo}
                categories={allCategories}
                showNav={false}
                showFooter={false}
                description={section.category.description}
              />
            }
            emptyMessage={`No products in ${section.category.title} yet.`}
          >
            {section.category.products.slice(0, 5).map((product, index) => (
              <HomeProductCard
                key={product.id}
                product={product}
                priority={index < 6}
              />
            ))}
          </ProductGridShell>
        ))}
    </>
  );
}
