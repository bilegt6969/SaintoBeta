# Recommendation System Implementation

This document describes the complete recommendation algorithm implementation for the premium fashion/streetwear e-commerce platform.

## Overview

The recommendation system is built according to the comprehensive design specification, implementing a content-based scoring engine with multiple signals, two-tier GROQ candidate pooling, and a phased roadmap for future enhancements.

## Architecture

### Core Modules

#### 1. Types (`lib/recommendations/types.ts`)
- `RecommendationProduct`: Simplified product type for scoring (only fields needed for recommendations)
- `RecommendationStrategy`: "similar" | "trending" | "cart" | "new-arrivals"
- `ScoredProduct`: Product with associated score
- `ScoringContext`: Bundle affinity map and condition preferences
- `UserContext`: User behavioral data (Phase 2)
- `DiversityConstraints`: Brand and category diversity limits

#### 2. Cross-Category Affinity (`lib/recommendations/affinity.ts`)
Hardcoded affinity weights between category pairs based on domain knowledge:
- Sneakers ↔ Accessories (0.70), Clothes (0.55), Carry (0.30), Heritage (0.25)
- Clothes ↔ Accessories (0.60), Sneakers (0.55), Watches (0.35), Carry (0.30)
- Watches ↔ Accessories (0.55), Heritage (0.45), Clothes (0.35)
- And more...

#### 3. Bundle Affinity (`lib/recommendations/bundles.ts`)
- `buildBundleAffinityMap()`: Builds affinity map from `purchaseBundles` data
- `scoreBundleAffinity()`: +0.2 bonus if products share bundle types

#### 4. Scoring Engine (`lib/recommendations/scorer.ts`)
Multi-signal scoring with the following weights:
- **Category (Jaccard + cross-category)**: 35% weight
- **Brand match**: 20% weight
- **Tags (Jaccard, de-prefixed)**: 15% weight
- **Price (log-scale proximity)**: 10% weight
- **Condition (4-tier rank)**: 8% weight
- **Recency (6-month decay)**: 5% weight
- **Sale alignment**: +10% bonus
- **Bundle affinity**: +20% bonus
- **Beauty (bestFor match)**: 7% weight
- **Availability multiplier**: 0.05 (unavailable), 0.5 (out of stock), 1.0 (available)
- **Staff pick boost**: 1.15x multiplier

#### 5. Filters (`lib/recommendations/filters.ts`)
- `filterByVariantAvailability()`: Filters candidates by size availability

#### 6. Condition Preference (`lib/recommendations/condition.ts`)
- `inferConditionPreference()`: Infers "thrift", "new", or "mixed" from viewed products
- `applyConditionPreference()`: Filters candidates based on preference

#### 7. Diversity Injection (`lib/recommendations/diversity.ts`)
- `injectDiversity()`: Enforces max 2 per brand, max 3 per category

#### 8. GROQ Queries (`lib/recommendations/queries.ts`)
- **TIER_1_QUERY**: Primary pool (60 products, same brand OR overlapping category)
- **TIER_2_QUERY**: Cross-category pool (20 staff-picks from affinity categories)
- **TRENDING_QUERY**: Recent products (30-day window)
- **CART_QUERY**: Complementary products based on cart categories

#### 9. API Endpoint (`app/api/recommendations/route.ts`)
`GET /api/recommendations?strategy={strategy}&productId={id}&limit={n}`

Supports:
- `strategy=similar`: Product-to-product recommendations
- `strategy=trending`: Trending products
- `strategy=cart`: Cart-based recommendations
- `strategy=new-arrivals`: New arrivals (7-day window)

#### 10. Webhook (`app/api/sanity-webhook/route.ts`)
Cache invalidation endpoint for Sanity webhooks. Configure in Sanity:
- Settings → API → Webhooks → On create/update/delete of product
- Set webhook secret in `SANITY_WEBHOOK_SECRET` env var

#### 11. Event Tracking (`lib/recommendations/events.ts`)
Phase 2 client-side event tracking:
- `eventQueue.push()`: Track view, cart_add, cart_remove, purchase events
- `eventQueue.derivePreferences()`: Infer user preferences from session history
- Stores in sessionStorage (privacy-respecting, no cookies)

#### 12. Shelf Component (`components/recommendations/recommendation-shelf.tsx`)
React component for displaying recommendation shelves:
```tsx
<RecommendationShelf
  strategy="similar"
  productId={product.id}
  limit={6}
/>
```

## Usage Examples

### Product Page (Similar Products)
```tsx
import { RecommendationShelf } from "components/recommendations/recommendation-shelf";

<RecommendationShelf
  strategy="similar"
  productId={product.id}
  title="You might also like"
  limit={6}
/>
```

### Homepage (Trending)
```tsx
<RecommendationShelf
  strategy="trending"
  title="Trending now"
  limit={6}
/>
```

