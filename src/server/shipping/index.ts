import { isFreeShipping } from "@/lib/shipping";
import { isValidLocation } from "@/lib/iran-locations";
import { resolveCartItems } from "@/server/repo/orders";
import { buildParcel } from "./parcel";
import { getPostexShippingPrice, type ShippingDestination } from "./postex";

export type ShippingQuote =
  | { ok: true; shippingCost: number; free: boolean; subtotal: number }
  | { ok: false; error: string };

/**
 * Single source of truth for shipping cost (used by both the quote endpoint and checkout).
 * Free ONLY for Kermanshah city; every other destination is priced by Postex.
 */
export async function quoteShipping(
  cartItems: { variantId: string; quantity: number }[],
  to: ShippingDestination,
  partner = false
): Promise<ShippingQuote> {
  if (!isValidLocation(to.province, to.city)) {
    return { ok: false, error: "استان یا شهر انتخاب‌شده معتبر نیست" };
  }

  const { items, error } = resolveCartItems(cartItems, partner);
  if (error || !items) return { ok: false, error: error || "سبد خرید نامعتبر است" };

  const subtotal = items.reduce((s, i) => s + i.unitPrice * i.quantity, 0);

  if (isFreeShipping(to.province, to.city)) {
    return { ok: true, shippingCost: 0, free: true, subtotal };
  }

  const result = await getPostexShippingPrice(buildParcel(items), to);
  if (!result.ok) return { ok: false, error: result.error };

  return { ok: true, shippingCost: result.price, free: false, subtotal };
}
