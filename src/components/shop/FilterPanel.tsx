import { categories, weightOptions, formatToman, priceRange, type Weight } from "@/lib/products";

type Props = {
  selectedCategories: Set<string>;
  onToggleCategory: (slug: string) => void;
  selectedWeights: Set<Weight>;
  onToggleWeight: (weight: Weight) => void;
  maxPrice: number;
  onMaxPriceChange: (value: number) => void;
  onReset: () => void;
};

export default function FilterPanel({
  selectedCategories,
  onToggleCategory,
  selectedWeights,
  onToggleWeight,
  maxPrice,
  onMaxPriceChange,
  onReset,
}: Props) {
  return (
    <div className="rounded-2xl border border-line bg-cream">
      <div className="flex items-center justify-between px-5 py-4 border-b border-line">
        <h2 className="font-bold text-ink">فیلترها</h2>
        <button
          onClick={onReset}
          className="text-xs text-coffee hover:text-coffee-deep transition-colors"
        >
          حذف همه
        </button>
      </div>

      {/* category */}
      <div className="px-5 py-5 border-b border-line">
        <h3 className="text-sm font-semibold text-ink">دسته‌بندی</h3>
        <ul className="mt-3 space-y-2.5">
          {categories.map((cat) => (
            <li key={cat.slug}>
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-ink-soft hover:text-ink transition-colors">
                <input
                  type="checkbox"
                  checked={selectedCategories.has(cat.slug)}
                  onChange={() => onToggleCategory(cat.slug)}
                  className="h-4 w-4 rounded border-line accent-[var(--color-coffee)]"
                />
                {cat.title}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* weight */}
      <div className="px-5 py-5 border-b border-line">
        <h3 className="text-sm font-semibold text-ink">وزن</h3>
        <ul className="mt-3 space-y-2.5">
          {weightOptions.map((w) => (
            <li key={w.value}>
              <label className="flex items-center gap-2.5 cursor-pointer text-sm text-ink-soft hover:text-ink transition-colors">
                <input
                  type="checkbox"
                  checked={selectedWeights.has(w.value)}
                  onChange={() => onToggleWeight(w.value)}
                  className="h-4 w-4 rounded border-line accent-[var(--color-coffee)]"
                />
                {w.label}
              </label>
            </li>
          ))}
        </ul>
      </div>

      {/* price */}
      <div className="px-5 py-5">
        <h3 className="text-sm font-semibold text-ink">محدوده قیمت</h3>
        <p className="mt-3 text-sm text-ink-soft">
          تا {formatToman(maxPrice)}
        </p>
        <input
          type="range"
          min={priceRange.min}
          max={priceRange.max}
          step={5000}
          value={maxPrice}
          onChange={(e) => onMaxPriceChange(Number(e.target.value))}
          className="mt-3 w-full accent-[var(--color-coffee)]"
        />
        <div className="mt-1 flex justify-between text-[11px] text-ink-soft/70">
          <span>{formatToman(priceRange.min)}</span>
          <span>{formatToman(priceRange.max)}</span>
        </div>
      </div>
    </div>
  );
}
