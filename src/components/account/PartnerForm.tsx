"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import LocationSelect from "@/components/ui/LocationSelect";
import Spinner from "@/components/Spinner";
import { toast } from "@/lib/toast-store";
import { PARTNER_MIN_WEIGHT_LABEL, PARTNER_STATUS_LABEL, type PartnerStatus } from "@/lib/partner";

export type PartnerApplicationView = {
  ownerName: string;
  nationalCode: string;
  cafeName: string;
  cafePhone: string;
  province: string;
  city: string;
  addressLine: string;
  licenseNumber: string | null;
  instagram: string | null;
  status: PartnerStatus;
  adminNote: string | null;
};

const inputCls =
  "mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee";

export default function PartnerForm({
  isPartner,
  application,
}: {
  isPartner: boolean;
  application: PartnerApplicationView | null;
}) {
  const router = useRouter();
  const status = application?.status;
  const [editing, setEditing] = useState(false);
  const [saving, setSaving] = useState(false);
  const [values, setValues] = useState({
    ownerName: application?.ownerName ?? "",
    nationalCode: application?.nationalCode ?? "",
    cafeName: application?.cafeName ?? "",
    cafePhone: application?.cafePhone ?? "",
    province: application?.province ?? "",
    city: application?.city ?? "",
    addressLine: application?.addressLine ?? "",
    licenseNumber: application?.licenseNumber ?? "",
    instagram: application?.instagram ?? "",
  });
  const set = (patch: Partial<typeof values>) => setValues((v) => ({ ...v, ...patch }));

  if (isPartner || status === "APPROVED") {
    return (
      <div className="rounded-2xl border border-emerald-300 bg-emerald-50 p-5 text-emerald-900">
        <p className="font-bold">حساب شما به‌عنوان همکار تأیید شده است ✓</p>
        <p className="mt-2 text-sm leading-7">
          قیمت‌های همکار در فروشگاه و سبد خرید برای شما اعمال می‌شود. حداقل خرید برای مشتریان
          همکار {PARTNER_MIN_WEIGHT_LABEL} است.
        </p>
      </div>
    );
  }

  if (status === "PENDING" && !editing) {
    return (
      <div className="rounded-2xl border border-amber-300 bg-amber-50 p-5 text-amber-900">
        <p className="font-bold">درخواست شما ثبت شد و در انتظار بررسی است</p>
        <p className="mt-2 text-sm leading-7">
          پس از تأیید مدیریت، قیمت‌های همکار برای شما فعال می‌شود. کافه: {application?.cafeName}
        </p>
      </div>
    );
  }

  const submit = async (e: React.FormEvent) => {
    e.preventDefault();
    const required = [values.ownerName, values.nationalCode, values.cafeName, values.cafePhone, values.province, values.city, values.addressLine];
    if (required.some((v) => !v.trim())) {
      toast.error("لطفاً همه‌ی فیلدهای ضروری را پر کنید");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch("/api/account/partner", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(values),
      });
      const data = await res.json().catch(() => null);
      if (!res.ok) throw new Error(data?.error || "ثبت درخواست ناموفق بود");
      toast.success("درخواست شما ثبت شد و پس از بررسی نتیجه اعلام می‌شود");
      setEditing(false);
      router.refresh();
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ثبت درخواست ناموفق بود");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={submit} className="space-y-4 max-w-xl">
      {status === "REJECTED" && (
        <div className="rounded-2xl border border-red-300 bg-red-50 p-4 text-sm text-red-900">
          <p className="font-bold">{PARTNER_STATUS_LABEL.REJECTED}</p>
          {application?.adminNote && <p className="mt-1 leading-7">{application.adminNote}</p>}
          <p className="mt-1">می‌توانید اطلاعات را اصلاح و دوباره ارسال کنید.</p>
        </div>
      )}

      <p className="text-sm leading-7 text-ink-soft">
        برای استفاده از قیمت همکار، اطلاعات خود و کافه‌تان را وارد کنید. پس از تأیید مدیریت،
        قیمت‌های همکار فعال می‌شود. حداقل خرید همکاران {PARTNER_MIN_WEIGHT_LABEL} است.
      </p>

      <h3 className="font-bold text-ink pt-2">مشخصات شما</h3>
      <div>
        <label className="text-sm text-ink-soft">نام و نام خانوادگی *</label>
        <input value={values.ownerName} onChange={(e) => set({ ownerName: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className="text-sm text-ink-soft">کد ملی *</label>
        <input
          inputMode="numeric"
          dir="ltr"
          maxLength={10}
          value={values.nationalCode}
          onChange={(e) => set({ nationalCode: e.target.value })}
          className={inputCls}
        />
      </div>

      <h3 className="font-bold text-ink pt-2">مشخصات کافه</h3>
      <div>
        <label className="text-sm text-ink-soft">نام کافه / مجموعه *</label>
        <input value={values.cafeName} onChange={(e) => set({ cafeName: e.target.value })} className={inputCls} />
      </div>
      <div>
        <label className="text-sm text-ink-soft">تلفن کافه *</label>
        <input
          inputMode="tel"
          dir="ltr"
          value={values.cafePhone}
          onChange={(e) => set({ cafePhone: e.target.value })}
          className={inputCls}
        />
      </div>
      <div>
        <label className="text-sm text-ink-soft mb-1.5 block">استان و شهر *</label>
        <LocationSelect
          province={values.province}
          city={values.city}
          onChange={({ province, city }) => set({ province, city })}
        />
      </div>
      <div>
        <label className="text-sm text-ink-soft">آدرس کافه *</label>
        <textarea
          rows={3}
          value={values.addressLine}
          onChange={(e) => set({ addressLine: e.target.value })}
          className={inputCls}
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <label className="text-sm text-ink-soft">شماره پروانه کسب (اختیاری)</label>
          <input
            dir="ltr"
            value={values.licenseNumber}
            onChange={(e) => set({ licenseNumber: e.target.value })}
            className={inputCls}
          />
        </div>
        <div>
          <label className="text-sm text-ink-soft">اینستاگرام (اختیاری)</label>
          <input
            dir="ltr"
            placeholder="@page"
            value={values.instagram}
            onChange={(e) => set({ instagram: e.target.value })}
            className={inputCls}
          />
        </div>
      </div>

      <button
        type="submit"
        disabled={saving}
        className="flex items-center gap-2 rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
      >
        {saving && <Spinner className="h-4 w-4" />}
        {status === "REJECTED" ? "ارسال مجدد درخواست" : "ارسال درخواست همکاری"}
      </button>
    </form>
  );
}
