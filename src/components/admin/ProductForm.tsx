"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { weightOptions } from "@/lib/products";
import { toast } from "@/lib/toast-store";

type Category = { id: string; title: string; requiresGrind: boolean };
type GrindType = { id: string; title: string };

type VariantRow = {
  weight: string;
  grindTypeId: string;
  price: string;
  partnerPrice: string;
};

type Initial = {
  id: string;
  slug: string;
  name: string;
  origin: string;
  categoryId: string;
  description: string | null;
  published: boolean;
  imageUrl: string | null;
  variants: { weight: string; grindTypeId: string | null; price: number; partnerPrice: number | null }[];
};

export default function ProductForm({
  categories,
  grindTypes,
  initial,
}: {
  categories: Category[];
  grindTypes: GrindType[];
  initial?: Initial;
}) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [origin, setOrigin] = useState(initial?.origin ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const [description, setDescription] = useState(initial?.description ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [variants, setVariants] = useState<VariantRow[]>(
    initial?.variants.length
      ? initial.variants.map((v) => ({
          weight: v.weight,
          grindTypeId: v.grindTypeId ?? "",
          price: String(v.price),
          partnerPrice: v.partnerPrice != null ? String(v.partnerPrice) : "",
        }))
      : [{ weight: weightOptions[0].value, grindTypeId: "", price: "", partnerPrice: "" }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const selectedCategory = categories.find((c) => c.id === categoryId);
  const requiresGrind = selectedCategory?.requiresGrind ?? false;

  const updateVariant = (index: number, patch: Partial<VariantRow>) => {
    setVariants((rows) => rows.map((r, i) => (i === index ? { ...r, ...patch } : r)));
  };

  const addVariant = () =>
    setVariants((rows) => [...rows, { weight: weightOptions[0].value, grindTypeId: "", price: "", partnerPrice: "" }]);

  const removeVariant = (index: number) =>
    setVariants((rows) => rows.filter((_, i) => i !== index));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");

    if (!slug || !name || !origin || !categoryId) {
      setError("لطفاً همه‌ی فیلدهای ضروری را پر کنید");
      toast.error("لطفاً همه‌ی فیلدهای ضروری را پر کنید");
      return;
    }
    const cleanVariants = variants
      .filter((v) => v.weight && v.price)
      .map((v) => ({
        weight: v.weight,
        grindTypeId: requiresGrind ? v.grindTypeId || null : null,
        price: Number(v.price),
        partnerPrice: v.partnerPrice ? Number(v.partnerPrice) : null,
      }));
    if (cleanVariants.length === 0) {
      setError("حداقل یک گزینه‌ی وزن و قیمت لازم است");
      toast.error("حداقل یک گزینه‌ی وزن و قیمت لازم است");
      return;
    }
    if (requiresGrind && cleanVariants.some((v) => !v.grindTypeId)) {
      setError("برای این دسته‌بندی، نوع آسیاب هر گزینه باید انتخاب شود");
      toast.error("برای این دسته‌بندی، نوع آسیاب هر گزینه باید انتخاب شود");
      return;
    }

    setSaving(true);
    const form = new FormData();
    form.set("slug", slug);
    form.set("name", name);
    form.set("origin", origin);
    form.set("categoryId", categoryId);
    form.set("description", description);
    form.set("published", String(published));
    form.set("variants", JSON.stringify(cleanVariants));
    if (imageFile) form.set("image", imageFile);

    try {
      const res = await fetch(
        initial ? `/api/admin/products/${initial.id}` : "/api/admin/products",
        { method: initial ? "PATCH" : "POST", body: form }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        toast.error(data.error || "خطایی رخ داد");
        return;
      }
      toast.success(initial ? "محصول ویرایش شد" : "محصول ایجاد شد");
      router.push("/admin/products");
      router.refresh();
    } catch {
      toast.error("ارتباط با سرور برقرار نشد");
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

      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-ink-soft">خاستگاه</label>
          <input
            value={origin}
            onChange={(e) => setOrigin(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
          />
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

      {/* variants */}
      <div>
        <div className="flex items-center justify-between mb-2">
          <label className="text-sm font-semibold text-ink">
            گزینه‌های وزن و قیمت{requiresGrind ? " و نوع آسیاب" : ""}
          </label>
          <button
            type="button"
            onClick={addVariant}
            className="flex items-center gap-1 text-xs text-coffee hover:text-coffee-deep"
          >
            <Plus size={14} />
            افزودن گزینه
          </button>
        </div>
        <div className="space-y-2">
          {variants.map((row, i) => (
            <div key={i} className="flex items-center gap-2">
              <select
                value={row.weight}
                onChange={(e) => updateVariant(i, { weight: e.target.value })}
                className="rounded-xl border border-line bg-cream px-3 py-2 text-sm focus:border-coffee"
              >
                {weightOptions.map((w) => (
                  <option key={w.value} value={w.value}>
                    {w.label}
                  </option>
                ))}
              </select>

              {requiresGrind && (
                <select
                  value={row.grindTypeId}
                  onChange={(e) => updateVariant(i, { grindTypeId: e.target.value })}
                  className="flex-1 rounded-xl border border-line bg-cream px-3 py-2 text-sm focus:border-coffee"
                >
                  <option value="">نوع آسیاب...</option>
                  {grindTypes.map((g) => (
                    <option key={g.id} value={g.id}>
                      {g.title}
                    </option>
                  ))}
                </select>
              )}

              <input
                type="number"
                placeholder="قیمت (تومان)"
                value={row.price}
                onChange={(e) => updateVariant(i, { price: e.target.value })}
                className="flex-1 rounded-xl border border-line bg-cream px-3 py-2 text-sm focus:border-coffee"
              />

              <input
                type="number"
                placeholder="قیمت همکار"
                title="قیمت برای مشتریان همکار (خالی = همان قیمت عادی)"
                value={row.partnerPrice}
                onChange={(e) => updateVariant(i, { partnerPrice: e.target.value })}
                className="flex-1 rounded-xl border border-line bg-cream px-3 py-2 text-sm focus:border-coffee"
              />

              <button
                type="button"
                onClick={() => removeVariant(i)}
                disabled={variants.length === 1}
                className="p-2 rounded-full hover:bg-paper-deep text-ink-soft hover:text-red-700 disabled:opacity-30"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
        <p className="mt-2 text-xs text-ink-soft">
          «قیمت همکار» فقط برای مشتریان همکارِ تأییدشده اعمال می‌شود؛ اگر خالی بماند، همان قیمت عادی حساب می‌شود.
        </p>
        {requiresGrind && (
          <p className="mt-2 text-xs text-ink-soft">
            نوع‌های آسیاب رو می‌تونید از بخش «متغیرهای محصول» در منوی کناری اضافه یا ویرایش کنید.
          </p>
        )}
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
