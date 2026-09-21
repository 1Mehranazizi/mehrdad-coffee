"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Pencil, Plus } from "lucide-react";
import Modal from "@/components/admin/Modal";

type CustomerData = { id: string; name: string | null; phone: string };

function CustomerFormModal({
  open,
  onClose,
  customer,
}: {
  open: boolean;
  onClose: () => void;
  customer?: CustomerData;
}) {
  const router = useRouter();
  const [name, setName] = useState(customer?.name ?? "");
  const [phone, setPhone] = useState(customer?.phone ?? "");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const isEdit = Boolean(customer);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!phone.trim()) {
      setError("شماره موبایل الزامی است");
      return;
    }
    setSaving(true);
    try {
      const res = await fetch(
        isEdit ? `/api/admin/customers/${customer!.id}` : "/api/admin/customers",
        {
          method: isEdit ? "PATCH" : "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ name, phone }),
        }
      );
      const data = await res.json().catch(() => null);
      if (!res.ok) {
        setError(data?.error || "ذخیره‌سازی انجام نشد");
        return;
      }
      if (!isEdit) {
        setName("");
        setPhone("");
      }
      onClose();
      router.refresh();
    } catch {
      setError("خطا در ارتباط با سرور");
    } finally {
      setSaving(false);
    }
  };

  const inputCls =
    "w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-ink focus:border-coffee";

  return (
    <Modal open={open} onClose={onClose} title={isEdit ? "ویرایش مشتری" : "افزودن مشتری"}>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="customer-name" className="mb-1.5 block text-sm text-ink-soft">
            نام و نام خانوادگی
          </label>
          <input
            id="customer-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            maxLength={100}
            autoComplete="off"
            className={inputCls}
          />
        </div>
        <div>
          <label htmlFor="customer-phone" className="mb-1.5 block text-sm text-ink-soft">
            شماره موبایل <span className="text-red-700">*</span>
          </label>
          <input
            id="customer-phone"
            value={phone}
            onChange={(e) => setPhone(e.target.value)}
            inputMode="numeric"
            dir="ltr"
            placeholder="09123456789"
            autoComplete="off"
            className={`${inputCls} text-left`}
          />
          {isEdit && (
            <p className="mt-1.5 text-xs text-ink-soft">
              مشتری با همین شماره وارد حساب خود می‌شود؛ با تغییر آن، ورود با شماره‌ی قبلی ممکن نخواهد بود.
            </p>
          )}
        </div>

        {error && (
          <p role="alert" className="text-sm text-red-700">
            {error}
          </p>
        )}

        <div className="flex items-center justify-end gap-2 pt-1">
          <button
            type="button"
            onClick={onClose}
            className="rounded-full px-5 py-2.5 text-sm text-ink-soft hover:bg-paper-deep"
          >
            انصراف
          </button>
          <button
            type="submit"
            disabled={saving}
            className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-coffee-deep disabled:opacity-60"
          >
            {saving ? "در حال ذخیره…" : isEdit ? "ذخیره تغییرات" : "افزودن مشتری"}
          </button>
        </div>
      </form>
    </Modal>
  );
}

export function AddCustomerButton() {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-semibold text-cream transition-colors hover:bg-coffee-deep"
      >
        <Plus size={16} />
        مشتری جدید
      </button>
      {/* remount on open so the form always starts empty */}
      {open && <CustomerFormModal open onClose={() => setOpen(false)} />}
    </>
  );
}

export function EditCustomerButton({ customer }: { customer: CustomerData }) {
  const [open, setOpen] = useState(false);
  return (
    <>
      <button
        onClick={() => setOpen(true)}
        aria-label="ویرایش مشتری"
        className="rounded-full p-2 text-ink-soft hover:bg-paper-deep hover:text-ink"
      >
        <Pencil size={16} />
      </button>
      {/* remount on open so the form always starts from the saved values */}
      {open && <CustomerFormModal open customer={customer} onClose={() => setOpen(false)} />}
    </>
  );
}
