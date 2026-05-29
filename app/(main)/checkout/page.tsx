import { getCart } from "lib/commerce";
import { CheckoutForm } from "./checkout-form";

export default async function CheckoutPage() {
  const cart = await getCart();

  const lines = (cart?.lines ?? []).map((line) => ({
    id: line.merchandise.id,
    title: line.merchandise.product.title,
    subtitle: line.merchandise.title,
    quantity: line.quantity,
    price: Number(line.cost.totalAmount.amount) / line.quantity,
    image: line.merchandise.product.featuredImage?.url,
  }));

  const subtotalAmount = Number(cart?.cost.subtotalAmount.amount ?? 0);
  const totalAmount = Number(cart?.cost.totalAmount.amount ?? 0);

  return (
    <CheckoutForm
      lines={lines}
      subtotalAmount={subtotalAmount}
      totalAmount={totalAmount}
    />
  );
}
