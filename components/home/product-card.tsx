"use client";

import Price from "components/price";
import { cn } from "lib/cn";
import type { Product } from "lib/commerce";
import {
    getProductBrand,
    getProductCategory,
    isStaffPick,
} from "lib/product-meta";
import Image from "next/image";
import Link from "next/link";

function StaffPickBadge({ compact = false }: { compact?: boolean }) {
  return (
    <div
      className={cn(
        "absolute left-4 top-4 z-20 flex items-center gap-1.5 text-sm font-medium text-violet-600",
        compact && "max-lg:left-2 max-lg:top-2 max-lg:gap-1 max-lg:text-[10px]",
      )}
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className={cn("h-4 w-4", compact && "max-lg:h-3 max-lg:w-3")}
        aria-hidden
      >
        <path
          fillRule="evenodd"
          d="M10 18a8 8 0 1 0 0-16 8 8 0 0 0 0 16Zm3.857-9.809a.75.75 0 0 0-1.214-.882l-3.483 4.79-1.88-1.88a.75.75 0 1 0-1.06 1.061l2.5 2.5a.75.75 0 0 0 1.137-.089l4-5.5Z"
          clipRule="evenodd"
        />
      </svg>
      Staff Pick
    </div>
  );
}

export function HomeProductCard({
  product,
  priority,
  href,
  density = "default",
}: {
  product: Product;
  priority?: boolean;
  href?: string;
  density?: "default" | "compact" | "bento";
}) {
  const brand = getProductBrand(product);
  const category = getProductCategory(product);
  const staffPick = isStaffPick(product);
  const { amount, currencyCode } = product.priceRange.maxVariantPrice;
  const isOutOfStock = product.outOfStock;
  const productHref = href ?? `/product/${product.handle}`;
  const isCompact = density === "compact";
  const isBento = density === "bento";

  const imageSizes = isCompact
    ? "(max-width: 1023px) 45vw, (min-width: 1024px) 30vw"
    : isBento
      ? "(max-width: 1023px) 45vw, 30vw"
      : "(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw";

  const imageBlock = (
    <div
      className={cn(
        "category-bento-product-image t-resize relative w-full overflow-hidden rounded-2xl bg-white",
        !isCompact && "aspect-square",
        isCompact && "aspect-square max-lg:rounded-xl",
        isBento && "aspect-square rounded-xl",
        isOutOfStock && "grayscale opacity-60",
      )}
    >
      {product.featuredImage?.url ? (
        <Image
          src={product.featuredImage.url}
          alt={product.featuredImage.altText || product.title}
          fill
          sizes={imageSizes}
          priority={priority}
          className={cn(
            "object-contain p-3 pb-16",
            isCompact && "max-lg:object-cover max-lg:p-2 max-lg:pb-20",
            isBento && "object-cover p-4 pb-20",
            !isOutOfStock &&
              "transition duration-500 ease-out group-hover:scale-[1.03]",
          )}
        />
      ) : null}
      {!isOutOfStock && !isBento ? (
        <div
          className="pointer-events-none absolute inset-0 z-10 opacity-0 backdrop-blur-[20px] transition-opacity duration-500 ease-out group-hover:opacity-100 max-lg:hidden"
          style={{
            WebkitMaskImage:
              "radial-gradient(circle, transparent 40%, black 90%)",
            maskImage: "radial-gradient(circle, transparent 40%, black 90%)",
          }}
        />
      ) : null}
      {staffPick ? <StaffPickBadge compact={isCompact || isBento} /> : null}

      {/* Product info overlay */}
      <div
        className={cn(
          "absolute bottom-0 left-0 right-0 z-30 bg-white/95 backdrop-blur-sm p-4",
          isCompact && "max-lg:p-2.5",
          isBento && "p-3",
        )}
      >
        <p
          className={cn(
            "text-sm text-neutral-400",
            isCompact && "max-lg:text-[10px]",
          )}
        >
          {brand}
          <span className="mx-1 text-neutral-300 max-lg:mx-0.5">·</span>
          {category}
        </p>
        <div
          className={cn(
            "flex items-start justify-between gap-2 mt-1",
            isCompact && "max-lg:gap-1 max-lg:mt-0.5",
          )}
        >
          <h2
            className={cn(
              "line-clamp-2 text-sm font-normal text-neutral-900",
              isCompact && "max-lg:text-[11px] max-lg:leading-snug",
            )}
          >
            {product.title}
            {isOutOfStock ? (
              <span className="ml-1.5 text-sm font-medium text-red-600 max-lg:text-[10px]">
                Out of Stock
              </span>
            ) : null}
          </h2>
          <Price
            amount={amount}
            currencyCode={currencyCode}
            className={cn(
              "text-sm text-neutral-600 whitespace-nowrap font-mono",
              isCompact && "max-lg:text-[10px]",
            )}
            currencyCodeClassName="hidden"
          />
        </div>
      </div>
    </div>
  );

  return (
    <article className="group min-w-0">
      {isOutOfStock ? (
        <div
          className="block cursor-not-allowed"
          onClick={(e) => e.preventDefault()}
        >
          {imageBlock}
        </div>
      ) : (
        <Link href={productHref} prefetch className="block min-w-0">
          {imageBlock}
        </Link>
      )}
    </article>
  );
}
