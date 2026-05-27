"use server";

import dbConnect from "lib/dbConnect";
import { Order } from "models/Order";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  txCode: string,
  newStatus: "Payment Approved" | "On Delivery" | "Delivered",
) {
  try {
    await dbConnect();

    // Find by txCode and update the status field
    const updatedOrder = await Order.findOneAndUpdate(
      { txCode },
      { status: newStatus },
      { new: true },
    );

    if (!updatedOrder) {
      return { success: false, error: "Order not found" };
    }

    // Force Next.js to revalidate the user's order history page
    // so they see the change instantly on their next visit/refresh
    revalidatePath("/account/orders");

    return { success: true };
  } catch (error) {
    console.error("Failed to update status:", error);
    return { success: false, error: "Database update failed" };
  }
}
