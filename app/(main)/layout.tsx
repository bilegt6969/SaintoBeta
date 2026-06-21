import Footer from "components/Heading/Footer";
import { getCategoryPages } from "lib/commerce";
import { resolveCategoryNavLinks } from "lib/navigation";
import { ReactNode, Suspense } from "react";
import ConditionalNavbar from "./conditional-navbar";
import ConditionalPadding from "./conditional-padding";

const siteName = "Sainto";

export default async function MainLayout({
  children,
}: {
  children: ReactNode;
}) {
  const categoryPages = await getCategoryPages();
  const categories = resolveCategoryNavLinks(categoryPages);

  return (
    <>
      <Suspense fallback={null}>
        <ConditionalNavbar siteName={siteName} categories={categories} />
      </Suspense>
      <ConditionalPadding>{children}</ConditionalPadding>
      <Footer siteName={siteName} />
    </>
  );
}
