import { createImageUrlBuilder } from "@sanity/image-url";
import { defaultSort, sorting } from "lib/constants";
import { sanityClient } from "lib/sanity/client";
import { NextResponse } from "next/server";

const builder = createImageUrlBuilder(sanityClient);

function urlFor(source: any): string {
  return builder.image(source).width(800).url();
}

/**
 * Improved search route for a thrift e-commerce platform.
 *
 * Improvements over original:
 *  1. Faceted filtering: brand, category, condition, size, price range, onSale
 *  2. Pagination: page + limit params; returns pagination metadata
 *  3. Size filter in search (not just recommendations)
 *  4. Empty query → trending fallback (no dead search pages)
 *  5. Zero-result logging for analytics / inventory gap tracking
 *  6. Wildcard prefix matching for partial text queries ("sneak" → "sneakers")
 *
 * NOTE: For true typo tolerance ("sneekers" → "sneakers"), integrate a
 * dedicated search engine like Typesense or Algolia and replace the GROQ
 * text query below with their API. Sanity's `match` operator does NOT
 * handle misspellings — it's prefix-matched full-text search only.
 *
 * API usage:
 *  GET /api/search?q=vintage+jacket&category=Outerwear&condition=good&size=M&page=1&limit=24
 */

const CONDITIONS = ["new", "like-new", "good", "fair"] as const;
type Condition = (typeof CONDITIONS)[number];

