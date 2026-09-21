import { normalizeDigits } from "@/lib/pagination";

const PHONE_REGEX = /^09\d{9}$/;

/** Returns the phone in the canonical 09xxxxxxxxx form, or null if it's not a valid Iranian mobile. */
export function normalizePhone(input: unknown): string | null {
  const cleaned = normalizeDigits(String(input ?? ""))
    .replace(/[\s\-()]/g, "")
    .replace(/^\+98/, "0")
    .replace(/^0098/, "0");
  const phone = /^9\d{9}$/.test(cleaned) ? "0" + cleaned : cleaned;
  return PHONE_REGEX.test(phone) ? phone : null;
}
