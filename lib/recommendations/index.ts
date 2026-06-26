// Export all recommendation modules
export type {
  RecommendationProduct,
  RecommendationStrategy,
  ConditionPreference,
  ScoredProduct,
  ScoringContext,
  UserContext,
  DiversityConstraints,
  RecommendationRequest,
  RecommendationResponse,
} from "./types";

export { getCrossCategoryBonus, CROSS_CATEGORY_AFFINITY } from "./affinity";
export {
  buildBundleAffinityMap,
  scoreBundleAffinity,
} from "./bundles";
export { filterByVariantAvailability } from "./filters";
export {
  inferConditionPreference,
  applyConditionPreference,
} from "./condition";
export { injectDiversity } from "./diversity";
export { scoreProductPair, scoreTrending } from "./scorer";
export {
  TIER_1_QUERY,
  TIER_2_QUERY,
  TRENDING_QUERY,
  CART_QUERY,
} from "./queries";
export { eventQueue, type UserEvent } from "./events";
