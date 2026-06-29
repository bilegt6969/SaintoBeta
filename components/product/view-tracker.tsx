"use client";

import { useEffect } from "react";

interface ViewTrackerProps {
  productId: string;
  productHandle: string;
}

export function ViewTracker({ productId, productHandle }: ViewTrackerProps) {
  useEffect(() => {
    // Track product view when component mounts
    fetch("/api/product-views", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        productId,
        productHandle,
      }),
    }).catch((error) => {
      console.error("Failed to track product view:", error);
    });
  }, [productId, productHandle]);

  return null; // This component doesn't render anything
}

// Export as ClientViewTracker for server component usage
export { ViewTracker as ClientViewTracker };
