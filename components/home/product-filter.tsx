"use client";

import { cn } from "lib/cn";
import {
    Amphora,
    Balloon,
    Briefcase,
    Check,
    ChevronDown,
    Flower,
    Footprints,
    Glasses,
    Grid,
    MonitorSmartphoneIcon,
    Paintbrush,
    Shirt,
    Watch,
} from "lucide-react";
import { useRef, useState } from "react";

// Adapted categories for a premium fashion/streetwear marketplace
const filterCategories = [
  { id: "all", label: "All", icon: Grid },
  { id: "sneakers", label: "Sneakers", icon: Footprints },
  { id: "clothes", label: "Clothes", icon: Shirt },
  { id: "accessories", label: "Accessories", icon: Glasses },
  { id: "carry", label: "Carry", icon: Briefcase },
  { id: "watches", label: "Watches", icon: Watch },
  { id: "lifestyle", label: "Lifestyle", icon: Balloon },
  { id: "fragrance", label: "Fragrance", icon: Glasses },
  { id: "home", label: "Home", icon: Briefcase },
  { id: "tech", label: "Tech", icon: MonitorSmartphoneIcon },
  { id: "heritage", label: "Heritage", icon: Amphora },
  { id: "art", label: "Art", icon: Paintbrush },
  { id: "beauty", label: "Beauty", icon: Flower },
];

const sortOptions = [
  "Featured",
  "Trending",
  "Newest",
  "Price: Low to High",
  "Price: High to Low",
];

// Our signature ultra-smooth transition
const smoothCurve =
  "transition-all duration-500 ease-[cubic-bezier(0.16,1,0.3,1)]";

interface FilterBarProps {
  activeCategory?: string;
  activeSort?: string;
  onCategoryChange?: (category: string) => void;
  onSortChange?: (sort: string) => void;
  products?: any[];
}

export default function FilterBar({
  activeCategory: controlledCategory,
  activeSort: controlledSort,
  onCategoryChange,
  onSortChange,
  products = [],
}: FilterBarProps) {
  const [internalCategory, setInternalCategory] = useState("all");
  const [internalSort, setInternalSort] = useState("Trending");
  const [isSortOpen, setIsSortOpen] = useState(false);

  const dropdownRef = useRef<HTMLDivElement>(null);

  const activeCategory = controlledCategory ?? internalCategory;
  const activeSort = controlledSort ?? internalSort;

  // Calculate which categories have products
  const categoriesWithProducts = filterCategories.filter((category) => {
    if (category.id === "all") return true; // Always show "All"
    return products.some((product) => {
      // Check if category is in the product's categories array
      if (product.categories && Array.isArray(product.categories)) {
        return product.categories.includes(category.id);
      }
      // Fallback to categoryHandle
      return product.categoryHandle === category.id;
    });
  });

  return (
    <div className="mx-auto max-w-[1600px] px-4 pt-6 pb-4 md:px-8 lg:px-10">
      <div className="flex w-full items-center justify-between gap-6">
        {/* LEFT: Scrollable Category Pills */}
        <div
          className="flex items-center gap-2 overflow-x-auto py-1 pl-1 pr-4 sm:pr-0 [&::-webkit-scrollbar]:hidden"
          style={{ scrollbarWidth: "none" }}
        >
          {categoriesWithProducts.map((category) => {
            const Icon = category.icon;
            const isActive = activeCategory === category.id;

            return (
              <button
                key={category.id}
                onClick={() => {
                  if (onCategoryChange) {
                    onCategoryChange(category.id);
                  } else {
                    setInternalCategory(category.id);
                  }
                }}
                className={cn(
                  "group flex flex-shrink-0 items-center gap-2 rounded-full px-4 py-2.5 text-[13px] font-medium",
                  smoothCurve,
                  isActive
                    ? "bg-white text-neutral-900 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.08)] ring-1 ring-black/4"
                    : "bg-transparent text-neutral-500 ring-1 ring-neutral-200/60 hover:bg-neutral-100 hover:text-neutral-800 hover:ring-neutral-200",
                )}
              >
                <Icon
                  className={cn(
                    "h-3.5 w-3.5",
                    smoothCurve,
                    isActive
                      ? "text-neutral-900"
                      : "text-neutral-400 group-hover:text-neutral-600",
                  )}
                />
                <span>{category.label}</span>
              </button>
            );
          })}
        </div>

        {/* RIGHT: The Upgraded Sort Dropdown */}
        <div className="relative flex-shrink-0" ref={dropdownRef}>
          <button
            type="button"
            onClick={() => setIsSortOpen((prev) => !prev)}
            className={cn(
              "group flex h-9 items-center gap-1.5 rounded-full bg-neutral-200/50 px-4 text-[13px] font-medium backdrop-blur-md ring-1 ring-black/4",
              smoothCurve,
              "hover:bg-neutral-200/80",
            )}
          >
            <span className="bg-transparent text-neutral-500">Sort by:</span>
            <span className="bg-transparent text-neutral-900">
              {activeSort}
            </span>

            <ChevronDown
              className={cn(
                "h-3.5 w-3.5 opacity-60",
                smoothCurve,
                isSortOpen && "rotate-180 opacity-100",
              )}
            />
          </button>

          {/* Dropdown Panel */}
          {isSortOpen && (
            <div
              className={cn(
                "absolute right-0 top-full z-50 mt-2 w-48 origin-top-right rounded-2xl bg-white/90 p-1.5 shadow-[0_16px_40px_-4px_rgba(0,0,0,0.1)] ring-1 ring-black/5 backdrop-blur-[32px] saturate-150 animate-in fade-in zoom-in-95",
                smoothCurve,
              )}
            >
              <div className="flex flex-col">
                {sortOptions.map((option) => (
                  <button
                    key={option}
                    onClick={() => {
                      if (onSortChange) {
                        onSortChange(option);
                      } else {
                        setInternalSort(option);
                      }
                      setIsSortOpen(false);
                    }}
                    className={cn(
                      "flex w-full items-center justify-between rounded-xl px-3 py-2 text-left text-[13px] font-medium transition-colors hover:bg-black/5",
                      activeSort === option
                        ? "text-neutral-900"
                        : "text-neutral-600",
                    )}
                  >
                    {option}
                    {activeSort === option && <Check className="h-3.5 w-3.5" />}
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
