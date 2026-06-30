"use client";

import { CategoryMobileBento } from "components/home/category-mobile-bento";
import { motion } from "framer-motion";
import { Children, isValidElement, type ReactNode } from "react";

const smoothEase = [0.16, 1, 0.3, 1] as const;

const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.06,
      ease: smoothEase,
    },
  },
};

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 12,
    filter: "blur(8px)",
  },
  show: {
    opacity: 1,
    y: 0,
    filter: "blur(0px)",
    transition: {
      duration: 0.6,
      ease: smoothEase,
    },
  },
};

export function ProductGridShell({
  sidebar,
  children,
  emptyMessage,
  variant = "default",
}: {
  sidebar: ReactNode;
  children: ReactNode;
  emptyMessage?: string;
  variant?: "default" | "category" | "home";
}) {
  const childArray = Children.toArray(children).filter(isValidElement);
  const hasChildren = childArray.length > 0;
  const useBento = variant === "category" || variant === "home";

  if (useBento) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-2 md:px-8 lg:px-10 lg:py-2">
        {/* Mobile: pinterest bento — hidden on lg+ */}
        <CategoryMobileBento sidebar={sidebar} emptyMessage={emptyMessage}>
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="contents"
          >
            {childArray.map((child, index) => (
              <motion.div key={index} variants={itemVariants}>
                {child}
              </motion.div>
            ))}
          </motion.div>
        </CategoryMobileBento>

        {/* Desktop: original 3-col grid — hidden below lg */}
        <div className="hidden gap-x-4 gap-y-4 sm:grid sm:grid-cols-2 lg:grid lg:grid-cols-3">
          {sidebar}
          {hasChildren ? (
            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="show"
              className="contents"
            >
              {childArray.map((child, index) => (
                <motion.div key={index} variants={itemVariants}>
                  {child}
                </motion.div>
              ))}
            </motion.div>
          ) : (
            <p className="text-sm text-neutral-500 lg:col-span-2">
              {emptyMessage ??
                "No products yet. Add products in Sanity to populate the grid."}
            </p>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 lg:px-10 lg:py-10">
      <div className="grid grid-cols-1 gap-x-6 gap-y-10 sm:grid-cols-2 lg:grid-cols-3">
        {sidebar}
        {hasChildren ? (
          <motion.div
            variants={containerVariants}
            initial="hidden"
            animate="show"
            className="contents"
          >
            {childArray.map((child, index) => (
              <motion.div key={index} variants={itemVariants}>
                {child}
              </motion.div>
            ))}
          </motion.div>
        ) : (
          <p className="text-sm text-neutral-500 sm:col-span-2 lg:col-span-2">
            {emptyMessage ??
              "No products yet. Add products in Sanity to populate the grid."}
          </p>
        )}
      </div>
    </div>
  );
}
