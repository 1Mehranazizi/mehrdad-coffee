/** Shared (client + server) shipping rules. */

export const FREE_SHIPPING_PROVINCE = "کرمانشاه";
export const FREE_SHIPPING_CITY = "کرمانشاه";

const normalize = (v: string) =>
  v.replace(/ي/g, "ی").replace(/ك/g, "ک").replace(/\s+/g, " ").trim();

/** Shipping is free ONLY for the city of Kermanshah. Everywhere else it is always charged. */
export function isFreeShipping(province: string, city: string): boolean {
  return (
    normalize(province) === FREE_SHIPPING_PROVINCE &&
    normalize(city) === FREE_SHIPPING_CITY
  );
}
