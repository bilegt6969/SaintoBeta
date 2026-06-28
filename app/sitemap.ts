import { getCollections, getPages, getProducts } from "lib/commerce";
import { validateEnvironmentVariables } from "lib/utils";
import { MetadataRoute } from "next";

type Route = {
  url: string;
  lastModified: string;
};

export const dynamic = "force-dynamic";

const SITE_URL = "https://www.sainto.app";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  try {
    validateEnvironmentVariables();
  } catch (error) {
    // Continue with static routes if env validation fails
    console.warn("Environment validation failed, using static routes only");
  }

  const staticRoutes = [
    "",
    "/about",
    "/contact",
    "/blog",
    "/categories",
    "/search",
    "/terms",
    "/privacy",
    "/support",
    "/cookie-settings",
  ].map((route) => ({
    url: `${SITE_URL}${route}`,
    lastModified: new Date().toISOString(),
    changeFrequency: "weekly" as const,
    priority: route === "" ? 1 : 0.8,
  }));

  let fetchedRoutes: Route[] = [];

  try {
    const collectionsPromise = getCollections()
      .then((collections) =>
        collections.map((collection) => ({
          url: `${SITE_URL}${collection.path}`,
          lastModified: collection.updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.8,
        })),
      )
      .catch(() => []);

    const productsPromise = getProducts({})
      .then((products) =>
        products.map((product) => ({
          url: `${SITE_URL}/product/${product.handle}`,
          lastModified: product.updatedAt,
          changeFrequency: "daily" as const,
          priority: 0.6,
        })),
      )
      .catch(() => []);

    const pagesPromise = getPages()
      .then((pages) =>
        pages.map((page) => ({
          url: `${SITE_URL}/${page.handle}`,
          lastModified: page.updatedAt,
          changeFrequency: "weekly" as const,
          priority: 0.7,
        })),
      )
      .catch(() => []);

    fetchedRoutes = (
      await Promise.all([collectionsPromise, productsPromise, pagesPromise])
    ).flat();
  } catch (error) {
    console.warn(
      "Failed to fetch dynamic routes, using static routes only:",
      error,
    );
  }

  return [...staticRoutes, ...fetchedRoutes];
}
