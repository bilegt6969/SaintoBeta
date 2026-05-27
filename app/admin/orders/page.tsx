"use client";

import { updateOrderStatus } from "app/actions/admin";

export default function AdminOrderControls({ txCode }: { txCode: string }) {
  return (
    <div className="flex gap-2">
      <button
        onClick={() => updateOrderStatus(txCode, "Payment Approved")}
        className="bg-green-600 text-white px-4 py-2 rounded"
      >
        Approve Payment
      </button>
      <button
        onClick={() => updateOrderStatus(txCode, "On Delivery")}
        className="bg-blue-600 text-white px-4 py-2 rounded"
      >
        Set to Delivery
      </button>
    </div>
  );
}
