import Link from "next/link";
import { notFound } from "next/navigation";
import { ArrowRight } from "lucide-react";
import { getOrderDetail } from "@/server/repo/orders";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import OrderDetailsView from "@/components/admin/OrderDetailsView";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderDetail(id);
  if (!order) notFound();

  return (
    <div className="max-w-3xl">
      <Link
        href="/admin/orders"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-ink-soft transition-colors hover:text-coffee"
      >
        <ArrowRight size={15} />
        بازگشت به سفارش‌ها
      </Link>

      <div className="mb-6 flex flex-wrap items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-ink" dir="ltr">
          {order.orderNumber}
        </h1>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <OrderDetailsView order={order} />
    </div>
  );
}
