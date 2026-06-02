import { Hero } from "components/home/hero";
import { HomeGrid } from "components/home/home-grid";
import { getHero } from "lib/commerce";

export const metadata = {
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
      <HomeGrid />
    </>
  );
}
