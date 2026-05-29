import type { CategoryPage, Image, Product } from "lib/commerce/types";
import { DEFAULT_CURRENCY_CODE } from "lib/constants";

function demoImage(seed: string, alt: string): Image {
  return {
    url: `https://picsum.photos/seed/sainto-${seed}/800/800`,
    altText: alt,
    width: 800,
    height: 800,
  };
}

function money(amount: number) {
  return { amount: String(amount), currencyCode: DEFAULT_CURRENCY_CODE };
}

function createDemoProduct(input: {
  handle: string;
  title: string;
  brand: string;
  categoryTitle: string;
  categoryHandle: string;
  price: number;
  imageSeed: string;
  tags?: string[];
  outOfStock?: boolean;
}): Product {
  const image = demoImage(input.imageSeed, input.title);
  const variantId = `demo-variant-${input.handle}`;

  return {
    id: `demo-product-${input.handle}`,
    handle: input.handle,
    availableForSale: !input.outOfStock,
    outOfStock: input.outOfStock,
    brand: input.brand,
    categoryHandle: input.categoryHandle,
    categoryTitle: input.categoryTitle,
    title: input.title,
    description: `Demo listing for ${input.title}.`,
    descriptionHtml: `<p>Demo listing for ${input.title}.</p>`,
    options: [{ id: "option-default", name: "Title", values: ["Default"] }],
    priceRange: {
      minVariantPrice: money(input.price),
      maxVariantPrice: money(input.price),
    },
    variants: [
      {
        id: variantId,
        title: "Default",
        availableForSale: !input.outOfStock,
        selectedOptions: [{ name: "Title", value: "Default" }],
        price: money(input.price),
      },
    ],
    featuredImage: image,
    images: [image],
    seo: {
      title: input.title,
      description: `Demo product — ${input.title}`,
    },
    tags: [
      `brand:${input.brand}`,
      `category:${input.categoryTitle}`,
      ...(input.tags ?? []),
    ],
    updatedAt: new Date().toISOString(),
  };
}

