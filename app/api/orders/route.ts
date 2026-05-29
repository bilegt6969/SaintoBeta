import { formatOrderForApi } from "lib/auth/orders";
import { requireAuthenticatedUser } from "lib/auth/server";
import dbConnect from "lib/dbConnect";
import { IOrder, Order } from "models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    const user = await requireAuthenticatedUser();
    await dbConnect();

    const orders = await Order.find({ userId: user.uid })
      .sort({ createdAt: -1 })
      .lean<IOrder[]>();

    return NextResponse.json(orders.map(formatOrderForApi));
  } catch (error) {
    if (error instanceof Error && error.message === "UNAUTHORIZED") {
      return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
    }
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
