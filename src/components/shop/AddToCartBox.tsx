"use client";

import { useMemo, useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { formatToman, weightLabel } from "@/lib/products";

type Variant = { id: string; weight: string; grindOptionId: string | null; grind: string | null; price: number; active: boolean };
type Props = { product: { id: string; slug: string; name: string }; variants: Variant[]; isCoffee: boolean };

export default function AddToCartBox({ product, variants, isCoffee }: Props) {
  const activeVariants = variants.filter((v) => v.active);
  const [selectedWeight, setSelectedWeight] = useState(activeVariants[0]?.weight ?? "250");
  const [selectedGrind, setSelectedGrind] = useState(activeVariants.find(v => v.weight === selectedWeight)?.grindOptionId ?? "");
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const addItem = useCartStore((s) => s.addItem);

  const weights = useMemo(() => [...new Set(activeVariants.map(v => v.weight))], [activeVariants]);
  const current = activeVariants.find(v => v.weight === selectedWeight && (!isCoffee || v.grindOptionId === selectedGrind))
    ?? activeVariants.find(v => v.weight === selectedWeight)
    ?? activeVariants[0];
  const grinds = activeVariants.filter(v => v.weight === selectedWeight && v.grindOptionId);

  const changeWeight = (weight: string) => {
    setSelectedWeight(weight);
    const first = activeVariants.find(v => v.weight === weight);
    setSelectedGrind(first?.grindOptionId ?? "");
  };

  const handleAdd = () => {
    if (!current) return;
    addItem({
      productId: product.id, variantId: current.id, slug: product.slug, name: product.name,
      price: current.price, weight: current.weight, grind: current.grind ?? undefined,
    }, quantity);
    setAdded(true); window.setTimeout(() => setAdded(false), 1800);
  };

  if (!current) return null;
  return (
    <div className="space-y-4">
      <div>
        <p className="mb-2 text-sm font-semibold text-ink">وزن محصول</p>
        <div className="flex flex-wrap gap-2">
          {weights.map(w => <button key={w} type="button" onClick={()=>changeWeight(w)} className={`rounded-full border px-4 py-2 text-sm transition ${selectedWeight===w ? "border-ink bg-ink text-cream" : "border-line bg-cream text-ink-soft hover:border-coffee"}`}>{weightLabel(w)}</button>)}
        </div>
      </div>
      {isCoffee && grinds.length > 0 && (
        <div>
          <p className="mb-2 text-sm font-semibold text-ink">نوع آسیاب</p>
          <select value={selectedGrind} onChange={e=>setSelectedGrind(e.target.value)} className="w-full rounded-xl border border-line bg-cream px-4 py-3 text-sm">
            {grinds.map(v=><option key={v.grindOptionId} value={v.grindOptionId ?? ""}>{v.grind}</option>)}
          </select>
        </div>
      )}
      <div className="flex items-center justify-between rounded-2xl border border-line bg-paper-deep/40 p-3">
        <span className="text-sm text-ink-soft">قیمت این انتخاب</span>
        <strong className="text-xl text-ink">{formatToman(current.price)}</strong>
      </div>
      <div className="flex flex-col sm:flex-row items-stretch gap-3">
        <div className="flex items-center justify-between rounded-full border border-line bg-cream px-2 py-1 sm:w-36">
          <button type="button" aria-label="کم کردن تعداد" onClick={()=>setQuantity(q=>Math.max(1,q-1))} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-paper-deep"><Minus size={16}/></button>
          <span className="text-sm font-semibold">{quantity}</span>
          <button type="button" aria-label="زیاد کردن تعداد" onClick={()=>setQuantity(q=>Math.min(20,q+1))} className="flex h-9 w-9 items-center justify-center rounded-full hover:bg-paper-deep"><Plus size={16}/></button>
        </div>
        <button type="button" onClick={handleAdd} className="flex-1 flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors">
          {added ? <><Check size={18}/> به سبد اضافه شد</> : <><ShoppingBag size={18}/> افزودن به سبد خرید</>}
        </button>
      </div>
    </div>
  );
}
