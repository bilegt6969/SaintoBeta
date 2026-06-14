"use client";

import { BlackCard } from "components/home/black-card";
import { ProductGridShell } from "components/home/product-grid-shell";
import LiteFooter from "components/layout/lite-footer";
import { SearchBar } from "components/search/search-bar";
import {
    fadeUpVariants,
    gridItemVariants,
    pageVariants,
    searchBarVariants,
    searchEase,
    searchSpring,
    useSearchMotion,
} from "components/search/search-motion";
import {
    SearchProductCard,
    SearchProductCardSkeleton,
} from "components/search/search-product-card";
import { AnimatePresence, motion } from "framer-motion";
import { cn } from "lib/cn";
import type { Product } from "lib/commerce";
import { defaultSort, sorting, type SortFilterItem } from "lib/constants";
import type { NavLink } from "lib/navigation";
import { useRouter, useSearchParams } from "next/navigation";
import type { ReactNode } from "react";
import { useCallback, useEffect, useMemo, useTransition } from "react";
import useSWR from "swr";

type SearchResponse = { products: Product[]; query: string };
type GridPhase = "idle" | "loading" | "empty" | "results";

async function fetchSearch(url: string): Promise<SearchResponse> {
  const res = await fetch(url);
  if (!res.ok) throw new Error("Search failed");
  return res.json();
}

function SortPill({
  item,
  active,
  disabled,
  onSelect,
  shouldAnimate,
}: {
  item: SortFilterItem;
  active: boolean;
  disabled?: boolean;
  onSelect: () => void;
  shouldAnimate: boolean;
}) {
  return (
    <button
      type="button"
      disabled={disabled}
      onClick={onSelect}
      className={cn(
        "relative shrink-0 rounded-full px-4 py-1.5 text-[13px] font-medium outline-none transition-colors duration-300",
        disabled && "pointer-events-none opacity-50",
      )}
    >
      {active && (
        <motion.div
          layoutId={shouldAnimate ? "active-sort-pill" : undefined}
          className="absolute inset-0 rounded-full bg-neutral-900 shadow-[0_2px_8px_-2px_rgba(0,0,0,0.12)]"
          initial={false}
          transition={searchSpring}
        />
      )}

      {!active && (
        <div className="absolute inset-0 rounded-full bg-transparent transition-colors duration-300 hover:bg-neutral-100" />
      )}

      <span
        className={cn(
          "relative z-10 transition-colors duration-300",
          active ? "text-white" : "text-neutral-600 hover:text-neutral-900",
        )}
      >
        {item.title}
      </span>
    </button>
  );
}

function AnimatedGridItem({
  children,
  shouldAnimate,
  index = 0,
}: {
  children: ReactNode;
  shouldAnimate: boolean;
  index?: number;
}) {
  if (!shouldAnimate) return <div className="min-w-0">{children}</div>;

  return (
    <motion.div
      className="min-w-0"
      variants={gridItemVariants}
      initial="hidden"
      animate="show"
      transition={{ delay: index * 0.05 }}
      layout
    >
      {children}
    </motion.div>
  );
}

function GridMessage({
  children,
  shouldAnimate,
  messageKey,
}: {
  children: ReactNode;
  shouldAnimate: boolean;
  messageKey: string;
}) {
  const inner = (
    <p className="text-sm text-neutral-500 lg:col-span-2">{children}</p>
  );
  if (!shouldAnimate)
    return <div className="min-w-0 lg:col-span-2">{inner}</div>;

  return (
    <motion.div
      key={messageKey}
      className="min-w-0 lg:col-span-2"
      variants={fadeUpVariants}
      initial="hidden"
      animate="show"
      exit="exit"
      layout
    >
      {inner}
    </motion.div>
  );
}

