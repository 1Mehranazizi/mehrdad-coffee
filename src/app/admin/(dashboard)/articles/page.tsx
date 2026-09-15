import Link from "next/link";
import { Pencil, Plus } from "lucide-react";
import { listAllArticlesForAdmin } from "@/server/repo/articles";
import DeleteButton from "@/components/admin/DeleteButton";

export default function AdminArticlesPage() {
  const articles = listAllArticlesForAdmin();

  return (
    <div>
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-extrabold text-ink">مقالات</h1>
        <Link
          href="/admin/articles/new"
          className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors"
        >
          <Plus size={16} />
          مقاله جدید
        </Link>
      </div>

      <div className="rounded-2xl border border-line bg-cream divide-y divide-line">
        {articles.map((a) => (
          <div key={a.id} className="flex items-center justify-between p-4">
            <div>
              <p className="font-medium text-ink">{a.title}</p>
              <p className="text-xs text-ink-soft">
                {a.published ? "منتشر شده" : "پیش‌نویس"}
              </p>
            </div>
            <div className="flex gap-1">
              <Link
                href={`/admin/articles/${a.id}/edit`}
                className="p-2 rounded-full hover:bg-paper-deep text-ink-soft hover:text-ink"
              >
                <Pencil size={16} />
              </Link>
              <DeleteButton endpoint={`/api/admin/articles/${a.id}`} />
            </div>
          </div>
        ))}
        {articles.length === 0 && (
          <p className="p-6 text-center text-sm text-ink-soft">مقاله‌ای ثبت نشده است.</p>
        )}
      </div>
    </div>
  );
}
