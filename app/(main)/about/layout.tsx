import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About Us | Sainto",
  description:
    "Learn about Sainto's mission, values, and story. We bring the coolest sneakers, streetwear, and lifestyle products to Mongolia.",
  keywords:
    "about sainto, sainto story, mission, values, mongolia fashion, online shopping",
  openGraph: {
    title: "About Us | Sainto",
    description:
      "Learn about Sainto's mission, values, and story. We bring the coolest sneakers, streetwear, and lifestyle products to Mongolia.",
    type: "website",
  },
};

export default function AboutLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return children;
}
