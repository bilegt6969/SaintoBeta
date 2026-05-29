import type {
  Cart,
  CategoryPage,
  Collection,
  Menu,
  Page,
  Product,
} from "lib/commerce/types";
import { HIDDEN_PRODUCT_TAG, TAGS } from "lib/constants";
import {
  cacheLife, // 🌟 Stabilized in Next.js 16
  cacheTag, // 🌟 Stabilized in Next.js 16
  revalidateTag,
} from "next/cache";
import { NextRequest, NextResponse } from "next/server";
import { isSanityConfigured } from "sanity/env";
import {
  addToSanityCart,
  createSanityCart,
  getSanityCart,
  removeFromSanityCart,
  updateSanityCart,
} from "./cart";
import { sanityClient } from "./client";
import {
  mapSanityCategoryPage,
  mapSanityCollection,
  mapSanityMenu,
  mapSanityPage,
  mapSanityProduct,
  type SanityCategoryPage,
  type SanityCollection,
  type SanityMenu,
  type SanityPage,
  type SanityProduct,
} from "./mappers";

const productFields = `
  _id,
  _updatedAt,
  title,
  "slug": slug,
  brand,
  category,
  "categoryHandle": category->slug.current,
  "categoryTitle": category->title,
  condition,
  price,
  description,
  descriptionHtml,
  availableForSale,
  outOfStock,
  tags,
  images,
  options,
  variants,
  seo,
  highlights,
  purchaseBundles,
  bestFor,
  keyIngredients,
  specs
`;

const productsQuery = `*[_type == "product"] | order(_updatedAt desc) {${productFields}}`;

const productByHandleQuery = `*[_type == "product" && slug.current == $handle][0]{${productFields}}`;

const collectionsQuery = `*[_type == "collection"] | order(title asc) {
  _id,
  _updatedAt,
  title,
  "slug": slug,
  description,
  seo
}`;

const collectionByHandleQuery = `*[_type == "collection" && slug.current == $handle][0]{
  _id,
  _updatedAt,
  title,
  "slug": slug,
  description,
  seo,
  "products": products[]->{${productFields}}
}`;

const menuByHandleQuery = `*[_type == "menu" && slug.current == $handle][0]{
  items
}`;

const pageByHandleQuery = `*[_type == "page" && slug.current == $handle][0]{
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug,
  body,
  bodySummary,
  seo
}`;

const pagesQuery = `*[_type == "page"] | order(title asc) {
  _id,
  _createdAt,
  _updatedAt,
  title,
  "slug": slug,
  body,
  bodySummary,
  seo
}`;

const categoryPageFields = `
  _id,
  _updatedAt,
  title,
  "slug": slug,
  description,
  categoryLogo,
  showOnHome,
  homeSortOrder,
  seo,
  "featuredProduct": featuredProduct->{${productFields}}
`;

const categoryPagesQuery = `*[_type == "categoryPage"] | order(homeSortOrder asc, title asc) {${categoryPageFields}}`;

const categoryPageByHandleQuery = `*[_type == "categoryPage" && slug.current == $handle][0]{${categoryPageFields}}`;

const productsByCategoryHandleQuery = `*[_type == "product" && category->slug.current == $handle] | order(_updatedAt desc) {${productFields}}`;

function sortProducts(
  products: Product[],
  sortKey?: string,
  reverse?: boolean,
): Product[] {
  const sorted = [...products];

  switch (sortKey) {
    case "PRICE":
      sorted.sort(
        (a, b) =>
          Number(a.priceRange.minVariantPrice.amount) -
          Number(b.priceRange.minVariantPrice.amount),
      );
      break;
    case "CREATED_AT":
    case "CREATED":
      sorted.sort(
        (a, b) =>
          new Date(b.updatedAt).getTime() - new Date(a.updatedAt).getTime(),
      );
      break;
    default:
      break;
  }

  if (reverse) {
    sorted.reverse();
  }

  return sorted;
}

