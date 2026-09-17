"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { sortOptions, type SortOption, type Weight } from "@/lib/products";
import type { Category } from "@/server/repo/categories";
import type { ProductCardData } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import FilterPanel from "@/components/shop/FilterPanel";

type Props = {
  products: ProductCardData[];
  categories: Category[];
  priceMin: number;
  priceMax: number;
  initialCategory?: string;
};

export default function ShopClient({
  products,
  categories,
  priceMin,
  priceMax,
  initialCategory,
}: Props) {
  const [selectedCategories, setSelectedCategories] = useState<Set<string>>(
    () => new Set(initialCategory ? [initialCategory] : [])
  );
  const [selectedWeights, setSelectedWeights] = useState<Set<Weight>>(
    () => new Set()
  );
  const [maxPrice, setMaxPrice] = useState<number>(priceMax);
  const [sortBy, setSortBy] = useState<SortOption>("default");
  const [mobileFiltersOpen, setMobileFiltersOpen] = useState(false);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
  };

  const toggleWeight = (weight: Weight) => {
    setSelectedWeights((prev) => {
      const next = new Set(prev);
      next.has(weight) ? next.delete(weight) : next.add(weight);
      return next;
    });
  };

  const resetFilters = () => {
    setSelectedCategories(new Set());
    setSelectedWeights(new Set());
    setMaxPrice(priceMax);
  };

  const activeFilterCount =
    selectedCategories.size +
    selectedWeights.size +
    (maxPrice < priceMax ? 1 : 0);

  const visibleProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(p.categorySlug ?? ""))
        return false;
      if (selectedWeights.size > 0 && !selectedWeights.has(p.weight as Weight))
        return false;
      if (p.price > maxPrice) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.price - b.price);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.price - a.price);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "fa"));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, selectedCategories, selectedWeights, maxPrice, sortBy]);

  const [page, setPage] = useState(1);
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => { setPage(1); }, [selectedCategories, selectedWeights, maxPrice, sortBy]);
  useEffect(() => {
    const node = sentinelRef.current;
    if (!node) return;
    const observer = new IntersectionObserver((entries) => {
      if (entries[0]?.isIntersecting) setPage((p) => Math.min(p + 1, Math.ceil(visibleProducts.length / 9)));
    }, { rootMargin: "300px" });
    observer.observe(node);
    return () => observer.disconnect();
  }, [visibleProducts.length]);
  const shownProducts = visibleProducts.slice(0, page * 9);

  const filterPanelProps = {
    categories,
    selectedCategories,
    onToggleCategory: toggleCategory,
    selectedWeights,
    onToggleWeight: toggleWeight,
    maxPrice,
    onMaxPriceChange: setMaxPrice,
    priceMin,
    priceMax,
    onReset: resetFilters,
  };

  return (
    <div className="mx-auto max-w-6xl px-4 py-10 md:py-14 grid md:grid-cols-[260px_1fr] gap-8">
      <aside className="hidden md:block h-fit sticky top-24">
        <FilterPanel {...filterPanelProps} />
      </aside>

      <div>
        <div className="flex items-center justify-between gap-3 mb-6">
          <button
            onClick={() => setMobileFiltersOpen(true)}
            className="md:hidden flex items-center gap-2 rounded-full border border-line bg-cream px-4 py-2 text-sm text-ink"
          >
            <SlidersHorizontal size={16} strokeWidth={1.75} />
            فیلترها
            {activeFilterCount > 0 && (
              <span className="flex h-5 w-5 items-center justify-center rounded-full bg-coffee text-[11px] text-cream">
                {activeFilterCount}
              </span>
            )}
          </button>

          <p className="text-sm text-ink-soft hidden md:block">
            {visibleProducts.length} محصول
          </p>

          <div className="flex items-center gap-2 mr-auto">
            <label htmlFor="sort" className="text-sm text-ink-soft hidden sm:inline">
              مرتب‌سازی:
            </label>
            <select
              id="sort"
              value={sortBy}
              onChange={(e) => setSortBy(e.target.value as SortOption)}
              className="rounded-full border border-line bg-cream px-4 py-2 text-sm text-ink focus:border-coffee"
            >
              {sortOptions.map((opt) => (
                <option key={opt.value} value={opt.value}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        <p className="text-sm text-ink-soft mb-6 md:hidden">
          {visibleProducts.length} محصول
        </p>

        {visibleProducts.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {shownProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
            </div>
            {shownProducts.length < visibleProducts.length && (
              <div ref={sentinelRef} className="py-10 flex justify-center">
                <div className="h-8 w-8 rounded-full border-2 border-line border-t-coffee animate-spin" aria-label="در حال بارگذاری" />
              </div>
            )}
          </>
        ) : (
          <div className="rounded-2xl border border-dashed border-line py-20 text-center text-ink-soft">
            <p>محصولی با این فیلترها پیدا نشد.</p>
            <button
              onClick={resetFilters}
              className="mt-4 text-sm text-coffee hover:text-coffee-deep transition-colors"
            >
              حذف فیلترها
            </button>
          </div>
        )}
      </div>

      {mobileFiltersOpen && (
        <div className="fixed inset-0 z-50 md:hidden">
          <div
            className="absolute inset-0 bg-ink/40"
            onClick={() => setMobileFiltersOpen(false)}
          />
          <div className="absolute inset-y-0 right-0 w-[85%] max-w-sm overflow-y-auto bg-paper p-4">
            <div className="flex items-center justify-between mb-4">
              <h2 className="font-bold text-ink">فیلترها</h2>
              <button
                onClick={() => setMobileFiltersOpen(false)}
                aria-label="بستن فیلترها"
                className="p-2 rounded-full hover:bg-paper-deep"
              >
                <X size={20} />
              </button>
            </div>
            <FilterPanel {...filterPanelProps} />
            <button
              onClick={() => setMobileFiltersOpen(false)}
              className="mt-4 w-full rounded-full bg-ink py-3 text-sm font-semibold text-cream"
            >
              نمایش {visibleProducts.length} محصول
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
