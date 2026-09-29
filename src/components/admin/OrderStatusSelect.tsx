"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { orderStatusBadge, orderStatusOptions } from "@/lib/order-status";
import type { OrderStatus } from "@/server/repo/orders";
import { toast } from "@/lib/toast-store";

export default function OrderStatusSelect({
  orderId,
  currentStatus,
  compact = false,
  onChanged,
}: {
  orderId: string;
  currentStatus: OrderStatus;
  /** smaller, colour-coded variant used inside table rows */
  compact?: boolean;
  /** called after the server accepted the new status */
  onChanged?: (status: OrderStatus) => void;
}) {
  const router = useRouter();
  const [status, setStatus] = useState(currentStatus);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  // pick up server-side changes (router.refresh, another tab, …)
  const [seenStatus, setSeenStatus] = useState(currentStatus);
  if (currentStatus !== seenStatus) {
    setSeenStatus(currentStatus);
    setStatus(currentStatus);
  }

  const handleChange = async (value: OrderStatus) => {
    if (value === status) return;
    if (
      value === "CANCELED" &&
      !confirm("سفارش لغو شود؟ این کار به‌صورت خودکار مبلغی را برنمی‌گرداند.")
    ) {
      return;
    }
    const previous = status;
    setStatus(value);
    setSaving(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status: value }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "تغییر وضعیت انجام نشد");
      }
      toast.success("وضعیت سفارش تغییر کرد");
      router.refresh();
      onChanged?.(value);
    } catch (err) {
      setStatus(previous);
      setError(err instanceof Error ? err.message : "تغییر وضعیت انجام نشد");
      toast.error(err instanceof Error ? err.message : "تغییر وضعیت انجام نشد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <div className="inline-flex flex-col items-start gap-1">
      <select
        value={status}
        onChange={(e) => handleChange(e.target.value as OrderStatus)}
        disabled={saving}
        aria-label="وضعیت سفارش"
        className={
          compact
            ? `rounded-full border-0 px-3 py-1.5 text-xs font-medium disabled:opacity-60 ${orderStatusBadge[status]}`
            : "rounded-full border border-line bg-cream px-4 py-2 text-sm text-ink focus:border-coffee disabled:opacity-60"
        }
      >
        {orderStatusOptions.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
      {error && <span className="text-xs text-red-700">{error}</span>}
    </div>
  );
}
