import { Hero } from "components/home/hero";
import { ProductFilterClient } from "components/home/product-filter-client";
import { getHero } from "lib/commerce";
import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "Sainto: Sneakers, Clothes, Accessories, Watches, Tech, Lifestyle",
  description:
    "Buy and sell the hottest sneakers, streetwear, accessories, watches, tech products, and lifestyle items. Discover curated fashion and designer products updated weekly.",
  alternates: {
    canonical: "/",
    languages: {
      "en-US": "/",
      "mn-MN": "/",
    },
  },
  openGraph: {
    type: "website",
    title: "Sainto: Sneakers, Clothes, Accessories, Watches, Tech, Lifestyle",
    description:
      "Buy and sell the hottest sneakers, streetwear, accessories, watches, tech products, and lifestyle items. Discover curated fashion and designer products updated weekly.",
  },
  other: {
    "description-mn":
      "Хамгийн сүүлийн үеийн гутал, хувцас, аксессуар, цаг, техник хэрэгсэл, амьдралын хэрэглээний зүйлсийг худалдах, худалдан авах. Долоо хоног бүр шинээр шинэчлэгддэг загварын бүтээгдэхүүнүүдийг нээ.",
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
