import { HomeSidebar } from "components/home/home-sidebar";
import { HomeProductCard } from "components/home/product-card";
import type { Product } from "lib/commerce";
import { getCollectionProducts, getProducts } from "lib/commerce";

function dedupeProducts(products: Product[]): Product[] {
  const seen = new Set<string>();
  return products.filter((product) => {
    if (seen.has(product.handle)) return false;
    seen.add(product.handle);
    return true;
  });
}

async function getHomeProducts(): Promise<Product[]> {
  const [featured, carousel, all] = await Promise.all([
    getCollectionProducts({ collection: "hidden-homepage-featured-items" }),
    getCollectionProducts({ collection: "hidden-homepage-carousel" }),
    getProducts({ sortKey: "CREATED_AT", reverse: true }),
  ]);

  const combined = dedupeProducts([...featured, ...carousel, ...all]);
  return combined.slice(0, 12);
}

export async function HomeGrid() {
  const products = await getHomeProducts();

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 lg:px-10 lg:py-10">
      {products.length > 0 ? (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <HomeSidebar />
          {products.map((product, index) => (
            <HomeProductCard
              key={product.handle}
              product={product}
              priority={index < 6}
            />
          ))}
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
          <HomeSidebar />
          <p className="text-sm text-neutral-500 sm:col-span-2 lg:col-span-2">
            No products yet. Add products in Sanity to populate the grid.
          </p>
        </div>
      )}
    </div>
  );
}
