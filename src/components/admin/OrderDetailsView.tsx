import { Check } from "lucide-react";
import { formatToman, weightLabel } from "@/lib/products";
import { formatDateTime } from "@/lib/format-date";
import { orderStatusBadge, orderStatusLabels } from "@/lib/order-status";
import type { OrderDetail, OrderStatus } from "@/server/repo/orders";

const FLOW: OrderStatus[] = ["PENDING_PAYMENT", "PAID", "PROCESSING", "SHIPPED", "DELIVERED"];

function StatusFlow({ status }: { status: OrderStatus }) {
  if (status === "CANCELED") {
    return (
      <p className={`rounded-xl px-4 py-3 text-sm font-medium ${orderStatusBadge.CANCELED}`}>
        این سفارش لغو شده است.
      </p>
    );
  }
  const currentIndex = FLOW.indexOf(status);
  return (
    <ol className="flex items-start" aria-label="روند سفارش">
      {FLOW.map((step, i) => {
        const done = i <= currentIndex;
        return (
          <li key={step} className="relative flex flex-1 flex-col items-center gap-1.5 text-center">
            {i > 0 && (
              <span
                className={`absolute top-3 left-1/2 h-0.5 w-full ${
                  i <= currentIndex ? "bg-coffee" : "bg-line"
                }`}
              />
            )}
            <span
              className={`relative z-10 flex h-6 w-6 items-center justify-center rounded-full border-2 ${
                done ? "border-coffee bg-coffee text-cream" : "border-line bg-cream"
              }`}
            >
              {done && <Check size={12} strokeWidth={3} />}
            </span>
            <span className={`text-[10px] leading-4 sm:text-xs ${done ? "text-ink" : "text-ink-soft"}`}>
              {orderStatusLabels[step]}
            </span>
          </li>
        );
      })}
    </ol>
  );
}

function Row({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="flex items-start justify-between gap-4 py-1.5 text-sm">
      <dt className="shrink-0 text-ink-soft">{label}</dt>
      <dd className="text-left text-ink">{children}</dd>
    </div>
  );
}

/** Presentational (no hooks) — rendered both on the order page and in the list's quick-view dialog. */
export default function OrderDetailsView({ order }: { order: OrderDetail }) {
  return (
    <div className="space-y-4">
      <div className="rounded-2xl border border-line bg-cream p-5">
        <StatusFlow status={order.status} />
      </div>

      <div className="rounded-2xl border border-line bg-cream divide-y divide-line">
        {order.items.map((item) => (
          <div key={item.id} className="flex items-center justify-between gap-3 p-4 text-sm">
            <div className="min-w-0">
              <p className="font-medium text-ink">{item.productName}</p>
              <p className="text-xs text-ink-soft">
                {weightLabel(item.weight)}
                {item.grindTypeName ? ` — ${item.grindTypeName}` : ""} × {item.quantity.toLocaleString("fa-IR")}
              </p>
              <p className="text-xs text-ink-soft">
                قیمت واحد: {formatToman(item.unitPrice)}
              </p>
            </div>
            <p className="shrink-0 text-ink">{formatToman(item.unitPrice * item.quantity)}</p>
          </div>
        ))}
      </div>

      <div className="rounded-2xl border border-line bg-paper-deep/40 p-5 text-sm space-y-1.5">
        <div className="flex justify-between text-ink-soft">
          <span>جمع کالاها</span>
          <span>{formatToman(order.subtotal)}</span>
        </div>
        <div className="flex justify-between text-ink-soft">
          <span>هزینه ارسال</span>
          <span>{order.shippingCost === 0 ? "رایگان" : formatToman(order.shippingCost)}</span>
        </div>
        <div className="flex justify-between border-t border-line pt-1.5 font-bold text-ink">
          <span>مبلغ نهایی</span>
          <span>{formatToman(order.total)}</span>
        </div>
      </div>

      <div className="grid gap-4 md:grid-cols-2">
        <div className="rounded-2xl border border-line bg-cream p-5">
          <h3 className="mb-1 text-sm font-semibold text-ink">مشتری و تحویل‌گیرنده</h3>
          <dl>
            <Row label="مشتری">{order.customerName || "—"}</Row>
            <Row label="موبایل مشتری">
              <span dir="ltr">{order.customerPhone ?? "—"}</span>
            </Row>
            <Row label="تحویل‌گیرنده">{order.receiverName}</Row>
            <Row label="موبایل گیرنده">
              <span dir="ltr">{order.receiverPhone}</span>
            </Row>
          </dl>
        </div>

        <div className="rounded-2xl border border-line bg-cream p-5">
          <h3 className="mb-1 text-sm font-semibold text-ink">آدرس تحویل</h3>
          <p className="py-1.5 text-sm leading-7 text-ink-soft">
            {order.province}، {order.city}، {order.addressLine}
          </p>
          {order.postalCode && (
            <Row label="کد پستی">
              <span dir="ltr">{order.postalCode}</span>
            </Row>
          )}
        </div>
      </div>

      <div className="rounded-2xl border border-line bg-cream p-5">
        <h3 className="mb-1 text-sm font-semibold text-ink">پرداخت و زمان‌ها</h3>
        <dl>
          <Row label="ثبت سفارش">{formatDateTime(order.createdAt)}</Row>
          <Row label="پرداخت">{order.paidAt ? formatDateTime(order.paidAt) : "پرداخت نشده"}</Row>
          <Row label="آخرین تغییر">{formatDateTime(order.updatedAt)}</Row>
          {order.paymentRefId && (
            <Row label="کد پیگیری">
              <span dir="ltr">{order.paymentRefId}</span>
            </Row>
          )}
          {order.paymentAuthority && (
            <Row label="Authority">
              <span dir="ltr" className="break-all text-xs">
                {order.paymentAuthority}
              </span>
            </Row>
          )}
        </dl>
      </div>
    </div>
  );
}