export function SearchPageClient({
  categories,
  siteName,
}: {
  categories: NavLink[];
  siteName: string;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [, startTransition] = useTransition();
  const { shouldAnimate } = useSearchMotion();

  const query = searchParams.get("q")?.trim() ?? "";
  const sortSlug = searchParams.get("sort");
  const activeSort =
    sorting.find((item) => item.slug === sortSlug) || defaultSort;

  const apiUrl = useMemo(() => {
    if (!query) return null;
    const params = new URLSearchParams({ q: query });
    if (sortSlug) params.set("sort", sortSlug);
    return `/api/search?${params.toString()}`;
  }, [query, sortSlug]);

  const { data, isLoading, isValidating } = useSWR(apiUrl, fetchSearch, {
    keepPreviousData: true,
    revalidateOnFocus: false,
  });

  const products = data?.products ?? [];
  const showLoading = Boolean(query) && (isLoading || isValidating) && !data;

  const gridPhase: GridPhase = (() => {
    if (!query) return "idle";
    if (showLoading) return "loading";
    if (products.length === 0) return "empty";
    return "results";
  })();

  const pushParams = useCallback(
    (next: { q?: string; sort?: string | null }) => {
      const params = new URLSearchParams(searchParams.toString());
      if (next.q !== undefined) {
        if (next.q) params.set("q", next.q);
        else params.delete("q");
      }
      if ("sort" in next) {
        if (next.sort) params.set("sort", next.sort);
        else params.delete("sort");
      }
      const qs = params.toString();
      startTransition(() => {
        router.push(qs ? `/search?${qs}` : "/search", { scroll: false });
      });
    },
    [router, searchParams, startTransition],
  );

  useEffect(() => {
    const onKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        router.push("/search");
      }
    };
    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [router]);

  const handleSearch = (q: string) => pushParams({ q });

  const resultsLabel = (() => {
    if (!query) return null;
    if (showLoading) {
      return (
        <p className="text-sm text-neutral-500">
          Searching for{" "}
          <span className="font-medium text-neutral-800">
            &quot;{query}&quot;
          </span>
          …
        </p>
      );
    }
    if (products.length === 0) {
      return (
        <p className="text-sm text-neutral-500">
          No products match{" "}
          <span className="font-medium text-neutral-800">
            &quot;{query}&quot;
          </span>
        </p>
      );
    }
    const word = products.length === 1 ? "result" : "results";
    return (
      <p className="text-sm text-neutral-500">
        {products.length} {word} for{" "}
        <span className="font-medium text-neutral-800">
          &quot;{query}&quot;
        </span>
      </p>
    );
  })();

  const sidebar = (
    <AnimatedGridItem shouldAnimate={shouldAnimate} index={0}>
      <BlackCard
        variant="bento"
        siteName={siteName}
        logoHref="/"
        logo={{
          url: "/Lelogo.svg",
          altText: "Sainto",
          width: 800,
          height: 200,
        }}
        categories={categories}
      />
    </AnimatedGridItem>
  );

  const gridContent = (() => {
    if (gridPhase === "idle") {
      return (
        <GridMessage shouldAnimate={shouldAnimate} messageKey="idle">
          Type a product name or brand above, or pick a suggestion from the
          card.
        </GridMessage>
      );
    }

    if (gridPhase === "loading") {
      return Array.from({ length: 6 }, (_, i) => (
        <AnimatedGridItem
          key={`skel-${i}`}
          shouldAnimate={shouldAnimate}
          index={i + 1}
        >
          <SearchProductCardSkeleton />
        </AnimatedGridItem>
      ));
    }

    if (gridPhase === "empty") {
      return (
        <GridMessage shouldAnimate={shouldAnimate} messageKey="empty">
          Try another term or browse a category from the sidebar.
        </GridMessage>
      );
    }

    return products.map((product, index) => (
      <AnimatedGridItem
        key={product.handle}
        shouldAnimate={shouldAnimate}
        index={index + 1}
      >
        <SearchProductCard product={product} priority={index < 6} />
      </AnimatedGridItem>
    ));
  })();

  const pageInner = (
    <>
      <motion.div
        variants={fadeUpVariants}
        className="mx-auto flex max-w-[1600px] flex-col items-center gap-2 pb-2 pt-6 text-center md:pb-4 md:pt-8"
        layout
      >
        <p className="text-[10px] font-bold uppercase tracking-[0.2em] text-neutral-400">
          Discover
        </p>
        <h1 className="text-3xl font-semibold tracking-tight text-neutral-900 md:text-4xl">
          Search
        </h1>
      </motion.div>

      <motion.div
        className="mx-auto w-full max-w-2xl pb-6 md:pb-8 relative z-20"
        variants={searchBarVariants}
        layout
      >
        <SearchBar defaultValue={query} autoFocus onSubmit={handleSearch} />
      </motion.div>

      <motion.div layout className="min-h-[64px]">
        <AnimatePresence mode="wait">
          {query ? (
            <motion.div
              key="meta"
              className="flex w-full flex-col items-center gap-4"
              variants={fadeUpVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
            >
              <motion.div layout transition={searchSpring}>
                {resultsLabel}
              </motion.div>

              <motion.div
                layout
                className="flex w-full flex-wrap justify-center gap-1 rounded-full bg-black/5 p-1 backdrop-blur-sm sm:w-fit"
              >
                {sorting.map((item) => (
                  <SortPill
                    key={item.title}
                    item={item}
                    active={(item.slug ?? null) === (activeSort.slug ?? null)}
                    disabled={showLoading}
                    onSelect={() => pushParams({ sort: item.slug })}
                    shouldAnimate={shouldAnimate}
                  />
                ))}
              </motion.div>
            </motion.div>
          ) : (
            <motion.div
              key="hint"
              className="text-center"
              variants={fadeUpVariants}
              initial="hidden"
              animate="show"
              exit="exit"
              layout
            >
              <p className="max-w-md text-sm text-neutral-500">
                Find products across every category — same calm grid as
                collections.
              </p>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.div>

      <motion.div variants={fadeUpVariants} className="relative mt-8" layout>
        <div
          className="pointer-events-none absolute -top-8 left-0 right-0 z-10 h-16 bg-white/40 backdrop-blur-md transition-opacity duration-500"
          style={{
            WebkitMaskImage:
              "linear-gradient(to top, transparent 0%, black 100%)",
            maskImage: "linear-gradient(to top, transparent 0%, black 100%)",
          }}
        />

        <AnimatePresence mode="wait">
          <motion.div
            key={
              gridPhase === "results"
                ? `results-${query}-${sortSlug ?? ""}`
                : gridPhase
            }
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.4, ease: searchEase }}
          >
            <ProductGridShell
              variant="category"
              sidebar={sidebar}
              emptyMessage="Start typing to see products appear here."
            >
              {gridContent}
            </ProductGridShell>
          </motion.div>
        </AnimatePresence>
      </motion.div>
    </>
  );

  return (
    <div className="relative min-h-[70vh] bg-white font-sans text-neutral-950 overflow-hidden">
      {shouldAnimate ? (
        <motion.div
          className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8 lg:px-10"
          variants={pageVariants}
          initial="hidden"
          animate="show"
        >
          {pageInner}
        </motion.div>
      ) : (
        <div className="mx-auto max-w-[1600px] px-4 pb-24 md:px-8 lg:px-10">
          {pageInner}
        </div>
      )}
      <LiteFooter />
    </div>
  );
}
