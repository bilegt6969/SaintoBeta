"use client";

import dynamic from "next/dynamic";

const RecommendationShelf = dynamic(
  () => import("./recommendation-shelf").then(mod => ({ default: mod.default })),
  { ssr: false, loading: () => null }
);

export default RecommendationShelf;
