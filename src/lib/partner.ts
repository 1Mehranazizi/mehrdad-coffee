/** Shared (client + server) partner / wholesale rules. */

export const PARTNER_MIN_WEIGHT_GRAMS = 5000; // 5 kg minimum order for partners

export type CustomerType = "regular" | "partner";
export type PartnerStatus = "PENDING" | "APPROVED" | "REJECTED";

export const PARTNER_STATUS_LABEL: Record<PartnerStatus, string> = {
  PENDING: "در انتظار بررسی",
  APPROVED: "تأیید شده",
  REJECTED: "رد شده",
};

export const PARTNER_MIN_WEIGHT_LABEL = "۵ کیلوگرم";

export function cartWeightGrams(items: { weight: string; quantity: number }[]): number {
  return items.reduce((sum, i) => sum + (parseInt(i.weight, 10) || 0) * i.quantity, 0);
}

export function formatWeightGrams(grams: number): string {
  const kg = grams / 1000;
  return `${new Intl.NumberFormat("fa-IR", { maximumFractionDigits: 2 }).format(kg)} کیلوگرم`;
}

/** Iranian national code (کد ملی) check-digit validation. */
export function isValidNationalCode(code: string): boolean {
  if (!/^\d{10}$/.test(code)) return false;
  if (/^(\d)\1{9}$/.test(code)) return false;
  const check = Number(code[9]);
  const sum = code
    .slice(0, 9)
    .split("")
    .reduce((s, d, i) => s + Number(d) * (10 - i), 0);
  const r = sum % 11;
  return r < 2 ? check === r : check === 11 - r;
}
