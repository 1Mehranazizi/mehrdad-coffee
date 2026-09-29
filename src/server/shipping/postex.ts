import type { Parcel } from "./parcel";

/**
 * Postex shipping-quote client — POST {base}/shipping/quotes
 * (schema: "محاسبه هزینه جمع آوری و ارسال مرسوله", api.postex.ir/developers-docs)
 *
 * Env:
 *   POSTEX_API_KEY            – API key (empty in dev => mock estimate, error in production)
 *   POSTEX_AUTH_HEADER        – header name for the key, default "x-api-key"
 *   POSTEX_BASE_URL           – default https://api.postex.ir/api/v1
 *   POSTEX_ORIGIN_PROVINCE/CITY – sender location by name, default اصفهان / اصفهان
 *   POSTEX_ORIGIN_CITY_CODE   – optional: sender Postex city code (skips the name lookup)
 *   POSTEX_SERVICE_TYPE       – courier.service_type (required), default EXPRESS
 *   POSTEX_PAYMENT_TYPE       – parcels[].payment_type (required), default PREPAID
 *   POSTEX_BOX_TYPE_ID        – Postex box type id (required by the API), default 1
 *   POSTEX_PROVINCES_PATH     – default /locality/provinces
 *   POSTEX_CITIES_PATH        – default /locality/cities  (province code is appended)
 *   POSTEX_PRICE_UNIT         – "rial" (default) or "toman": unit of prices in the quote response
 */

const COURIER_CODE = "MAHEX";
const COLLECTION_TYPE = "courier_drop_off";

export type ShippingDestination = {
  province: string;
  city: string;
  addressLine: string;
  postalCode?: string | null;
  receiverName: string;
  receiverPhone: string;
};

const norm = (v: string) =>
  v
    .replace(/ي/g, "ی")
    .replace(/ك/g, "ک")
    .replace(/[\u200c\s]+/g, "")
    .trim();

function baseUrl() {
  return process.env.POSTEX_BASE_URL || "https://api.postex.ir/api/v1";
}

function authHeaders(apiKey: string): Record<string, string> {
  return {
    "Content-Type": "application/json",
    Accept: "application/json",
    [process.env.POSTEX_AUTH_HEADER || "x-api-key"]: apiKey,
  };
}

/* ---------------------------- city code lookup ----------------------------
 * GET {base}/locality/provinces           -> provinces with their codes
 * GET {base}/locality/cities/{province-code} -> cities of that province
 * The response shapes weren't provided, so items are read tolerantly (see parseItems).
 */

type Item = { code: number | string; name: string };

function findArray(node: unknown, depth = 0): unknown[] | null {
  if (Array.isArray(node)) return node;
  if (depth > 3 || !node || typeof node !== "object") return null;
  for (const v of Object.values(node as Record<string, unknown>)) {
    const found = findArray(v, depth + 1);
    if (found) return found;
  }
  return null;
}

function parseItems(json: unknown): Item[] {
  const out: Item[] = [];
  for (const raw of findArray(json) ?? []) {
    if (!raw || typeof raw !== "object") continue;
    const o = raw as Record<string, unknown>;
    const code = [o.code, o.province_code, o.city_code, o.id, o.value].find(
      (x) => typeof x === "number" || (typeof x === "string" && /^\d+$/.test(x))
    ) as number | string | undefined;
    const name = [
      o.name,
      o.title,
      o.name_fa,
      o.fa_name,
      o.label,
      o.city_name,
      o.province_name,
    ].find((x) => typeof x === "string" && x.trim() !== "") as
      string | undefined;
    if (code !== undefined && name) out.push({ code, name });
  }
  return out;
}

const TTL = 6 * 3600_000;
const cache = new Map<string, { at: number; items: Item[] }>();

async function cachedGet(apiKey: string, path: string): Promise<Item[]> {
  const hit = cache.get(path);
  if (hit && Date.now() - hit.at < TTL) return hit.items;
  const res = await fetch(`${baseUrl()}${path}`, {
    headers: authHeaders(apiKey),
    signal: AbortSignal.timeout(15000),
    cache: "no-store",
  });
  const json = await res.json().catch(() => null);
  if (!res.ok)
    throw new Error(
      `GET ${path} failed (${res.status}): ${JSON.stringify(json)}`
    );
  const items = parseItems(json);
  if (items.length === 0)
    throw new Error(
      `no items parsed from GET ${path}: ${JSON.stringify(json)}`
    );
  cache.set(path, { at: Date.now(), items });
  return items;
}

function pickByName(items: Item[], name: string): Item | undefined {
  const n = norm(name);
  const exact = items.filter((i) => norm(i.name) === n);
  if (exact.length) return exact[0];
  // e.g. "شهرستان X" / "X (شهر)" style names: accept a single loose match
  const loose = items.filter(
    (i) => norm(i.name).includes(n) || n.includes(norm(i.name))
  );
  return loose.length === 1 ? loose[0] : undefined;
}

async function resolveCityCode(
  apiKey: string,
  province: string,
  city: string
): Promise<number | null> {
  const provincesPath =
    process.env.POSTEX_PROVINCES_PATH || "/locality/provinces";
  const citiesPath = process.env.POSTEX_CITIES_PATH || "/locality/cities";

  const prov = pickByName(await cachedGet(apiKey, provincesPath), province);
  if (!prov) return null;
  const found = pickByName(
    await cachedGet(apiKey, `${citiesPath}/${prov.code}`),
    city
  );
  if (!found) return null;
  const code = Number(found.code);
  return Number.isInteger(code) ? code : null;
}

