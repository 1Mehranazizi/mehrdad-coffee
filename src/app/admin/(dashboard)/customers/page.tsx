import { queryCustomersForAdmin } from "@/server/repo/customers";
import { formatDate } from "@/lib/format-date";
import { firstParam, parsePaging } from "@/lib/pagination";
import TableToolbar from "@/components/admin/TableToolbar";
import Pagination from "@/components/Pagination";
import { AddCustomerButton, EditCustomerButton } from "@/components/admin/CustomerActions";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminCustomersPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const { page, perPage } = parsePaging(sp);

  const result = queryCustomersForAdmin({ q, page, perPage });

  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (perPage !== 10) params.perPage = String(perPage);

  return (
    <div>
      <div className="mb-6 flex items-center justify-between gap-3">
        <h1 className="text-2xl font-extrabold text-ink">مشتریان</h1>
        <AddCustomerButton />
      </div>

      <TableToolbar params={params} perPage={perPage} placeholder="جستجو: نام یا شماره موبایل" />

      {/* desktop table */}
      <div className="hidden md:block rounded-2xl border border-line bg-cream overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-paper-deep/50 text-ink-soft">
            <tr>
              <th className="p-3 text-right font-medium">نام</th>
              <th className="p-3 text-right font-medium">موبایل</th>
              <th className="p-3 text-right font-medium">نوع</th>
              <th className="p-3 text-right font-medium">تعداد سفارش</th>
              <th className="p-3 text-right font-medium">تاریخ عضویت</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {result.items.map((c) => (
              <tr key={c.id}>
                <td className="p-3 text-ink">{c.name || "—"}</td>
                <td className="p-3 text-ink-soft" dir="ltr">
                  <span className="block text-right">{c.phone}</span>
                </td>
                <td className="p-3">
                  {c.type === "partner" ? (
                    <span className="rounded-full bg-coffee px-2.5 py-0.5 text-xs text-cream">همکار</span>
                  ) : (
                    <span className="text-xs text-ink-soft">عادی</span>
                  )}
                </td>
                <td className="p-3 text-ink-soft">{c.orderCount.toLocaleString("fa-IR")}</td>
                <td className="p-3 text-xs text-ink-soft">{formatDate(c.createdAt)}</td>
                <td className="p-3">
                  <div className="flex justify-end">
                    <EditCustomerButton customer={{ id: c.id, name: c.name, phone: c.phone }} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className="md:hidden space-y-3">
        {result.items.map((c) => (
          <div
            key={c.id}
            className="flex items-center justify-between gap-3 rounded-2xl border border-line bg-cream p-4"
          >
            <div className="min-w-0">
              <p className="font-medium text-ink">
                {c.name || "بدون نام"}
                {c.type === "partner" && (
                  <span className="mr-2 rounded-full bg-coffee px-2 py-0.5 text-xs text-cream">همکار</span>
                )}
              </p>
              <p className="mt-0.5 text-sm text-ink-soft" dir="ltr" style={{ textAlign: "right" }}>
                {c.phone}
              </p>
              <p className="mt-1 text-xs text-ink-soft">
                {c.orderCount.toLocaleString("fa-IR")} سفارش · عضو از {formatDate(c.createdAt)}
              </p>
            </div>
            <EditCustomerButton customer={{ id: c.id, name: c.name, phone: c.phone }} />
          </div>
        ))}
      </div>

      {result.items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-soft">
          {q ? "مشتری‌ای با این جستجو پیدا نشد." : "مشتری‌ای ثبت نشده است."}
        </p>
      )}

      <Pagination
        basePath="/admin/customers"
        params={params}
        page={result.page}
        perPage={result.perPage}
        total={result.total}
        totalPages={result.totalPages}
      />
    </div>
  );
}
