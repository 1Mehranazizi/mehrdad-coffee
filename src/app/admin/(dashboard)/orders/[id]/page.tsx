import { notFound } from "next/navigation";
import { getOrderById } from "@/server/repo/orders";
import { formatToman, weightLabel } from "@/lib/products";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";

export default async function AdminOrderDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const order = getOrderById(id);
  if (!order) notFound();

  return (
    <div className="max-w-2xl">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-ink" dir="ltr">
          {order.orderNumber}
        </h1>
        <OrderStatusSelect orderId={order.id} currentStatus={order.status} />
      </div>

      <div className="rounded-2xl border border-line bg-cream divide-y divide-line">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between p-4 text-sm">
            <div>
              <p className="font-medium text-ink">{item.productName}</p>
              <p className="text-xs text-ink-soft">
                {weightLabel(item.weight)}{item.grind ? ` · ${item.grind}` : ""} × {item.quantity}
              </p>
            </div>
            <p className="text-ink">{formatToman(item.unitPrice * item.quantity)}</p>
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
        {order.paymentRefId && (
          <p className="pt-1.5 text-xs text-ink-soft" dir="ltr">
            Ref ID: {order.paymentRefId}
          </p>
        )}
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
