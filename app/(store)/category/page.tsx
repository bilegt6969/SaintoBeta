import { getCategoryPages } from "lib/commerce";
import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";

export const metadata: Metadata = {
  title: "Categories",
  description: "Browse all product categories",
};

export default async function CategoryListPage() {
  const categoryPages = await getCategoryPages();

  return (
    <div className="min-h-screen ">
      <div className="mx-auto max-w-[1600px] px-4 py-2 md:px-8 lg:px-10 lg:py-2">
        {/* Header section with Title and See All link */}
        <div className="mb-6 flex items-baseline justify-between">
          <h1 className="text-2xl font-semibold tracking-tight text-gray-900">
            By category
          </h1>
          <Link
            href="/categories"
            className="text-sm font-normal text-gray-500 hover:text-gray-700 transition-colors"
          >
            See all
          </Link>
        </div>

        {/* Grid layout matching the image profile */}
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-4 xl:grid-cols-4">
          {categoryPages.map((category) => {
            const faceImage = category.featuredProduct?.featuredImage;
            const itemCount = category.products.length;

            return (
              <Link
                key={category.id}
                href={category.path}
                className="group relative flex flex-col justify-between overflow-hidden rounded-2xl bg-white p-5"
              >
                {/* Blur overlay for the entire card */}
                <div className="pointer-events-none absolute inset-0 z-10 opacity-0 bg-white/30 backdrop-blur-[20px] transition-opacity duration-500 ease-out group-hover:opacity-100" />

                {/* Center-aligned image wrapper */}
                <div className="relative z-20 flex aspect-square w-full items-center justify-center p-2">
                  {faceImage ? (
                    <div className="relative h-full w-full">
                      <Image
                        src={faceImage.url}
                        alt={faceImage.altText || category.title}
                        fill
                        className="object-contain transition duration-500 ease-out group-hover:scale-[1.03]"
                        sizes="(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw"
                        priority
                      />
                    </div>
                  ) : (
                    <div className="flex h-full w-full items-center justify-center bg-gray-50 rounded-xl">
                      <span className="text-xs text-gray-400">No image</span>
                    </div>
                  )}
                </div>

                {/* Card labels positioned perfectly at the bottom corner edges */}
                <div className="relative z-30 flex items-center justify-between pt-4">
                  <h2 className="text-sm font-normal text-gray-900">
                    {category.title}
                  </h2>
                  <span className="text-sm text-gray-400 font-mono">
                    {itemCount}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>

        {categoryPages.length === 0 && (
          <div className="text-center py-12">
            <p className="text-gray-500">No categories found</p>
          </div>
        )}
      </div>
    </div>
  );
}
