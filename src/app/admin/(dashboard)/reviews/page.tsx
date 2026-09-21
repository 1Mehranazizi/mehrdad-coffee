import { queryReviewsForAdmin, countPendingReviews } from "@/server/repo/reviews";
import { firstParam, parsePaging } from "@/lib/pagination";
import ReviewModerationRow from "@/components/admin/ReviewModerationRow";
import TableToolbar from "@/components/admin/TableToolbar";
import Pagination from "@/components/Pagination";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminReviewsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const statusParam = firstParam(sp.status);
  const status = statusParam === "pending" || statusParam === "approved" ? statusParam : undefined;
  const ratingNum = Number(firstParam(sp.rating));
  const rating = Number.isInteger(ratingNum) && ratingNum >= 1 && ratingNum <= 5 ? ratingNum : undefined;
  const { page, perPage } = parsePaging(sp);

  const result = queryReviewsForAdmin({ q, status, rating, page, perPage });
  const pendingCount = countPendingReviews();

  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (status) params.status = status;
  if (rating) params.rating = String(rating);
  if (perPage !== 10) params.perPage = String(perPage);

  return (
    <div>
      <div className="mb-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
        <h1 className="text-2xl font-extrabold text-ink">نظرات مشتریان</h1>
        <p className="text-sm text-ink-soft">
          {pendingCount.toLocaleString("fa-IR")} نظر در انتظار تایید
        </p>
      </div>

      <TableToolbar
        params={params}
        perPage={perPage}
        placeholder="جستجو: متن نظر، محصول یا مشتری"
        filters={[
          {
            key: "status",
            label: "وضعیت",
            value: status ?? "",
            options: [
              { value: "pending", label: "در انتظار تایید" },
              { value: "approved", label: "تایید شده" },
            ],
          },
          {
            key: "rating",
            label: "امتیاز",
            value: rating ? String(rating) : "",
            options: [5, 4, 3, 2, 1].map((n) => ({
              value: String(n),
              label: `${n.toLocaleString("fa-IR")} ستاره`,
            })),
          },
        ]}
      />

      <div className="space-y-3">
        {result.items.map((r) => (
          <ReviewModerationRow key={r.id} review={r} />
        ))}
        {result.items.length === 0 && (
          <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-soft">
            {q || status || rating ? "نظری با این فیلترها پیدا نشد." : "هنوز نظری ثبت نشده است."}
          </p>
        )}
      </div>

      <Pagination
        basePath="/admin/reviews"
        params={params}
        page={result.page}
        perPage={result.perPage}
        total={result.total}
        totalPages={result.totalPages}
      />
    </div>
  );
}
