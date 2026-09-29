"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCartStore } from "@/lib/cart-store";
import { useCartPricing } from "@/lib/use-cart-pricing";
import { formatWeightGrams } from "@/lib/partner";
import Spinner from "@/components/Spinner";
import { formatToman, weightLabel } from "@/lib/products";
import LocationSelect from "@/components/ui/LocationSelect";
import { isValidLocation } from "@/lib/iran-locations";
import { toast } from "@/lib/toast-store";

type ShippingState =
  | { status: "idle" }
  | { status: "loading" }
  | { status: "ok"; cost: number; free: boolean }
  | { status: "error"; message: string };

type Address = {
  id: string;
  title: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string | null;
  receiverName: string;
  receiverPhone: string;
  isDefault: boolean;
};

const emptyForm = {
  province: "",
  city: "",
  addressLine: "",
  postalCode: "",
  receiverName: "",
  receiverPhone: "",
};

export default function CheckoutClient() {
  const router = useRouter();
  const items = useCartStore((s) => s.items);
  const [hydrated, setHydrated] = useState(false);
  useEffect(() => setHydrated(true), []);

  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loadingAddresses, setLoadingAddresses] = useState(true);
  const [selectedAddressId, setSelectedAddressId] = useState<string | "new">("new");
  const [form, setForm] = useState(emptyForm);
  const [differentRecipient, setDifferentRecipient] = useState(false);
  const [saveAddress, setSaveAddress] = useState(false);
  const [addressTitle, setAddressTitle] = useState("");
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((data) => {
        const list: Address[] = data.addresses || [];
        setAddresses(list);
        const def = list.find((a) => a.isDefault) || list[0];
        if (def) setSelectedAddressId(def.id);
      })
      .finally(() => setLoadingAddresses(false));
  }, []);

  const pricing = useCartPricing(items);
  const [fetched, setFetched] = useState<{ key: string; state: ShippingState } | null>(null);

  // The location currently chosen (saved address or the new-address form)
  const selectedAddress = addresses.find((a) => a.id === selectedAddressId);
  const dest =
    selectedAddressId !== "new" && selectedAddress
      ? {
          province: selectedAddress.province,
          city: selectedAddress.city,
          addressLine: selectedAddress.addressLine,
          postalCode: selectedAddress.postalCode || "",
        }
      : {
          province: form.province,
          city: form.city,
          addressLine: form.addressLine,
          postalCode: form.postalCode,
        };
  const locationValid = isValidLocation(dest.province, dest.city);
  const cartSignature = items.map((i) => `${i.variantId}:${i.quantity}`).join("|");
  const postalKey = dest.postalCode;
  const addressKey = dest.addressLine;
  const quoteKey = `${dest.province}|${dest.city}|${postalKey}|${addressKey}|${cartSignature}`;

  useEffect(() => {
    if (!hydrated || loadingAddresses || items.length === 0) return;
    if (!dest.province || !dest.city || !locationValid) return;

    const controller = new AbortController();
    const timer = setTimeout(async () => {
      try {
        const res = await fetch("/api/shipping/quote", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          signal: controller.signal,
          body: JSON.stringify({
            items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
            province: dest.province,
            city: dest.city,
            addressLine: addressKey,
            postalCode: postalKey,
            receiverName: selectedAddress?.receiverName || form.receiverName,
            receiverPhone: selectedAddress?.receiverPhone || form.receiverPhone,
          }),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "محاسبه هزینه ارسال ناموفق بود");
        setFetched({ key: quoteKey, state: { status: "ok", cost: data.shippingCost, free: data.free } });
      } catch (err) {
        if ((err as Error).name === "AbortError") return;
        const message = err instanceof Error ? err.message : "محاسبه هزینه ارسال ناموفق بود";
        setFetched({ key: quoteKey, state: { status: "error", message } });
        toast.error(message);
      }
    }, 400);

    return () => {
      clearTimeout(timer);
      controller.abort();
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [hydrated, loadingAddresses, dest.province, dest.city, locationValid, cartSignature, postalKey, addressKey, selectedAddressId, quoteKey]);

  // idle / invalid states are derived (no setState in the effect); remote states come from the quote request
  const shipping: ShippingState =
    !dest.province || !dest.city
      ? { status: "idle" }
      : !locationValid
        ? {
            status: "error",
            message: "استان یا شهر این آدرس معتبر نیست؛ لطفاً آدرس را ویرایش کنید",
          }
        : fetched?.key === quoteKey
          ? fetched.state
          : { status: "loading" };

  const shippingCost = shipping.status === "ok" ? shipping.cost : 0;

  if (!hydrated || loadingAddresses) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center text-ink-soft">
        سبد خرید شما خالی است.
      </div>
    );
  }

  const subtotal = pricing.subtotal;
  const grandTotal = subtotal + shippingCost;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    let payload: typeof emptyForm & { receiverName: string; receiverPhone: string };

    if (selectedAddressId !== "new") {
      const addr = addresses.find((a) => a.id === selectedAddressId);
      if (!addr) return;
      payload = {
        province: addr.province,
        city: addr.city,
        addressLine: addr.addressLine,
        postalCode: addr.postalCode || "",
        receiverName: differentRecipient ? form.receiverName : addr.receiverName,
        receiverPhone: differentRecipient ? form.receiverPhone : addr.receiverPhone,
      };
      if (differentRecipient && (!form.receiverName || !form.receiverPhone)) {
        setError("اطلاعات تحویل‌گیرنده را کامل وارد کنید");
        toast.error("اطلاعات تحویل‌گیرنده را کامل وارد کنید");
        return;
      }
    } else {
      const requiredOk =
        form.province && form.city && form.addressLine && form.receiverName && form.receiverPhone;
      if (!requiredOk) {
        setError("لطفاً همه‌ی فیلدهای آدرس را کامل وارد کنید");
        toast.error("لطفاً همه‌ی فیلدهای آدرس را کامل وارد کنید");
        return;
      }
      payload = form;
    }

    if (!pricing.meetsMinimum) {
      toast.error(`حداقل خرید برای مشتریان همکار ${formatWeightGrams(pricing.minWeightGrams)} است`);
      return;
    }

    if (shipping.status !== "ok") {
      toast.error(
        shipping.status === "loading"
          ? "لطفاً تا پایان محاسبه هزینه ارسال صبر کنید"
          : "هزینه ارسال محاسبه نشده است؛ آدرس را بررسی کنید"
      );
      return;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ variantId: i.variantId, quantity: i.quantity })),
          ...payload,
          saveAddress: selectedAddressId === "new" && saveAddress,
          addressTitle: addressTitle || "آدرس جدید",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        toast.error(data.error || "خطایی رخ داد");
        return;
      }
      toast.info("در حال انتقال به درگاه پرداخت...");
      window.location.href = data.paymentUrl;
    } catch {
      setError("ارتباط با سرور برقرار نشد");
      toast.error("ارتباط با سرور برقرار نشد");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="mx-auto max-w-4xl px-4 py-10 md:py-14 grid md:grid-cols-[1fr_320px] gap-8">
      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <h2 className="font-bold text-ink mb-3">آدرس تحویل سفارش</h2>

          {addresses.length > 0 && (
            <div className="space-y-2 mb-4">
              {addresses.map((addr) => (
                <label
                  key={addr.id}
                  className={`block cursor-pointer rounded-xl border p-4 text-sm ${
                    selectedAddressId === addr.id
                      ? "border-coffee bg-paper-deep/40"
                      : "border-line bg-cream"
                  }`}
                >
                  <input
                    type="radio"
                    name="address"
                    className="ml-2 accent-[var(--color-coffee)]"
                    checked={selectedAddressId === addr.id}
                    onChange={() => setSelectedAddressId(addr.id)}
                  />
                  <span className="font-semibold text-ink">{addr.title}</span>
                  <span className="block mt-1 text-ink-soft">
                    {addr.province}، {addr.city}، {addr.addressLine}
                  </span>
                  <span className="block text-ink-soft">
                    تحویل‌گیرنده: {addr.receiverName} — {addr.receiverPhone}
                  </span>
                </label>
              ))}

              <label
                className={`block cursor-pointer rounded-xl border p-4 text-sm ${
                  selectedAddressId === "new"
                    ? "border-coffee bg-paper-deep/40"
                    : "border-line bg-cream"
                }`}
              >
                <input
                  type="radio"
                  name="address"
                  className="ml-2 accent-[var(--color-coffee)]"
                  checked={selectedAddressId === "new"}
                  onChange={() => setSelectedAddressId("new")}
                />
                آدرس جدید
              </label>
            </div>
          )}

          {selectedAddressId === "new" ? (
            <div className="space-y-3">
              <LocationSelect
                province={form.province}
                city={form.city}
                onChange={({ province, city }) => setForm((f) => ({ ...f, province, city }))}
              />
              <textarea
                placeholder="آدرس کامل (خیابان، کوچه، پلاک، واحد)"
                value={form.addressLine}
                onChange={(e) => setForm({ ...form, addressLine: e.target.value })}
                rows={2}
                className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
              />
              <input
                placeholder="کد پستی (اختیاری)"
                value={form.postalCode}
                onChange={(e) => setForm({ ...form, postalCode: e.target.value })}
                className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
              />
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="نام تحویل‌گیرنده"
                  value={form.receiverName}
                  onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
                  className="rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
                />
                <input
                  placeholder="موبایل تحویل‌گیرنده"
                  dir="ltr"
                  value={form.receiverPhone}
                  onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })}
                  className="rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-center focus:border-coffee"
                />
              </div>
              <label className="flex items-center gap-2 text-sm text-ink-soft">
                <input
                  type="checkbox"
                  checked={saveAddress}
                  onChange={(e) => setSaveAddress(e.target.checked)}
                  className="accent-[var(--color-coffee)]"
                />
                این آدرس را برای دفعات بعد ذخیره کن
              </label>
              {saveAddress && (
                <input
                  placeholder="عنوان آدرس (مثلاً خانه، محل کار)"
                  value={addressTitle}
                  onChange={(e) => setAddressTitle(e.target.value)}
                  className="w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
                />
              )}
            </div>
          ) : (
            <label className="flex items-center gap-2 text-sm text-ink-soft">
              <input
                type="checkbox"
                checked={differentRecipient}
                onChange={(e) => setDifferentRecipient(e.target.checked)}
                className="accent-[var(--color-coffee)]"
              />
              تحویل‌گیرنده شخص دیگری است
            </label>
          )}

          {selectedAddressId !== "new" && !locationValid && (
            <p className="mt-3 text-sm text-red-700">
              استان یا شهر این آدرس در فهرست معتبر نیست.{" "}
              <Link href="/account/addresses" className="underline">
                ویرایش آدرس
              </Link>
            </p>
          )}

          {selectedAddressId !== "new" && differentRecipient && (
            <div className="mt-3 grid grid-cols-2 gap-3">
              <input
                placeholder="نام تحویل‌گیرنده"
                value={form.receiverName}
                onChange={(e) => setForm({ ...form, receiverName: e.target.value })}
                className="rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
              />
              <input
                placeholder="موبایل تحویل‌گیرنده"
                dir="ltr"
                value={form.receiverPhone}
                onChange={(e) => setForm({ ...form, receiverPhone: e.target.value })}
                className="rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-center focus:border-coffee"
              />
            </div>
          )}
        </div>

        {error && <p className="text-sm text-red-700">{error}</p>}

        {!pricing.meetsMinimum && (
          <p className="rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-sm text-amber-900">
            حداقل خرید برای مشتریان همکار {formatWeightGrams(pricing.minWeightGrams)} است. وزن فعلی
            سبد شما {formatWeightGrams(pricing.totalWeightGrams)} است.
          </p>
        )}

        <button
          type="submit"
          disabled={submitting || shipping.status !== "ok" || !pricing.meetsMinimum}
          className="w-full flex items-center justify-center gap-2 rounded-full bg-ink py-3.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
        >
          {submitting ? (<><Spinner className="h-4 w-4" /> در حال انتقال به درگاه...</>) : "پرداخت و ثبت سفارش"}
        </button>
      </form>

      {/* summary */}
      <aside className="h-fit rounded-2xl border border-line bg-cream p-5">
        <h3 className="font-bold text-ink mb-4">خلاصه سفارش</h3>
        <ul className="space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.variantId} className="flex justify-between text-ink-soft">
              <span>
                {item.name} × {item.quantity}
                <span className="block text-xs">
                  {weightLabel(item.weight)}
                  {item.grindTypeName ? ` · ${item.grindTypeName}` : ""}
                </span>
              </span>
              <span className="text-ink">{formatToman(pricing.unitPrice(item) * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-line space-y-2 text-sm">
          <div className="flex justify-between text-ink-soft">
            <span>جمع سبد</span>
            <span className="text-ink">{formatToman(subtotal)}</span>
          </div>
          <div className="flex justify-between text-ink-soft">
            <span>هزینه ارسال</span>
            <span className="text-ink">
              {shipping.status === "loading" && "در حال محاسبه..."}
              {shipping.status === "idle" && "پس از انتخاب شهر"}
              {shipping.status === "error" && "محاسبه نشد"}
              {shipping.status === "ok" &&
                (shipping.free ? "رایگان" : formatToman(shipping.cost))}
            </span>
          </div>
          {shipping.status === "error" && (
            <p className="text-xs text-red-700">{shipping.message}</p>
          )}
          <div className="flex justify-between pt-2 border-t border-line font-bold text-ink">
            <span>مبلغ قابل پرداخت</span>
            <span>
              {shipping.status === "ok" ? formatToman(grandTotal) : formatToman(subtotal)}
            </span>
          </div>
        </div>
      </aside>
    </div>
  );
}
