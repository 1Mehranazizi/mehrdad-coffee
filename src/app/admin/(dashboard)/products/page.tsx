import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { queryProductsForAdmin } from "@/server/repo/products";
import { listCategories } from "@/server/repo/categories";
import { formatToman } from "@/lib/products";
import { firstParam, parsePaging } from "@/lib/pagination";
import DeleteButton from "@/components/admin/DeleteButton";
import TableToolbar from "@/components/admin/TableToolbar";
import Pagination from "@/components/Pagination";

type SearchParams = Promise<Record<string, string | string[] | undefined>>;

function StatusBadge({ published }: { published: boolean }) {
  return (
    <span
      className={`rounded-full px-2.5 py-1 text-xs ${
        published ? "bg-coffee/10 text-coffee-deep" : "bg-paper-deep text-ink-soft"
      }`}
    >
      {published ? "منتشر شده" : "پیش‌نویس"}
    </span>
  );
}

function Thumb({ url }: { url: string | null }) {
  return url ? (
    <Image src={url} alt="" width={36} height={36} className="h-9 w-9 shrink-0 rounded-lg object-cover" />
  ) : (
    <div className="h-9 w-9 shrink-0 rounded-lg bg-ink" />
  );
}

export default async function AdminProductsPage({ searchParams }: { searchParams: SearchParams }) {
  const sp = await searchParams;
  const q = firstParam(sp.q);
  const category = firstParam(sp.category);
  const statusParam = firstParam(sp.status);
  const status = statusParam === "published" || statusParam === "draft" ? statusParam : undefined;
  const { page, perPage } = parsePaging(sp);

  const categories = listCategories();
  const categoryId = categories.find((c) => c.id === category)?.id;
  const categoryTitle = new Map(categories.map((c) => [c.id, c.title]));

  const result = queryProductsForAdmin({ q, categoryId, status, page, perPage });

  const params: Record<string, string> = {};
  if (q) params.q = q;
  if (categoryId) params.category = categoryId;
  if (status) params.status = status;
  if (perPage !== 10) params.perPage = String(perPage);

  return (
    <div>
      <div className="flex items-center justify-between gap-3 mb-6">
        <h1 className="text-2xl font-extrabold text-ink">محصولات</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors"
        >
          <Plus size={16} />
          محصول جدید
        </Link>
      </div>

      <TableToolbar
        params={params}
        perPage={perPage}
        placeholder="جستجو: نام یا مبدأ محصول"
        filters={[
          {
            key: "category",
            label: "دسته‌بندی",
            value: categoryId ?? "",
            options: categories.map((c) => ({ value: c.id, label: c.title })),
          },
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

      {/* desktop table */}
      <div className="hidden md:block rounded-2xl border border-line bg-cream overflow-x-auto">
        <table className="w-full text-sm">
          <thead className="bg-paper-deep/50 text-ink-soft">
            <tr>
              <th className="p-3 text-right font-medium">محصول</th>
              <th className="p-3 text-right font-medium">دسته‌بندی</th>
              <th className="p-3 text-right font-medium">قیمت</th>
              <th className="p-3 text-right font-medium">وضعیت</th>
              <th className="p-3"></th>
            </tr>
          </thead>
          <tbody className="divide-y divide-line">
            {result.items.map((p) => (
              <tr key={p.id}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    <Thumb url={p.imageUrl} />
                    <div>
                      <p className="font-medium text-ink">{p.name}</p>
                      <p className="text-xs text-ink-soft">
                        {p.variants.length.toLocaleString("fa-IR")} گزینه
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-ink-soft">{categoryTitle.get(p.categoryId)}</td>
                <td className="p-3 text-ink whitespace-nowrap">از {formatToman(p.minPrice)}</td>
                <td className="p-3">
                  <StatusBadge published={p.published} />
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
                      aria-label="ویرایش"
                      className="p-2 rounded-full hover:bg-paper-deep text-ink-soft hover:text-ink"
                    >
                      <Pencil size={16} />
                    </Link>
                    <DeleteButton endpoint={`/api/admin/products/${p.id}`} />
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* mobile cards */}
      <div className="md:hidden space-y-3">
        {result.items.map((p) => (
          <div key={p.id} className="flex items-center gap-3 rounded-2xl border border-line bg-cream p-4">
            <Thumb url={p.imageUrl} />
            <div className="min-w-0 flex-1">
              <p className="truncate font-medium text-ink">{p.name}</p>
              <p className="text-xs text-ink-soft">
                {categoryTitle.get(p.categoryId)} · از {formatToman(p.minPrice)}
              </p>
              <div className="mt-1.5">
                <StatusBadge published={p.published} />
              </div>
            </div>
            <div className="flex shrink-0">
              <Link
                href={`/admin/products/${p.id}/edit`}
                aria-label="ویرایش"
                className="p-2 rounded-full hover:bg-paper-deep text-ink-soft hover:text-ink"
              >
                <Pencil size={16} />
              </Link>
              <DeleteButton endpoint={`/api/admin/products/${p.id}`} />
            </div>
          </div>
        ))}
      </div>

      {result.items.length === 0 && (
        <p className="rounded-2xl border border-dashed border-line p-8 text-center text-sm text-ink-soft">
          {q || categoryId || status ? "محصولی با این فیلترها پیدا نشد." : "محصولی ثبت نشده است."}
        </p>
      )}

      <Pagination
        basePath="/admin/products"
        params={params}
        page={result.page}
        perPage={result.perPage}
        total={result.total}
        totalPages={result.totalPages}
      />
    </div>
  );
}
