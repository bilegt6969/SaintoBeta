"use server";

import { PENDING_TX_CODE_COOKIE, secureCookieOptions } from "lib/auth/cookies";
import {
  buildOrderLinesFromCart,
  calculateOrderTotal,
  generateTxCode,
  isValidTxCode,
} from "lib/auth/orders";
import { getOrderUserId } from "lib/auth/server";
import dbConnect from "lib/dbConnect";
import { getCart } from "lib/commerce";
import { Order } from "models/Order";
import { cookies } from "next/headers";

interface OrderForm {
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  address: string;
  district: string;
  city: string;
  notes?: string;
}

interface FinalizeOrderPayload {
  form: OrderForm;
}

async function createUniqueTxCode(): Promise<string> {
  await dbConnect();

  for (let attempt = 0; attempt < 8; attempt++) {
    const txCode = generateTxCode();
    const exists = await Order.exists({ txCode });
    if (!exists) {
      return txCode;
    }
  }

  throw new Error("Failed to generate transaction code");
}

export async function reserveOrderTxCode(): Promise<{
  success: boolean;
  txCode?: string;
  error?: string;
}> {
  try {
    const txCode = await createUniqueTxCode();
    const cookieStore = await cookies();
    cookieStore.set(
      PENDING_TX_CODE_COOKIE,
      txCode,
      secureCookieOptions({ maxAge: 60 * 60 }),
    );
    return { success: true, txCode };
  } catch (error) {
    console.error("Failed to reserve transaction code:", error);
    return { success: false, error: "Could not prepare payment code." };
  }
}

async function sendOrderToDiscord(payload: {
  txCode: string;
  form: OrderForm;
  lines: ReturnType<typeof buildOrderLinesFromCart>;
  total: number;
}) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const itemsList = payload.lines
    .map(
      (line) =>
        `• **${line.title}** x${line.quantity} — ₮ ${(line.price * line.quantity).toLocaleString()}`,
    )
    .join("\n");

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({
      embeds: [
        {
          title: `🛒 New Order: ${payload.txCode}`,
          color: 0x1d1d1f,
          fields: [
            {
              name: "Customer",
              value: `${payload.form.firstName} ${payload.form.lastName}`,
              inline: false,
            },
            { name: "Items", value: itemsList, inline: false },
            {
              name: "Financial",
              value: `Total: ₮ ${payload.total.toLocaleString()}`,
              inline: false,
            },
          ],
          timestamp: new Date().toISOString(),
        },
      ],
    }),
  });
}

function validateOrderForm(form: OrderForm): string | null {
  if (!form.firstName?.trim() || !form.lastName?.trim()) {
    return "Name is required.";
  }
  if (!form.email?.trim() || !form.email.includes("@")) {
    return "A valid email is required.";
  }
  if (!form.phone?.trim() || !form.address?.trim() || !form.city?.trim()) {
    return "Complete shipping details are required.";
  }
  return null;
}

export async function processSecureOrder(payload: FinalizeOrderPayload) {
  try {
    const formError = validateOrderForm(payload.form);
    if (formError) {
      return { success: false, error: formError };
    }

    const cart = await getCart();
    if (!cart?.lines.length) {
      return { success: false, error: "Your cart is empty." };
    }

    const cookieStore = await cookies();
    const txCode = cookieStore.get(PENDING_TX_CODE_COOKIE)?.value;
    if (!txCode || !isValidTxCode(txCode)) {
      return {
        success: false,
        error: "Payment code expired. Return to payment and try again.",
      };
    }

    await dbConnect();

    const existing = await Order.exists({ txCode });
    if (existing) {
      return { success: false, error: "This payment code was already used." };
    }

    const userId = await getOrderUserId();
    const lines = buildOrderLinesFromCart(cart);
    const total = calculateOrderTotal(cart);

    const newOrder = await Order.create({
      userId,
      txCode,
      status: "Payment Processing",
      customerDetails: payload.form,
      items: lines.map((line) => ({
        merchandiseId: line.merchandiseId,
        title: line.title,
        quantity: line.quantity,
        price: line.price,
        image: line.image,
      })),
      totalAmount: total,
    });

    cookieStore.delete(PENDING_TX_CODE_COOKIE);

    await sendOrderToDiscord({
      txCode,
      form: payload.form,
      lines,
      total,
    });

    return { success: true, orderId: newOrder._id.toString(), txCode };
  } catch (error) {
    console.error("Order processing error:", error);
    return { success: false, error: "Order processing failed. Please try again." };
  }
}
