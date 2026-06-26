import type { Product } from "lib/commerce/types";
import type { ConditionPreference } from "./types";

function inferConditionPreference(viewedProducts: Product[]): ConditionPreference {
  if (viewedProducts.length < 3) return "mixed";
  const thriftCount = viewedProducts.filter(
    (p) =>
      p.condition === "good" ||
      p.condition === "fair" ||
      p.condition === "like-new"
  ).length;
  const newCount = viewedProducts.filter((p) => p.condition === "new").length;
  if (thriftCount / viewedProducts.length > 0.7) return "thrift";
  if (newCount / viewedProducts.length > 0.7) return "new";
  return "mixed";
}

// Apply as a hard filter or soft multiplier
export function applyConditionPreference(
  candidates: Product[],
  preference: ConditionPreference
): Product[] {
  if (preference === "mixed") return candidates;
  if (preference === "thrift") {
    return candidates.filter((p) => p.condition !== "new");
  }
  if (preference === "new") {
    return candidates.filter((p) => p.condition === "new");
  }
  return candidates;
}

export { inferConditionPreference };
