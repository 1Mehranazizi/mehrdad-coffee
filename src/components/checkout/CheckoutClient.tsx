"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useCartStore, cartTotal } from "@/lib/cart-store";
import { formatToman, weightLabel } from "@/lib/products";

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

  if (!hydrated || loadingAddresses) return null;

  if (items.length === 0) {
    return (
      <div className="mx-auto max-w-2xl px-4 py-24 text-center text-ink-soft">
        سبد خرید شما خالی است.
      </div>
    );
  }

  const subtotal = cartTotal(items);

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
        return;
      }
    } else {
      const requiredOk =
        form.province && form.city && form.addressLine && form.receiverName && form.receiverPhone;
      if (!requiredOk) {
        setError("لطفاً همه‌ی فیلدهای آدرس را کامل وارد کنید");
        return;
      }
      payload = form;
    }

    setSubmitting(true);
    try {
      const res = await fetch("/api/checkout", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          items: items.map((i) => ({ productId: i.productId, quantity: i.quantity })),
          ...payload,
          saveAddress: selectedAddressId === "new" && saveAddress,
          addressTitle: addressTitle || "آدرس جدید",
        }),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        return;
      }
      window.location.href = data.paymentUrl;
    } catch {
      setError("ارتباط با سرور برقرار نشد");
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
              <div className="grid grid-cols-2 gap-3">
                <input
                  placeholder="استان"
                  value={form.province}
                  onChange={(e) => setForm({ ...form, province: e.target.value })}
                  className="rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
                />
                <input
                  placeholder="شهر"
                  value={form.city}
                  onChange={(e) => setForm({ ...form, city: e.target.value })}
                  className="rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
                />
              </div>
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

        <button
          type="submit"
          disabled={submitting}
          className="w-full rounded-full bg-ink py-3.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
        >
          {submitting ? "در حال انتقال به درگاه..." : "پرداخت و ثبت سفارش"}
        </button>
      </form>

      {/* summary */}
      <aside className="h-fit rounded-2xl border border-line bg-cream p-5">
        <h3 className="font-bold text-ink mb-4">خلاصه سفارش</h3>
        <ul className="space-y-3 text-sm">
          {items.map((item) => (
            <li key={item.productId} className="flex justify-between text-ink-soft">
              <span>
                {item.name} × {item.quantity}
                <span className="block text-xs">{weightLabel(item.weight)}</span>
              </span>
              <span className="text-ink">{formatToman(item.price * item.quantity)}</span>
            </li>
          ))}
        </ul>
        <div className="mt-4 pt-4 border-t border-line flex justify-between font-bold text-ink">
          <span>جمع سبد</span>
          <span>{formatToman(subtotal)}</span>
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          هزینه‌ی ارسال پس از ثبت، بر اساس مبلغ سفارش محاسبه و به مبلغ نهایی
          اضافه می‌شود.
        </p>
      </aside>
    </div>
  );
}
