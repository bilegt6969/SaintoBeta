import imageUrlBuilder from "@sanity/image-url";
import { buildBundleAffinityMap } from "lib/recommendations/bundles";
import { injectDiversity } from "lib/recommendations/diversity";
import { filterByVariantAvailability } from "lib/recommendations/filters";
import {
    CART_QUERY,
    TIER_1_QUERY,
    TIER_2_QUERY,
    TRENDING_QUERY,
} from "lib/recommendations/queries";
import { scoreProductPair, scoreTrending } from "lib/recommendations/scorer";
import type {
    RecommendationProduct,
    RecommendationStrategy,
    ScoredProduct,
    ScoringContext,
} from "lib/recommendations/types";
import { sanityClient } from "lib/sanity/client";
import { ProductView } from "models/ProductView";
import mongoose from "mongoose";
import { NextRequest, NextResponse } from "next/server";
import { isSanityConfigured } from "sanity/env";

const MONGODB_URI = process.env.MONGODB_URI;

// Cache the connection
let cachedConnection: typeof mongoose | null = null;

async function connectToDatabase() {
  if (cachedConnection) {
    return cachedConnection;
  }

  if (!MONGODB_URI) {
    return null;
  }

  cachedConnection = await mongoose.connect(MONGODB_URI!);
  return cachedConnection;
}

// Build the image URL builder once
const builder = imageUrlBuilder(sanityClient);

function urlFor(source: any): string {
  return builder.image(source).width(800).url();
}

interface SanityProduct {
  _id: string;
  slug: any;
  title: string;
  brand: string;
  category: string[];
  price: number;
  compareAtPrice?: number;
  condition?: string;
  tags: string[];
  updatedAt: string;
  availableForSale: boolean;
  outOfStock?: boolean;
  images: any[];
  variants: any[];
  purchaseBundles?: any;
  bestFor?: any;
}

// Helper to map Sanity product to our RecommendationProduct type
function mapSanityProduct(doc: SanityProduct): RecommendationProduct {
  const priceAmount = (doc.price || 0).toString();
  const images = doc.images || [];

  const featuredImage =
    images.length > 0
      ? {
          url: urlFor(images[0]), // ← resolves the Sanity asset ref to a real CDN URL
          altText: doc.title || "",
          width: 800,
          height: 800,
        }
      : {
          url: "",
          altText: doc.title || "",
          width: 0,
          height: 0,
        };

  return {
    id: doc._id,
    handle: doc.slug?.current || "",
    title: doc.title,
    brand: doc.brand,
    categories: doc.category || [],
    priceRange: {
      minVariantPrice: { amount: priceAmount, currencyCode: "MNT" },
      maxVariantPrice: { amount: priceAmount, currencyCode: "MNT" },
    },
    compareAtPrice: doc.compareAtPrice,
    condition: doc.condition,
    tags: doc.tags || [],
    updatedAt: doc.updatedAt,
    availableForSale: doc.availableForSale,
    outOfStock: doc.outOfStock,
    featuredImage,
    images,
    variants: doc.variants || [],
    purchaseBundles: doc.purchaseBundles,
    bestFor: doc.bestFor,
  };
}

// Get affinity categories based on source product categories
function getAffinityCategories(sourceCategories: string[]): string[] {
  const affinityMap: Record<string, string[]> = {
    sneakers: ["accessories", "clothes", "carry", "heritage"],
    clothes: ["accessories", "sneakers", "watches", "carry"],
    watches: ["accessories", "heritage", "clothes"],
    fragrance: ["beauty", "lifestyle", "accessories"],
    heritage: ["art", "watches", "lifestyle"],
    tech: ["carry", "lifestyle", "accessories"],
    beauty: ["fragrance", "lifestyle"],
  };

  const affinitySet = new Set<string>();
  for (const cat of sourceCategories) {
    const affinities = affinityMap[cat.toLowerCase()];
    if (affinities) {
      affinities.forEach((a) => affinitySet.add(a));
    }
  }
  return Array.from(affinitySet);
}

