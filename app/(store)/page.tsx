import { Hero } from "components/home/hero";
import { HomeGrid } from "components/home/home-grid";
import FilterBar from "components/home/product-filter";
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
      <FilterBar />
      <HomeGrid />
    </>
  );
}
