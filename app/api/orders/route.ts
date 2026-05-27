import dbConnect from "lib/dbConnect";
import { IOrder, IOrderItem, Order } from "models/Order";
import { NextResponse } from "next/server";

export async function GET() {
  try {
    await dbConnect();

    const orders = await Order.find({})
      .sort({ createdAt: -1 })
      .lean<IOrder[]>();

    const formattedOrders = orders.map((order: IOrder) => ({
      id: order.txCode || order._id,
      timestamp: order.createdAt,
      status: order.status?.toLowerCase().replace(" ", "_"),
      items: order.items.map((item: IOrderItem) => ({
        id: item.merchandiseId,
        name: item.title,
        brand: "BASED",
        qty: item.quantity,
        price: item.price,
        image: item.image,
      })),
      subtotal: order.totalAmount - 5000,
      logistics: 5000,
      total: order.totalAmount,
      destination: `${order.customerDetails?.address}, ${order.customerDetails?.city}`,
    }));

    return NextResponse.json(formattedOrders);
  } catch (e) {
    return NextResponse.json({ error: "Failed to fetch" }, { status: 500 });
  }
}