function filterProducts(products: Product[], query?: string): Product[] {
  if (!query) {
    return products;
  }

  const q = query.toLowerCase();
  return products.filter(
    (product) =>
      product.title.toLowerCase().includes(q) ||
      product.description.toLowerCase().includes(q) ||
      product.tags.some((tag) => tag.toLowerCase().includes(q)),
  );
}

export async function createCart(): Promise<Cart> {
  return createSanityCart();
}

export async function addToCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  return addToSanityCart(lines);
}

export async function removeFromCart(lineIds: string[]): Promise<Cart> {
  return removeFromSanityCart(lineIds);
}

export async function updateCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  return updateSanityCart(lines);
}

export async function getCart(): Promise<Cart | undefined> {
  "use cache: private";
  cacheTag(TAGS.cart);
  cacheLife("seconds");
  return getSanityCart();
}

export async function getCategoryPages(): Promise<CategoryPage[]> {
  "use cache";
  cacheTag(TAGS.categoryPages, TAGS.products);
  cacheLife("days");

  if (!isSanityConfigured()) {
    return [];
  }

  const docs = await sanityClient.fetch<SanityCategoryPage[]>(categoryPagesQuery);
  return docs.map((doc) => mapSanityCategoryPage(doc, []));
}

export async function getCategoryPage(
  handle: string,
): Promise<CategoryPage | undefined> {
  "use cache";
  cacheTag(TAGS.categoryPages, TAGS.products);
  cacheLife("days");

  if (!isSanityConfigured()) {
    return undefined;
  }

  const doc = await sanityClient.fetch<SanityCategoryPage | null>(
    categoryPageByHandleQuery,
    { handle },
  );

  if (!doc) {
    return undefined;
  }

  const productDocs = await sanityClient.fetch<SanityProduct[]>(
    productsByCategoryHandleQuery,
    { handle },
  );

  const products = productDocs
    .map((product) => mapSanityProduct(product))
    .filter((product): product is Product => Boolean(product));

  return mapSanityCategoryPage(doc, products);
}

export async function getCategoryPagesForHome(): Promise<CategoryPage[]> {
  const pages = await getCategoryPages();
  return pages.filter(
    (page) => page.showOnHome && page.featuredProduct,
  );
}

export async function getCollection(
  handle: string,
): Promise<Collection | undefined> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  if (!isSanityConfigured()) {
    return undefined;
  }

  const doc = await sanityClient.fetch<SanityCollection | null>(
    collectionByHandleQuery,
    { handle },
  );

  return doc ? mapSanityCollection(doc) : undefined;
}

export async function getCollectionProducts({
  collection,
  reverse,
  sortKey,
}: {
  collection: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.collections, TAGS.products);
  cacheLife("days");

  if (!isSanityConfigured()) {
    console.log(
      `Skipping getCollectionProducts for '${collection}' - Sanity not configured`,
    );
    return [];
  }

  if (collection.startsWith("hidden-")) {
    const docs = await sanityClient.fetch<SanityProduct[]>(productsQuery);
    return sortProducts(
      docs
        .map((doc) => mapSanityProduct(doc))
        .filter((product): product is Product => Boolean(product)),
      sortKey,
      reverse,
    );
  }

  const doc = await sanityClient.fetch<SanityCollection | null>(
    collectionByHandleQuery,
    { handle: collection },
  );

  if (!doc?.products?.length) {
    console.log(`No collection found for \`${collection}\``);
    return [];
  }

  return sortProducts(
    doc.products
      .map((product) => mapSanityProduct(product))
      .filter((product): product is Product => Boolean(product)),
    sortKey,
    reverse,
  );
}

export async function getCollections(): Promise<Collection[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  const allCollection: Collection = {
    handle: "",
    title: "All",
    description: "All products",
    seo: { title: "All", description: "All products" },
    path: "/search",
    updatedAt: new Date().toISOString(),
  };

  if (!isSanityConfigured()) {
    console.log("Skipping getCollections - Sanity not configured");
    return [allCollection];
  }

  const docs = await sanityClient.fetch<SanityCollection[]>(collectionsQuery);

  return [
    allCollection,
    ...docs
      .map((doc) => mapSanityCollection(doc))
      .filter((collection) => !collection.handle.startsWith("hidden")),
  ];
}

