import { Hero } from "components/home/hero";
import { ProductFilterClient } from "components/home/product-filter-client";
import { getHero } from "lib/commerce";
import type { Metadata } from "next";

export const metadata: Metadata = {
  description:
    "Discover beautifully designed physical products. Updated weekly.",
  openGraph: {
    type: "website",
  },
};

export default async function HomePage() {
  const hero = await getHero();

  const siteNavigationJsonLd = {
    "@context": "https://schema.org",
    "@type": "WebSite",
    name: "Sainto",
    url: "https://www.sainto.app",
    potentialAction: {
      "@type": "SearchAction",
      target: {
        "@type": "EntryPoint",
        urlTemplate: "https://www.sainto.app/search?q={search_term_string}",
      },
      "query-input": "required name=search_term_string",
    },
  };

  const organizationJsonLd = {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: "Sainto",
    url: "https://www.sainto.app",
    logo: "https://www.sainto.app/Lelogo.svg",
    description:
      "Discover beautifully designed physical products. Updated weekly.",
    sameAs: [
      "https://www.facebook.com/sainto.store",
      "https://www.instagram.com/sainto.app/",
      "https://www.tiktok.com/@sainto.mn",
      "https://www.linkedin.com/company/108702260/",
    ],
  };

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(siteNavigationJsonLd),
        }}
      />
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{
          __html: JSON.stringify(organizationJsonLd),
        }}
      />
      {hero && <Hero hero={hero} />}
      <ProductFilterClient />
    </>
  );
}
