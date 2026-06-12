// components/product/product-pill-card.tsx
"use client";

import { GridTileImage } from "components/grid/tile";
import { motion } from "framer-motion";
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
      className="block outline-none focus-visible:ring-2 focus-visible:ring-neutral-400 focus-visible:ring-offset-2 rounded-3xl"
    >
      <motion.div
        whileHover={{ y: -4, scale: 1.01 }}
        whileTap={{ scale: 0.98 }}
        transition={{ type: "spring", stiffness: 300, damping: 20 }}
        className="group relative aspect-[4/3] w-full overflow-hidden rounded-3xl bg-[#f5f5f7] shadow-[inset_0_0_0_1px_rgba(0,0,0,0.04)]"
      >
        <GridTileImage
          alt={product.featuredImage?.altText || product.title}
          src={product.featuredImage?.url}
          fill
          sizes="(min-width: 1024px) 22vw, (min-width: 768px) 30vw, 100vw"
          priority={priority}
          isInteractive={false} // Keeping false to let our Framer Motion handle the hover!
          label={{
            title: product.title,
            amount,
            currencyCode,
          }}
        />

        {/* Subtle hover glare effect */}
        <div className="absolute inset-0 z-10 opacity-0 bg-gradient-to-tr from-white/0 via-white/20 to-white/0 transition-opacity duration-700 ease-in-out group-hover:opacity-100 pointer-events-none" />
      </motion.div>
    </Link>
  );
}