export async function getMenu(handle: string): Promise<Menu[]> {
  "use cache";
  cacheTag(TAGS.collections);
  cacheLife("days");

  if (!isSanityConfigured()) {
    console.log(`Skipping getMenu for '${handle}' - Sanity not configured`);
    return [];
  }

  const doc = await sanityClient.fetch<SanityMenu | null>(menuByHandleQuery, {
    handle,
  });

  return doc ? mapSanityMenu(doc) : [];
}

export async function getPage(handle: string): Promise<Page> {
  if (!isSanityConfigured()) {
    throw new Error("Sanity is not configured");
  }

  const doc = await sanityClient.fetch<SanityPage | null>(pageByHandleQuery, {
    handle,
  });

  if (!doc) {
    throw new Error(`Page not found: ${handle}`);
  }

  return mapSanityPage(doc);
}

export async function getPages(): Promise<Page[]> {
  if (!isSanityConfigured()) {
    return [];
  }

  const docs = await sanityClient.fetch<SanityPage[]>(pagesQuery);
  return docs.map(mapSanityPage);
}

export async function getProduct(handle: string): Promise<Product | undefined> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!isSanityConfigured()) {
    console.log(`Skipping getProduct for '${handle}' - Sanity not configured`);
    return undefined;
  }

  const doc = await sanityClient.fetch<SanityProduct | null>(
    productByHandleQuery,
    { handle },
  );

  return doc ? mapSanityProduct(doc, false) : undefined;
}

export async function getProductRecommendations(
  productId: string,
  productTags?: string[],
): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!isSanityConfigured()) {
    return [];
  }

  const docs = await sanityClient.fetch<SanityProduct[]>(productsQuery);
  const products = docs
    .filter((doc) => doc._id !== productId)
    .map((doc) => mapSanityProduct(doc))
    .filter((product): product is Product => Boolean(product));

  // If no tags provided, return empty array
  if (!productTags || productTags.length === 0) {
    return [];
  }

  // Filter products that have at least one matching tag
  const similarProducts = products.filter((product) => {
    const productTagSet = new Set(product.tags.map((tag) => tag.toLowerCase()));
    const currentTagSet = new Set(productTags.map((tag) => tag.toLowerCase()));

    // Check if any tag matches
    for (const tag of currentTagSet) {
      if (productTagSet.has(tag)) {
        return true;
      }
    }
    return false;
  });

  return similarProducts.slice(0, 4);
}

export async function getProducts({
  query,
  reverse,
  sortKey,
}: {
  query?: string;
  reverse?: boolean;
  sortKey?: string;
}): Promise<Product[]> {
  "use cache";
  cacheTag(TAGS.products);
  cacheLife("days");

  if (!isSanityConfigured()) {
    return [];
  }

  const docs = await sanityClient.fetch<SanityProduct[]>(productsQuery);
  const products = docs
    .map((doc) => mapSanityProduct(doc))
    .filter((product): product is Product => Boolean(product));

  return sortProducts(filterProducts(products, query), sortKey, reverse);
}

export async function revalidate(req: NextRequest): Promise<NextResponse> {
  const authHeader = req.headers.get("authorization");
  const headerSecret = req.headers.get("x-revalidation-secret");
  const secret =
    (authHeader?.startsWith("Bearer ")
      ? authHeader.slice("Bearer ".length)
      : null) ??
    headerSecret ??
    req.nextUrl.searchParams.get("secret");

  if (!secret || secret !== process.env.SANITY_REVALIDATION_SECRET) {
    console.error("Invalid Sanity revalidation secret.");
    return NextResponse.json({ status: 401 });
  }

  revalidateTag(TAGS.collections, "days");
  revalidateTag(TAGS.categoryPages, "days");
  revalidateTag(TAGS.products, "days");

  return NextResponse.json({ status: 200, revalidated: true, now: Date.now() });
}

export { HIDDEN_PRODUCT_TAG };