const techProducts = [
  createDemoProduct({
    handle: "demo-wireless-headphones",
    title: "Wireless Headphones",
    brand: "Sainto Audio",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 549000,
    imageSeed: "headphones",
    tags: ["staff-pick"],
  }),
  createDemoProduct({
    handle: "demo-mechanical-keyboard",
    title: "Mechanical Keyboard",
    brand: "Keycraft",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 289000,
    imageSeed: "keyboard",
  }),
  createDemoProduct({
    handle: "demo-portable-speaker",
    title: "Portable Speaker",
    brand: "Sainto Audio",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 199000,
    imageSeed: "speaker",
  }),
  createDemoProduct({
    handle: "demo-usb-hub",
    title: "USB-C Hub",
    brand: "Connect",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 89000,
    imageSeed: "hub",
    outOfStock: true,
  }),
  createDemoProduct({
    handle: "demo-wireless-mouse",
    title: "Wireless Mouse",
    brand: "Logitech",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 119000,
    imageSeed: "mouse",
  }),
  createDemoProduct({
    handle: "demo-tablet-stand",
    title: "Tablet Stand",
    brand: "Ergo",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 79000,
    imageSeed: "tablet-stand",
  }),
  createDemoProduct({
    handle: "demo-usbc-cable",
    title: "USB-C Cable Pack",
    brand: "Connect",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 35000,
    imageSeed: "cable",
  }),
  createDemoProduct({
    handle: "demo-bluetooth-tracker",
    title: "Bluetooth Tracker",
    brand: "Tile",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 59000,
    imageSeed: "tracker",
  }),
  createDemoProduct({
    handle: "demo-portable-ssd",
    title: "Portable SSD 1TB",
    brand: "Samsung",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 429000,
    imageSeed: "ssd",
    tags: ["staff-pick"],
  }),
  createDemoProduct({
    handle: "demo-smart-plug",
    title: "Smart Plug",
    brand: "Nest",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 49000,
    imageSeed: "plug",
  }),
  createDemoProduct({
    handle: "demo-webcam-hd",
    title: "HD Webcam",
    brand: "ClearView",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 189000,
    imageSeed: "webcam-hd",
  }),
  createDemoProduct({
    handle: "demo-gaming-controller",
    title: "Gaming Controller",
    brand: "Xbox",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 219000,
    imageSeed: "controller",
  }),
  createDemoProduct({
    handle: "demo-noise-earbuds",
    title: "Noise-Canceling Earbuds",
    brand: "Sainto Audio",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 379000,
    imageSeed: "earbuds",
  }),
  createDemoProduct({
    handle: "demo-laptop-sleeve",
    title: "Laptop Sleeve",
    brand: "Field",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 99000,
    imageSeed: "sleeve",
  }),
  createDemoProduct({
    handle: "demo-power-bank",
    title: "Power Bank 20K",
    brand: "Anker",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 149000,
    imageSeed: "powerbank",
  }),
  createDemoProduct({
    handle: "demo-desk-fan",
    title: "USB Desk Fan",
    brand: "Dyson",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 259000,
    imageSeed: "fan",
  }),
  createDemoProduct({
    handle: "demo-ring-light",
    title: "Ring Light",
    brand: "Lumen",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 169000,
    imageSeed: "ringlight",
  }),
  createDemoProduct({
    handle: "demo-mechanical-numpad",
    title: "Mechanical Numpad",
    brand: "Keycraft",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 129000,
    imageSeed: "numpad",
  }),
  createDemoProduct({
    handle: "demo-smart-speaker",
    title: "Smart Speaker",
    brand: "Apple",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 499000,
    imageSeed: "smart-speaker",
    tags: ["staff-pick"],
  }),
  createDemoProduct({
    handle: "demo-docking-station",
    title: "Docking Station",
    brand: "CalDigit",
    categoryTitle: "Tech",
    categoryHandle: "tech",
    price: 389000,
    imageSeed: "dock",
  }),
];

const workspaceProducts = [
  createDemoProduct({
    handle: "demo-desk-lamp",
    title: "Desk Lamp",
    brand: "Lumen",
    categoryTitle: "Workspace",
    categoryHandle: "workspace",
    price: 129000,
    imageSeed: "lamp",
    tags: ["staff-pick"],
  }),
  createDemoProduct({
    handle: "demo-monitor-stand",
    title: "Monitor Stand",
    brand: "Ergo",
    categoryTitle: "Workspace",
    categoryHandle: "workspace",
    price: 159000,
    imageSeed: "stand",
  }),
  createDemoProduct({
    handle: "demo-desk-mat",
    title: "Desk Mat",
    brand: "Surface",
    categoryTitle: "Workspace",
    categoryHandle: "workspace",
    price: 69000,
    imageSeed: "deskmat",
  }),
  createDemoProduct({
    handle: "demo-webcam",
    title: "4K Webcam",
    brand: "ClearView",
    categoryTitle: "Workspace",
    categoryHandle: "workspace",
    price: 249000,
    imageSeed: "webcam",
  }),
  createDemoProduct({
    handle: "demo-monitor-arm",
    title: "Monitor Arm",
    brand: "Ergo",
    categoryTitle: "Workspace",
    categoryHandle: "workspace",
    price: 199000,
    imageSeed: "monitor-arm",
  }),
];

