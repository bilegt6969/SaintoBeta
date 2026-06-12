"use client";

import { addItem } from "components/cart/actions";
import type { Product } from "lib/commerce";
import { useActionState, useEffect, useMemo, useState } from "react";

export interface AddToCartProps {
  product: Product;
  variantId?: string;
  displayPrice?: {
    amount: string;
    label: string;
  };
}

export function AddToCart({
  product,
  variantId,
  displayPrice,
}: AddToCartProps) {
  // Bind variantId directly into the action at render time
  // This is the Next.js recommended pattern for passing extra args to server actions
  const addItemWithVariant = useMemo(
    () => addItem.bind(null, variantId ?? ""),
    [variantId],
  );

  const [message, formAction, isPending] = useActionState(
    addItemWithVariant,
    null,
  );

  useEffect(() => {
    if (!isPending && message === null) {
      setShowSuccess(true);
      setTimeout(() => setShowSuccess(false), 2000);
    }
  }, [isPending, message]);
  const [showSuccess, setShowSuccess] = useState(false);

  const isAvailable = product.availableForSale;

  return (
    <form action={formAction} className="w-full relative">
      <button
        type="submit"
        disabled={isPending || !isAvailable}
        className="w-full flex items-center justify-center rounded-full bg-neutral-900 px-6 py-4 text-sm font-medium text-white hover:bg-neutral-800 disabled:bg-neutral-200 disabled:text-neutral-400 transition-colors tracking-wide"
      >
        {showSuccess ? (
          <span className="flex items-center gap-2">
            <span
              className="t-success-check"
              data-state="in"
              aria-hidden="true"
            >
              <svg viewBox="0 0 48 48" fill="none" className="w-5 h-5">
                <path
                  d="M12 24L20 32L36 16"
                  stroke="currentColor"
                  strokeWidth="3"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                />
              </svg>
            </span>
            Added to bag
          </span>
        ) : isPending ? (
          <span className="flex items-center gap-2">
            <svg
              className="animate-spin h-4 w-4 text-current"
              fill="none"
              viewBox="0 0 24 24"
            >
              <circle
                className="opacity-25"
                cx="12"
                cy="12"
                r="10"
                stroke="currentColor"
                strokeWidth="4"
              />
              <path
                className="opacity-75"
                fill="currentColor"
                d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
              />
            </svg>
            Adding to bag...
          </span>
        ) : !isAvailable ? (
          "Sold out"
        ) : (
          <>
            Add to bag
            {displayPrice ? ` • $${displayPrice.amount}` : ""}
          </>
        )}
      </button>

      {message && (
        <p
          className="mt-3 text-center text-xs font-medium text-red-500"
          aria-live="polite"
        >
          {message}
        </p>
      )}
    </form>
  );
}
