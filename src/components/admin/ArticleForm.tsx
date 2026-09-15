"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";

type Initial = {
  id: string;
  slug: string;
  title: string;
  excerpt: string | null;
  content: string;
  published: boolean;
  coverImageUrl: string | null;
};

export default function ArticleForm({ initial }: { initial?: Initial }) {
  const router = useRouter();
  const [slug, setSlug] = useState(initial?.slug ?? "");
  const [title, setTitle] = useState(initial?.title ?? "");
  const [excerpt, setExcerpt] = useState(initial?.excerpt ?? "");
  const [content, setContent] = useState(initial?.content ?? "");
  const [published, setPublished] = useState(initial?.published ?? true);
  const [coverImage, setCoverImage] = useState<File | null>(null);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!slug || !title || !content) {
      setError("عنوان، اسلاگ و متن الزامی است");
      return;
    }
    setSaving(true);
    const form = new FormData();
    form.set("slug", slug);
    form.set("title", title);
    form.set("excerpt", excerpt);
    form.set("content", content);
    form.set("published", String(published));
    if (coverImage) form.set("coverImage", coverImage);

    try {
      const res = await fetch(
        initial ? `/api/admin/articles/${initial.id}` : "/api/admin/articles",
        { method: initial ? "PATCH" : "POST", body: form }
      );
      const data = await res.json();
      if (!res.ok) {
        setError(data.error || "خطایی رخ داد");
        return;
      }
      router.push("/admin/articles");
      router.refresh();
    } finally {
      setSaving(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="max-w-2xl space-y-4">
      <div className="grid sm:grid-cols-2 gap-4">
        <div>
          <label className="text-sm text-ink-soft">عنوان</label>
          <input
            value={title}
            onChange={(e) => setTitle(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
          />
        </div>
        <div>
          <label className="text-sm text-ink-soft">اسلاگ</label>
          <input
            value={slug}
            dir="ltr"
            onChange={(e) => setSlug(e.target.value)}
            className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm text-left focus:border-coffee"
          />
        </div>
      </div>

      <div>
        <label className="text-sm text-ink-soft">خلاصه</label>
        <input
          value={excerpt}
          onChange={(e) => setExcerpt(e.target.value)}
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
        />
      </div>

      <div>
        <label className="text-sm text-ink-soft">متن مقاله</label>
        <textarea
          value={content}
          onChange={(e) => setContent(e.target.value)}
          rows={8}
          className="mt-1.5 w-full rounded-xl border border-line bg-cream px-4 py-2.5 text-sm focus:border-coffee"
        />
      </div>

      <div>
        <label className="text-sm text-ink-soft">تصویر کاور</label>
        {initial?.coverImageUrl && !coverImage && (
          <Image
            src={initial.coverImageUrl}
            alt=""
            width={100}
            height={60}
            className="mt-2 rounded-lg object-cover"
          />
        )}
        <input
          type="file"
          accept="image/png,image/jpeg,image/webp,image/gif"
          onChange={(e) => setCoverImage(e.target.files?.[0] ?? null)}
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
        منتشر شود
      </label>

      {error && <p className="text-sm text-red-700">{error}</p>}

      <button
        type="submit"
        disabled={saving}
        className="rounded-full bg-ink px-6 py-2.5 text-sm font-semibold text-cream hover:bg-coffee-deep transition-colors disabled:opacity-60"
      >
        {saving ? "در حال ذخیره..." : initial ? "ذخیره تغییرات" : "افزودن مقاله"}
      </button>
    </form>
  );
}
