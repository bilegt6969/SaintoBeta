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
  /**
   * When the item first entered the catalog (_createdAt).
   * Used for recency scoring — NOT _updatedAt, which resets on every edit.
   */
  listedAt: string;
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

export interface SignalWeights {
  category: number;
  brand: number;
  tags: number;
  price: number;
  condition: number;
  recency: number;
  sale: number;
  bundle: number;
  beauty: number;
  userPreference: number;
}

/**
 * Default weights — tuned for a thrift context:
 * - Tags weighted up (0.20): style aesthetics like "y2k", "vintage" are strong signal
 * - Condition weighted up (0.10): thrift buyers care about grade consistency
 * - Brand weighted down (0.15): brand isn't the main draw for thrift shoppers
 */
export const DEFAULT_WEIGHTS: SignalWeights = {
  category: 0.3,
  brand: 0.15,
  tags: 0.2,
  price: 0.1,
  condition: 0.1,
  recency: 0.05,
  sale: 0.1,
  bundle: 0.1,
  beauty: 0.07,
  userPreference: 0.15,
};

/**
 * Per-strategy weight overrides. Merged over DEFAULT_WEIGHTS in the route.
 * Only specify the signals you want to change; the rest stay at defaults.
 */
export const STRATEGY_WEIGHTS: Record<
  RecommendationStrategy,
  Partial<SignalWeights>
> = {
  // "Similar" uses full DEFAULT_WEIGHTS — no overrides needed
  similar: {},

  // "Trending" is recency + sale-driven; content signals matter less
  trending: {
    recency: 0.5,
    sale: 0.2,
    tags: 0.15,
    brand: 0.1,
    category: 0.05,
  },

  // "New arrivals" is almost purely a recency feed
  "new-arrivals": {
    recency: 0.7,
    condition: 0.15,
    brand: 0.1,
    tags: 0.05,
  },

  // "Cart" leans hard on bundle affinity — items meant to be bought together
  cart: {
    bundle: 0.4,
    category: 0.25,
    brand: 0.15,
    tags: 0.1,
    price: 0.1,
  },
};

export interface ScoringContext {
  bundleAffinityMap: Map<string, Set<string>>;
  weights: SignalWeights;
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
