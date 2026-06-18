import Wrapper from "components/global/wrapper";
import { resolveCategoryNavLinks } from "lib/navigation";
import type { CategoryPage } from "lib/commerce/types";
import Link from "next/link";

async function getCategories(): Promise<CategoryPage[]> {
  // In production, this would fetch from Sanity
  // For now, return empty array to use fallback
  return [];
}

export default async function CategoriesPage() {
  const categories = await getCategories();
  const navLinks = resolveCategoryNavLinks(categories);

  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <Wrapper>
        <div className="max-w-4xl mx-auto">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Categories
          </h1>
          <p className="text-lg text-neutral-600 mb-12">
            Browse our collection by category
          </p>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {navLinks.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="group flex items-center justify-between p-6 bg-white rounded-2xl shadow-sm hover:shadow-md transition-shadow duration-200"
              >
                <span className="text-lg font-medium text-neutral-900 group-hover:text-neutral-700">
                  {link.label}
                </span>
                <svg
                  className="w-5 h-5 text-neutral-400 group-hover:text-neutral-600 transition-colors"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d="M9 5l7 7-7 7"
                  />
                </svg>
              </Link>
            ))}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
