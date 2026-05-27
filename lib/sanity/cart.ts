import type { Cart, CartItem } from "lib/commerce/types";
import { DEFAULT_CURRENCY_CODE, DEFAULT_OPTION } from "lib/constants";
import { cookies } from "next/headers";
import { sanityClient } from "./client";
import { mapSanityProduct, type SanityProduct } from "./mappers";

const CART_COOKIE = "cart";

const productByVariantQuery = `*[_type == "product" && _id == $variantId][0]{
  _id,
  _updatedAt,
  title,
  "slug": slug,
  price,
  description,
  descriptionHtml,
  availableForSale,
  tags,
  images,
  options,
  variants,
  seo
}`;

function createEmptyCart(id?: string): Cart {
  return {
    id: id || crypto.randomUUID(),
    checkoutUrl: "/checkout",
    totalQuantity: 0,
    lines: [],
    cost: {
      subtotalAmount: { amount: "0", currencyCode: DEFAULT_CURRENCY_CODE },
      totalAmount: { amount: "0", currencyCode: DEFAULT_CURRENCY_CODE },
      totalTaxAmount: { amount: "0", currencyCode: DEFAULT_CURRENCY_CODE },
    },
  };
}

function updateCartTotals(
  lines: CartItem[],
): Pick<Cart, "totalQuantity" | "cost"> {
  const totalQuantity = lines.reduce((sum, item) => sum + item.quantity, 0);
  const totalAmount = lines.reduce(
    (sum, item) => sum + Number(item.cost.totalAmount.amount),
    0,
  );
  const currencyCode =
    lines[0]?.cost.totalAmount.currencyCode ?? DEFAULT_CURRENCY_CODE;

  return {
    totalQuantity,
    cost: {
      subtotalAmount: { amount: totalAmount.toString(), currencyCode },
      totalAmount: { amount: totalAmount.toString(), currencyCode },
      totalTaxAmount: { amount: "0", currencyCode },
    },
  };
}

async function readCart(): Promise<Cart | undefined> {
  const cartCookie = (await cookies()).get(CART_COOKIE)?.value;
  if (!cartCookie) {
    return undefined;
  }

  try {
    return JSON.parse(cartCookie) as Cart;
  } catch {
    return undefined;
  }
}

async function writeCart(cart: Cart): Promise<void> {
  (await cookies()).set(CART_COOKIE, JSON.stringify(cart), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
  });
}

async function getVariantLine(
  merchandiseId: string,
  quantity: number,
): Promise<CartItem | undefined> {
  const doc = await sanityClient.fetch<SanityProduct | null>(
    productByVariantQuery,
    { variantId: merchandiseId },
  );

  if (!doc) {
    return undefined;
  }

  const product = mapSanityProduct(doc, false);
  if (!product) {
    return undefined;
  }

  const variant =
    product.variants.find((v) => v.id === merchandiseId) ?? product.variants[0];

  if (!variant) {
    return undefined;
  }

  const amount = (Number(variant.price.amount) * quantity).toString();

  return {
    id: `${product.id}:${variant.id}`,
    quantity,
    cost: {
      totalAmount: {
        amount,
        currencyCode: variant.price.currencyCode,
      },
    },
    merchandise: {
      id: variant.id,
      title: variant.title === DEFAULT_OPTION ? product.title : variant.title,
      selectedOptions: variant.selectedOptions,
      product: {
        id: product.id,
        handle: product.handle,
        title: product.title,
        featuredImage: product.featuredImage,
      },
    },
  };
}

export async function getSanityCart(): Promise<Cart | undefined> {
  return readCart();
}

export async function createSanityCart(): Promise<Cart> {
  const cart = createEmptyCart();
  await writeCart(cart);
  return cart;
}

export async function addToSanityCart(
  lines: { merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cart = (await readCart()) ?? createEmptyCart();

  for (const { merchandiseId, quantity } of lines) {
    const existing = cart.lines.find(
      (line) => line.merchandise.id === merchandiseId,
    );

    if (existing) {
      const updated = await getVariantLine(
        merchandiseId,
        existing.quantity + quantity,
      );
      if (updated) {
        cart.lines = cart.lines.map((line) =>
          line.merchandise.id === merchandiseId ? updated : line,
        );
      }
    } else {
      const line = await getVariantLine(merchandiseId, quantity);
      if (line) {
        cart.lines.push(line);
      }
    }
  }

  const totals = updateCartTotals(cart.lines);
  const nextCart = { ...cart, ...totals };
  await writeCart(nextCart);
  return nextCart;
}

export async function removeFromSanityCart(lineIds: string[]): Promise<Cart> {
  const cart = (await readCart()) ?? createEmptyCart();
  cart.lines = cart.lines.filter(
    (line) => line.id && !lineIds.includes(line.id),
  );
  const nextCart = { ...cart, ...updateCartTotals(cart.lines) };
  await writeCart(nextCart);
  return nextCart;
}

export async function updateSanityCart(
  lines: { id: string; merchandiseId: string; quantity: number }[],
): Promise<Cart> {
  const cart = (await readCart()) ?? createEmptyCart();

  for (const { id, merchandiseId, quantity } of lines) {
    const updated = await getVariantLine(merchandiseId, quantity);
    if (!updated) {
      continue;
    }
    updated.id = id;
    cart.lines = cart.lines.map((line) => (line.id === id ? updated : line));
  }

  const nextCart = { ...cart, ...updateCartTotals(cart.lines) };
  await writeCart(nextCart);
  return nextCart;
}
