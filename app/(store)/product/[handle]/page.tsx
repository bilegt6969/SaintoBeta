import { Gallery } from "components/product/gallery";
import { KeyIngredientsSection } from "components/product/key-ingredients-section";
import { ProductDescription } from "components/product/product-description";
import { ProductPageWrapper } from "components/product/product-page-wrapper";
import { ProductPillCard } from "components/product/product-pill-card";
import type { Image } from "lib/commerce";
import { getProduct, getProductRecommendations } from "lib/commerce";
import { HIDDEN_PRODUCT_TAG } from "lib/constants";
import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { Suspense } from "react";

export async function generateMetadata(props: {
  params: Promise<{ handle: string }>;
}): Promise<Metadata> {
  "use cache";

  const params = await props.params;
  const product = await getProduct(params.handle);

  if (!product) return notFound();

  const { url, width, height, altText: alt } = product.featuredImage || {};
  const indexable = !product.tags.includes(HIDDEN_PRODUCT_TAG);

  return {
    title: product.seo.title || product.title,
    description: product.seo.description || product.description,
    robots: {
      index: indexable,
      follow: indexable,
      googleBot: {
        index: indexable,
        follow: indexable,
      },
    },
    openGraph: url ? { images: [{ url, width, height, alt }] } : null,
  };
}

export default function ProductPage(props: {
  params: Promise<{ handle: string }>;
}) {
  return (
    <ProductPageWrapper>
      <div className="min-h-screen bg-transparent font-sans text-neutral-950">
        <div className="mx-auto max-w-[1400px] px-4 py-8 md:px-8 md:py-12 lg:px-12">
          <Suspense
            fallback={
              <div className="flex flex-col lg:flex-row gap-8 lg:gap-16">
                <div className="w-full lg:w-1/2 bg-neutral-50 animate-pulse rounded-3xl aspect-square" />
                <div className="flex min-w-0 w-full lg:w-1/2 flex-col gap-6 lg:pt-8">
                  <div className="h-4 w-32 bg-neutral-100 animate-pulse rounded-full" />
                  <div className="h-12 w-3/4 bg-neutral-100 animate-pulse rounded-lg" />
                  <div className="h-40 w-full bg-neutral-100 animate-pulse rounded-[2rem] mt-6" />
                </div>
              </div>
            }
          >
            <ProductContent paramsPromise={props.params} />
          </Suspense>
        </div>
      </div>
    </ProductPageWrapper>
  );
}

async function ProductContent({
  paramsPromise,
}: {
  paramsPromise: Promise<{ handle: string }>;
}) {
  const { handle } = await paramsPromise;
  const product = await getProduct(handle);

  if (!product) return notFound();

  const productJsonLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: product.title,
    description: product.description,
    image: product.featuredImage?.url || "",
    offers: {
      "@type": "AggregateOffer",
      availability: product.availableForSale
        ? "https://schema.org/InStock"
        : "https://schema.org/OutOfStock",
      priceCurrency: product.priceRange.minVariantPrice.currencyCode,
      highPrice: product.priceRange.maxVariantPrice.amount,
      lowPrice: product.priceRange.minVariantPrice.amount,
    },
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(productJsonLd),
        }}
      />

      {/* 50/50 Desktop split layout */}
      <div className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start">
        {/* Left Column: Your preferred Gallery wrapper */}
        <div className="w-full lg:w-1/2 lg:sticky lg:top-[calc(max(1rem,env(safe-area-inset-top))+2rem)] h-fit">
          <Gallery
            images={product.images.map((image: Image) => ({
              src: image.url, // Correctly formats CMS .url into component expected .src
              altText: image.altText || product.title,
            }))}
          />
        </div>

        {/* Right Column: Clean description & metrics grid */}
        <div className="w-full lg:w-1/2 flex flex-col lg:pt-2">
          <Suspense
            fallback={
              <div className="h-64 w-full bg-neutral-50 animate-pulse rounded-[2rem]" />
            }
          >
            <ProductDescription product={product} />
          </Suspense>
        </div>
      </div>

      {product.keyIngredients ? (
        <div className="mt-16 lg:mt-24">
          <KeyIngredientsSection section={product.keyIngredients} />
        </div>
      ) : null}

      <Suspense fallback={null}>
        <RelatedProducts id={product.id} />
      </Suspense>
    </>
  );
}

async function RelatedProducts({ id }: { id: string }) {
  const relatedProducts = await getProductRecommendations(id);

  if (!relatedProducts.length) return null;

  return (
    <section className="mt-20 border-t border-neutral-100 pt-16 md:mt-24 lg:pt-20">
      <div className="mb-10 flex flex-col gap-2 text-center items-center justify-center">
        <h2 className="text-[10px] font-bold tracking-[0.2em] text-neutral-400 uppercase">
          Curated for you
        </h2>
        <h3 className="text-3xl font-semibold tracking-tight text-neutral-900">
          You may also like
        </h3>
      </div>

      <ul className="grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-3">
        {relatedProducts.map((product, index) => (
          <li key={product.handle}>
            <ProductPillCard product={product} priority={index < 3} />
          </li>
        ))}
      </ul>
    </section>
  );
}
