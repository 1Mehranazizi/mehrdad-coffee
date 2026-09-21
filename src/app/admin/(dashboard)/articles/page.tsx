import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { queryArticlesForAdmin } from "@/server/repo/articles";
import { formatDate } from "@/lib/format-date";
import { firstParam, parsePaging } from "@/lib/pagination";
import DeleteButton from "@/components/admin/DeleteButton";
import TableToolbar from "@/components/admin/TableToolbar";
import Pagination from "@/components/Pagination";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

export default async function AdminArticlesPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const statusParam = firstParam(sp.status);
  const status = statusParam === "published" || statusParam === "draft" ? statusParam : undefined;
  const { page, perPage } = parsePaging(sp);

  const result = queryArticlesForAdmin({ q, status, page, perPage });

  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (status) params.status = status;
  if (perPage !== 10) params.perPage = String(perPage);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-extrabold text-ink">مقالات</h1>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors"
        >
          <Plus size={16} />
          مقاله جدید
        </Link>
      </div>

      <TableToolbar
        params={params}
        perPage={perPage}
        placeholder="جستجو: عنوان یا خلاصه مقاله"
        filters={[
          {
            key: "status",
            label: "وضعیت",
            value: status ?? "",
            options: [
              { value: "published", label: "منتشر شده" },
              { value: "draft", label: "پیش‌نویس" },
            ],
          },
        ]}
      />

      <div className="rounded-2xl border border-line bg-cream divide-y divide-line">
        {result.items.map((a) => (
          <div key={a.id} className="flex items-center justify-between gap-3 p-4">
            <div className="min-w-0">
              <p className="truncate font-medium text-ink">{a.title}</p>
              <p className="text-xs text-ink-soft">
                {a.published ? "منتشر شده" : "پیش‌نویس"} · {formatDate(a.createdAt)}
              </p>
            </div>
            <div className="flex shrink-0 gap-1">
              <Link
                href={`/admin/articles/${a.id}/edit`}
                aria-label="ویرایش"
                className="p-2 rounded-full hover:bg-paper-deep text-ink-soft hover:text-ink"
              >
                <Pencil size={16} />
              </Link>
              <DeleteButton endpoint={`/api/admin/articles/${a.id}`} />
            </div>
          </div>
        ))}
        {result.items.length === 0 && (
          <p className="p-6 text-center text-sm text-ink-soft">
            {q || status ? "مقاله‌ای با این فیلترها پیدا نشد." : "مقاله‌ای ثبت نشده است."}
          </p>
        )}
      </div>

      <Pagination
        basePath="/admin/articles"
        params={params}
        page={result.page}
        perPage={result.perPage}
        total={result.total}
        totalPages={result.totalPages}
      />
    </div>
  );
}
