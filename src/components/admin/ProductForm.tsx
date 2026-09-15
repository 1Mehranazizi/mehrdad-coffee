"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { weightOptions } from "@/lib/products";

type Category = { id: string; title: string };

type Initial = {
  id: string;
  slug: string;
  name: string;
  origin: string;
  price: number;
  weight: string;
  categoryId: string;
  description: string | null;
  published: boolean;
  imageUrl: string | null;
};

export default function ProductForm({
  categories,
  initial,
}: {
  categories: Category[];
  initial?: Initial;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [origin, setOrigin] = useState(initial?.origin ?? "");
  const [price, setPrice] = useState(initial?.price?.toString() ?? "");
  const [weight, setWeight] = useState(initial?.weight ?? weightOptions[0].value);
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!slug || !name || !origin || !price || !categoryId) {
      setError("لطفاً همه‌ی فیلدهای ضروری را پر کنید");
      return;
    }
    setSaving(true);
    const form = new FormData();
    form.set("slug", slug);
    form.set("name", name);
    form.set("origin", origin);
    form.set("price", price);
    form.set("weight", weight);
    form.set("categoryId", categoryId);
    form.set("description", description);
    form.set("published", String(published));
    if (imageFile) form.set("image", imageFile);

    try {
      const res = await fetch(
        initial ? `/api/admin/products/${initial.id}` : "/api/admin/products",
        { method: initial ? "PATCH" : "POST", body: form }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        return;
      }
      router.push("/admin/products");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-ink-soft">نام محصول</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
          />
        </div>
        <div>
          <label className="text-sm text-ink-soft">اسلاگ (لینک انگلیسی)</label>
          <input
            value={slug}
            dir="ltr"
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-left focus:border-coffee"
          />
        </div>
      </div>

      <div className="grid sm:grid-cols-3 gap-4">
        <div>
          <label className="text-sm text-ink-soft">خاستگاه</label>
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
          />
        </div>
        <div>
          <label className="text-sm text-ink-soft">قیمت (تومان)</label>
          <input
            type="number"
            value={price}
            onChange={(e) => setPrice(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
          />
        </div>
        <div>
          <label className="text-sm text-ink-soft">وزن</label>
          <select
            value={weight}
            onChange={(e) => setWeight(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
          >
            {weightOptions.map((w) => (
              <option key={w.value} value={w.value}>
                {w.label}
              </option>
            ))}
          </select>
        </div>
      </div>

      <div>
        <label className="text-sm text-ink-soft">دسته‌بندی</label>
        <select
          value={categoryId}
          onChange={(e) => setCategoryId(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
        >
          {categories.map((c) => (
            <option key={c.id} value={c.id}>
              {c.title}
            </option>
          ))}
        </select>
      </div>

      <div>
        <label className="text-sm text-ink-soft">توضیحات</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          rows={3}
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
        />
      </div>

      <div>
        <label className="text-sm text-ink-soft">تصویر محصول</label>
        {initial?.imageUrl && !imageFile && (
          <Image
            src={initial.imageUrl}
            alt=""
            width={80}
            height={80}
            className="mt-2 rounded-lg object-cover"
          />
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(e) => setImageFile(e.target.files?.[0] ?? null)}
          className="mt-1.5 w-full text-sm"
        />
      </div>

      <label className="flex items-center gap-2 text-sm text-ink-soft">
        <input
          type="checkbox"
          checked={published}
          onChange={(e) => setPublished(e.target.checked)}
          className="accent-[var(--color-coffee)]"
        />
        نمایش در فروشگاه (منتشر شده)
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
      >
        {saving ? "در حال ذخیره..." : initial ? "ذخیره تغییرات" : "افزودن محصول"}
      </button>
    </form>
  );
}
