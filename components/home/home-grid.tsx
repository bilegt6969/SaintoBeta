import { BlackCard } from "components/home/black-card";
import { HomeProductCard } from "components/home/product-card";
import { ProductGridShell } from "components/home/product-grid-shell";
import { getHomeConfig, getProducts } from "lib/commerce";
import { resolveCategoryNavLinks } from "lib/navigation";

export async function HomeGrid() {
  const [products, homeConfig] = await Promise.all([
    getProducts({}),
    getHomeConfig(),
  ]);

  const categories = resolveCategoryNavLinks([]);

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
      emptyMessage="No products yet. Add products in Sanity to populate the grid."
    >
      {products.map((product, index) => (
        <HomeProductCard
          key={product.handle}
          product={product}
          priority={index < 6}
        />
      ))}
    </ProductGridShell>
  );
}
