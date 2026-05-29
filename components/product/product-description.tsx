import type { Product } from "lib/commerce";
import { Suspense } from "react";
import { ProductDescriptionInner } from "./product-description-inner";

function ProductDescriptionSkeleton() {
  return (
    <div className="max-w-2xl space-y-8 pb-10 animate-pulse">
      {/* Back link */}
      <div className="h-4 w-24 bg-neutral-100 rounded" />

      <div className="space-y-3">
        {/* Eyebrow */}
        <div className="h-3 w-32 bg-neutral-100 rounded" />
        {/* Title */}
        <div className="h-10 w-3/4 bg-neutral-100 rounded" />
        <div className="h-10 w-1/2 bg-neutral-100 rounded" />
        {/* Price */}
        <div className="h-7 w-1/4 bg-neutral-100 rounded mt-1" />
      </div>

      <hr className="border-neutral-200" />

      {/* Highlights */}
      <div className="space-y-2">
        <div className="h-4 w-full bg-neutral-100 rounded" />
        <div className="h-4 w-5/6 bg-neutral-100 rounded" />
        <div className="h-4 w-4/6 bg-neutral-100 rounded" />
      </div>

      {/* Purchase panel */}
      <div className="rounded-[2rem] bg-[#f5f5f7] p-6 md:p-8 space-y-5">
        <div className="h-6 w-40 bg-neutral-200 rounded" />
        <div className="h-12 w-full bg-neutral-200 rounded-xl" />
        <div className="h-12 w-full bg-neutral-300 rounded-xl" />
      </div>
    </div>
  );
}

export function ProductDescription({ product }: { product: Product }) {
  return (
    // This Suspense boundary is rendered by a Server Component (no useSearchParams here),
    // which is what Next.js 15+ requires to avoid the "blocking-route" error.
    // ProductDescriptionInner is the "use client" component that calls useSearchParams().
    <Suspense fallback={<ProductDescriptionSkeleton />}>
      <ProductDescriptionInner product={product} />
    </Suspense>
  );
}
