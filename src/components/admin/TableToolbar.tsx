"use client";

import { useEffect, useRef, useState, useTransition } from "react";
import { usePathname, useRouter } from "next/navigation";
import { Loader2, Search, X } from "lucide-react";
import { DEFAULT_PER_PAGE, PER_PAGE_OPTIONS } from "@/lib/pagination";

export type ToolbarFilter = {
  key: string;
  label: string;
  value: string;
  options: { value: string; label: string }[];
};

type Props = {
  /** Current URL params (q, status, page, …) as parsed on the server. */
  params: Record<string, string>;
  placeholder: string;
  filters?: ToolbarFilter[];
  perPage: number;
};

const DEBOUNCE_MS = 350;

/**
 * URL-driven filter bar for admin tables. Every change rewrites the query
 * string (and resets to page 1); the server component re-renders with the
 * new results, so filters survive refresh, back/forward and sharing links.
 */
export default function TableToolbar({ params, placeholder, filters = [], perPage }: Props) {
  const router = useRouter();
  const pathname = usePathname();
  const [isPending, startTransition] = useTransition();

  const q = params.q ?? "";
  const [text, setText] = useState(q);
  const lastPushed = useRef(q);
  const timer = useRef<ReturnType<typeof setTimeout> | null>(null);

  // keep the box in sync when q changes from outside (back button, "clear")
  useEffect(() => {
    if (q !== lastPushed.current) {
      lastPushed.current = q;
      setText(q);
    }
  }, [q]);

  useEffect(() => () => {
    if (timer.current) clearTimeout(timer.current);
  }, []);

  const push = (patch: Record<string, string>) => {
    const next = new URLSearchParams(params);
    for (const [k, v] of Object.entries(patch)) {
      if (v) next.set(k, v);
      else next.delete(k);
    }
    next.delete("page");
    if (next.get("perPage") === String(DEFAULT_PER_PAGE)) next.delete("perPage");
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const onSearchChange = (value: string) => {
    setText(value);
    if (timer.current) clearTimeout(timer.current);
    timer.current = setTimeout(() => {
      lastPushed.current = value.trim();
      push({ q: value.trim() });
    }, DEBOUNCE_MS);
  };

  const clearAll = () => {
    if (timer.current) clearTimeout(timer.current);
    setText("");
    lastPushed.current = "";
    const next = new URLSearchParams();
    if (perPage !== DEFAULT_PER_PAGE) next.set("perPage", String(perPage));
    const qs = next.toString();
    startTransition(() => {
      router.replace(qs ? `${pathname}?${qs}` : pathname, { scroll: false });
    });
  };

  const hasActiveFilters = Boolean(q || text || filters.some((f) => f.value));

  const selectCls =
    "rounded-full border border-line bg-cream px-4 py-2.5 text-sm text-ink focus:border-coffee";

  return (
    <div className="mb-4 flex flex-col gap-3 lg:flex-row lg:items-center">
      <div className="relative flex-1">
        <Search
          size={16}
          className="pointer-events-none absolute right-4 top-1/2 -translate-y-1/2 text-ink-soft"
        />
        <input
          type="search"
          value={text}
          onChange={(e) => onSearchChange(e.target.value)}
          onKeyDown={(e) => {
            if (e.key === "Enter") {
              if (timer.current) clearTimeout(timer.current);
              lastPushed.current = text.trim();
              push({ q: text.trim() });
            }
          }}
          placeholder={placeholder}
          aria-label={placeholder}
          className="w-full rounded-full border border-line bg-cream py-2.5 pr-11 pl-10 text-sm text-ink placeholder:text-ink-soft/70 focus:border-coffee"
        />
        {isPending && (
          <Loader2
            size={16}
            className="absolute left-4 top-1/2 -translate-y-1/2 animate-spin text-ink-soft"
          />
        )}
      </div>

      <div className="flex flex-wrap items-center gap-2">
        {filters.map((f) => (
          <select
            key={f.key}
            value={f.value}
            onChange={(e) => push({ [f.key]: e.target.value })}
            aria-label={f.label}
            className={selectCls}
          >
            <option value="">{f.label}: همه</option>
            {f.options.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        ))}

        <select
          value={perPage}
          onChange={(e) => push({ perPage: e.target.value })}
          aria-label="تعداد در هر صفحه"
          className={`${selectCls} hidden sm:block`}
        >
          {PER_PAGE_OPTIONS.map((n) => (
            <option key={n} value={n}>
              {n.toLocaleString("fa-IR")} در صفحه
            </option>
          ))}
        </select>

        {hasActiveFilters && (
          <button
            onClick={clearAll}
            className="flex items-center gap-1 rounded-full px-3 py-2 text-sm text-coffee hover:text-coffee-deep"
          >
            <X size={14} />
            حذف فیلترها
          </button>
        )}
      </div>
    </div>
  );
}
