import { SearchPageLoading } from "components/search/search-loading";
import { SearchPageClient } from "components/search/search-page-client";
import { getCategoryPages } from "lib/commerce";
import { resolveCategoryNavLinks } from "lib/navigation";
import { Suspense } from "react";

const siteName = process.env.SITE_NAME || "Sainto";

export const metadata = {
  title: "Search",
  description: "Search for products in the store.",
};

export default async function SearchPage() {
  const categoryPages = await getCategoryPages();
  const categories = resolveCategoryNavLinks(categoryPages);

  return (
    <Suspense fallback={<SearchPageLoading />}>
      <SearchPageClient categories={categories} siteName={siteName} />
    </Suspense>
  );
}
