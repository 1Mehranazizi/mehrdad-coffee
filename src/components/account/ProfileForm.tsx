"use client";

import { useState } from "react";
import { toast } from "@/lib/toast-store";

export default function ProfileForm({ initialName }: { initialName: string }) {
  const [name, setName] = useState(initialName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    setSaved(false);
    try {
      const res = await fetch("/api/account/profile", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ name }),
      });
      if (!res.ok) {
        const data = await res.json().catch(() => null);
        throw new Error(data?.error || "ذخیره تغییرات با خطا مواجه شد");
      }
      setSaved(true);
      toast.success("اطلاعات حساب ذخیره شد");
    } catch (err) {
      toast.error(err instanceof Error ? err.message : "ذخیره تغییرات با خطا مواجه شد");
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-3">
      <div>
        <label className="text-sm text-ink-soft">نام و نام خانوادگی</label>
        <input
          value={name}
          onChange={(e) => setName(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
        />
      </div>
      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
      >
        {saving ? "در حال ذخیره..." : "ذخیره تغییرات"}
      </button>
      {saved && <span className="mr-3 text-sm text-coffee">ذخیره شد ✓</span>}
    </form>
  );
}
