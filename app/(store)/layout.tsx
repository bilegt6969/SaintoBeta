import Navbar from "components/Heading/Navbar";
import { getCategoryPages } from "lib/commerce";
import { resolveCategoryNavLinks } from "lib/navigation";
import { ReactNode, Suspense } from "react";
import { StoreLayoutClient } from "./store-layout-client";

const siteName = "Sainto";

export default async function StoreLayout({
  children,
}: {
  children: ReactNode;
}) {
  const categoryPages = await getCategoryPages();
  const categories = resolveCategoryNavLinks(categoryPages);

  return (
    <>
      <Suspense fallback={null}>
        <Navbar siteName={siteName} categories={categories} />
      </Suspense>
      <div className="pt-[calc(max(0.75rem,env(safe-area-inset-top))+4.25rem)] pb-6 lg:pb-10">
        {children}
      </div>
      {/* Footer visibility depends on pathname — handled in client wrapper */}
      <Suspense fallback={null}>
        <StoreLayoutClient siteName={siteName} categories={categories} />
      </Suspense>
    </>
  );
}
