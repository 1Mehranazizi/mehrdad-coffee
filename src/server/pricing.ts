import { getCurrentCustomer } from "@/server/auth/customer";
import { isPartnerCustomer } from "@/server/repo/customers";
import { priceForCustomer, type ProductWithVariants } from "@/server/repo/products";

/** True when the visitor is a logged-in, approved partner. Guests and regular customers => false. */
export async function currentIsPartner(): Promise<boolean> {
  return isPartnerCustomer(await getCurrentCustomer());
}

/** Applies wholesale prices (when the viewer is a partner) to a list of products. */
export function priced<T extends ProductWithVariants>(products: T[], partner: boolean): T[] {
  return partner ? products.map((p) => priceForCustomer(p, true)) : products;
}
