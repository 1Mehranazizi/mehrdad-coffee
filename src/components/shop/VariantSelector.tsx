"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { weightLabel, formatToman } from "@/lib/products";
import { toast } from "@/lib/toast-store";

type Variant = {
  id: string;
  weight: string;
  grindTypeId: string | null;
  grindTypeName: string | null;
  price: number;
};

export default function VariantSelector({
  product,
  variants,
  requiresGrind,
}: {
  product: { id: string; slug: string; name: string };
  variants: Variant[];
  requiresGrind: boolean;
}) {
  const weights = useMemo(
    () => Array.from(new Set(variants.map((v) => v.weight))),
    [variants]
  );
  const [selectedWeight, setSelectedWeight] = useState(weights[0] ?? "");

  const grindOptionsForWeight = useMemo(
    () =>
      variants
        .filter((v) => v.weight === selectedWeight && v.grindTypeId)
        .map((v) => ({ id: v.grindTypeId!, name: v.grindTypeName! })),
    [variants, selectedWeight]
  );
  const [selectedGrindId, setSelectedGrindId] = useState(
    grindOptionsForWeight[0]?.id ?? ""
  );

  const currentGrindId = grindOptionsForWeight.some((g) => g.id === selectedGrindId)
    ? selectedGrindId
    : grindOptionsForWeight[0]?.id ?? "";

  const selectedVariant = variants.find(
    (v) =>
      v.weight === selectedWeight &&
      (requiresGrind ? v.grindTypeId === currentGrindId : true)
  );

  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const handleAdd = () => {
    if (!selectedVariant) return;
    addItem(
      {
        variantId: selectedVariant.id,
        productId: product.id,
        slug: product.slug,
        name: product.name,
        price: selectedVariant.price,
        weight: selectedVariant.weight,
        grindTypeName: selectedVariant.grindTypeName,
      },
      quantity
    );
    toast.success("به سبد خرید اضافه شد");
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
    <div className="space-y-5">
      <div>
        <p className="text-sm font-semibold text-ink mb-2">وزن</p>
        <div className="flex flex-wrap gap-2">
          {weights.map((w) => (
            <button
              key={w}
              type="button"
              onClick={() => setSelectedWeight(w)}
              className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                selectedWeight === w
                  ? "border-ink bg-ink text-cream"
                  : "border-line bg-cream text-ink-soft hover:border-coffee"
              }`}
            >
              {weightLabel(w)}
            </button>
          ))}
        </div>
      </div>

      {requiresGrind && grindOptionsForWeight.length > 0 && (
        <div>
          <p className="text-sm font-semibold text-ink mb-2">نوع آسیاب</p>
          <div className="flex flex-wrap gap-2">
            {grindOptionsForWeight.map((g) => (
              <button
                key={g.id}
                type="button"
                onClick={() => setSelectedGrindId(g.id)}
                className={`rounded-full border px-4 py-2 text-sm transition-colors ${
                  currentGrindId === g.id
                    ? "border-ink bg-ink text-cream"
                    : "border-line bg-cream text-ink-soft hover:border-coffee"
                }`}
              >
                {g.name}
              </button>
            ))}
          </div>
        </div>
      )}

      <p className="text-3xl font-bold text-ink">
        {selectedVariant ? formatToman(selectedVariant.price) : "موجود نیست"}
      </p>

      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="flex items-center justify-between rounded-full border border-line bg-cream px-2 py-1 sm:w-36">
          <button
            type="button"
            aria-label="کم کردن تعداد"
            onClick={() => setQuantity((q) => Math.max(1, q - 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-paper-deep transition-colors"
          >
            <Minus size={16} />
          </button>
          <span className="text-sm font-semibold text-ink">{quantity}</span>
          <button
            type="button"
            aria-label="زیاد کردن تعداد"
            onClick={() => setQuantity((q) => Math.min(20, q + 1))}
            className="flex h-9 w-9 items-center justify-center rounded-full text-ink hover:bg-paper-deep transition-colors"
          >
            <Plus size={16} />
          </button>
        </div>

        <button
          type="button"
          onClick={handleAdd}
          disabled={!selectedVariant}
          className="flex-1 flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-50"
        >
          {added ? (
            <>
              <Check size={18} />
              به سبد اضافه شد
            </>
          ) : (
            <>
              <ShoppingBag size={18} strokeWidth={1.75} />
              افزودن به سبد خرید
            </>
          )}
        </button>
      </div>
    </div>
  );
}
