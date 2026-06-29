"use client";

import { BlackCard } from "components/home/black-card";
import { HomeProductCard } from "components/home/product-card";
import { ProductGridShell } from "components/home/product-grid-shell";
import { resolveCategoryNavLinks } from "lib/navigation";
import { useEffect, useState } from "react";

interface HomeGridProps {
  activeCategory?: string;
  activeSort?: string;
}

export function HomeGrid({
  activeCategory = "all",
  activeSort = "Featured",
}: HomeGridProps) {
  const [products, setProducts] = useState<any[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    async function loadProducts() {
      setIsLoading(true);
      try {
        // If trending is selected, use recommendations API
        if (activeSort === "Trending") {
          const params = new URLSearchParams({
            strategy: "trending",
            limit: "200",
          });

          const response = await fetch(
            `/api/recommendations?${params.toString()}`,
          );
          const data = await response.json();
          setProducts(data.products || []);
          return;
        }

        const params = new URLSearchParams();
        if (activeCategory !== "all") {
          params.set("category", activeCategory);
        }

        let sortKey: string | undefined;
        let reverse = false;

        if (activeSort === "Price: Low to High") {
          sortKey = "PRICE";
          reverse = false;
        } else if (activeSort === "Price: High to Low") {
          sortKey = "PRICE";
          reverse = true;
        } else if (activeSort === "Newest") {
          sortKey = "CREATED_AT";
        }

        if (sortKey) {
          params.set("sort", sortKey);
          if (reverse) {
            params.set("reverse", "true");
          }
        }

        const response = await fetch(`/api/products?${params.toString()}`);
        const data = await response.json();
        setProducts(data.products || []);
      } catch (error) {
        console.error("Failed to load products:", error);
        setProducts([]);
      } finally {
        setIsLoading(false);
      }
    }

    loadProducts();
  }, [activeCategory, activeSort]);

  const categories = resolveCategoryNavLinks([]);

  if (isLoading) {
    return (
      <ProductGridShell
        variant="home"
        sidebar={
          <BlackCard
            siteName={process.env.SITE_NAME || "Sainto"}
            categories={categories}
            logoHref="/"
            logo={{
              url: "/Lelogo.svg",
              altText: "Sainto",
              width: 800,
              height: 200,
            }}
            showNav={true}
          />
        }
        emptyMessage="Loading products..."
      >
        {Array.from({ length: 8 }).map((_, i) => (
          <div
            key={i}
            className="h-96 animate-pulse bg-neutral-100 rounded-2xl"
          />
        ))}
      </ProductGridShell>
    );
  }

  return (
    <ProductGridShell
      variant="home"
      sidebar={
        <BlackCard
          siteName={process.env.SITE_NAME || "Sainto"}
          categories={categories}
          logoHref="/"
          logo={{
            url: "/Lelogo.svg",
            altText: "Sainto",
            width: 800,
            height: 200,
          }}
          showNav={true}
        />
      }
      emptyMessage="No products yet. Add products in Sanity to populate the grid."
    >
      {products.map((product, index) => (
        <HomeProductCard
          key={product.handle}
          product={product}
          priority={index < 6}
        />
      ))}
    </ProductGridShell>
  );
}
