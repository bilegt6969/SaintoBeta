"use server";

import dbConnect from "lib/dbConnect";
import { Order } from "models/Order";
import { cookies } from "next/headers";

interface CartLine {
  id: string;
  title: string;
  subtitle: string;
  quantity: number;
  price: number;
  image?: string;
}

interface FinalizeOrderPayload {
  txCode: string;
  form: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    address: string;
    district: string;
    city: string;
    notes?: string;
  };
  lines: CartLine[];
  total: number;
}

export async function sendOrderToDiscord(payload: FinalizeOrderPayload) {
  const webhookUrl = process.env.DISCORD_WEBHOOK_URL;
  if (!webhookUrl) return;

  const itemsList = payload.lines
    .map(
      (l) =>
        `• **${l.title}** x${l.quantity} — ₮ ${(l.price * l.quantity).toLocaleString()}`,
    )
    .join("\n");

  const embedData = {
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
  };

  await fetch(webhookUrl, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(embedData),
  });
}

export async function processSecureOrder(payload: FinalizeOrderPayload) {
  try {
    console.log("Connecting to database...");
    await dbConnect();

    const cookieStore = await cookies();
    const userId = cookieStore.get("userId")?.value || "guest_checkout_session";

    console.log("Persisting order to MongoDB...");
    const newOrder = await Order.create({
      userId,
      txCode: payload.txCode,
      status: "Payment Processing",
      customerDetails: payload.form,
      items: payload.lines.map((l) => ({
        merchandiseId: l.id,
        title: l.title,
        quantity: l.quantity,
        price: l.price,
        image: l.image,
      })),
      totalAmount: payload.total,
    });

    console.log("Order saved with ID:", newOrder._id);
    await sendOrderToDiscord(payload);

    return { success: true, orderId: newOrder._id.toString() };
  } catch (error: any) {
    console.error("Order processing error:", error);
    return { success: false, error: error.message };
  }
}
