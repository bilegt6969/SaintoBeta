"use client";

import { usePathname } from "next/navigation";
import { ReactNode } from "react";

export default function ConditionalPadding({
  children,
}: {
  children: ReactNode;
}) {
  const pathname = usePathname();

  // Routes that have their own lite navbar and shouldn't have top padding
  const liteNavbarRoutes = ["/checkout", "/account", "/privacy"];
  const shouldHidePadding = liteNavbarRoutes.some((route) =>
    pathname?.startsWith(route),
  );

  // Pages with white background
  const isAboutPage = pathname === "/about";
  const isBlogPage = pathname === "/blog";
  const isContactPage = pathname === "/contact";
  const isProductPage = pathname?.startsWith("/product/");
  const useWhiteBg =
    isAboutPage || isBlogPage || isContactPage || isProductPage;

  if (shouldHidePadding) {
    return <>{children}</>;
  }

  return (
    <div
      className={`pt-[calc(max(0.75rem,env(safe-area-inset-top))+4.25rem)] pb-6 lg:pb-10 ${useWhiteBg ? "bg-white" : ""}`}
    >
      {children}
    </div>
  );
}
