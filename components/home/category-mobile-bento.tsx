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
    ? cloneElement(sidebar as ReactElement, { variant: "bento" })
    : sidebar;

  if (items.length === 0) {
    return (
      <div className="category-bento-mobile w-full lg:hidden">
        <div className="category-bento-sidebar">{bentoSidebar}</div>
        <p className="mt-3 text-sm text-neutral-500">
          {emptyMessage ?? "No products yet."}
        </p>
      </div>
    );
  }

  const leftColumnItems = items.filter((_, idx) => idx % 2 === 1);
  const rightColumnItems = items.filter((_, idx) => idx % 2 === 0);

  return (
    <div className="category-bento-mobile w-full lg:hidden">
      <div className="flex gap-[var(--bento-gap)] items-start">
        {/* Left Column */}
        <div className="flex flex-1 flex-col gap-[var(--bento-gap)] min-w-0">
          <div className="category-bento-sidebar">{bentoSidebar}</div>
          {leftColumnItems.map((child, index) => (
            <div key={child.key ?? `left-${index}`} className="min-w-0">
              {/* Force the child card to use bento density layout */}
              {cloneElement(child, { density: "bento" } as any)}
            </div>
          ))}
        </div>

        {/* Right Column */}
        <div className="flex flex-1 flex-col gap-[var(--bento-gap)] min-w-0">
          {rightColumnItems.map((child, index) => (
            <div key={child.key ?? `right-${index}`} className="min-w-0">
              {/* Force the child card to use bento density layout */}
              {cloneElement(child, { density: "bento" } as any)}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
