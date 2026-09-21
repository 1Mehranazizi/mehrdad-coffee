import Link from "next/link";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DEFAULT_PER_PAGE } from "@/lib/pagination";

type Props = {
  basePath: string;
  /** current filters (q, status, …) — preserved on every page link */
  params: Record<string, string>;
  page: number;
  perPage: number;
  total: number;
  totalPages: number;
  /** page size that needs no ?perPage= in the URL (defaults to the admin default) */
  defaultPerPage?: number;
};

const fa = (n: number) => n.toLocaleString("fa-IR");

function pageWindow(page: number, totalPages: number): (number | "…")[] {
  if (totalPages <= 7) return Array.from({ length: totalPages }, (_, i) => i + 1);
  const pages = new Set([1, totalPages, page - 1, page, page + 1]);
  if (page <= 3) [2, 3, 4].forEach((p) => pages.add(p));
  if (page >= totalPages - 2) [totalPages - 3, totalPages - 2, totalPages - 1].forEach((p) => pages.add(p));
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out: (number | "…")[] = [];
  sorted.forEach((p, i) => {
    if (i > 0 && p - sorted[i - 1] > 1) out.push("…");
    out.push(p);
  });
  return out;
}

export default function Pagination({
  basePath,
  params,
  page,
  perPage,
  total,
  totalPages,
  defaultPerPage = DEFAULT_PER_PAGE,
}: Props) {
  if (total === 0) return null;

  const href = (p: number) => {
    const qs = new URLSearchParams(params);
    qs.delete("page");
    if (perPage !== defaultPerPage) qs.set("perPage", String(perPage));
    else qs.delete("perPage");
    if (p > 1) qs.set("page", String(p));
    const s = qs.toString();
    return s ? `${basePath}?${s}` : basePath;
  };

  const from = (page - 1) * perPage + 1;
  const to = Math.min(page * perPage, total);

  const btn =
    "flex h-9 min-w-9 items-center justify-center rounded-full border px-3 text-sm transition-colors";

  return (
    <div className="mt-4 flex flex-col items-center gap-3 sm:flex-row sm:justify-between">
      <p className="text-xs text-ink-soft">
        نمایش {fa(from)} تا {fa(to)} از {fa(total)}
      </p>

      {totalPages > 1 && (
        <nav aria-label="صفحه‌بندی" className="flex items-center gap-1.5">
          {page > 1 ? (
            <Link href={href(page - 1)} aria-label="صفحه قبل" className={`${btn} border-line bg-cream text-ink hover:border-coffee`}>
              <ChevronRight size={16} />
            </Link>
          ) : (
            <span className={`${btn} border-line/60 text-ink-soft/40`} aria-hidden="true">
              <ChevronRight size={16} />
            </span>
          )}

          {pageWindow(page, totalPages).map((p, i) =>
            p === "…" ? (
              <span key={`gap-${i}`} className="px-1 text-ink-soft">
                …
              </span>
            ) : p === page ? (
              <span key={p} aria-current="page" className={`${btn} border-ink bg-ink font-semibold text-cream`}>
                {fa(p)}
              </span>
            ) : (
              <Link key={p} href={href(p)} className={`${btn} border-line bg-cream text-ink hover:border-coffee`}>
                {fa(p)}
              </Link>
            )
          )}

          {page < totalPages ? (
            <Link href={href(page + 1)} aria-label="صفحه بعد" className={`${btn} border-line bg-cream text-ink hover:border-coffee`}>
              <ChevronLeft size={16} />
            </Link>
          ) : (
            <span className={`${btn} border-line/60 text-ink-soft/40`} aria-hidden="true">
              <ChevronLeft size={16} />
            </span>
          )}
        </nav>
      )}
    </div>
  );
}
