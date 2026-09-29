import { queryApplicationsForAdmin, countPendingApplications } from "@/server/repo/partners";
import { formatDate } from "@/lib/format-date";
import { firstParam, parsePaging } from "@/lib/pagination";
import { PARTNER_STATUS_LABEL, type PartnerStatus } from "@/lib/partner";
import TableToolbar from "@/components/admin/TableToolbar";
import Pagination from "@/components/Pagination";
import PartnerReviewActions from "@/components/admin/PartnerReviewActions";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

const BADGE: Record<PartnerStatus, string> = {
  PENDING: "bg-amber-100 text-amber-900",
  APPROVED: "bg-emerald-100 text-emerald-900",
  REJECTED: "bg-red-100 text-red-900",
};

function Field({ label, value, ltr }: { label: string; value: string | null; ltr?: boolean }) {
  if (!value) return null;
  return (
    <div>
      <dt className="text-xs text-ink-soft">{label}</dt>
      <dd className="mt-0.5 text-sm text-ink" dir={ltr ? "ltr" : undefined} style={ltr ? { textAlign: "right" } : undefined}>
        {value}
      </dd>
    </div>
  );
}

export default async function AdminPartnersPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const statusRaw = firstParam(sp.status);
  const status = (["PENDING", "APPROVED", "REJECTED"] as const).find((s) => s === statusRaw);
  const { page, perPage } = parsePaging(sp);

  const result = queryApplicationsForAdmin({ q, status, page, perPage });
  const pending = countPendingApplications();

  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (status) params.status = status;
  if (perPage !== 10) params.perPage = String(perPage);

  return (
    <div>
      <div className="mb-6 flex items-center gap-3">
        <h1 className="text-2xl font-extrabold text-ink">درخواست‌های همکاری</h1>
        {pending > 0 && (
          <span className="rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-900">
            {pending.toLocaleString("fa-IR")} در انتظار بررسی
          </span>
        )}
      </div>

      <TableToolbar
        params={params}
        perPage={perPage}
        placeholder="جستجو: نام، کافه یا شماره موبایل"
        filters={[
          {
            key: "status",
            label: "وضعیت",
            value: status ?? "",
            options: (Object.keys(PARTNER_STATUS_LABEL) as PartnerStatus[]).map((s) => ({
              value: s,
              label: PARTNER_STATUS_LABEL[s],
            })),
          },
        ]}
      />

      <div className="space-y-4">
        {result.items.map((a) => (
          <div key={a.id} className="rounded-2xl border border-line bg-cream p-5">
            <div className="flex flex-wrap items-start justify-between gap-3">
              <div>
                <p className="font-bold text-ink">{a.cafeName}</p>
                <p className="mt-0.5 text-sm text-ink-soft">
                  {a.ownerName} ·{" "}
                  <span dir="ltr">{a.customerPhone}</span>
                </p>
              </div>
              <span className={`rounded-full px-3 py-1 text-xs font-semibold ${BADGE[a.status]}`}>
                {PARTNER_STATUS_LABEL[a.status]}
              </span>
            </div>

            <dl className="mt-4 grid gap-x-6 gap-y-3 sm:grid-cols-2">
              <Field label="کد ملی" value={a.nationalCode} ltr />
              <Field label="تلفن کافه" value={a.cafePhone} ltr />
              <Field label="استان / شهر" value={`${a.province} / ${a.city}`} />
              <Field label="پروانه کسب" value={a.licenseNumber} ltr />
              <Field label="اینستاگرام" value={a.instagram ? `@${a.instagram}` : null} ltr />
              <Field label="تاریخ ثبت" value={formatDate(a.updatedAt)} />
              <div className="sm:col-span-2">
                <Field label="آدرس کافه" value={a.addressLine} />
              </div>
              {a.adminNote && (
                <div className="sm:col-span-2">
                  <Field label="یادداشت مدیریت" value={a.adminNote} />
                </div>
              )}
            </dl>

            <div className="mt-4 border-t border-line pt-4">
              <PartnerReviewActions id={a.id} status={a.status} />
            </div>
          </div>
        ))}
      </div>

      {result.items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-soft">
          درخواستی پیدا نشد.
        </p>
      )}

      <Pagination
        basePath="/admin/partners"
        params={params}
        page={result.page}
        perPage={result.perPage}
        total={result.total}
        totalPages={result.totalPages}
      />
    </div>
  );
}
