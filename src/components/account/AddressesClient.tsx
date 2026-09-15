"use client";

import { useEffect, useState } from "react";
import { Pencil, Plus, Star, Trash2 } from "lucide-react";
import AddressForm, { type AddressFormValues } from "@/components/account/AddressForm";

type Address = AddressFormValues & { id: string };

export default function AddressesClient() {
  const [addresses, setAddresses] = useState<Address[]>([]);
  const [loading, setLoading] = useState(true);
  const [editing, setEditing] = useState<Address | "new" | null>(null);

  const load = () => {
    setLoading(true);
    fetch("/api/addresses")
      .then((r) => r.json())
      .then((data) =>
        setAddresses(
          (data.addresses || []).map((a: Record<string, unknown>) => ({
            id: a.id,
            title: a.title,
            province: a.province,
            city: a.city,
            addressLine: a.addressLine,
            postalCode: a.postalCode || "",
            receiverName: a.receiverName,
            receiverPhone: a.receiverPhone,
            isDefault: Boolean(a.isDefault),
          }))
        )
      )
      .finally(() => setLoading(false));
  };

  useEffect(load, []);

  const handleCreate = async (values: AddressFormValues) => {
    await fetch("/api/addresses", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setEditing(null);
    load();
  };

  const handleUpdate = async (id: string, values: AddressFormValues) => {
    await fetch(`/api/addresses/${id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(values),
    });
    setEditing(null);
    load();
  };

  const handleDelete = async (id: string) => {
    if (!confirm("این آدرس حذف شود؟")) return;
    await fetch(`/api/addresses/${id}`, { method: "DELETE" });
    load();
  };

  if (loading) return <p className="text-sm text-ink-soft">در حال بارگذاری...</p>;

  return (
    <div className="space-y-4">
      {addresses.map((addr) =>
        editing !== "new" && editing?.id === addr.id ? (
          <AddressForm
            key={addr.id}
            initial={addr}
            onSubmit={(values) => handleUpdate(addr.id, values)}
            onCancel={() => setEditing(null)}
          />
        ) : (
          <div key={addr.id} className="rounded-2xl border border-line bg-cream p-5">
            <div className="flex items-start justify-between">
              <div>
                <p className="font-semibold text-ink flex items-center gap-1.5">
                  {addr.title}
                  {addr.isDefault && <Star size={14} className="fill-brass text-brass" />}
                </p>
                <p className="mt-1 text-sm text-ink-soft">
                  {addr.province}، {addr.city}، {addr.addressLine}
                </p>
                <p className="text-sm text-ink-soft">
                  تحویل‌گیرنده: {addr.receiverName} — {addr.receiverPhone}
                </p>
              </div>
              <div className="flex gap-1 shrink-0">
                <button
                  onClick={() => setEditing(addr)}
                  aria-label="ویرایش"
                  className="p-2 rounded-full hover:bg-paper-deep text-ink-soft hover:text-ink"
                >
                  <Pencil size={16} />
                </button>
                <button
                  onClick={() => handleDelete(addr.id)}
                  aria-label="حذف"
                  className="p-2 rounded-full hover:bg-paper-deep text-ink-soft hover:text-red-700"
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          </div>
        )
      )}

      {editing === "new" ? (
        <AddressForm onSubmit={handleCreate} onCancel={() => setEditing(null)} />
      ) : (
        <button
          onClick={() => setEditing("new")}
          className="flex items-center gap-2 rounded-full border border-dashed border-line px-5 py-2.5 text-sm text-ink-soft hover:border-coffee hover:text-coffee transition-colors"
        >
          <Plus size={16} />
          افزودن آدرس جدید
        </button>
      )}
    </div>
  );
}
