import { NextResponse } from "next/server";
import { getCurrentCustomer } from "@/server/auth/customer";
import { isPartnerCustomer } from "@/server/repo/customers";
import { getProductById, getVariantById, effectivePrice } from "@/server/repo/products";
import { cartWeightGrams, PARTNER_MIN_WEIGHT_GRAMS } from "@/lib/partner";

/** Live prices for the cart, so the UI never shows a stale (or wrong-tier) price. */
export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const raw = Array.isArray(body?.items) ? body.items : [];

  const customer = await getCurrentCustomer();
  const partner = isPartnerCustomer(customer);

  const lines: { variantId: string; unitPrice: number; quantity: number; weight: string }[] = [];
  for (const item of raw.slice(0, 100)) {
    const variant = getVariantById(String(item?.variantId ?? ""));
    if (!variant) continue;
    const product = getProductById(variant.productId);
    if (!product || !product.published) continue;
    lines.push({
      variantId: variant.id,
      unitPrice: effectivePrice(variant, partner),
      quantity: Math.max(1, Math.min(20, Number(item.quantity) || 1)),
      weight: variant.weight,
    });
  }

  const totalWeightGrams = cartWeightGrams(lines);
  const minWeightGrams = partner ? PARTNER_MIN_WEIGHT_GRAMS : 0;

  return NextResponse.json({
    isPartner: partner,
    lines: lines.map((l) => ({ variantId: l.variantId, unitPrice: l.unitPrice })),
    subtotal: lines.reduce((s, l) => s + l.unitPrice * l.quantity, 0),
    totalWeightGrams,
    minWeightGrams,
    meetsMinimum: totalWeightGrams >= minWeightGrams,
  });
}