export async function GET(request: NextRequest) {
  const { searchParams } = new URL(request.url);
  const strategy = (searchParams.get("strategy") ||
    "similar") as RecommendationStrategy;
  const productId = searchParams.get("productId");
  const cartProductIds = searchParams.get("cartProductIds")?.split(",") || [];
  const limit = parseInt(searchParams.get("limit") || "6", 10);

  if (!isSanityConfigured()) {
    return NextResponse.json({
      products: [],
      metadata: { candidateCount: 0, scoringTimeMs: 0, cacheHit: false },
    });
  }

  const startTime = Date.now();

  try {
    let candidates: any[] = [];
    let sourceProduct: any = null;

    // Fetch source product if needed
    if (strategy === "similar" && productId) {
      const sourceQuery = `*[_type == "product" && _id == $productId][0] {
        _id, "handle": slug.current, title, brand, category, price, compareAtPrice, condition, tags, "updatedAt": _updatedAt, availableForSale, outOfStock, featuredImage, variants, purchaseBundles, bestFor
      }`;
      sourceProduct = await sanityClient.fetch(sourceQuery, { productId });
      if (!sourceProduct) {
        return NextResponse.json({
          products: [],
          metadata: { candidateCount: 0, scoringTimeMs: 0, cacheHit: false },
        });
      }
    }

    // Build bundle affinity map
    const allProductsQuery = `*[_type == "product" && availableForSale == true] {
      _id, category, purchaseBundles
    }`;
    const allProducts = await sanityClient.fetch(allProductsQuery);
    const bundleAffinityMap = buildBundleAffinityMap(
      allProducts.map(mapSanityProduct),
    );

    const scoringContext: ScoringContext = {
      bundleAffinityMap,
    };

    // Fetch candidates based on strategy using tiered queries
    if (strategy === "similar" && sourceProduct) {
      // Tier 1: Primary pool (same brand or overlapping categories)
      const tier1Params = {
        targetId: productId,
        targetBrand: sourceProduct.brand,
        targetCategories: sourceProduct.category,
      };
      candidates = await sanityClient.fetch(TIER_1_QUERY, tier1Params);

      // Tier 2: Cross-category pool if we need more candidates
      if (candidates.length < 12) {
        const affinityCategories = getAffinityCategories(
          sourceProduct.category,
        );
        const alreadyFetchedIds = candidates.map((c: any) => c._id);
        const tier2Params = {
          targetId: productId,
          alreadyFetchedIds,
          affinityCategories,
        };
        const tier2Candidates = await sanityClient.fetch(
          TIER_2_QUERY,
          tier2Params,
        );
        candidates = [...candidates, ...tier2Candidates];
      }
    } else if (strategy === "trending" || strategy === "new-arrivals") {
      candidates = await sanityClient.fetch(TRENDING_QUERY);
    } else if (strategy === "cart" && cartProductIds.length > 0) {
      // Get categories from cart products
      const cartProductsQuery = `*[_type == "product" && _id in $cartIds] {
        _id, category
      }`;
      const cartProducts = await sanityClient.fetch(cartProductsQuery, {
        cartIds: cartProductIds,
      });
      const cartCategories = cartProducts.flatMap((p: any) => p.category || []);
      const uniqueCartCategories = [...new Set(cartCategories)];

      const cartParams = {
        excludeIds: cartProductIds,
        cartCategories: uniqueCartCategories,
      };
      candidates = await sanityClient.fetch(CART_QUERY, cartParams);
    } else {
      // Fallback: simple query for other strategies
      const baseQuery = `*[_type == "product"] | order(_updatedAt desc) [0...50] {
        _id, "slug": slug, title, brand, category, price, compareAtPrice, condition, tags, "updatedAt": _updatedAt, availableForSale, outOfStock, images, variants, purchaseBundles, bestFor
      }`;
      candidates = await sanityClient.fetch(baseQuery);
    }

    // Map candidates to our Product type (featuredImage URL is resolved here)
    const mappedCandidates = candidates.map(mapSanityProduct);

    // Apply variant-aware filtering if we have a source product
    let filteredCandidates = mappedCandidates;
    if (strategy === "similar" && sourceProduct) {
      filteredCandidates = filterByVariantAvailability(
        mappedCandidates,
        mapSanityProduct(sourceProduct),
      );
    }

    // Score candidates
    let scoredProducts: ScoredProduct[];
    if (strategy === "trending" || strategy === "new-arrivals") {
      // Fetch view counts for all candidates
      const db = await connectToDatabase();
      const productIds = filteredCandidates.map((p) => p.id);
      let viewCounts: Record<string, number> = {};

      if (db) {
        const viewDocs = await ProductView.find({
          productId: { $in: productIds },
        });
        viewDocs.forEach((doc: any) => {
          viewCounts[doc.productId] = doc.viewCount;
        });
      }

      scoredProducts = filteredCandidates.map((product) => ({
        product,
        score: scoreTrending(product, viewCounts[product.id]),
      }));
    } else if (strategy === "similar" && sourceProduct) {
      const mappedSource = mapSanityProduct(sourceProduct);
      scoredProducts = filteredCandidates.map((product) => ({
        product,
        score: scoreProductPair(mappedSource, product, scoringContext),
      }));
    } else {
      // For cart strategy, score based on category overlap
      scoredProducts = filteredCandidates.map((product) => ({
        product,
        score: Math.random(),
      }));
    }

    // Sort by score
    scoredProducts.sort((a, b) => b.score - a.score);

    // Apply diversity injection
    const diverseProducts = injectDiversity(scoredProducts, {
      maxPerBrand: 50,
      maxPerCategory: 50,
    });

    // Slice to limit
    const finalProducts = diverseProducts
      .slice(0, limit)
      .map((sp) => sp.product);

    const scoringTimeMs = Date.now() - startTime;

    return NextResponse.json({
      products: finalProducts,
      strategy,
      metadata: {
        candidateCount: candidates.length,
        scoringTimeMs,
        cacheHit: false,
      },
    });
  } catch (error) {
    console.error("Failed to fetch recommendations:", error);
    return NextResponse.json(
      {
        products: [],
        metadata: { candidateCount: 0, scoringTimeMs: 0, cacheHit: false },
      },
      { status: 500 },
    );
  }
}
