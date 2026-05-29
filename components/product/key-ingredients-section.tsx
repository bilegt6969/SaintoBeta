import type { KeyIngredientsSection } from "lib/commerce";
import Image from "next/image";
import Link from "next/link";
import { ProductHighlights } from "./product-highlights";
import { StaticImport } from "next/dist/shared/lib/get-img-props";
import { Key, ReactElement, JSXElementConstructor, ReactNode, ReactPortal } from "react";

export function KeyIngredientsSection({
  section,
}: {
  section: KeyIngredientsSection;
}) {
  if (!section.ingredients.length && !section.featureBadges?.length) {
    return null;
  }

  return (
    <section className="border-t border-neutral-200 pt-12 md:pt-16">
      <div className="mb-10 text-center">
        {section.title && (
          <h2 className="text-2xl md:text-3xl font-medium tracking-tight text-neutral-900">
            {section.title}
          </h2>
        )}
        {section.subtitle && (
          <p className="mt-2 text-xs font-semibold uppercase tracking-[0.2em] text-amber-700">
            {section.subtitle}
          </p>
        )}
      </div>

      {section.ingredients.length > 0 && (
        <ul className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
          {section.ingredients.map((ingredient: { name: boolean | Key | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | null | undefined; image: { url: string | StaticImport; altText: any; }; description: string | number | bigint | boolean | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | ReactPortal | Promise<string | number | bigint | boolean | ReactPortal | ReactElement<unknown, string | JSXElementConstructor<any>> | Iterable<ReactNode> | null | undefined> | Iterable<ReactNode> | null | undefined; }) => (
            <li
              key={ingredient.name}
              className="group relative overflow-hidden rounded-2xl border border-neutral-100 bg-white transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div className="relative aspect-square overflow-hidden">
                <Image
                  src={ingredient.image.url}
                  alt={ingredient.image.altText || ingredient.name}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="(min-width: 1024px) 33vw, (min-width: 640px) 50vw, 100vw"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-black/20 to-transparent" />
              </div>

              <div className="absolute inset-x-0 bottom-0 p-6 text-white">
                <h3 className="text-xl font-medium leading-tight">
                  {ingredient.name}
                </h3>
                <p className="mt-2 line-clamp-3 text-sm leading-relaxed text-neutral-100">
                  {ingredient.description}
                </p>
              </div>
            </li>
          ))}
        </ul>
      )}

      {section.featureBadges?.length ? (
        <div className="mt-12 flex justify-center">
          <ProductHighlights highlights={section.featureBadges} />
        </div>
      ) : null}

      {section.fullIngredientListUrl && (
        <div className="mt-10 flex justify-center">
          <Link
            href={section.fullIngredientListUrl}
            className="inline-flex items-center rounded-full border border-neutral-300 px-6 py-3 text-sm text-neutral-700 transition-all hover:bg-neutral-50 hover:border-neutral-400"
            target="_blank"
            rel="noopener noreferrer"
          >
            View full ingredient list →
          </Link>
        </div>
      )}
    </section>
  );
}