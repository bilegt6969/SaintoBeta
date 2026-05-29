import { CategoryMobileBento } from "components/home/category-mobile-bento";
import { Children, isValidElement, type ReactNode } from "react";

export function ProductGridShell({
  sidebar,
  children,
  emptyMessage,
  variant = "default",
}: {
  sidebar: ReactNode;
  children: ReactNode;
  emptyMessage?: string;
}) {
  const childArray = Children.toArray(children).filter(isValidElement);
  const hasChildren = childArray.length > 0;
  const isCategoryBento = variant === "category";

  if (isCategoryBento) {
    return (
      <div className="mx-auto max-w-[1600px] px-4 py-6 md:px-8 lg:px-10 lg:py-10">
        <CategoryMobileBento sidebar={sidebar} emptyMessage={emptyMessage}>
          {children}
        </CategoryMobileBento>

        <div className="hidden gap-x-6 gap-y-10 lg:grid lg:grid-cols-3">
          {sidebar}
          {hasChildren ? (
            children
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
          children
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
