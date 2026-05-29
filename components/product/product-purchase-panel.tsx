"use client";

import { AddToCart } from "components/cart/add-to-cart";
import type { Product, ProductVariant } from "lib/commerce";
import { useState } from "react";
import { ProductBestFor } from "./product-best-for";
import {
  getFirstBundleKey,
  getSelectedBundle,
  PurchaseBundlesSelector,
  type BundleKey,
} from "./purchase-bundles";

interface ProductPurchasePanelProps {
  product: Product;
  selectedVariant?: ProductVariant;
}

// Ensure this matches your import exactly
export function ProductPurchasePanel({
  product,
  selectedVariant,
}: ProductPurchasePanelProps) {
  const bundles = product.purchaseBundles;
  const [selectedBundle, setSelectedBundle] = useState<BundleKey>(() =>
    bundles ? getFirstBundleKey(bundles) : "single",
  );

  const selectedOption = bundles
    ? getSelectedBundle(bundles, selectedBundle)
    : undefined;

  const finalVariantId =
    selectedOption?.variantId || selectedVariant?.id || product.variants[0]?.id;

  if (!finalVariantId) {
    console.error("No variantId resolved", { selectedOption, selectedVariant });
  }
  return (
    <div className="space-y-5">
      {bundles ? (
        <PurchaseBundlesSelector
          bundles={bundles}
          selected={selectedBundle}
          onSelect={setSelectedBundle}
        />
      ) : null}

      {product.bestFor ? <ProductBestFor bestFor={product.bestFor} /> : null}

      <AddToCart
        product={product}
        variantId={finalVariantId}
        displayPrice={
          selectedOption
            ? {
                amount: String(selectedOption.price),
                label: selectedOption.title,
              }
            : undefined
        }
      />
    </div>
  );
}
