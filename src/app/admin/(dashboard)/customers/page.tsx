import { listCustomersForAdmin } from "@/server/repo/customers";

export default function AdminCustomersPage() {
  const customers = listCustomersForAdmin();

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-6">مشتریان</h1>
      <div className="rounded-2xl border border-line bg-cream overflow-hidden">
        <table className="w-full text-sm">
          <thead className="bg-paper-deep/50 text-ink-soft">
            <tr>
              <th className="p-3 text-right font-medium">نام</th>
              <th className="p-3 text-right font-medium">موبایل</th>
              <th className="p-3 text-right font-medium">تعداد سفارش</th>
              <th className="p-3 text-right font-medium">تاریخ عضویت</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {customers.map((c) => (
              <tr key={c.id}>
                <td className="p-3 text-ink">{c.name || "—"}</td>
                <td className="p-3 text-ink-soft" dir="ltr">{c.phone}</td>
                <td className="p-3 text-ink-soft">{c.orderCount}</td>
                <td className="p-3 text-xs text-ink-soft" dir="ltr">{c.createdAt}</td>
              </tr>
            ))}
          </tbody>
        </table>
        {customers.length === 0 && (
          <p className="p-6 text-center text-sm text-ink-soft">مشتری‌ای ثبت نشده است.</p>
        )}
      </div>
    </div>
  );
}
