// components/product/product-pill-card.tsx
import { GridTileImage } from "components/grid/tile";
import type { Product } from "lib/commerce";
import Link from "next/link";

export function ProductPillCard({
  product,
  priority,
}: {
  product: Product;
  priority?: boolean;
}) {
  const { amount, currencyCode } = product.priceRange.maxVariantPrice;

  return (
    <Link
      href={`/product/${product.handle}`}
      prefetch={true}
      className="block @container"
    >
      {/* Added border, border-transparent, hover:border-neutral-300, and transition classes here */}
      <div className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl border border-transparent bg-[#f3f3f3] hover:border-neutral-300 transition-colors duration-200">
        <GridTileImage
          alt={product.featuredImage?.altText || product.title}
          src={product.featuredImage?.url}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 100vw"
          priority={priority}
          isInteractive={false} // Prevents double handling hover effects if needed, or keep true for zoom
          label={{
            title: product.title,
            amount,
            currencyCode,
          }}
        />
      </div>
    </Link>
  );
}
