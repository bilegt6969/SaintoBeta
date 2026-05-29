import Navbar from "components/Heading/Navbar";
import { NotFoundView } from "components/not-found-view";
import { getCategoryPages } from "lib/commerce";
import { resolveCategoryNavLinks } from "lib/navigation";
import { Suspense } from "react";
import { StoreLayoutClient } from "./(store)/store-layout-client";

export const metadata = {
  title: "Page not found",
};

export default async function NotFound() {
  const categoryPages = await getCategoryPages();
  const categories = resolveCategoryNavLinks(categoryPages);
  const siteName = process.env.SITE_NAME || "Sainto";

  return (
    <>
      <Suspense fallback={null}>
        <Navbar siteName={siteName} categories={categories} />
      </Suspense>
      <div className="pb-[calc(max(0.75rem,env(safe-area-inset-bottom))+4.25rem)] lg:pb-0 lg:pt-[calc(max(0.75rem,env(safe-area-inset-top))+4.25rem)]">
        <NotFoundView />
      </div>
      <Suspense fallback={null}>
        <StoreLayoutClient siteName={siteName} />
      </Suspense>
    </>
  );
}
