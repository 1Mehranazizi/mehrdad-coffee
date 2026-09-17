"use client";

import { create } from "zustand";
import { persist } from "zustand/middleware";

export type CartItem = {
  productId: string;
  variantId: string;
  slug: string;
  name: string;
  price: number;
  weight: string;
  grind?: string;
  quantity: number;
};

type CartState = {
  items: CartItem[];
  addItem: (item: Omit<CartItem, "quantity">, quantity?: number) => void;
  removeItem: (variantId: string) => void;
  setQuantity: (variantId: string, quantity: number) => void;
  clear: () => void;
};

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      addItem: (item, quantity = 1) => {
        const items = get().items;
        const existing = items.find((i) => i.variantId === item.variantId);
        if (existing) {
          set({
            items: items.map((i) =>
              i.variantId === item.variantId
                ? { ...i, quantity: Math.min(20, i.quantity + quantity) }
                : i
            ),
          });
        } else {
          set({ items: [...items, { ...item, quantity: Math.min(20, Math.max(1, quantity)) }] });
        }
      },
      removeItem: (variantId) =>
        set({ items: get().items.filter((i) => i.variantId !== variantId) }),
      setQuantity: (variantId, quantity) =>
        set({
          items: get().items.map((i) =>
            i.variantId === variantId
              ? { ...i, quantity: Math.max(1, Math.min(20, quantity)) }
              : i
          ),
        }),
      clear: () => set({ items: [] }),
    }),
    {
      name: "mehrdad-cart",
      version: 2,
      migrate: (persisted: unknown) => {
        const state = persisted as { items?: Array<Record<string, unknown>> };
        return {
          ...state,
          items: (state.items ?? []).map((item) => ({
            ...item,
            variantId: String(item.variantId ?? item.productId),
            grind: item.grind ? String(item.grind) : undefined,
          })),
        };
      },
    }
  )
);

export function cartTotal(items: CartItem[]) {
  return items.reduce((sum, i) => sum + i.price * i.quantity, 0);
}
