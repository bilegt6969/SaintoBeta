import { buildBundleAffinityMap } from "lib/recommendations/bundles";
import { injectDiversity } from "lib/recommendations/diversity";
import { filterByVariantAvailability } from "lib/recommendations/filters";
import { scoreProductPair, scoreTrending } from "lib/recommendations/scorer";
import type {
  RecommendationProduct,
  RecommendationStrategy,
  ScoredProduct,
  ScoringContext,
} from "lib/recommendations/types";
import { sanityClient } from "lib/sanity/client";
import imageUrlBuilder from "@sanity/image-url";
import { NextRequest, NextResponse } from "next/server";
import { isSanityConfigured } from "sanity/env";

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

    // Fetch candidates based on strategy
    const baseQuery = `*[_type == "product"] | order(_updatedAt desc) [0...50] {
      _id, "slug": slug, title, brand, category, price, compareAtPrice, condition, tags, "updatedAt": _updatedAt, availableForSale, outOfStock, images, variants, purchaseBundles, bestFor
    }`;
    const allCandidates = await sanityClient.fetch(baseQuery);
    console.log("All candidates from Sanity:", allCandidates.length);
    console.log("First candidate:", allCandidates[0]);

    candidates = allCandidates.slice(0, limit);

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
      scoredProducts = filteredCandidates.map((product) => ({
        product,
        score: scoreTrending(product),
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
      maxPerBrand: 2,
      maxPerCategory: 3,
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
