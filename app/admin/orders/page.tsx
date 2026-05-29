import { requireAdmin } from "lib/auth/server";
import { redirect } from "next/navigation";
import { AdminOrderControls } from "./admin-order-controls";

export default async function AdminOrdersPage() {
  try {
    await requireAdmin();
  } catch (error) {
    if (error instanceof Error && error.message === "FORBIDDEN") {
      redirect("/");
    }
    redirect("/sign-in?next=/admin/orders");
  }

  return (
    <div className="mx-auto max-w-2xl px-6 py-16">
      <h1 className="text-2xl font-semibold text-neutral-900">Admin Orders</h1>
      <p className="mt-2 text-sm text-neutral-500">
        Enter a transaction code to update order status. Discord bot commands
        remain available for authorized staff.
      </p>
      <div className="mt-8 rounded-xl border border-neutral-200 bg-white p-6">
        <AdminOrderControls />
      </div>
    </div>
  );
}
