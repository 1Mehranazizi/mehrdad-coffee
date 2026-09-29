"use client";

import { useState } from "react";
import { Eye } from "lucide-react";
import Modal from "@/components/admin/Modal";
import OrderDetailsView from "@/components/admin/OrderDetailsView";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import type { OrderDetail } from "@/server/repo/orders";
import { toast } from "@/lib/toast-store";

/** "Details" button for an orders-list row: loads the order and shows it in a dialog. */
export default function OrderQuickView({
  orderId,
  orderNumber,
}: {
  orderId: string;
  orderNumber: string;
}) {
  const [open, setOpen] = useState(false);
  const [order, setOrder] = useState<OrderDetail | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const load = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await fetch(`/api/admin/orders/${orderId}`, { cache: "no-store" });
      if (!res.ok) throw new Error();
      const data = await res.json();
      setOrder(data.order);
    } catch {
      setError("دریافت جزئیات سفارش انجام نشد.");
      toast.error("دریافت جزئیات سفارش انجام نشد.");
    } finally {
      setLoading(false);
    }
  };

  const handleOpen = () => {
    setOpen(true);
    setOrder(null);
    void load(); // always re-fetch so the dialog never shows stale data
  };

  return (
    <>
      <button
        onClick={handleOpen}
        className="flex items-center gap-1.5 rounded-full border border-line px-3 py-1.5 text-xs text-ink-soft transition-colors hover:border-coffee hover:text-coffee"
      >
        <Eye size={14} />
        جزئیات
      </button>

      <Modal open={open} onClose={() => setOpen(false)} title={`سفارش ${orderNumber}`} size="lg">
        {loading && !order && <p className="py-10 text-center text-sm text-ink-soft">در حال بارگذاری…</p>}
        {error && (
          <div className="py-10 text-center text-sm">
            <p className="text-red-700">{error}</p>
            <button onClick={load} className="mt-3 text-coffee hover:text-coffee-deep">
              تلاش دوباره
            </button>
          </div>
        )}
        {order && !error && (
          <div className="space-y-4">
            <div className="flex flex-wrap items-center justify-between gap-3">
              <span className="text-sm text-ink-soft">تغییر وضعیت سفارش:</span>
              <OrderStatusSelect
                orderId={order.id}
                currentStatus={order.status}
                onChanged={() => void load()}
              />
            </div>
            <OrderDetailsView order={order} />
          </div>
        )}
      </Modal>
    </>
  );
}
