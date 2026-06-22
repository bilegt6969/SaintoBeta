import Wrapper from "components/global/wrapper";
import { BlackCard } from "components/home/black-card";
import { getCategoryPages } from "lib/commerce";
import { resolveCategoryNavLinks } from "lib/navigation";

export default async function CategoriesPage() {
  // Fetch all categories directly from Sanity/Commerce lib to get their logos and data
  const categories = await getCategoryPages();

  // Resolve the navigation links so each card can display the full list in its menu
  const navLinks = resolveCategoryNavLinks(categories);

  return (
    <div className="min-h-screen bg-neutral-50 py-16">
      <Wrapper>
        <div className="max-w-7xl mx-auto px-4">
          <h1 className="text-4xl font-bold text-neutral-900 mb-4">
            Categories
          </h1>
          <p className="text-lg text-neutral-600 mb-12">
            Browse our collection by category
          </p>

          {/* Grid layout containing a BlackCard for every single category */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {categories.map((category) => (
              <div
                key={category.path}
                className="w-full aspect-[4/3] min-h-[320px]"
              >
                <BlackCard
                  variant="bento"
                  siteName={category.title}
                  logoHref={category.path}
                  logo={category.logo} // Passes the unique SVG logo from Sanity
                  categories={navLinks} // Keeps the full menu accessible inside the card
                  activeCategoryHref={category.path} // Bold/highlights this specific card's category
                />
              </div>
            ))}
          </div>
        </div>
      </Wrapper>
    </div>
  );
}
