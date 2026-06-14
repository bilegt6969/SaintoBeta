"use client";

import { useEffect } from "react";

export function ProductPageWrapper({ children }: { children: React.ReactNode }) {
  useEffect(() => {
    document.body.style.backgroundColor = 'white';
    return () => {
      document.body.style.backgroundColor = '#f5f5f5';
    };
  }, []);

  return <>{children}</>;
}
