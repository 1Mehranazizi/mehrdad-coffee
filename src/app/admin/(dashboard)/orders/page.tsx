import Link from "next/link";
import { queryOrdersForAdmin, countOrdersByStatus, isOrderStatus } from "@/server/repo/orders";
import { formatToman } from "@/lib/products";
import { formatDateTime } from "@/lib/format-date";
import { ORDER_STATUSES, orderStatusLabels } from "@/lib/order-status";
import { firstParam, parsePaging } from "@/lib/pagination";
import TableToolbar from "@/components/admin/TableToolbar";
import Pagination from "@/components/Pagination";
import OrderStatusSelect from "@/components/admin/OrderStatusSelect";
import OrderQuickView from "@/components/admin/OrderQuickView";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminOrdersPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const statusParam = firstParam(sp.status);
  const status = isOrderStatus(statusParam) ? statusParam : undefined;
  const { page, perPage } = parsePaging(sp);

  const result = queryOrdersForAdmin({ q, status, page, perPage });
  const counts = countOrdersByStatus();
  const allCount = ORDER_STATUSES.reduce((sum, s) => sum + counts[s], 0);

  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (status) params.status = status;
  if (perPage !== 10) params.perPage = String(perPage);

  const tabHref = (value?: string) => {
    const qs = new URLSearchParams();
    if (q) qs.set("q", q);
    if (value) qs.set("status", value);
    if (perPage !== 10) qs.set("perPage", String(perPage));
    const s = qs.toString();
    return s ? `/admin/orders?${s}` : "/admin/orders";
  };

  const tabs = [
    { value: undefined, label: "همه", count: allCount },
    ...ORDER_STATUSES.map((s) => ({ value: s as string, label: orderStatusLabels[s], count: counts[s] })),
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-6">سفارش‌ها</h1>

      <div className="-mx-5 mb-4 flex gap-2 overflow-x-auto px-5 pb-1 md:mx-0 md:flex-wrap md:px-0" role="tablist">
        {tabs.map((t) => {
          const active = (t.value ?? "") === (status ?? "");
          return (
            <Link
              key={t.label}
              href={tabHref(t.value)}
              role="tab"
              aria-selected={active}
              className={`flex shrink-0 items-center gap-1.5 rounded-full border px-4 py-2 text-sm transition-colors ${
                active
                  ? "border-ink bg-ink font-semibold text-cream"
                  : "border-line bg-cream text-ink-soft hover:border-coffee"
              }`}
            >
              {t.label}
              <span className={`text-xs ${active ? "text-cream/80" : "text-ink-soft/70"}`}>
                {t.count.toLocaleString("fa-IR")}
              </span>
            </Link>
          );
        })}
      </div>

      <TableToolbar
        params={params}
        perPage={perPage}
        placeholder="جستجو: شماره سفارش، نام یا موبایل"
      />

      {/* desktop table */}
      <div className="hidden md:block rounded-2xl border border-line bg-cream overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-paper-deep/50 text-ink-soft">
            <tr>
              <th className="p-3 text-right font-medium">شماره سفارش</th>
              <th className="p-3 text-right font-medium">مشتری / گیرنده</th>
              <th className="p-3 text-right font-medium">مبلغ</th>
              <th className="p-3 text-right font-medium">وضعیت</th>
              <th className="p-3 text-right font-medium">تاریخ</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {result.items.map((order) => (
              <tr key={order.id}>
                <td className="p-3">
                  <Link
                    href={`/admin/orders/${order.id}`}
                    className="font-medium text-ink hover:text-coffee"
                    dir="ltr"
                  >
                    {order.orderNumber}
                  </Link>
                  <p className="text-xs text-ink-soft">
                    {order.itemCount.toLocaleString("fa-IR")} کالا
                  </p>
                </td>
                <td className="p-3">
                  <p className="text-ink">{order.receiverName}</p>
                  <p className="text-xs text-ink-soft" dir="ltr">
                    {order.customerPhone}
                  </p>
                </td>
                <td className="p-3 text-ink whitespace-nowrap">{formatToman(order.total)}</td>
                <td className="p-3">
                  <OrderStatusSelect orderId={order.id} currentStatus={order.status} compact />
                </td>
                <td className="p-3 text-xs text-ink-soft whitespace-nowrap">
                  {formatDateTime(order.createdAt)}
                </td>
                <td className="p-3">
                  <div className="flex justify-end">
                    <OrderQuickView orderId={order.id} orderNumber={order.orderNumber} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className="md:hidden space-y-3">
        {result.items.map((order) => (
          <div key={order.id} className="rounded-2xl border border-line bg-cream p-4">
            <div className="flex items-start justify-between gap-3">
              <div>
                <Link
                  href={`/admin/orders/${order.id}`}
                  className="font-semibold text-ink hover:text-coffee"
                  dir="ltr"
                >
                  {order.orderNumber}
                </Link>
                <p className="mt-0.5 text-xs text-ink-soft">{formatDateTime(order.createdAt)}</p>
              </div>
              <p className="text-sm font-semibold text-ink">{formatToman(order.total)}</p>
            </div>
            <p className="mt-2 text-sm text-ink-soft">
              {order.receiverName} ·{" "}
              <span dir="ltr">{order.customerPhone}</span>
            </p>
            <div className="mt-3 flex items-center justify-between gap-2">
              <OrderStatusSelect orderId={order.id} currentStatus={order.status} compact />
              <OrderQuickView orderId={order.id} orderNumber={order.orderNumber} />
            </div>
          </div>
        ))}
      </div>

      {result.items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-soft">
          {q || status ? "سفارشی با این فیلترها پیدا نشد." : "سفارشی ثبت نشده است."}
        </p>
      )}

      <Pagination
        basePath="/admin/orders"
        params={params}
        page={result.page}
        perPage={result.perPage}
        total={result.total}
        totalPages={result.totalPages}
      />
    </div>
  );
}
