"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Minus, Plus, Trash2 } from "lucide-react";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatToman, weightLabel } from "@/lib/products";

export default function CartClient() {
  const [hydrated, setHydrated] = useState(false);
  const items = useCartStore((s) => s.items);
  const setQuantity = useCartStore((s) => s.setQuantity);
  const removeItem = useCartStore((s) => s.removeItem);

  // avoid SSR/localStorage mismatch flash
  useEffect(() => setHydrated(true), []);

  if (!hydrated) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center">
        <p className="text-ink-soft">سبد خرید شما خالی است.</p>
        <Link
          href="/shop"
          className="mt-5 inline-block rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors"
        >
          مشاهده محصولات
        </Link>
      </div>
    );
  }

  const subtotal = cartTotal(items);

  return (
    <div className="mx-auto max-w-3xl px-4 py-10 md:py-14">
      <h1 className="text-2xl sm:text-3xl font-extrabold text-ink">سبد خرید</h1>

      <ul className="mt-8 divide-y divide-line rounded-2xl border border-line bg-cream">
        {items.map((item) => (
          <li key={item.variantId} className="flex items-center gap-4 p-4 sm:p-5">
            <div className="min-w-0 flex-1">
              <Link
                href={`/shop/${item.slug}`}
                className="font-semibold text-ink hover:text-coffee transition-colors"
              >
                {item.name}
              </Link>
              <p className="mt-1 text-xs text-ink-soft">
                {weightLabel(item.weight)}
                {item.grindTypeName ? ` · ${item.grindTypeName}` : ""} ·{" "}
                {formatToman(item.price)}
              </p>
            </div>

            <div className="flex items-center gap-1 rounded-full border border-line px-1.5 py-1 shrink-0">
              <button
                type="button"
                aria-label="کم کردن تعداد"
                onClick={() => setQuantity(item.variantId, item.quantity - 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-paper-deep"
              >
                <Minus size={14} />
              </button>
              <span className="w-5 text-center text-sm">{item.quantity}</span>
              <button
                type="button"
                aria-label="زیاد کردن تعداد"
                onClick={() => setQuantity(item.variantId, item.quantity + 1)}
                className="flex h-7 w-7 items-center justify-center rounded-full hover:bg-paper-deep"
              >
                <Plus size={14} />
              </button>
            </div>

            <p className="w-28 text-left text-sm font-semibold text-ink shrink-0">
              {formatToman(item.price * item.quantity)}
            </p>

            <button
              type="button"
              aria-label="حذف از سبد"
              onClick={() => removeItem(item.variantId)}
              className="p-2 text-ink-soft hover:text-red-700 transition-colors shrink-0"
            >
              <Trash2 size={18} />
            </button>
          </li>
        ))}
      </ul>

      <div className="mt-6 flex flex-col sm:flex-row items-center justify-between gap-4 rounded-2xl border border-line bg-paper-deep/50 p-5">
        <p className="text-ink-soft text-sm">
          جمع سبد:{" "}
          <span className="font-bold text-ink text-base">
            {formatToman(subtotal)}
          </span>
        </p>
        <Link
          href="/checkout"
          className="w-full sm:w-auto rounded-full bg-ink px-8 py-3 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors text-center"
        >
          ادامه و ثبت سفارش
        </Link>
      </div>
      <p className="mt-3 text-xs text-ink-soft">
        هزینه‌ی ارسال در مرحله‌ی بعد بر اساس مبلغ سفارش محاسبه می‌شود.
      </p>
    </div>
  );
}
