export type Image = {
  url: string;
  altText: string;
  width: number;
  height: number;
};

export type Money = {
  amount: string;
  currencyCode: string;
};

export type SEO = {
  title: string;
  description: string;
};

export type ProductOption = {
  id: string;
  name: string;
  values: string[];
};

export type ProductVariant = {
  id: string;
  title: string;
  availableForSale: boolean;
  selectedOptions: { name: string; value: string }[];
  price: Money;
};

export type ProductHighlight = {
  text: string;
  icon?: Image;
};

export type PurchaseBundleOption = {
  title: string;
  price: number;
  compareAtPrice?: number;
  highlightLabel?: string;
  promoBadges?: string[];
  whatsIncludedUrl?: string;
  image?: Image;
  variantId?: string;
};

export type PurchaseBundles = {
  single?: PurchaseBundleOption;
  twoPack?: PurchaseBundleOption;
  stylingKit?: PurchaseBundleOption;
};

export type BestForItem = {
  label: string;
  icon?: Image;
};

export type BestFor = {
  hairType?: BestForItem;
  hairLength?: BestForItem;
};

export type KeyIngredient = {
  name: string;
  description: string;
  image: Image;
};

export type KeyIngredientsSection = {
  title?: string;
  subtitle?: string;
  ingredients: KeyIngredient[];
  featureBadges?: ProductHighlight[];
  fullIngredientListUrl?: string;
};

export type Product = {
  [x: string]: any;
  id: string;
  handle: string;
  availableForSale: boolean;
  outOfStock?: boolean;
  brand: string;
  condition?: string;
  title: string;
  description: string;
  descriptionHtml: string;
  options: ProductOption[];
  priceRange: { minVariantPrice: Money; maxVariantPrice: Money };
  variants: ProductVariant[];
  featuredImage: Image;
  images: Image[];
  seo: SEO;
  tags: string[];
  updatedAt: string;
  price?: Money;
  highlights?: ProductHighlight[];
  purchaseBundles?: PurchaseBundles;
  bestFor?: BestFor;
  keyIngredients?: KeyIngredientsSection;
  specs?: { label: string; value: string }[];
};

export type CartItem = {
  id?: string;
  quantity: number;
  cost: { totalAmount: Money };
  merchandise: {
    id: string;
    title: string;
    selectedOptions: { name: string; value: string }[];
    product: Pick<Product, "id" | "handle" | "title" | "featuredImage">;
  };
};

export type Cart = {
  id: string;
  checkoutUrl: string;
  totalQuantity: number;
  lines: CartItem[];
  cost: {
    subtotalAmount: Money;
    totalAmount: Money;
    totalTaxAmount: Money;
  };
};

export type Collection = {
  handle: string;
  title: string;
  description: string;
  seo: SEO;
  updatedAt: string;
  path: string;
};

export type Menu = {
  title: string;
  path: string;
};

export type Page = {
  id: string;
  title: string;
  handle: string;
  body: string;
  bodySummary: string;
  seo?: SEO;
  createdAt: string;
  updatedAt: string;
};
