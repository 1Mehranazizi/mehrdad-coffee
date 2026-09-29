"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ChevronDown, Search, Check } from "lucide-react";

const norm = (v: string) =>
  v.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/[\u200c\s]+/g, "").toLowerCase();

export default function SearchableSelect({
  value,
  options,
  onChange,
  placeholder,
  searchPlaceholder = "جستجو...",
  disabled = false,
}: {
  value: string;
  options: string[];
  onChange: (value: string) => void;
  placeholder: string;
  searchPlaceholder?: string;
  disabled?: boolean;
}) {
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const rootRef = useRef<HTMLDivElement>(null);
  const searchRef = useRef<HTMLInputElement>(null);

  const filtered = useMemo(() => {
    const q = norm(query);
    return q ? options.filter((o) => norm(o).includes(q)) : options;
  }, [options, query]);

  useEffect(() => {
    if (!open) return;
    const onDown = (e: MouseEvent | TouchEvent) => {
      if (!rootRef.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    document.addEventListener("mousedown", onDown);
    document.addEventListener("touchstart", onDown);
    document.addEventListener("keydown", onKey);
    searchRef.current?.focus();
    return () => {
      document.removeEventListener("mousedown", onDown);
      document.removeEventListener("touchstart", onDown);
      document.removeEventListener("keydown", onKey);
    };
  }, [open]);

  const close = () => {
    setOpen(false);
    setQuery("");
  };

  return (
    <div ref={rootRef} className="relative">
      <button
        type="button"
        disabled={disabled}
        onClick={() => (open ? close() : setOpen(true))}
        className="flex w-full items-center justify-between gap-2 rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-right focus:border-coffee disabled:cursor-not-allowed disabled:opacity-50"
      >
        <span className={value ? "text-ink" : "text-ink-soft"}>{value || placeholder}</span>
        <ChevronDown
          size={16}
          className={`shrink-0 text-ink-soft transition-transform ${open ? "rotate-180" : ""}`}
        />
      </button>

      {open && (
        <div className="absolute z-50 mt-1 w-full overflow-hidden rounded-xl border border-line bg-cream shadow-lg">
          <div className="flex items-center gap-2 border-b border-line px-3 py-2">
            <Search size={15} className="shrink-0 text-ink-soft" />
            <input
              ref={searchRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={searchPlaceholder}
              className="w-full bg-transparent text-sm outline-none"
            />
          </div>
          <ul role="listbox" className="max-h-56 overflow-y-auto py-1">
            {filtered.length === 0 && (
              <li className="px-4 py-3 text-sm text-ink-soft">موردی پیدا نشد</li>
            )}
            {filtered.map((opt) => (
              <li key={opt}>
                <button
                  type="button"
                  role="option"
                  aria-selected={opt === value}
                  onClick={() => {
                    onChange(opt);
                    close();
                  }}
                  className={`flex w-full items-center justify-between px-4 py-2 text-sm text-right hover:bg-paper-deep ${
                    opt === value ? "bg-paper-deep/60 font-semibold" : ""
                  }`}
                >
                  {opt}
                  {opt === value && <Check size={14} className="text-coffee" />}
                </button>
              </li>
            ))}
          </ul>
        </div>
      )}
    </div>
  );
}
