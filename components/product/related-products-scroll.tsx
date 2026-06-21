"use client";

import { HomeProductCard } from "components/home/product-card";
import type { Product } from "lib/commerce";
import { useEffect, useRef } from "react";

export function RelatedProductsScroll({ products }: { products: Product[] }) {
  const scrollContainerRef = useRef<HTMLUListElement>(null);

  // Tripling the array creates a reliable buffer for the infinite illusion
  const extendedProducts = [...products, ...products, ...products];

  // Initialize the scroll position to the start of the middle set
  useEffect(() => {
    if (scrollContainerRef.current && products.length > 0) {
      const container = scrollContainerRef.current;
      const itemWidth = container.children[0]?.clientWidth || 320;
      const gap = 24; // 1.5rem (gap-6)
      const setWidth = products.length * (itemWidth + gap);

      container.scrollLeft = setWidth;
    }
  }, [products]);

  const handleScroll = () => {
    if (!scrollContainerRef.current || products.length === 0) return;

    const container = scrollContainerRef.current;
    const itemWidth = container.children[0]?.clientWidth || 320;
    const gap = 24;
    const setWidth = products.length * (itemWidth + gap);

    // If the user scrolls into the first set, seamlessly jump forward
    if (container.scrollLeft <= itemWidth) {
      container.scrollLeft += setWidth;
    }
    // If the user scrolls into the third set, seamlessly jump backward
    else if (container.scrollLeft >= setWidth * 2) {
      container.scrollLeft -= setWidth;
    }
  };

  const scrollLeft = () => {
    if (scrollContainerRef.current) {
      const itemWidth =
        scrollContainerRef.current.children[0]?.clientWidth || 320;
      const gap = 24;
      scrollContainerRef.current.scrollBy({
        left: -(itemWidth + gap),
        behavior: "smooth",
      });
    }
  };

  const scrollRight = () => {
    if (scrollContainerRef.current) {
      const itemWidth =
        scrollContainerRef.current.children[0]?.clientWidth || 320;
      const gap = 24;
      scrollContainerRef.current.scrollBy({
        left: itemWidth + gap,
        behavior: "smooth",
      });
    }
  };

  return (
    <div className="relative group/carousel py-4">
      {/* LEFT FROZEN BLUR OVERLAY - Always visible */}
      <div
        className="pointer-events-none absolute left-0 top-0 bottom-0 w-32 md:w-48 z-30"
        style={{
          background:
            "linear-gradient(to right, rgba(255,255,255,0.9), rgba(255,255,255,0))",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          maskImage: "linear-gradient(to right, black 20%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to right, black 20%, transparent 100%)",
          transform: "translateZ(0)",
        }}
      />

      <button
        className="absolute left-6 top-1/2 -translate-y-1/2 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 border border-white/30 backdrop-blur-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-110 hover:bg-white/40 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] opacity-0 group-hover/carousel:opacity-100"
        onClick={scrollLeft}
        aria-label="Scroll left"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-800"
        >
          <path d="m15 18-6-6 6-6" />
        </svg>
      </button>

      <ul
        ref={scrollContainerRef}
        onScroll={handleScroll}
        className="flex gap-6 overflow-x-auto pb-8 pt-4 relative z-10"
        style={{
          msOverflowStyle: "none",
          scrollbarWidth: "none",
        }}
      >
        <style>{`
          ul::-webkit-scrollbar { display: none; }
        `}</style>

        {extendedProducts.map((product, index) => (
          <li
            key={`${product.handle}-${index}`}
            className="flex-shrink-0 w-80 border border-neutral-100 bg-[#f5f5f5] rounded-2xl p-4 relative"
          >
            <HomeProductCard product={product} priority={index < 3} />
          </li>
        ))}
      </ul>

      {/* RIGHT FROZEN BLUR OVERLAY - Always visible */}
      <div
        className="pointer-events-none absolute right-0 top-0 bottom-0 w-32 md:w-48 z-30"
        style={{
          background:
            "linear-gradient(to left, rgba(255,255,255,0.9), rgba(255,255,255,0))",
          backdropFilter: "blur(8px)",
          WebkitBackdropFilter: "blur(8px)",
          maskImage: "linear-gradient(to left, black 20%, transparent 100%)",
          WebkitMaskImage:
            "linear-gradient(to left, black 20%, transparent 100%)",
          transform: "translateZ(0)",
        }}
      />

      <button
        className="absolute right-6 top-1/2 -translate-y-1/2 z-40 flex h-12 w-12 items-center justify-center rounded-full bg-white/20 border border-white/30 backdrop-blur-xl shadow-[0_4px_14px_0_rgba(0,0,0,0.1)] transition-all duration-300 hover:scale-110 hover:bg-white/40 hover:shadow-[0_6px_20px_rgba(0,0,0,0.15)] opacity-0 group-hover/carousel:opacity-100"
        onClick={scrollRight}
        aria-label="Scroll right"
      >
        <svg
          xmlns="http://www.w3.org/2000/svg"
          width="24"
          height="24"
          viewBox="0 0 24 24"
          fill="none"
          stroke="currentColor"
          strokeWidth="2.5"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="text-neutral-800"
        >
          <path d="m9 18 6-6-6-6" />
        </svg>
      </button>
    </div>
  );
}
