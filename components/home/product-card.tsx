"use client";

import Price from "components/price";
import type { Product } from "lib/commerce";
import {
    getProductBrand,
    getProductCategory,
    isStaffPick,
} from "lib/product-meta";
import Image from "next/image";
import Link from "next/link";

function StaffPickBadge() {
  return (
    <div className="absolute left-4 top-4 z-20 flex items-center gap-1.5 text-sm font-medium text-violet-600">
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 20 20"
        fill="currentColor"
        className="h-4 w-4"
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
}: {
  product: Product;
  priority?: boolean;
}) {
  const brand = getProductBrand(product);
  const category = getProductCategory(product);
  const staffPick = isStaffPick(product);
  const { amount, currencyCode } = product.priceRange.maxVariantPrice;
  const isOutOfStock = product.outOfStock;

  return (
    <article className="group">
      {isOutOfStock ? (
        <div
          className="block cursor-not-allowed"
          onClick={(e) => e.preventDefault()}
        >
          <div
            className={`relative aspect-square w-full overflow-hidden rounded-2xl bg-[#f3f3f3] ${isOutOfStock ? "grayscale opacity-60" : ""}`}
          >
            {/* 1. Base Layer: Image MUST be first so it sits at the back */}
            {product.featuredImage?.url ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                priority={priority}
                className="object-contain p-6"
              />
            ) : null}

            {/* 3. Top Layer: Badge sits over everything */}
            {staffPick ? <StaffPickBadge /> : null}
          </div>

          <div
            className={`mt-3 space-y-1 ${isOutOfStock ? "opacity-60 grayscale" : ""}`}
          >
            <p className="text-sm text-neutral-400">
              {brand}
              <span className="mx-1.5 text-neutral-300">·</span>
              {category}
            </p>
            <h2 className="text-base font-normal text-neutral-900">
              <span className="font-semibold">{brand}</span> {product.title}
              <span className="ml-2 text-sm font-medium text-red-600">
                Out of Stock
              </span>
            </h2>
            <Price
              amount={amount}
              currencyCode={currencyCode}
              className="text-sm text-neutral-600"
              currencyCodeClassName="hidden"
              wholeNumber
            />
          </div>
        </div>
      ) : (
        <Link
          href={`/product/${product.handle}`}
          prefetch={true}
          className="block"
        >
          <div className="relative aspect-square w-full overflow-hidden rounded-2xl bg-[#f3f3f3]">
            {/* 1. Base Layer: Image MUST be first so it sits at the back */}
            {product.featuredImage?.url ? (
              <Image
                src={product.featuredImage.url}
                alt={product.featuredImage.altText || product.title}
                fill
                sizes="(min-width: 1024px) 30vw, (min-width: 640px) 50vw, 100vw"
                priority={priority}
                className="object-contain p-6 transition duration-500 ease-out group-hover:scale-[1.03]"
              />
            ) : null}

            {/* 2. Middle Layer: Blur Overlay sits on top of the image */}
            <div
              className="pointer-events-none absolute inset-0 z-10 opacity-0 backdrop-blur-[20px] transition-opacity duration-500 ease-out group-hover:opacity-100"
              style={{
                WebkitMaskImage:
                  "radial-gradient(circle, transparent 40%, black 90%)",
                maskImage:
                  "radial-gradient(circle, transparent 40%, black 90%)",
              }}
            />

            {/* 3. Top Layer: Badge sits over everything */}
            {staffPick ? <StaffPickBadge /> : null}
          </div>

          <div className="mt-3 space-y-1">
            <p className="text-sm text-neutral-400">
              {brand}
              <span className="mx-1.5 text-neutral-300">·</span>
              {category}
            </p>
            <h2 className="text-base font-normal text-neutral-900">
              <span className="font-semibold">{brand}</span> {product.title}
            </h2>
            <Price
              amount={amount}
              currencyCode={currencyCode}
              className="text-sm text-neutral-600"
              currencyCodeClassName="hidden"
              wholeNumber
            />
          </div>
        </Link>
      )}
    </article>
  );
}
