import { DemoCategoriesView } from "components/demo/demo-categories-view";
import { DEMO_CATEGORIES } from "lib/demo/categories";
import type { Metadata } from "next";
import { Suspense } from "react";

export const metadata: Metadata = {
  title: "Category demo",
  description: "Preview category grids with static demo data.",
  robots: { index: false, follow: false },
};

function DemoCategoriesFallback() {
  return (
    <div className="mx-auto max-w-[1600px] px-4 py-16 md:px-8">
      <div className="h-8 w-48 animate-pulse rounded-md bg-neutral-200" />
      <div className="mt-4 h-4 w-96 max-w-full animate-pulse rounded-md bg-neutral-100" />
    </div>
  );
}

export default function DemoPage() {
  return (
    <Suspense fallback={<DemoCategoriesFallback />}>
      <DemoCategoriesView categories={DEMO_CATEGORIES} />
    </Suspense>
  );
}
