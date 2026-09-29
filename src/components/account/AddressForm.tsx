"use client";

import { useState } from "react";
import LocationSelect from "@/components/ui/LocationSelect";
import { toast } from "@/lib/toast-store";

export type AddressFormValues = {
  title: string;
  province: string;
  city: string;
  addressLine: string;
  postalCode: string;
  receiverName: string;
  receiverPhone: string;
  isDefault: boolean;
};

const empty: AddressFormValues = {
  title: "",
  province: "",
  city: "",
  addressLine: "",
  postalCode: "",
  receiverName: "",
  receiverPhone: "",
  isDefault: false,
};

export default function AddressForm({
  initial,
  onSubmit,
  onCancel,
}: {
  initial?: AddressFormValues;
  onSubmit: (values: AddressFormValues) => Promise<void>;
  onCancel: () => void;
}) {
  const [values, setValues] = useState<AddressFormValues>(initial ?? empty);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const set = (key: keyof AddressFormValues, value: string | boolean) =>
    setValues((v) => ({ ...v, [key]: value }));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (
      !values.title ||
      !values.province ||
      !values.city ||
      !values.addressLine ||
      !values.receiverName ||
      !values.receiverPhone
    ) {
      setError("لطفاً همه‌ی فیلدهای ضروری را پر کنید");
      toast.error("لطفاً همه‌ی فیلدهای ضروری را پر کنید");
      return;
    }
    setSaving(true);
    setError("");
    try {
      await onSubmit(values);
    } catch (err) {
      const msg = err instanceof Error && err.message ? err.message : "ذخیره آدرس با خطا مواجه شد";
      setError(msg);
      toast.error(msg);
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3 rounded-2xl border border-line bg-cream p-5">
      <input
        placeholder="عنوان آدرس (مثلاً خانه، محل کار)"
        value={values.title}
        onChange={(e) => set("title", e.target.value)}
        className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm focus:border-coffee"
      />
      <LocationSelect
        province={values.province}
        city={values.city}
        onChange={({ province, city }) => setValues((v) => ({ ...v, province, city }))}
      />
      <textarea
        placeholder="آدرس کامل"
        value={values.addressLine}
        onChange={(e) => set("addressLine", e.target.value)}
        rows={2}
        className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm focus:border-coffee"
      />
      <input
        placeholder="کد پستی (اختیاری)"
        value={values.postalCode}
        onChange={(e) => set("postalCode", e.target.value)}
        className="w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm focus:border-coffee"
      />
      <div className="grid grid-cols-2 gap-3">
        <input
          placeholder="نام تحویل‌گیرنده"
          value={values.receiverName}
          onChange={(e) => set("receiverName", e.target.value)}
          className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm focus:border-coffee"
        />
        <input
          placeholder="موبایل تحویل‌گیرنده"
          dir="ltr"
          value={values.receiverPhone}
          onChange={(e) => set("receiverPhone", e.target.value)}
          className="rounded-xl border border-line bg-paper px-4 py-2.5 text-sm text-center focus:border-coffee"
        />
      </div>
      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={values.isDefault}
          onChange={(e) => set("isDefault", e.target.checked)}
          className="accent-[var(--color-coffee)]"
        />
        آدرس پیش‌فرض باشد
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <div className="flex gap-3">
        <button
          type="submit"
          disabled={saving}
          className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
        >
          {saving ? "در حال ذخیره..." : "ذخیره آدرس"}
        </button>
        <button
          type="button"
          onClick={onCancel}
          className="rounded-full border border-line px-6 py-2.5 text-sm text-ink-soft hover:border-coffee transition-colors"
        >
          انصراف
        </button>
      </div>
    </form>
  );
}
