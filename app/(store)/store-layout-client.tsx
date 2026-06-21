"use client";

import Footer from "components/Heading/Footer";
import { usePathname } from "next/navigation";

interface StoreLayoutClientProps {
  siteName: string;
  categories?: { label: string; href: string }[];
}

// Isolated "use client" component so usePathname() is always
// inside a <Suspense> boundary (provided by the parent StoreLayout).
// This prevents the Next.js 15+ "blocking-route" error.
export function StoreLayoutClient({
  siteName,
  categories,
}: StoreLayoutClientProps) {
  const pathname = usePathname();
  const hideFooter =
    pathname === "/sign-in" || pathname === "/signup" || pathname === "/search";

  if (hideFooter) return null;

  return <Footer siteName={siteName} />;
}
