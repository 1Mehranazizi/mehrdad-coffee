import { notFound } from "next/navigation";
import { getCurrentCustomer } from "@/server/auth/customer";
import { getOrderById } from "@/server/repo/orders";
import { formatToman, weightLabel } from "@/lib/products";
import { orderStatusLabels } from "@/lib/order-status";

export default async function AccountOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const customer = await getCurrentCustomer();
  const order = getOrderById(id);

  if (!order || !customer || order.customerId !== customer.id) notFound();

  return (
    <div>
      <div className="flex items-center justify-between">
        <h2 className="font-bold text-ink text-lg" dir="ltr">
          {order.orderNumber}
        </h2>
        <span className="rounded-full bg-paper-deep px-3 py-1 text-xs text-ink-soft">
          {orderStatusLabels[order.status]}
        </span>
      </div>

      <div className="mt-6 rounded-2xl border border-line bg-cream divide-y divide-line">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-ink">{item.productName}</p>
              <p className="text-xs text-ink-soft">
                {weightLabel(item.weight)} × {item.quantity}
              </p>
            </div>
            <p className="text-sm text-ink">
              {formatToman(item.unitPrice * item.quantity)}
            </p>
          </div>
        ))}
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-paper-deep/40 p-5 text-sm space-y-1.5">
        <div className="flex justify-between text-ink-soft">
          <span>جمع کالاها</span>
          <span>{formatToman(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>هزینه ارسال</span>
          <span>{order.shippingCost === 0 ? "رایگان" : formatToman(order.shippingCost)}</span>
        </div>
        <div className="flex justify-between font-bold text-ink pt-1.5 border-t border-line">
          <span>مبلغ نهایی</span>
          <span>{formatToman(order.total)}</span>
        </div>
      </div>

      <div className="mt-4 rounded-2xl border border-line bg-cream p-5 text-sm">
        <p className="font-semibold text-ink mb-1">آدرس تحویل</p>
        <p className="text-ink-soft">
          {order.province}، {order.city}، {order.addressLine}
        </p>
        <p className="text-ink-soft">
          تحویل‌گیرنده: {order.receiverName} — {order.receiverPhone}
        </p>
      </div>
    </div>
  );
}
