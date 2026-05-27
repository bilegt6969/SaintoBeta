"use client";

import clsx from "clsx";
import Price from "components/price";
import type { PurchaseBundleOption, PurchaseBundles } from "lib/commerce";
import { DEFAULT_CURRENCY_CODE } from "lib/constants";
import Image from "next/image";

export type BundleKey = keyof PurchaseBundles;

const BUNDLE_ORDER: BundleKey[] = ["single", "twoPack", "stylingKit"];

function BundleCard({
  option,
  selected,
  onSelect,
}: {
  option: PurchaseBundleOption;
  selected: boolean;
  onSelect: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onSelect}
      className={clsx(
        "group flex w-full items-center justify-between gap-4 rounded-2xl border-2 p-5 text-left transition-all duration-200 ease-in-out",
        selected
          ? "border-neutral-900 bg-white shadow-sm"
          : "border-gray-200 bg-white hover:border-gray-400",
      )}
    >
      {/* Left side: Image + Text details */}
      <div className="flex items-center gap-4 min-w-0">
        {option.image?.url && (
          <div className="h-14 w-14 shrink-0 overflow-hidden rounded-xl">
            <Image
              src={option.image.url}
              alt={option.image.altText || option.title}
              width={48}
              height={48}
              className="h-full w-full object-contain mix-blend-multiply"
            />
          </div>
        )}

        <div className="flex flex-col min-w-0">
          <span className="text-base font-semibold tracking-tight text-gray-900">
            {option.title}
          </span>
          {option.highlightLabel && (
            <span className="text-xs font-medium text-gray-500 mt-0.5">
              {option.highlightLabel}
            </span>
          )}
        </div>
      </div>

      {/* Right side: Price */}
      <div className="flex flex-col items-end shrink-0 text-right space-y-1.5">
        <Price
          amount={String(option.price)}
          currencyCode={DEFAULT_CURRENCY_CODE}
          className="text-base font-semibold tracking-tight text-gray-900"
        />
        {option.promoBadges?.length ? (
          <div className="flex flex-col gap-1 items-end">
            {option.promoBadges.map((badge, i) => (
              <span
                key={i}
                className="inline-block rounded-full bg-neutral-900 px-2.5 py-0.5 text-[10px] font-medium tracking-wide text-white uppercase"
              >
                {badge}
              </span>
            ))}
          </div>
        ) : null}
      </div>
    </button>
  );
}

// Ensure this component is correctly exported so product-purchase-panel can read it
export function PurchaseBundlesSelector({
  bundles,
  selected,
  onSelect,
}: {
  bundles: PurchaseBundles;
  selected: BundleKey;
  onSelect: (key: BundleKey) => void;
}) {
  return (
    <div className="space-y-3">
      {BUNDLE_ORDER.map((key) => {
        const option = bundles[key];
        if (!option) return null;

        return (
          <BundleCard
            key={key}
            option={option}
            selected={selected === key}
            onSelect={() => onSelect(key)}
          />
        );
      })}
    </div>
  );
}

// === Helper Functions ===
export function getFirstBundleKey(bundles: PurchaseBundles): BundleKey {
  return BUNDLE_ORDER.find((key) => bundles[key]) ?? "single";
}

export function getSelectedBundle(
  bundles: PurchaseBundles,
  key: BundleKey,
): PurchaseBundleOption | undefined {
  return bundles[key];
}