/* ------------------------------ quote request ----------------------------- */

function buildRequestBody(
  parcel: Parcel,
  fromCityCode: number,
  toCityCode: number
) {
  return {
    collection_type: COLLECTION_TYPE,
    from_city_code: fromCityCode,
    courier: {
      courier_code: COURIER_CODE,
      service_type: process.env.POSTEX_SERVICE_TYPE || "EXPRESS", // required by the API
    },
    parcels: [
      {
        to_city_code: toCityCode,
        payment_type: process.env.POSTEX_PAYMENT_TYPE || "PREPAID", // required by the API (per parcel)
        parcel_properties: {
          length: parcel.lengthCm,
          width: parcel.widthCm,
          height: parcel.heightCm,
          total_weight: parcel.weightGrams, // grams
          is_fragile: false,
          is_liquid: false,
          total_value: parcel.valueToman * 10, // API expects Rial
          box_type_id: Number(process.env.POSTEX_BOX_TYPE_ID || 1),
        },
      },
    ],
    value_added_service: {
      request_label: false,
      request_packaging: false,
      request_sms_notification: false,
    },
  };
}

/** The response schema wasn't provided, so read the cheapest price from a few plausible shapes. */
function extractPrice(json: unknown): number | null {
  const isNum = (v: unknown): v is number =>
    typeof v === "number" && isFinite(v) && v >= 0;
  const keys = [
    "total_price",
    "final_price",
    "total_cost",
    "price",
    "cost",
    "amount",
  ];

  const visit = (node: unknown, depth: number): number | null => {
    if (depth > 5 || node == null) return null;
    if (Array.isArray(node)) {
      const prices = node.map((n) => visit(n, depth + 1)).filter(isNum);
      return prices.length ? Math.min(...prices) : null;
    }
    if (typeof node === "object") {
      const obj = node as Record<string, unknown>;
      for (const k of keys) {
        const v = obj[k];
        if (isNum(v)) return v;
        if (typeof v === "string" && /^\d+(\.\d+)?$/.test(v)) return Number(v);
      }
      for (const v of Object.values(obj)) {
        const found = visit(v, depth + 1);
        if (found !== null) return found;
      }
    }
    return null;
  };
  return visit(json, 0);
}

export type QuoteResult =
  { ok: true; price: number; mock?: boolean } | { ok: false; error: string };

export async function getPostexShippingPrice(
  parcel: Parcel,
  to: ShippingDestination
): Promise<QuoteResult> {
  const apiKey = process.env.POSTEX_API_KEY;

  if (!apiKey) {
    if (process.env.NODE_ENV === "production") {
      return { ok: false, error: "سرویس محاسبه هزینه ارسال پیکربندی نشده است" };
    }
    console.warn(
      "[postex] POSTEX_API_KEY is empty — using DEV mock shipping price"
    );
    return {
      ok: true,
      price: 60000 + Math.ceil(parcel.weightGrams / 1000) * 15000,
      mock: true,
    };
  }

  try {
    let fromCityCode = Number(process.env.POSTEX_ORIGIN_CITY_CODE);
    if (!Number.isInteger(fromCityCode) || fromCityCode <= 0) {
      const resolved = await resolveCityCode(
        apiKey,
        process.env.POSTEX_ORIGIN_PROVINCE || "کرمانشاه",
        process.env.POSTEX_ORIGIN_CITY || "کرمانشاه"
      );
      if (resolved === null) {
        console.error(
          "[postex] could not resolve the origin city code; set POSTEX_ORIGIN_CITY_CODE"
        );
        return {
          ok: false,
          error: "سرویس محاسبه هزینه ارسال پیکربندی نشده است",
        };
      }
      fromCityCode = resolved;
    }

    const toCityCode = await resolveCityCode(apiKey, to.province, to.city);
    if (toCityCode === null) {
      console.error("[postex] no Postex city code for", to.province, to.city);
      return {
        ok: false,
        error: "ارسال به این شهر در حال حاضر پشتیبانی نمی‌شود",
      };
    }

    const res = await fetch(`${baseUrl()}/shipping/quotes`, {
      method: "POST",
      headers: authHeaders(apiKey),
      body: JSON.stringify(buildRequestBody(parcel, fromCityCode, toCityCode)),
      signal: AbortSignal.timeout(15000),
      cache: "no-store",
    });

    const json = await res.json().catch(() => null);
    if (!res.ok) {
      console.error("[postex] quote failed", res.status, JSON.stringify(json));
      return {
        ok: false,
        error: "دریافت هزینه ارسال ناموفق بود، لطفاً دوباره تلاش کنید",
      };
    }

    const price = extractPrice(json);
    if (price === null) {
      console.error(
        "[postex] no price found in response",
        JSON.stringify(json)
      );
      return { ok: false, error: "پاسخ سرویس ارسال نامعتبر بود" };
    }

    const toman =
      process.env.POSTEX_PRICE_UNIT === "toman" ? price : price / 10;
    return { ok: true, price: Math.round(toman) };
  } catch (err) {
    console.error("[postex] request error", err);
    return {
      ok: false,
      error: "ارتباط با سرویس محاسبه هزینه ارسال برقرار نشد",
    };
  }
}