// Map sortKey → GROQ order clause
const GROQ_SORT_MAP: Record<string, string> = {
  PRICE: "price",
  CREATED_AT: "_createdAt",
  UPDATED_AT: "_updatedAt",
  BEST_SELLING: "_createdAt", // Fallback until you have sales data
  RELEVANCE: "_createdAt", // Fallback; real relevance needs a search engine
};

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);

  // ── Query & sort ──────────────────────────────────────────────────────────
  const q = searchParams.get("q")?.trim() ?? "";
  const sort = searchParams.get("sort");
  const { sortKey, reverse } =
    sorting.find((item) => item.slug === sort) || defaultSort;

  // ── Pagination ────────────────────────────────────────────────────────────
  const page = Math.max(1, parseInt(searchParams.get("page") ?? "1", 10));
  const limit = Math.min(
    48,
    Math.max(1, parseInt(searchParams.get("limit") ?? "24", 10)),
  );
  const offset = (page - 1) * limit;

  // ── Filters ───────────────────────────────────────────────────────────────
  const brand = searchParams.get("brand")?.trim();
  const category = searchParams.get("category")?.trim();
  const condition = searchParams.get("condition")?.trim() as Condition | null;
  const size = searchParams.get("size")?.trim().toUpperCase(); // Sizes stored as "XS","S","M","L","XL"
  const minPrice = searchParams.get("minPrice")
    ? parseFloat(searchParams.get("minPrice")!)
    : null;
  const maxPrice = searchParams.get("maxPrice")
    ? parseFloat(searchParams.get("maxPrice")!)
    : null;
  const onSale = searchParams.get("onSale") === "true";
  const inStock = searchParams.get("inStock") !== "false"; // default: available items only

  // ── Build GROQ filter ─────────────────────────────────────────────────────
  const filters: string[] = ['_type == "product"'];

  if (inStock) filters.push("availableForSale == true");
  if (brand) filters.push("brand match $brand");
  if (category) filters.push("$category in category");
  if (condition && CONDITIONS.includes(condition))
    filters.push("condition == $condition");
  if (minPrice !== null) filters.push("price >= $minPrice");
  if (maxPrice !== null) filters.push("price <= $maxPrice");
  if (onSale) filters.push("compareAtPrice > price");

  // Size filter: find products with at least one available variant in the requested size
  if (size) {
    filters.push(
      `count(variants[availableForSale == true && count(selectedOptions[name == "Size" && value == $size]) > 0]) > 0`,
    );
  }

  // Text search: wildcard suffix for prefix matching ("sneak" matches "sneakers")
  // Switch this block to your Typesense/Algolia query when you add a search engine.
  if (q) {
    filters.push(
      `(title match $q || brand match $q || $qExact in tags || pt::text(description) match $q)`,
    );
  }

  const filterStr = filters.join(" && ");

  // ── GROQ sort ─────────────────────────────────────────────────────────────
  const groqSortField = GROQ_SORT_MAP[sortKey] ?? "_createdAt";
  const groqSort = `${groqSortField} ${reverse ? "desc" : "asc"}`;

  // ── Shared projection ─────────────────────────────────────────────────────
  const projection = `{
    _id,
    "handle": slug.current,
    title,
    brand,
    category,
    price,
    compareAtPrice,
    condition,
    tags,
    "listedAt":  _createdAt,
    "updatedAt": _updatedAt,
    availableForSale,
    outOfStock,
    "featuredImage": images[0],
    variants
  }`;

  // ── Empty query with no filters → trending fallback ───────────────────────
  const hasFilters = !!(
    brand ||
    category ||
    condition ||
    size ||
    minPrice !== null ||
    maxPrice !== null ||
    onSale
  );

  if (!q && !hasFilters) {
    const trendingQuery = `*[_type == "product" && availableForSale == true]
      | order(_createdAt desc) [0...$limit] ${projection}`;

    const products = await sanityClient.fetch(trendingQuery, { limit });

    // Transform products to match expected Product type structure
    const transformedProducts = (products as any[]).map((product) => ({
      ...product,
      tags: Array.isArray(product.tags) ? product.tags : [],
      categories: Array.isArray(product.category)
        ? product.category
        : product.category
          ? [product.category]
          : [],
      featuredImage: product.featuredImage
        ? {
            url: urlFor(product.featuredImage),
            altText: product.title || "",
            width: 800,
            height: 800,
          }
        : { url: "", altText: product.title || "", width: 0, height: 0 },
      priceRange: {
        minVariantPrice: {
          amount: String(product.price || 0),
          currencyCode: "MNT",
        },
        maxVariantPrice: {
          amount: String(product.price || 0),
          currencyCode: "MNT",
        },
      },
    }));

    return NextResponse.json({
      products: transformedProducts,
      query: "",
      pagination: {
        page: 1,
        limit,
        total: transformedProducts.length,
        totalPages: 1,
      },
      appliedFilters: {},
    });
  }

  // ── Query params ──────────────────────────────────────────────────────────
  const params: Record<string, any> = {
    offset,
    end: offset + limit,
  };
  if (q) {
    params.q = `${q}*`; // Wildcard suffix: prefix matching
    params.qExact = q; // Exact match for tag lookup
  }
  if (brand) params.brand = `*${brand}*`;
  if (category) params.category = category;
  if (condition) params.condition = condition;
  if (size) params.size = size;
  if (minPrice !== null) params.minPrice = minPrice;
  if (maxPrice !== null) params.maxPrice = maxPrice;

  // ── Execute: products + count in parallel ─────────────────────────────────
  const productQuery = `*[${filterStr}] | order(${groqSort}) [$offset...$end] ${projection}`;
  const countQuery = `count(*[${filterStr}])`;

  try {
    const [products, total] = await Promise.all([
      sanityClient.fetch(productQuery, params),
      sanityClient.fetch(countQuery, params),
    ]);

    // Transform products to match expected Product type structure
    const transformedProducts = (products as any[]).map((product) => ({
      ...product,
      tags: Array.isArray(product.tags) ? product.tags : [],
      categories: Array.isArray(product.category)
        ? product.category
        : product.category
          ? [product.category]
          : [],
      featuredImage: product.featuredImage
        ? {
            url: urlFor(product.featuredImage),
            altText: product.title || "",
            width: 800,
            height: 800,
          }
        : { url: "", altText: product.title || "", width: 0, height: 0 },
      priceRange: {
        minVariantPrice: {
          amount: String(product.price || 0),
          currencyCode: "MNT",
        },
        maxVariantPrice: {
          amount: String(product.price || 0),
          currencyCode: "MNT",
        },
      },
    }));

    // Zero-result tracking — log these for inventory gap analysis
    if (transformedProducts.length === 0) {
      console.warn("[search] zero results", {
        query: q,
        filters: {
          brand,
          category,
          condition,
          size,
          minPrice,
          maxPrice,
          onSale,
        },
        timestamp: new Date().toISOString(),
      });
      // TODO: persist to analytics store (e.g. Vercel KV, Posthog, or a Sanity document)
    }

    return NextResponse.json({
      products: transformedProducts,
      query: q,
      pagination: {
        page,
        limit,
        total,
        totalPages: Math.ceil(total / limit),
      },
      appliedFilters: {
        brand,
        category,
        condition,
        size,
        minPrice,
        maxPrice,
        onSale,
        inStock,
      },
    });
  } catch (error) {
    console.error("[search] GROQ error:", error);
    return NextResponse.json(
      {
        products: [],
        query: q,
        pagination: { page, limit, total: 0, totalPages: 0 },
        error: "Search failed",
      },
      { status: 500 },
    );
  }
}
