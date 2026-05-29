import type { ReactElement, ReactNode } from "react";
import { Children, isValidElement } from "react";

/** Bento span pattern for products after the hero row */
const REST_BENTO_CLASS =
  "col-span-1 row-span-1 [&:nth-child(3n)]:col-span-2 [&:nth-child(6n)]:row-span-2";

/**
 * Mobile category bento:
 * Row 1 — black card (left, 4:3) + featured product (right, square, same height as card)
 * Below — 2-column bento grid (wide / tall cells on a cycle)
 */
export function CategoryMobileBento({
  sidebar,
  children,
  emptyMessage,
}: {
  sidebar: ReactNode;
  children: ReactNode;
  emptyMessage?: string;
}) {
  const items = Children.toArray(children).filter(isValidElement) as ReactElement[];
  const [featured, ...rest] = items;

  if (items.length === 0) {
    return (
      <div className="category-bento-mobile w-full lg:hidden">
        <div className="category-bento-hero">{sidebar}</div>
        <p className="mt-3 text-sm text-neutral-500">{emptyMessage}</p>
      </div>
    );
  }

  return (
    <div className="category-bento-mobile w-full lg:hidden">
      <div className="category-bento-hero">
        <div className="category-bento-sidebar">{sidebar}</div>
        {featured ? (
          <div className="category-bento-hero-feature">{featured}</div>
        ) : null}
      </div>

      {rest.length > 0 ? (
        <div className="category-bento-rest mt-3 grid grid-cols-2 gap-3">
          {rest.map((child, index) => (
            <div
              key={child.key ?? `rest-${index}`}
              className={`category-bento-product-slot min-w-0 ${REST_BENTO_CLASS}`}
            >
              {child}
            </div>
          ))}
        </div>
      ) : null}
    </div>
  );
}
