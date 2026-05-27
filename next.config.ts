/** @type {import('next').NextConfig} */
const nextConfig = {
  // 🌟 In Next.js 16, this replaces experimental.ppr and experimental.useCache
  // This enables Component-level caching and defaults to Partial Prerendering behavior.
  cacheComponents: true,

  experimental: {
    inlineCss: true,
  },

  // Stable Turbopack integration block
  turbopack: {
    root: import.meta.dirname,
  },

  images: {
    formats: ["image/avif", "image/webp"],
    remotePatterns: [
      {
        protocol: "https",
        hostname: "cdn.shopify.com",
        pathname: "/s/files/**",
      },
      {
        protocol: "https",
        hostname: "cdn.sanity.io",
      },
    ],
  },
};

export default nextConfig;
