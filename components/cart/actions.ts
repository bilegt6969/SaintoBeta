"use server";

import {
  addToCart,
  createCart,
  getCart,
  removeFromCart,
  updateCart,
} from "lib/commerce";
import { TAGS } from "lib/constants";
import { updateTag } from "next/cache";
import { cookies } from "next/headers";
import { redirect } from "next/navigation";

export async function addItem(
  variantId: string, // bound via .bind(null, variantId) in add-to-cart.tsx
  prevState: any, // useActionState previous state
  _formData: FormData, // unused but required by the action signature
) {
  if (!variantId) {
    return "Error adding item to cart: No variant selected";
  }

  const cookieStore = await cookies();
  let cartId = cookieStore.get("cartId")?.value;

  if (!cartId) {
    try {
      const cart = await createCart();
      cartId = cart.id;
      cookieStore.set("cartId", cartId!, { path: "/" });
    } catch (e) {
      console.error("Failed to initialize a cart session:", e);
      return "Error initializing cart session";
    }
  }

  try {
    await addToCart([{ merchandiseId: variantId, quantity: 1 }]);
    updateTag(TAGS.cart);
    return null;
  } catch (e) {
    console.error("Commerce API Error adding item to cart:", e);
    return "Error adding item to cart";
  }
}

/**
 * Destroys the session cookie and forcefully bursts the data cache
 * so layout wrappers instantly register an empty shopping state.
 */
export async function wipeCartCookie() {
  try {
    const cookieStore = await cookies();

    // 1. Delete the old cart tracking reference
    cookieStore.delete("cartId");

    // 2. Force-initialize a completely new, empty cart session on the backend
    const freshCart = await createCart();

    if (freshCart && freshCart.id) {
      // 3. Mount the new clean cart token immediately
      cookieStore.set("cartId", freshCart.id, { path: "/" });
    }

    // 4. Force invalidate everything tied to the previous cart cache tags
    updateTag(TAGS.cart);
  } catch (e) {
    console.error("Failed to safely reset cart data layer state:", e);
  }
}

export async function removeItem(prevState: any, merchandiseId: string) {
  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line: { merchandise: { id: string } }) =>
        line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      await removeFromCart([lineItem.id]);
      updateTag(TAGS.cart);
    } else {
      return "Item not found in cart";
    }
  } catch (e) {
    return "Error removing item from cart";
  }
}

export async function updateItemQuantity(
  prevState: any,
  payload: {
    merchandiseId: string;
    quantity: number;
  },
) {
  const { merchandiseId, quantity } = payload;

  try {
    const cart = await getCart();

    if (!cart) {
      return "Error fetching cart";
    }

    const lineItem = cart.lines.find(
      (line: { merchandise: { id: string } }) =>
        line.merchandise.id === merchandiseId,
    );

    if (lineItem && lineItem.id) {
      if (quantity === 0) {
        await removeFromCart([lineItem.id]);
      } else {
        await updateCart([
          {
            id: lineItem.id,
            merchandiseId,
            quantity,
          },
        ]);
      }
    } else if (quantity > 0) {
      await addToCart([{ merchandiseId, quantity }]);
    }

    updateTag(TAGS.cart);
  } catch (e) {
    console.error(e);
    return "Error updating item quantity";
  }
}

export async function redirectToCheckout() {
  let cart = await getCart();
  redirect(cart!.checkoutUrl);
}

export async function createCartAndSetCookie() {
  let cart = await createCart();
  (await cookies()).set("cartId", cart.id!);
}
