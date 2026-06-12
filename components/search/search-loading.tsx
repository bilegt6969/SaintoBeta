"use client";

import {
  gridItemVariants,
  pageVariants,
  useSearchMotion,
} from "components/search/search-motion";
import { SearchProductCardSkeleton } from "components/search/search-product-card";
import { motion } from "framer-motion";

export function SearchPageLoading() {
  const { shouldAnimate } = useSearchMotion();

  const loadingContent = (
    <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8 lg:px-10">
      <div className="mx-auto mb-12 h-14 max-w-2xl overflow-hidden rounded-full bg-neutral-100 ring-1 ring-black/5 relative shadow-sm">
        <div className="absolute inset-0 -translate-x-full animate-[shimmer_1.5s_infinite] bg-gradient-to-r from-transparent via-white/50 to-transparent" />
      </div>

      <div className="grid grid-cols-1 gap-x-6 gap-y-12 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
        {Array.from({ length: 8 }, (_, i) =>
          shouldAnimate ? (
            <motion.div
              key={i}
              variants={gridItemVariants}
              initial="hidden"
              animate="show"
              transition={{ delay: i * 0.05 }}
            >
              <SearchProductCardSkeleton />
            </motion.div>
          ) : (
            <SearchProductCardSkeleton key={i} />
          ),
        )}
      </div>
    </div>
  );

  if (!shouldAnimate) {
    return (
      <div className="min-h-[70vh] bg-white font-sans">{loadingContent}</div>
    );
  }

  return (
    <motion.div
      className="min-h-[70vh] bg-white font-sans"
      variants={pageVariants}
      initial="hidden"
      animate="show"
    >
      {loadingContent}
    </motion.div>
  );
}
