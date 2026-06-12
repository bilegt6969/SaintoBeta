"use client";

import Navbar from "components/Heading/Navbar";
import { usePathname } from "next/navigation";
import { Suspense } from "react";

export default function ConditionalNavbar({
  siteName,
  categories,
}: {
  siteName: string;
  categories: any[];
}) {
  const pathname = usePathname();

  // Routes that have their own lite navbar and shouldn't show the main navbar
  const liteNavbarRoutes = ["/checkout", "/account", "/privacy"];
  const shouldHideNavbar = liteNavbarRoutes.some((route) =>
    pathname?.startsWith(route)
  );

  if (shouldHideNavbar) {
    return null;
  }

  return (
    <Suspense fallback={null}>
      <Navbar siteName={siteName} categories={categories} />
    </Suspense>
  );
}
