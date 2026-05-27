import Navbar from "components/Heading/Navbar";
import { ReactNode, Suspense } from "react";
import { StoreLayoutClient } from "./store-layout-client";

const siteName = "Sainto";

export default function StoreLayout({ children }: { children: ReactNode }) {
  return (
    <>
      <Suspense fallback={null}>
        <Navbar siteName={siteName} />
      </Suspense>
      <div className="pb-[calc(max(0.75rem,env(safe-area-inset-bottom))+4.25rem)] lg:pb-0 lg:pt-[calc(max(0.75rem,env(safe-area-inset-top))+4.25rem)]">
        {children}
      </div>
      {/* Footer visibility depends on pathname — handled in client wrapper */}
      <Suspense fallback={null}>
        <StoreLayoutClient siteName={siteName} />
      </Suspense>
    </>
  );
}
