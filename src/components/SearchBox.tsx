"use client";

import { useEffect, useRef, useState } from "react";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";
import { formatToman } from "@/lib/products";
import { SunburstMark } from "@/components/icons";

type ResultProduct = {
  slug: string;
  name: string;
  origin: string;
  imageUrl: string | null;
  minPrice: number;
};

export default function SearchBox() {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [query, setQuery] = useState("");
  const [results, setResults] = useState<ResultProduct[]>([]);
  const [loading, setLoading] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) inputRef.current?.focus();
  }, [open]);

  useEffect(() => {
    function onClickOutside(e: MouseEvent) {
      if (containerRef.current && !containerRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }
    document.addEventListener("mousedown", onClickOutside);
    return () => document.removeEventListener("mousedown", onClickOutside);
  }, []);

  useEffect(() => {
    if (query.trim().length < 2) {
      setResults([]);
      return;
    }
    setLoading(true);
    const timeout = setTimeout(() => {
      fetch(`/api/search?q=${encodeURIComponent(query.trim())}`)
        .then((r) => r.json())
        .then((data) => setResults(data.products || []))
        .finally(() => setLoading(false));
    }, 300);
    return () => clearTimeout(timeout);
  }, [query]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    setOpen(false);
    router.push(`/search?q=${encodeURIComponent(query.trim())}`);
  };

  return (
    <div ref={containerRef} className="relative">
      <button
        aria-label="جستجو"
        onClick={() => setOpen((v) => !v)}
        className="p-2 rounded-full text-ink hover:bg-paper-deep transition-colors"
      >
        {open ? <X size={20} strokeWidth={1.75} /> : <Search size={20} strokeWidth={1.75} />}
      </button>

      {open && (
        <div className="absolute left-0 top-full mt-2 w-80 max-w-[90vw] rounded-2xl border border-line bg-cream shadow-lg overflow-hidden">
          <form onSubmit={handleSubmit} className="p-3 border-b border-line">
            <input
              ref={inputRef}
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder="جستجوی محصول..."
              className="w-full rounded-full border border-line bg-paper px-4 py-2 text-sm focus:border-coffee"
            />
          </form>

          {loading && (
            <p className="p-4 text-sm text-ink-soft text-center">در حال جستجو...</p>
          )}

          {!loading && query.trim().length >= 2 && results.length === 0 && (
            <p className="p-4 text-sm text-ink-soft text-center">نتیجه‌ای پیدا نشد.</p>
          )}

          {!loading && results.length > 0 && (
            <ul className="max-h-80 overflow-y-auto divide-y divide-line">
              {results.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/shop/${p.slug}`}
                    onClick={() => setOpen(false)}
                    className="flex items-center gap-3 p-3 hover:bg-paper-deep/50 transition-colors"
                  >
                    <div className="relative h-11 w-11 shrink-0 rounded-lg bg-ink flex items-center justify-center overflow-hidden">
                      {p.imageUrl ? (
                        <Image src={p.imageUrl} alt="" fill className="object-cover" />
                      ) : (
                        <SunburstMark className="h-6 w-6 text-cream/90" />
                      )}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-sm font-medium text-ink truncate">{p.name}</p>
                      <p className="text-xs text-ink-soft">از {formatToman(p.minPrice)}</p>
                    </div>
                  </Link>
                </li>
              ))}
            </ul>
          )}
        </div>
      )}
    </div>
  );
}
