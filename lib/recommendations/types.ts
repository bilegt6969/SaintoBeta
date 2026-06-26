// Simplified product type for recommendations - only fields needed for scoring
export type RecommendationProduct = {
  id: string;
  handle: string;
  title: string;
  brand: string;
  categories: string[];
  priceRange: {
    minVariantPrice: { amount: string; currencyCode: string };
    maxVariantPrice: { amount: string; currencyCode: string };
  };
  compareAtPrice?: number;
  condition?: string;
  tags: string[];
  updatedAt: string;
  availableForSale: boolean;
  outOfStock?: boolean;
  featuredImage: any;
  images: any[];
  variants: any[];
  purchaseBundles?: any;
  bestFor?: any;
};

export type RecommendationStrategy =
  | "similar"
  | "trending"
  | "cart"
  | "new-arrivals";

export type ConditionPreference = "thrift" | "new" | "mixed";

export interface ScoredProduct {
  product: RecommendationProduct;
  score: number;
}

export interface ScoringContext {
  bundleAffinityMap: Map<string, Set<string>>;
  conditionPreference?: ConditionPreference;
}

export interface UserContext {
  viewedCategories: string[];
  preferredBrands: string[];
  conditionPreference: ConditionPreference;
}

export interface DiversityConstraints {
  maxPerBrand: number;
  maxPerCategory: number;
}

export interface RecommendationRequest {
  strategy: RecommendationStrategy;
  productId?: string;
  cartProductIds?: string[];
  limit?: number;
  userContext?: UserContext;
}

export interface RecommendationResponse {
  products: RecommendationProduct[];
  strategy: RecommendationStrategy;
  metadata: {
    candidateCount: number;
    scoringTimeMs: number;
    cacheHit: boolean;
  };
}
