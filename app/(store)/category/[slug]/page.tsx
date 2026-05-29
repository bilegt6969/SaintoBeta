import { CategoryGrid } from "components/home/category-grid";
import { getCategoryPage, getCategoryPages } from "lib/commerce";
import type { Metadata } from "next";
import { notFound } from "next/navigation";

export async function generateStaticParams() {
  const pages = await getCategoryPages();
  return pages.map((page) => ({ slug: page.handle }));
}

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

  return <CategoryGrid category={category} />;
}
