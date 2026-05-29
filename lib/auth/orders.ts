import type { Cart } from "lib/commerce/types";

export const SHIPPING_FEE = 5000;

export function generateTxCode(): string {
  const suffix = crypto.randomInt(100000, 1000000);
  return `SNT-${suffix}`;
}

export function isValidTxCode(txCode: string): boolean {
  return /^SNT-\d{6}$/.test(txCode);
}

export function buildOrderLinesFromCart(cart: Cart) {
  return cart.lines.map((line) => ({
    merchandiseId: line.merchandise.id,
    title: line.merchandise.product.title,
    quantity: line.quantity,
    price: Number(line.cost.totalAmount.amount) / line.quantity,
    image: line.merchandise.product.featuredImage?.url ?? "",
  }));
}

export function calculateOrderTotal(cart: Cart): number {
  const subtotal = cart.lines.reduce(
    (sum, line) => sum + Number(line.cost.totalAmount.amount),
    0,
  );
  return subtotal + SHIPPING_FEE;
}

export function formatOrderForApi(order: {
  txCode: string;
  _id: unknown;
  createdAt?: Date;
  status?: string;
  items: {
    merchandiseId: string;
    title: string;
    quantity: number;
    price: number;
    image?: string;
  }[];
  totalAmount: number;
  customerDetails?: { address?: string; city?: string };
}) {
  return {
    id: order.txCode || String(order._id),
    timestamp: order.createdAt,
    status: order.status?.toLowerCase().replace(/ /g, "_"),
    items: order.items.map((item) => ({
      id: item.merchandiseId,
      name: item.title,
      brand: "BASED",
      qty: item.quantity,
      price: item.price,
      image: item.image,
    })),
    subtotal: order.totalAmount - SHIPPING_FEE,
    logistics: SHIPPING_FEE,
    total: order.totalAmount,
    destination: `${order.customerDetails?.address ?? ""}, ${order.customerDetails?.city ?? ""}`,
  };
}
