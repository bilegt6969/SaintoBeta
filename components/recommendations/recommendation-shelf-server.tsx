import { HomeProductCard } from "components/home/product-card";

interface RecommendationShelfProps {
  strategy: "similar" | "trending" | "cart" | "new-arrivals";
  productId?: string;
  cartProductIds?: string[];
  title?: string;
  limit?: number;
}

export async function RecommendationShelf({
  strategy,
  productId,
  cartProductIds,
  title,
  limit = 6,
}: RecommendationShelfProps) {
  const params = new URLSearchParams({
    strategy,
    limit: limit.toString(),
  });

  if (productId) params.append("productId", productId);
  if (cartProductIds && cartProductIds.length > 0) {
    params.append("cartProductIds", cartProductIds.join(","));
  }

  const response = await fetch(
    `http://localhost:3000/api/recommendations?${params.toString()}`,
    { cache: "no-store" }
  );

  if (!response.ok) {
    return null;
  }

  const data = await response.json();
  const products = data.products || [];

  if (products.length === 0) {
    return null;
  }

  const shelfTitle = title || getDefaultTitle(strategy);

  return (
    <div className="py-8">
      <h2 className="text-xl font-semibold mb-6">{shelfTitle}</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
        {products.map((product: any) => (
          <div
            key={product.id}
            className="border border-neutral-100 bg-[#f5f5f5] rounded-2xl p-4"
          >
            <HomeProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}

function getDefaultTitle(strategy: RecommendationShelfProps["strategy"]): string {
  switch (strategy) {
    case "similar":
      return "You might also like";
    case "trending":
      return "Trending now";
    case "cart":
      return "Complete your look";
    case "new-arrivals":
      return "New arrivals";
    default:
      return "Recommendations";
  }
}
