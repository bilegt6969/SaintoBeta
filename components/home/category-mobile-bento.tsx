import type { ReactElement, ReactNode } from "react";
import { Children, cloneElement, isValidElement } from "react";

export function CategoryMobileBento({
  sidebar,
  children,
  emptyMessage,
}: {
  sidebar: ReactNode;
  children: ReactNode;
  emptyMessage?: string;
}) {
  const items = Children.toArray(children).filter(
    isValidElement,
  ) as ReactElement[];

  const bentoSidebar = isValidElement(sidebar)
    ? cloneElement(
        sidebar as ReactElement,
        { variant: "bento", showFooter: false } as any,
      )
    : sidebar;

  if (items.length === 0) {
    return (
      <div className="category-bento-mobile w-full sm:hidden">
        <div className="category-bento-sidebar">{bentoSidebar}</div>
        <p className="mt-3 text-sm text-neutral-500">
          {emptyMessage ?? "No products yet."}
        </p>
      </div>
    );
  }

  return (
    <div className="category-bento-mobile w-full sm:hidden">
      <div className="flex flex-col gap-[var(--bento-gap)]">
        <div className="category-bento-sidebar">{bentoSidebar}</div>
        {items.map((child, index) => (
          <div key={child.key ?? `item-${index}`} className="min-w-0">
            {/* Force the child card to use bento density layout */}
            {cloneElement(child, { density: "bento" } as any)}
          </div>
        ))}
      </div>
    </div>
  );
}
