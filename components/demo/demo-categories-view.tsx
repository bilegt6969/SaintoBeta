"use client";

import { BlackCard } from "components/home/black-card";
import { HomeProductCard } from "components/home/product-card";
import { ProductGridShell } from "components/home/product-grid-shell";
import type { CategoryPage } from "lib/commerce/types";
import {
  DEFAULT_DEMO_CATEGORY_HANDLE,
  demoCategoriesToNavLinks,
  getDemoCategory,
} from "lib/demo/categories";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";

export function DemoCategoriesView({
  categories,
}: {
  categories: CategoryPage[];
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const requestedHandle = searchParams.get("cat");
  const activeCategory =
    getDemoCategory(requestedHandle ?? "") ??
    getDemoCategory(DEFAULT_DEMO_CATEGORY_HANDLE) ??
    categories[0]!;

  const navCategories = demoCategoriesToNavLinks();

  function selectCategory(handle: string) {
    const params = new URLSearchParams(searchParams.toString());
    params.set("cat", handle);
    router.replace(`/demo?${params.toString()}`, { scroll: false });
  }

  return (
    <div>
      <div className="border-b border-amber-200/80 bg-amber-50 px-4 py-3 md:px-8 lg:px-10">
        <div className="mx-auto flex max-w-[1600px] flex-wrap items-center justify-between gap-2">
          <p className="text-sm text-amber-950">
            <span className="font-medium">Demo mode</span> — sample categories
            and products. Data is static; product links are for layout preview only.
          </p>
          <Link
            href="/"
            className="text-sm font-medium text-amber-950 underline-offset-2 hover:underline"
          >
            Back to store
          </Link>
        </div>
      </div>

      <div className="mx-auto max-w-[1600px] px-4 pt-6 md:px-8 lg:px-10">
        <header className="mb-6 max-w-2xl">
          <h1 className="text-2xl font-semibold tracking-tight text-neutral-900">
            Category demo
          </h1>
          <p className="mt-2 text-sm text-neutral-600">
            {activeCategory.description}
          </p>
          <div className="mt-4 flex flex-wrap gap-2">
            {categories.map((category) => {
              const isActive = category.handle === activeCategory.handle;
              return (
                <button
                  key={category.handle}
                  type="button"
                  onClick={() => selectCategory(category.handle)}
                  className={`rounded-full px-4 py-1.5 text-sm font-medium transition-colors ${
                    isActive
                      ? "bg-neutral-900 text-white"
                      : "bg-neutral-100 text-neutral-700 hover:bg-neutral-200"
                  }`}
                >
                  {category.title}
                </button>
              );
            })}
          </div>
        </header>
      </div>

      <ProductGridShell
        variant="category"
        sidebar={
          <BlackCard
            variant="bento"
            siteName={activeCategory.title}
            logoHref={activeCategory.path}
            logo={activeCategory.logo}
            categories={navCategories}
            activeCategoryHref={activeCategory.path}
          />
        }
        emptyMessage={`No demo products in ${activeCategory.title}.`}
      >
        {activeCategory.products.map((product, index) => (
          <HomeProductCard
            key={product.handle}
            product={product}
            priority={index < 6}
            density="compact"
          />
        ))}
      </ProductGridShell>
    </div>
  );
}
