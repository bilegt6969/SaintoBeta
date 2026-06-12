// components/product/key-ingredients-section.tsx
"use client";

import { motion } from "framer-motion";
import type { KeyIngredientsSection as KIS } from "lib/commerce";
import Image from "next/image";
import Link from "next/link";

export function KeyIngredientsSection({ section }: { section: KIS }) {
  if (!section.ingredients.length && !section.featureBadges?.length)
    return null;

  return (
    <section className="border-t border-neutral-100 pt-16 md:pt-24 lg:pt-32 overflow-hidden">
      <motion.div
        initial={{ y: 20, opacity: 0 }}
        whileInView={{ y: 0, opacity: 1 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{ duration: 0.6, ease: [0.32, 0.72, 0, 1] }}
        className="mb-14 text-center flex flex-col items-center"
      >
        {section.subtitle && (
          <p className="mb-3 text-[11px] font-bold uppercase tracking-[0.25em] text-neutral-400">
            {section.subtitle}
          </p>
        )}
        {section.title && (
          <h2 className="text-3xl md:text-4xl font-semibold tracking-tight text-neutral-900">
            {section.title}
          </h2>
        )}
      </motion.div>

      {section.ingredients.length > 0 && (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {section.ingredients.map((ingredient: any, index: number) => (
            <motion.li
              key={ingredient.name || index}
              initial={{ y: 40, opacity: 0 }}
              whileInView={{ y: 0, opacity: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{
                delay: index * 0.1,
                duration: 0.7,
                ease: [0.32, 0.72, 0, 1],
              }}
              className="group relative aspect-[4/5] w-full overflow-hidden rounded-[2rem] bg-neutral-50"
            >
              <Image
                src={ingredient.image.url}
                alt={ingredient.image.altText || ingredient.name}
                fill
                className="object-cover transition-transform duration-700 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:scale-110"
                sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
              />

              {/* Refined Glassmorphism overlay */}
              <div className="absolute inset-x-3 bottom-3 overflow-hidden rounded-3xl bg-white/10 p-5 ring-1 ring-white/20 backdrop-blur-[16px] saturate-[1.25] transition-all duration-500 ease-[cubic-bezier(0.32,0.72,0,1)] group-hover:bg-white/20">
                <h3 className="text-lg font-semibold tracking-tight text-white drop-shadow-sm">
                  {ingredient.name}
                </h3>
                <p className="mt-1.5 line-clamp-2 text-sm leading-relaxed text-white/90 drop-shadow-sm">
                  {ingredient.description}
                </p>
              </div>
            </motion.li>
          ))}
        </ul>
      )}

      {/* Badges and Links ... (unchanged logic, just styled smoother) */}
      {section.fullIngredientListUrl && (
        <motion.div
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true }}
          className="mt-12 flex justify-center"
        >
          <Link
            href={section.fullIngredientListUrl}
            className="inline-flex items-center rounded-full bg-neutral-100 px-6 py-3 text-sm font-medium text-neutral-900 transition-all duration-300 ease-[cubic-bezier(0.32,0.72,0,1)] hover:bg-neutral-200 hover:scale-105 active:scale-95"
            target="_blank"
            rel="noopener noreferrer"
          >
            View full ingredient list &rarr;
          </Link>
        </motion.div>
      )}
    </section>
  );
}
