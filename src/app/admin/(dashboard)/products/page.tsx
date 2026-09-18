import Link from "next/link";
import Image from "next/image";
import { Pencil, Plus } from "lucide-react";
import { getAllProductsForAdmin } from "@/server/repo/products";
import { listCategories } from "@/server/repo/categories";
import { formatToman } from "@/lib/products";
import DeleteButton from "@/components/admin/DeleteButton";

export default function AdminProductsPage() {
  const products = getAllProductsForAdmin();
  const categories = listCategories();
  const categoryTitle = new Map(categories.map((c) => [c.id, c.title]));

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-ink">محصولات</h1>
        <Link
          href="/admin/products/new"
          className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors"
        >
          <Plus size={16} />
          محصول جدید
        </Link>
      </div>

      <div className="rounded-2xl border border-line bg-cream overflow-hidden">
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
            {products.map((p) => (
              <tr key={p.id}>
                <td className="p-3">
                  <div className="flex items-center gap-3">
                    {p.imageUrl ? (
                      <Image
                        src={p.imageUrl}
                        alt=""
                        width={36}
                        height={36}
                        className="rounded-lg object-cover"
                      />
                    ) : (
                      <div className="h-9 w-9 rounded-lg bg-ink" />
                    )}
                    <div>
                      <p className="font-medium text-ink">{p.name}</p>
                      <p className="text-xs text-ink-soft">
                        {p.variants.length} گزینه
                      </p>
                    </div>
                  </div>
                </td>
                <td className="p-3 text-ink-soft">{categoryTitle.get(p.categoryId)}</td>
                <td className="p-3 text-ink">
                  از {formatToman(p.minPrice)}
                </td>
                <td className="p-3">
                  <span
                    className={`rounded-full px-2.5 py-1 text-xs ${
                      p.published
                        ? "bg-coffee/10 text-coffee-deep"
                        : "bg-paper-deep text-ink-soft"
                    }`}
                  >
                    {p.published ? "منتشر شده" : "پیش‌نویس"}
                  </span>
                </td>
                <td className="p-3">
                  <div className="flex justify-end gap-1">
                    <Link
                      href={`/admin/products/${p.id}/edit`}
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
        {products.length === 0 && (
          <p className="p-6 text-center text-sm text-ink-soft">محصولی ثبت نشده است.</p>
        )}
      </div>
    </div>
  );
}
