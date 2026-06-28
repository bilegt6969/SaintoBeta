"use client";

import { HomeProductCard } from "components/home/product-card";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { useEffect, useRef } from "react";

interface RecommendationShelfClientProps {
  products: any[];
  title?: string;
}

export default function RecommendationShelfClient({
  products,
  title,
}: RecommendationShelfClientProps) {
  const scrollRef = useRef<HTMLDivElement>(null);

  // Duplicate products to create 3 sets for a seamless infinite loop
  const infiniteProducts = [...products, ...products, ...products];

  // Initialize scroll position to the middle set so users can immediately scroll left
  useEffect(() => {
    if (scrollRef.current) {
      const singleSetWidth = scrollRef.current.scrollWidth / 3;
      // Instantly jump to the middle set on load
      scrollRef.current.scrollLeft = singleSetWidth;
    }
  }, [products]);

  const scroll = (direction: "left" | "right") => {
    if (scrollRef.current) {
      // Calculate a dynamic scroll amount based on viewport
      const scrollAmount = window.innerWidth < 768 ? 280 : 340;
      scrollRef.current.scrollBy({
        left: direction === "left" ? -scrollAmount : scrollAmount,
        behavior: "smooth", // Smoothness applies ONLY to button clicks
      });
    }
  };

  const handleScroll = () => {
    if (!scrollRef.current) return;

    const { scrollLeft, scrollWidth } = scrollRef.current;
    const singleSetWidth = scrollWidth / 3;

    // INFINITE LOOP LOGIC:
    // Because we removed the CSS 'scroll-smooth', these resets happen instantly and invisibly.

    // If scrolled too far left (into the first set), jump to the identical spot in the middle set
    if (scrollLeft <= 0) {
      scrollRef.current.scrollLeft = singleSetWidth;
    }
    // If scrolled too far right (into the third set), jump back to the identical spot in the middle set
    else if (scrollLeft >= singleSetWidth * 2) {
      scrollRef.current.scrollLeft = singleSetWidth;
    }
  };

  if (products.length === 0) {
    return null;
  }

  return (
    <div className="relative py-8 overflow-hidden">
      <h2 className="mb-6 px-4 text-xl font-semibold sm:px-8">
        {title || "You might also like"}
      </h2>

      {/* Left Edge Blur */}
      <div className="pointer-events-none absolute bottom-0 left-0 top-16 z-10 w-16 bg-gradient-to-r from-white via-white/80 to-transparent sm:w-28" />

      {/* Right Edge Blur */}
      <div className="pointer-events-none absolute bottom-0 right-0 top-16 z-10 w-16 bg-gradient-to-l from-white via-white/80 to-transparent sm:w-28" />

      {/* Left Chevron */}
      <button
        onClick={() => scroll("left")}
        className="absolute left-2 sm:left-4 top-[55%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-white active:scale-95"
      >
        <ChevronLeft className="h-5 w-5 text-neutral-800" />
      </button>

      {/* Right Chevron */}
      <button
        onClick={() => scroll("right")}
        className="absolute right-2 sm:right-4 top-[55%] z-20 flex h-10 w-10 -translate-y-1/2 items-center justify-center rounded-full border border-neutral-200 bg-white/90 shadow-lg backdrop-blur-md transition-all hover:scale-110 hover:bg-white active:scale-95"
      >
        <ChevronRight className="h-5 w-5 text-neutral-800" />
      </button>

      {/* Scrollable track */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        // Removed `scroll-smooth` to fix the infinite jump jitter
        // Added raw CSS selectors to guarantee scrollbar removal across all browsers
        className="flex gap-4 overflow-x-auto px-4 pb-4 sm:px-8 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
      >
        {infiniteProducts.map((product, index) => (
          <div
            key={`${product.id}-${index}`}
            className="w-64 flex-shrink-0 rounded-2xl border border-neutral-100 bg-[#f5f5f5] p-4 md:w-72 lg:w-80"
          >
            <HomeProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
}
