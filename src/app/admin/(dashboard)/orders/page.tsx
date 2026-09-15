import Link from "next/link";
import { listOrdersForAdmin } from "@/server/repo/orders";
import { formatToman } from "@/lib/products";
import { orderStatusLabels } from "@/lib/order-status";

export default function AdminOrdersPage() {
  const orders = listOrdersForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-6">سفارش‌ها</h1>
      <div className="rounded-2xl border border-line bg-cream overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper-deep/50 text-ink-soft">
            <tr>
              <th className="p-3 text-right font-medium">شماره سفارش</th>
              <th className="p-3 text-right font-medium">گیرنده</th>
              <th className="p-3 text-right font-medium">مبلغ</th>
              <th className="p-3 text-right font-medium">وضعیت</th>
              <th className="p-3 text-right font-medium">تاریخ</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {orders.map((order) => (
              <tr key={order.id}>
                <td className="p-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-ink hover:text-coffee"
                    dir="ltr"
                  >
                    {order.orderNumber}
                  </Link>
                </td>
                <td className="p-3 text-ink-soft">{order.receiverName}</td>
                <td className="p-3 text-ink">{formatToman(order.total)}</td>
                <td className="p-3">
                  <span className="rounded-full bg-paper-deep px-2.5 py-1 text-xs text-ink-soft">
                    {orderStatusLabels[order.status]}
                  </span>
                </td>
                <td className="p-3 text-xs text-ink-soft" dir="ltr">
                  {order.createdAt}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
        {orders.length === 0 && (
          <p className="p-6 text-center text-sm text-ink-soft">سفارشی ثبت نشده است.</p>
        )}
      </div>
    </div>
  );
}
