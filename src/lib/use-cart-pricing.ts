"use client";

import { useEffect, useState } from "react";
import type { CartItem } from "@/lib/cart-store";

type Summary = {
  isPartner: boolean;
  lines: { variantId: string; unitPrice: number }[];
  subtotal: number;
  totalWeightGrams: number;
  minWeightGrams: number;
  meetsMinimum: boolean;
};

/**
 * Live prices for the cart from the server (partner vs regular tier, current DB prices).
 * Falls back to the prices stored in the cart until the response arrives.
 */
export function useCartPricing(items: CartItem[]) {
  const key = items.map((i) => `${i.variantId}:${i.quantity}`).join("|");
  const [result, setResult] = useState<{ key: string; summary: Summary } | null>(null);

  useEffect(() => {
    if (items.length === 0) return;
    const controller = new AbortController();
    fetch("/api/cart/summary", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      signal: controller.signal,
      body: JSON.stringify({
        items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
      }),
    })
      .then((r) => r.json())
      .then((summary: Summary) => setResult({ key, summary }))
      .catch(() => {});
    return () => controller.abort();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [key]);

  const summary = result?.key === key ? result.summary : null;
  const priceMap = new Map(summary?.lines.map((l) => [l.variantId, l.unitPrice]));

  return {
    ready: summary !== null,
    isPartner: summary?.isPartner ?? false,
    unitPrice: (item: CartItem) => priceMap.get(item.variantId) ?? item.price,
    subtotal:
      summary?.subtotal ?? items.reduce((s, i) => s + i.price * i.quantity, 0),
    totalWeightGrams: summary?.totalWeightGrams ?? 0,
    minWeightGrams: summary?.minWeightGrams ?? 0,
    meetsMinimum: summary ? summary.meetsMinimum : true,
  };
}