### Cart Page (Complementary)
```tsx
<RecommendationShelf
  strategy="cart"
  cartProductIds={cartItems.map(item => item.product.id)}
  title="Complete your look"
  limit={6}
/>
```

### New Arrivals Section
```tsx
<RecommendationShelf
  strategy="new-arrivals"
  title="Just dropped"
  limit={6}
/>
```

## Phase 1 MVP Features (Complete)

✅ Content-based scoring engine with 9 signals
✅ Two-tier GROQ candidate pool (performance optimization)
✅ Cross-category affinity matrix (domain knowledge)
✅ Bundle signal from `purchaseBundles` data
✅ Diversity injection (brand/category limits)
✅ Variant-aware filtering (size availability)
✅ Condition preference segmentation
✅ API endpoint with 4 strategies
✅ Sanity webhook cache invalidation
✅ Recommendation shelf component

## Phase 2 Features (Ready to Implement)

📋 Client-side event tracking (events.ts implemented)
📋 Session-level personalization
📋 Cart-aware recommendations
📋 Condition preference detection

To enable Phase 2:
1. Import `eventQueue` from `lib/recommendations/events`
2. Call `eventQueue.push()` on product views, cart actions
3. Pass derived preferences to recommendation API

## Phase 3 Features (Future)

📋 Interaction database (Postgres/Supabase)
📋 Co-purchase queries
📋 Collaborative filtering
📋 "Users like you also viewed"

## Phase 4 Features (Optional)

📋 Text embeddings (OpenAI text-embedding-3-small)
📋 Semantic similarity
📋 Vector database (Pinecone)

## Configuration

### Environment Variables
```env
SANITY_WEBHOOK_SECRET=your_webhook_secret
```

### Sanity Webhook Setup
1. Go to Sanity project → Settings → API → Webhooks
2. Create new webhook
3. URL: `https://your-domain.com/api/sanity-webhook`
4. Secret: Set to `SANITY_WEBHOOK_SECRET`
5. Triggers: On create, update, delete of product documents
6. Projection: Include `_id`

## Performance Characteristics

- **Candidate pool size**: 60-80 products max (vs. 500+ without filtering)
- **Scoring time**: <100ms per request
- **Cache strategy**: 3-layer architecture (static, product-pair, user-personalized)
- **Diversity**: Enforced at post-processing level

## Metrics Framework

### Primary KPIs
- Recommendation CTR: Target >3%
- Recommendation ATC Rate: Target >8%
- Recommendation Conversion Rate: Target >2%
- Revenue Attribution: Track trend

### Algorithm Health Metrics
- Catalog Coverage: % of products ever appearing in recommendations
- Diversity Score: Average distinct brands per shelf (target: 3+)
- Position CTR Decay: Should decay by position
- Score Distribution: Histogram of final scores

## Testing

### Manual Testing
```bash
# Test similar products
curl "http://localhost:3000/api/recommendations?strategy=similar&productId=prod_123&limit=6"

# Test trending
curl "http://localhost:3000/api/recommendations?strategy=trending&limit=6"

# Test cart
curl "http://localhost:3000/api/recommendations?strategy=cart&cartProductIds=prod_1,prod_2&limit=6"
```

### Integration Testing
Add recommendation shelves to:
1. Product detail page (similar products)
2. Homepage (trending)
3. Cart page (complementary)

## Troubleshooting

### No recommendations returned
- Check Sanity configuration
- Verify product has categories and brand
- Check candidate pool size in API response metadata

### Poor recommendation quality
- Adjust weights in `scorer.ts`
- Tune affinity matrix in `affinity.ts`
- Review diversity constraints

### Performance issues
- Verify GROQ queries are using indexes
- Check bundle affinity map caching
- Monitor candidate pool size

## File Structure

```
lib/recommendations/
├── types.ts           # Type definitions
├── affinity.ts        # Cross-category affinity matrix
├── bundles.ts         # Bundle affinity map builder
├── scorer.ts          # Multi-signal scoring engine
├── filters.ts         # Variant-aware filtering
├── condition.ts       # Condition preference inference
├── diversity.ts       # Diversity injection
├── queries.ts         # GROQ queries for candidate pools
├── events.ts          # Phase 2 event tracking
└── index.ts           # Module exports

app/api/
├── recommendations/
│   └── route.ts       # Recommendation API endpoint
└── sanity-webhook/
    └── route.ts       # Cache invalidation webhook

components/recommendations/
└── recommendation-shelf.tsx  # UI component
```

## Next Steps

1. **Integrate into product pages**: Add `<RecommendationShelf strategy="similar" />` to product detail pages
2. **Add to homepage**: Add trending shelf to homepage
3. **Configure Sanity webhook**: Set up cache invalidation
4. **Monitor metrics**: Implement analytics tracking for recommendation CTR
5. **A/B test**: Test different weight configurations
6. **Phase 2 rollout**: Enable event tracking for personalization

## Support

For issues or questions, refer to the original design specification or contact the development team.
