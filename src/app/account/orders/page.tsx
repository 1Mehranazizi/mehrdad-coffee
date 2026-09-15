import Link from "next/link";
import { getCurrentCustomer } from "@/server/auth/customer";
import { listOrdersByCustomer } from "@/server/repo/orders";
import { formatToman } from "@/lib/products";
import { orderStatusLabels } from "@/lib/order-status";

export default async function AccountOrdersPage() {
  const customer = await getCurrentCustomer();
  const orders = customer ? listOrdersByCustomer(customer.id) : [];

  if (orders.length === 0) {
    return <p className="text-sm text-ink-soft">هنوز سفارشی ثبت نکرده‌اید.</p>;
  }

  return (
    <div className="space-y-3">
      {orders.map((order) => (
        <Link
          key={order.id}
          href={`/account/orders/${order.id}`}
          className="flex items-center justify-between rounded-2xl border border-line bg-cream p-5 hover:border-coffee transition-colors"
        >
          <div>
            <p className="font-semibold text-ink" dir="ltr">
              {order.orderNumber}
            </p>
            <p className="mt-1 text-xs text-ink-soft">
              {orderStatusLabels[order.status]} · {order.items.length} قلم
            </p>
          </div>
          <p className="font-semibold text-ink">{formatToman(order.total)}</p>
        </Link>
      ))}
    </div>
  );
}
