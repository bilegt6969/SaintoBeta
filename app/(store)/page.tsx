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

  return (
    <>
      {hero && <Hero hero={hero} />}
      <ProductFilterClient />
    </>
  );
}
