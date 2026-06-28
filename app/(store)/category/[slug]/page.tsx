import { CategoryGrid } from "components/home/category-grid";
import { getCategoryPage } from "lib/commerce";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateMetadata(props: {
  params: Promise<{ slug: string }>;
}): Promise<Metadata> {
  const { slug } = await props.params;
  const category = await getCategoryPage(slug);

  if (!category) {
    return { title: "Category not found" };
  }

  return {
    title: category.seo.title,
    description: category.seo.description,
  };
}

export default async function CategoryPage(props: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await props.params;
  const category = await getCategoryPage(slug);

  if (!category) {
    notFound();
  }

  const collectionJsonLd = {
    "@context": "https://schema.org",
    "@type": "CollectionPage",
    name: category.title,
    description: category.seo.description || category.description,
    url: `https://www.sainto.app${category.path}`,
  };

  const breadcrumbJsonLd = {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: [
      {
        "@type": "ListItem",
        position: 1,
        name: "Home",
        item: "https://www.sainto.app",
      },
      {
        "@type": "ListItem",
        position: 2,
        name: category.title,
        item: `https://www.sainto.app${category.path}`,
      },
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(collectionJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(breadcrumbJsonLd),
        }}
      />
      <CategoryGrid category={category} />
    </>
  );
}
