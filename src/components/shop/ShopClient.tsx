"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { SlidersHorizontal, X } from "lucide-react";
import { sortOptions, type SortOption, type Weight } from "@/lib/products";
import type { Category } from "@/server/repo/categories";
import type { ProductCardData } from "@/components/ProductCard";
import ProductCard from "@/components/ProductCard";
import FilterPanel from "@/components/shop/FilterPanel";
import ProductCardSkeleton from "@/components/shop/ProductCardSkeleton";

type ShopProduct = ProductCardData & { weights: string[] };

type Props = {
  products: ShopProduct[];
  categories: Category[];
  priceMin: number;
  priceMax: number;
  initialCategory?: string;
};

const PAGE_SIZE = 9;

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
  const [visibleCount, setVisibleCount] = useState(PAGE_SIZE);

  const toggleCategory = (slug: string) => {
    setSelectedCategories((prev) => {
      const next = new Set(prev);
      next.has(slug) ? next.delete(slug) : next.add(slug);
      return next;
    });
    setVisibleCount(PAGE_SIZE);
  };

  const toggleWeight = (weight: Weight) => {
    setSelectedWeights((prev) => {
      const next = new Set(prev);
      next.has(weight) ? next.delete(weight) : next.add(weight);
      return next;
    });
    setVisibleCount(PAGE_SIZE);
  };

  const resetFilters = () => {
    setSelectedCategories(new Set());
    setSelectedWeights(new Set());
    setMaxPrice(priceMax);
    setVisibleCount(PAGE_SIZE);
  };

  const activeFilterCount =
    selectedCategories.size +
    selectedWeights.size +
    (maxPrice < priceMax ? 1 : 0);

  const filteredProducts = useMemo(() => {
    const filtered = products.filter((p) => {
      if (selectedCategories.size > 0 && !selectedCategories.has(p.categorySlug ?? ""))
        return false;
      if (
        selectedWeights.size > 0 &&
        !p.weights.some((w) => selectedWeights.has(w as Weight))
      )
        return false;
      if (p.minPrice > maxPrice) return false;
      return true;
    });

    const sorted = [...filtered];
    switch (sortBy) {
      case "price-asc":
        sorted.sort((a, b) => a.minPrice - b.minPrice);
        break;
      case "price-desc":
        sorted.sort((a, b) => b.minPrice - a.minPrice);
        break;
      case "name":
        sorted.sort((a, b) => a.name.localeCompare(b.name, "fa"));
        break;
      default:
        break;
    }
    return sorted;
  }, [products, selectedCategories, selectedWeights, maxPrice, sortBy]);

  const visibleProducts = filteredProducts.slice(0, visibleCount);
  const hasMore = visibleCount < filteredProducts.length;

  // infinite scroll: reveal more items as the sentinel enters the viewport
  const sentinelRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => {
    if (!hasMore) return;
    const el = sentinelRef.current;
    if (!el) return;
    const observer = new IntersectionObserver(
      (entries) => {
        if (entries[0]?.isIntersecting) {
          setVisibleCount((v) => v + PAGE_SIZE);
        }
      },
      { rootMargin: "400px" }
    );
    observer.observe(el);
    return () => observer.disconnect();
  }, [hasMore]);

  const filterPanelProps = {
    categories,
    selectedCategories,
    onToggleCategory: toggleCategory,
    selectedWeights,
    onToggleWeight: toggleWeight,
    maxPrice,
    onMaxPriceChange: (v: number) => {
      setMaxPrice(v);
      setVisibleCount(PAGE_SIZE);
    },
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
            {filteredProducts.length} محصول
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
          {filteredProducts.length} محصول
        </p>

        {visibleProducts.length > 0 ? (
          <>
            <div className="grid gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {visibleProducts.map((product) => (
                <ProductCard key={product.slug} product={product} />
              ))}
              {hasMore &&
                Array.from({ length: Math.min(3, filteredProducts.length - visibleCount) }).map(
                  (_, i) => <ProductCardSkeleton key={`skeleton-${i}`} />
                )}
            </div>
            {hasMore && <div ref={sentinelRef} className="h-1" />}
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
              نمایش {Math.min(visibleCount, filteredProducts.length)} از {filteredProducts.length} محصول
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
