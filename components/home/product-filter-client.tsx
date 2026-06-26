"use client";

import { HomeGrid } from "components/home/home-grid";
import FilterBar from "components/home/product-filter";
import { useEffect, useState } from "react";

export function ProductFilterClient() {
  const [activeCategory, setActiveCategory] = useState("all");
  const [activeSort, setActiveSort] = useState("Featured");
  const [products, setProducts] = useState<any[]>([]);

  useEffect(() => {
    // Load from localStorage after mount
    const savedCategory = localStorage.getItem("productCategory");
    const savedSort = localStorage.getItem("productSort");
    if (savedCategory) setActiveCategory(savedCategory);
    if (savedSort) setActiveSort(savedSort);
  }, []);

  useEffect(() => {
    // Fetch all products to calculate which categories have items
    fetch("/api/products")
      .then((res) => res.json())
      .then((data) => {
        setProducts(data.products || []);
      })
      .catch((err) => {
        console.error("Failed to fetch products:", err);
      });
  }, []);

  // Persist sort and category to localStorage
  useEffect(() => {
    localStorage.setItem("productCategory", activeCategory);
  }, [activeCategory]);

  useEffect(() => {
    localStorage.setItem("productSort", activeSort);
  }, [activeSort]);

  return (
    <>
      <FilterBar
        activeCategory={activeCategory}
        activeSort={activeSort}
        onCategoryChange={setActiveCategory}
        onSortChange={setActiveSort}
        products={products}
      />
      <HomeGrid activeCategory={activeCategory} activeSort={activeSort} />
    </>
  );
}
