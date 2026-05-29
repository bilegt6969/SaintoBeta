"use client";

import { AddToCart } from "components/cart/add-to-cart";
import Price from "components/price";
import type { Product } from "lib/commerce";
import { getProductBrand, getProductCategory } from "lib/product-meta";
import Link from "next/link";
import { useSearchParams } from "next/navigation";
import {
    JSXElementConstructor,
    Key,
    ReactElement,
    ReactNode,
    ReactPortal,
} from "react";
import { VariantSelector } from "./variant-selector";

export function ProductDescriptionInner({ product }: { product: Product }) {
  const brand = getProductBrand(product);
  const category = getProductCategory(product);
  const searchParams = useSearchParams();

  const selectedVariant =
    product.variants.find((variant) =>
      variant.selectedOptions.every((option) => {
        const valueInUrl = searchParams.get(option.name.toLowerCase());
        return valueInUrl
          ? valueInUrl.toLowerCase() === option.value.toLowerCase()
          : false;
      }),
    ) || product.variants[0];

  const displayAmount =
    selectedVariant?.price?.amount ??
    product.price?.amount ??
    product.priceRange.maxVariantPrice.amount;
  const displayCurrency =
    selectedVariant?.price?.currencyCode ??
    product.price?.currencyCode ??
    product.priceRange.maxVariantPrice.currencyCode;

  return (
    <div className="w-full max-w-2xl mx-auto space-y-8 pb-8 text-neutral-950 px-4 sm:px-0">
      {/* Navigation Line */}
      <div className="flex items-center justify-between">
        <Link
          href="/"
          className="group inline-flex items-center gap-2 text-sm font-medium text-neutral-400 transition-colors hover:text-neutral-900"
        >
          <span className="text-base transition-transform group-hover:-translate-x-0.5">
            ←
          </span>{" "}
          Back to shop
        </Link>
        {product.slug?.current && (
          <span className="text-xs font-mono tracking-tight text-neutral-400 uppercase">
            {product.category?.slice(0, 2).toUpperCase() || "PR"}-
            {product.slug.current.slice(0, 2).toUpperCase()}
          </span>
        )}
      </div>

      {/* Title Block */}
      <div className="space-y-2">
        <div className="text-[11px] font-bold uppercase tracking-[0.02em] text-neutral-400">
          {brand || "Reference"} {brand && category && "&"} {category}
        </div>

        <h1 className="text-4xl sm:text-5xl lg:text-6xl font-semibold tracking-tight text-neutral-900 leading-[1.08]">
          {product.title}
        </h1>

        {product.condition && (
          <div className="inline-flex items-center rounded-full bg-neutral-100 px-3 py-1 text-xs font-medium text-neutral-600">
            {product.condition === "new" && "New"}
            {product.condition === "like-new" && "Like New"}
            {product.condition === "good" && "Good"}
            {product.condition === "fair" && "Fair"}
          </div>
        )}

        <div className="flex items-baseline gap-2 pt-1">
          <Price
            amount={displayAmount}
            currencyCode={displayCurrency}
            className="text-xl font-medium tracking-tight text-neutral-800"
          />
        </div>
      </div>

      {/* Description Text */}
      {product.description && (
        <p className="text-[15px] leading-relaxed text-neutral-500 font-normal max-w-xl">
          {product.description}
        </p>
      )}

      {/* Option Selection Panel */}
      {product.options.length > 0 &&
      product.options.some((o) => o.values.length > 1) ? (
        <div className="pt-2 border-t border-neutral-100">
          <VariantSelector
            options={product.options}
            variants={product.variants}
          />
        </div>
      ) : null}

      {/* Specifications Grid mapped from Sanity `specs` */}
      {product.specs && product.specs.length > 0 && (
        <div className="pt-4">
          <h2 className="mb-6 text-[11px] font-bold tracking-[0.05em] text-neutral-400 uppercase">
            Specifications
          </h2>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
            {product.specs.map(
              (
                spec: {
                  label:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | Iterable<ReactNode>
                    | null
                    | undefined;
                  value:
                    | string
                    | number
                    | bigint
                    | boolean
                    | ReactElement<unknown, string | JSXElementConstructor<any>>
                    | Iterable<ReactNode>
                    | ReactPortal
                    | Promise<
                        | string
                        | number
                        | bigint
                        | boolean
                        | ReactPortal
                        | ReactElement<
                            unknown,
                            string | JSXElementConstructor<any>
                          >
                        | Iterable<ReactNode>
                        | null
                        | undefined
                      >
                    | Iterable<ReactNode>
                    | null
                    | undefined;
                },
                index: Key | null | undefined,
              ) => (
                <div key={index} className="flex flex-col gap-2">
                  <dt className="text-[10px] font-semibold tracking-[0.1em] text-neutral-400 uppercase">
                    {spec.label}
                  </dt>
                  <dd className="text-lg font-medium tracking-tight text-neutral-900">
                    {spec.value}
                  </dd>
                </div>
              ),
            )}
          </dl>
        </div>
      )}

      {/* Metadata Tags */}
      {product.tags && product.tags.length > 0 && (
        <div className="space-y-4 pt-2">
          <h2 className="text-[11px] font-bold tracking-[0.05em] text-neutral-400 uppercase">
            Tags
          </h2>
          <div className="flex flex-wrap gap-2 pt-1">
            {product.tags.map((tag, index) => (
              <span
                key={index}
                className="inline-flex items-center rounded-md border border-neutral-200 bg-white px-2.5 py-1 text-[10px] font-mono tracking-wider text-neutral-500 uppercase"
              >
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Primary Conversion Actions */}
      <div className="pt-6 border-t border-neutral-100 flex flex-col sm:flex-row items-center gap-4">
        <div className="w-full sm:w-auto min-w-[200px]">
          <AddToCart
            product={product}
            variantId={selectedVariant?.id || product.variants[0]?.id}
            className="w-full bg-neutral-950 text-white rounded-full py-3.5 px-8 text-sm font-medium tracking-tight hover:bg-neutral-800 transition-colors flex items-center justify-center gap-1 shadow-sm"
          />
        </div>
        <button
          type="button"
          className="text-sm font-medium text-neutral-500 hover:text-neutral-900 transition-colors py-2 px-4 rounded-full border border-neutral-200 hover:border-neutral-300"
        >
          Download spec sheet
        </button>
      </div>
    </div>
  );
}
