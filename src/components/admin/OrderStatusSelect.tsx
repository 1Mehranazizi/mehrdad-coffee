"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderStatusOptions } from "@/lib/order-status";
import type { OrderStatus } from "@/server/repo/orders";

export default function OrderStatusSelect({
  orderId,
  currentStatus,
}: {
  orderId: string;
  currentStatus: OrderStatus;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);

  const handleChange = async (value: OrderStatus) => {
    setStatus(value);
    setSaving(true);
    try {
      await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <select
      value={status}
      onChange={(e) => handleChange(e.target.value as OrderStatus)}
      disabled={saving}
      className="rounded-full border border-line bg-cream px-4 py-2 text-sm text-ink focus:border-coffee disabled:opacity-60"
    >
      {orderStatusOptions.map((opt) => (
        <option key={opt.value} value={opt.value}>
          {opt.label}
        </option>
      ))}
    </select>
  );
}
