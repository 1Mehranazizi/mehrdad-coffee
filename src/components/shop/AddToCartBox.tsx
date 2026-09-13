"use client";

import { useState } from "react";
import { Check, Minus, Plus, ShoppingBag } from "lucide-react";

export default function AddToCartBox() {
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);

  const handleAdd = () => {
    setAdded(true);
    window.setTimeout(() => setAdded(false), 1800);
  };

  return (
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
        className="flex-1 flex items-center justify-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors"
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
  );
}
