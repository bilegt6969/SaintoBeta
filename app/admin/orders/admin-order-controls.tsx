"use client";

import { updateOrderStatus } from "app/actions/admin";
import { useState } from "react";

export function AdminOrderControls() {
  const [txCode, setTxCode] = useState("");
  const [message, setMessage] = useState("");

  async function handleUpdate(
    status: "Payment Approved" | "On Delivery" | "Delivered",
  ) {
    if (!txCode.trim()) {
      setMessage("Enter a transaction code first.");
      return;
    }

    const result = await updateOrderStatus(txCode.trim(), status);
    setMessage(result.success ? "Order updated." : result.error || "Update failed.");
  }

  return (
    <div className="flex flex-col gap-4">
      <input
        value={txCode}
        onChange={(event) => setTxCode(event.target.value)}
        placeholder="SNT-123456"
        className="w-full rounded-md border border-neutral-200 px-3 py-2 text-sm"
      />
      <div className="flex flex-wrap gap-2">
        <button
          onClick={() => handleUpdate("Payment Approved")}
          className="rounded bg-green-600 px-4 py-2 text-sm text-white"
        >
          Approve Payment
        </button>
        <button
          onClick={() => handleUpdate("On Delivery")}
          className="rounded bg-blue-600 px-4 py-2 text-sm text-white"
        >
          Set to Delivery
        </button>
        <button
          onClick={() => handleUpdate("Delivered")}
          className="rounded bg-neutral-800 px-4 py-2 text-sm text-white"
        >
          Mark Delivered
        </button>
      </div>
      {message ? <p className="text-sm text-neutral-600">{message}</p> : null}
    </div>
  );
}
