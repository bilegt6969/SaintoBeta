// Tier 1 — Primary Candidate Pool (run against Sanity)
// Fetch at most 60 products that share the brand or at least one category.
// This is your "close neighborhood" — high recall, fast query.
export const TIER_1_QUERY = `
*[
  _type == "product" &&
  _id != $targetId &&
  availableForSale == true &&
  outOfStock != true &&
  (
    brand == $targetBrand ||
    count(category[@ in $targetCategories]) > 0
  )
] | order(_updatedAt desc) [0...60] {
  _id,
  "slug": slug,
  title,
  brand,
  category,
  price,
  compareAtPrice,
  condition,
  tags,
  "updatedAt": _updatedAt,
  availableForSale,
  outOfStock,
  images,
  variants,
  purchaseBundles,
  bestFor
}
`;

// Tier 2 — Cross-Category Pool (if Tier 1 < 12 results)
// Fallback: fetch recent staff-picks from affinity categories
export const TIER_2_QUERY = `
*[
  _type == "product" &&
  _id != $targetId &&
  _id !in $alreadyFetchedIds &&
  availableForSale == true &&
  outOfStock != true &&
  count(category[@ in $affinityCategories]) > 0 &&
  "staff-pick" in tags
] | order(_updatedAt desc) [0...20] {
  _id,
  "slug": slug,
  title,
  brand,
  category,
  price,
  compareAtPrice,
  condition,
  tags,
  "updatedAt": _updatedAt,
  availableForSale,
  outOfStock,
  images,
  variants,
  purchaseBundles,
  bestFor
}
`;

// Query for trending products (new arrivals + staff picks)
export const TRENDING_QUERY = `
*[_type == "product"] | order(_updatedAt desc) [0...50] {
  _id,
  "slug": slug,
  title,
  brand,
  category,
  price,
  compareAtPrice,
  condition,
  tags,
  "updatedAt": _updatedAt,
  availableForSale,
  outOfStock,
  images,
  variants,
  purchaseBundles,
  bestFor
}
`;

// Query for cart-based recommendations (complementary products)
export const CART_QUERY = `
*[
  _type == "product" &&
  _id != $excludeIds &&
  availableForSale == true &&
  outOfStock != true &&
  count(category[@ in $cartCategories]) > 0
] | order(_updatedAt desc) [0...40] {
  _id,
  "slug": slug,
  title,
  brand,
  category,
  price,
  compareAtPrice,
  condition,
  tags,
  "updatedAt": _updatedAt,
  availableForSale,
  outOfStock,
  images,
  variants,
  purchaseBundles,
  bestFor
}
`;
