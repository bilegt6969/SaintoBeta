"use client";

import { HomeProductCard } from "components/home/product-card";
import { ProductGridShell } from "components/home/product-grid-shell";
import { RecentlyViewedBlackCard } from "components/home/recently-viewed-black-card";
import { useEffect, useState } from "react";

const RECENTLY_VIEWED_KEY = "recentlyViewed";
const MAX_PRODUCTS = 5;

export function RecentlyViewedSection() {
  const [recentProducts, setRecentProducts] = useState<string[]>([]);

  useEffect(() => {
    // Load recently viewed products from localStorage
    const stored = localStorage.getItem(RECENTLY_VIEWED_KEY);
    if (stored) {
      try {
        const parsed = JSON.parse(stored);
        setRecentProducts(
          Array.isArray(parsed) ? parsed.slice(0, MAX_PRODUCTS) : [],
        );
      } catch (e) {
        console.error("Failed to parse recently viewed:", e);
      }
    }
  }, []);

  if (recentProducts.length === 0) {
    return null;
  }

  return (
    <ProductGridShell
      variant="home"
      sidebar={<RecentlyViewedBlackCard />}
      emptyMessage="No recently viewed products yet."
    >
      {recentProducts.map((handle) => (
        <RecentlyViewedProductCard key={handle} handle={handle} />
      ))}
    </ProductGridShell>
  );
}

function RecentlyViewedProductCard({ handle }: { handle: string }) {
  const [product, setProduct] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch(`/api/products/${handle}`)
      .then((res) => res.json())
      .then((data) => {
        setProduct(data);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, [handle]);

  if (loading || !product) {
    return null;
  }

  return <HomeProductCard product={product} priority={false} />;
}
