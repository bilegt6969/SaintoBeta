import { getCart } from "lib/commerce";
import { Suspense } from "react";
import { CheckoutForm } from "./checkout-form";

async function CheckoutContent() {
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

export default function CheckoutPage() {
  return (
    <Suspense fallback={<div>Loading...</div>}>
      <CheckoutContent />
    </Suspense>
  );
}
