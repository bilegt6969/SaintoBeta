import Footer from "components/Heading/Footer";
import { ReactNode } from "react";

const siteName = "Sainto";

export default function LegalLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <>
      {children}
      <Footer siteName={siteName} />
    </>
  );
}
