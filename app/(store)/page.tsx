import { HomeGrid } from "components/home/home-grid";

export const metadata = {
  description:
    "Discover beautifully designed physical products. Updated weekly.",
  openGraph: {
    type: "website",
  },
};

export default function HomePage() {
  return <HomeGrid />;
}