const lifestyleProducts = [
  createDemoProduct({
    handle: "demo-ceramic-mug",
    title: "Ceramic Mug",
    brand: "Hearth",
    categoryTitle: "Lifestyle",
    categoryHandle: "lifestyle",
    price: 45000,
    imageSeed: "mug",
  }),
  createDemoProduct({
    handle: "demo-scented-candle",
    title: "Scented Candle",
    brand: "Noon",
    categoryTitle: "Lifestyle",
    categoryHandle: "lifestyle",
    price: 38000,
    imageSeed: "candle",
    tags: ["staff-pick"],
  }),
  createDemoProduct({
    handle: "demo-throw-blanket",
    title: "Wool Throw",
    brand: "Nest",
    categoryTitle: "Lifestyle",
    categoryHandle: "lifestyle",
    price: 175000,
    imageSeed: "blanket",
  }),
  createDemoProduct({
    handle: "demo-incense-set",
    title: "Incense Set",
    brand: "Noon",
    categoryTitle: "Lifestyle",
    categoryHandle: "lifestyle",
    price: 52000,
    imageSeed: "incense",
  }),
];

const carryProducts = [
  createDemoProduct({
    handle: "demo-backpack",
    title: "Everyday Backpack",
    brand: "Field",
    categoryTitle: "Carry",
    categoryHandle: "carry",
    price: 319000,
    imageSeed: "backpack",
    tags: ["staff-pick"],
  }),
  createDemoProduct({
    handle: "demo-sling-bag",
    title: "Sling Bag",
    brand: "Field",
    categoryTitle: "Carry",
    categoryHandle: "carry",
    price: 189000,
    imageSeed: "sling",
  }),
  createDemoProduct({
    handle: "demo-passport-wallet",
    title: "Passport Wallet",
    brand: "Leather Co.",
    categoryTitle: "Carry",
    categoryHandle: "carry",
    price: 99000,
    imageSeed: "wallet",
  }),
  createDemoProduct({
    handle: "demo-tech-pouch",
    title: "Tech Pouch",
    brand: "Field",
    categoryTitle: "Carry",
    categoryHandle: "carry",
    price: 79000,
    imageSeed: "pouch",
  }),
];

function demoCategoryLogo(handle: string, title: string): Image {
  return {
    url: `https://picsum.photos/seed/sainto-logo-${handle}/640/200`,
    altText: `${title} logo`,
    width: 640,
    height: 200,
  };
}

function createCategoryPage(input: {
  handle: string;
  title: string;
  description: string;
  products: Product[];
  homeSortOrder: number;
}): CategoryPage {
  const featuredProduct = input.products[0];

  return {
    id: `demo-category-${input.handle}`,
    handle: input.handle,
    title: input.title,
    description: input.description,
    seo: {
      title: `${input.title} (Demo)`,
      description: input.description,
    },
    updatedAt: new Date().toISOString(),
    path: `/demo?cat=${input.handle}`,
    logo: demoCategoryLogo(input.handle, input.title),
    featuredProduct,
    products: input.products,
    showOnHome: true,
    homeSortOrder: input.homeSortOrder,
  };
}

export const DEMO_CATEGORIES: CategoryPage[] = [
  createCategoryPage({
    handle: "tech",
    title: "Tech",
    description: "Demo category — headphones, keyboards, and everyday tech.",
    products: techProducts,
    homeSortOrder: 0,
  }),
  createCategoryPage({
    handle: "workspace",
    title: "Workspace",
    description: "Demo category — desk essentials and focus-friendly gear.",
    products: workspaceProducts,
    homeSortOrder: 1,
  }),
  createCategoryPage({
    handle: "lifestyle",
    title: "Lifestyle",
    description: "Demo category — home goods and calm everyday objects.",
    products: lifestyleProducts,
    homeSortOrder: 2,
  }),
  createCategoryPage({
    handle: "carry",
    title: "Carry",
    description: "Demo category — bags and travel-ready accessories.",
    products: carryProducts,
    homeSortOrder: 3,
  }),
];

export const DEFAULT_DEMO_CATEGORY_HANDLE = DEMO_CATEGORIES[0]!.handle;

export function getDemoCategory(handle: string): CategoryPage | undefined {
  return DEMO_CATEGORIES.find((category) => category.handle === handle);
}

export function demoCategoriesToNavLinks() {
  return DEMO_CATEGORIES.map((category) => ({
    label: category.title,
    href: category.path,
  }));
}
