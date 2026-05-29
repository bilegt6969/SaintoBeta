"use server";

import { requireAdmin } from "lib/auth/server";
import dbConnect from "lib/dbConnect";
import { Order } from "models/Order";
import { revalidatePath } from "next/cache";

export async function updateOrderStatus(
  txCode: string,
  newStatus: "Payment Approved" | "On Delivery" | "Delivered",
) {
  try {
    await requireAdmin();
    await dbConnect();

    const updatedOrder = await Order.findOneAndUpdate(
      { txCode },
      { status: newStatus },
      { new: true },
    );

    if (!updatedOrder) {
      return { success: false, error: "Order not found" };
    }

    revalidatePath("/account");

    return { success: true };
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return { success: false, error: "Unauthorized" };
    }
    if (error instanceof Error && error.message === "FORBIDDEN") {
      return { success: false, error: "Forbidden" };
    }
    console.error("Failed to update status:", error);
    return { success: false, error: "Database update failed" };
  }
}
