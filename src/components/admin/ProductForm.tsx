"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Plus, Trash2 } from "lucide-react";
import { weightOptions } from "@/lib/products";

type Category = { id: string; title: string; slug?: string };
type Grind = { id: string; title: string; slug: string };
type Variant = { weight: string; grindOptionId: string | null; price: number; active: boolean };
type Initial = {
  id: string; slug: string; name: string; origin: string; price: number; weight: string;
  categoryId: string; description: string | null; published: boolean; imageUrl: string | null;
  variants?: Variant[];
};

export default function ProductForm({
  categories, grindOptions, initial,
}: { categories: Category[]; grindOptions: Grind[]; initial?: Initial }) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [name, setName] = useState(initial?.name ?? "");
  const [origin, setOrigin] = useState(initial?.origin ?? "");
  const [categoryId, setCategoryId] = useState(initial?.categoryId ?? categories[0]?.id ?? "");
  const selectedCategory = categories.find((c) => c.id === categoryId);
  const isCoffee = selectedCategory?.slug === "coffee";
  const [description, setDescription] = useState(initial?.description ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [variants, setVariants] = useState<Variant[]>(
    initial?.variants?.length ? initial.variants : [{ weight: initial?.weight ?? "250", grindOptionId: null, price: initial?.price ?? 0, active: true }]
  );
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const addVariant = () => setVariants((v) => [...v, { weight: "250", grindOptionId: isCoffee ? grindOptions[0]?.id ?? null : null, price: 0, active: true }]);
  const updateVariant = (i: number, patch: Partial<Variant>) => setVariants((v) => v.map((x, n) => n === i ? { ...x, ...patch } : x));
  const removeVariant = (i: number) => setVariants((v) => v.filter((_, n) => n !== i));

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setError("");
    if (!slug || !name || !origin || !categoryId || variants.length === 0 || variants.some((v) => !v.price || v.price <= 0)) {
      setError("نام، اسلاگ، خاستگاه و حداقل یک متغیر با قیمت معتبر الزامی است"); return;
    }
    if (isCoffee && variants.some((v) => !v.grindOptionId)) {
      setError("برای محصولات قهوه، نوع آسیاب را برای هر وزن انتخاب کنید"); return;
    }
    setSaving(true);
    const first = variants[0];
    const form = new FormData();
    form.set("slug", slug); form.set("name", name); form.set("origin", origin);
    form.set("price", String(first.price)); form.set("weight", first.weight);
    form.set("categoryId", categoryId); form.set("description", description); form.set("published", String(published));
    form.set("variants", JSON.stringify(variants.map((v) => ({ ...v, grindOptionId: isCoffee ? v.grindOptionId : null }))));
    if (imageFile) form.set("image", imageFile);
    try {
      const res = await fetch(initial ? `/api/admin/products/${initial.id}` : "/api/admin/products", { method: initial ? "PATCH" : "POST", body: form });
      const data = await res.json();
      if (!res.ok) { setError(data.error || "خطایی رخ داد"); return; }
      router.push("/admin/products"); router.refresh();
    } catch { setError("ارتباط با سرور برقرار نشد"); }
    finally { setSaving(false); }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-4xl space-y-6">
      <section className="rounded-3xl border border-line bg-cream p-5 sm:p-6 space-y-5">
        <div className="flex items-center justify-between"><div><h2 className="font-bold text-ink">اطلاعات پایه</h2><p className="text-xs text-ink-soft mt-1">اطلاعات اصلی محصول را وارد کنید.</p></div></div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="نام محصول" value={name} onChange={setName} />
          <Field label="اسلاگ (لینک انگلیسی)" value={slug} onChange={setSlug} dir="ltr" />
        </div>
        <div className="grid sm:grid-cols-2 gap-4">
          <Field label="خاستگاه" value={origin} onChange={setOrigin} />
          <div><label className="text-sm text-ink-soft">دسته‌بندی</label><select value={categoryId} onChange={(e) => {
              const next = e.target.value;
              const coffee = categories.find((c) => c.id === next)?.slug === "coffee";
              setCategoryId(next);
              setVariants((current) => current.map((v) => ({ ...v, grindOptionId: coffee ? (v.grindOptionId ?? grindOptions[0]?.id ?? null) : null })));
            }} className="mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm">
            {categories.map((c) => <option key={c.id} value={c.id}>{c.title}</option>)}
          </select></div>
        </div>
        <div><label className="text-sm text-ink-soft">توضیحات</label><textarea value={description} onChange={(e) => setDescription(e.target.value)} rows={4} className="mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm" /></div>
        <div><label className="text-sm text-ink-soft">تصویر محصول</label>{initial?.imageUrl && !imageFile && <Image src={initial.imageUrl} alt="" width={90} height={90} className="mt-2 rounded-2xl object-cover" />}<input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onChange={(e) => setImageFile(e.target.files?.[0] ?? null)} className="mt-2 w-full text-sm" /></div>
        <label className="flex items-center gap-2 text-sm text-ink-soft"><input type="checkbox" checked={published} onChange={(e) => setPublished(e.target.checked)} className="accent-[var(--color-coffee)]" /> نمایش در فروشگاه</label>
      </section>

      <section className="rounded-3xl border border-line bg-cream p-5 sm:p-6">
        <div className="flex items-center justify-between gap-3 mb-4">
          <div><h2 className="font-bold text-ink">متغیرهای محصول</h2><p className="text-xs text-ink-soft mt-1">{isCoffee ? "برای هر وزن، نوع آسیاب و قیمت را تعیین کنید." : "وزن‌های قابل خرید و قیمت هر کدام را تعیین کنید."}</p></div>
          <button type="button" onClick={addVariant} className="inline-flex items-center gap-1.5 rounded-full bg-ink text-cream px-4 py-2 text-xs font-semibold"><Plus size={15}/> متغیر جدید</button>
        </div>
        <div className="space-y-3">
          {variants.map((v, i) => <div key={i} className="grid gap-3 sm:grid-cols-[1fr_1.2fr_1fr_auto] items-end rounded-2xl border border-line bg-paper p-3">
            <div><label className="text-xs text-ink-soft">وزن</label><select value={v.weight} onChange={(e) => updateVariant(i,{weight:e.target.value})} className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm">{weightOptions.map(w=><option key={w.value} value={w.value}>{w.label}</option>)}</select></div>
            {isCoffee ? <div><label className="text-xs text-ink-soft">نوع آسیاب</label><select value={v.grindOptionId ?? ""} onChange={(e)=>updateVariant(i,{grindOptionId:e.target.value || null})} className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm"><option value="">انتخاب آسیاب</option>{grindOptions.map(g=><option key={g.id} value={g.id}>{g.title}</option>)}</select></div> : <div><label className="text-xs text-ink-soft">نوع</label><div className="mt-1 rounded-xl border border-line bg-cream px-3 py-2 text-sm text-ink-soft">بدون آسیاب</div></div>}
            <div><label className="text-xs text-ink-soft">قیمت (تومان)</label><input type="number" min="1" value={v.price || ""} onChange={(e)=>updateVariant(i,{price:Number(e.target.value)})} className="mt-1 w-full rounded-xl border border-line bg-cream px-3 py-2 text-sm"/></div>
            <button type="button" onClick={()=>removeVariant(i)} disabled={variants.length===1} className="h-10 w-10 rounded-full text-ink-soft hover:bg-red-50 hover:text-red-700 disabled:opacity-30" aria-label="حذف متغیر"><Trash2 size={17}/></button>
          </div>)}
        </div>
      </section>
      {error && <p className="text-sm text-red-700 rounded-xl bg-red-50 p-3">{error}</p>}
      <button type="submit" disabled={saving} className="rounded-full bg-ink px-7 py-3 text-sm font-semibold text-cream hover:bg-coffee-deep disabled:opacity-60">{saving ? "در حال ذخیره..." : initial ? "ذخیره تغییرات" : "افزودن محصول"}</button>
    </form>
  );
}

function Field({label,value,onChange,dir}:{label:string;value:string;onChange:(v:string)=>void;dir?: "ltr"|"rtl"}) {
  return <div><label className="text-sm text-ink-soft">{label}</label><input value={value} dir={dir} onChange={(e)=>onChange(e.target.value)} className="mt-1.5 w-full rounded-xl border border-line bg-paper px-4 py-2.5 text-sm"/></div>;
}
