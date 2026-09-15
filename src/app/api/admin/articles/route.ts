import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { listAllArticlesForAdmin, createArticle } from "@/server/repo/articles";
import { saveUploadedImage } from "@/server/uploads";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  return NextResponse.json({ articles: listAllArticlesForAdmin() });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  const title = String(form.get("title") ?? "").trim();
  const excerpt = String(form.get("excerpt") ?? "");
  const content = String(form.get("content") ?? "").trim();
  const published = form.get("published") === "true";
  const image = form.get("coverImage");

  if (!slug || !title || !content) {
    return NextResponse.json({ error: "عنوان، اسلاگ و متن الزامی است" }, { status: 400 });
  }

  let coverImageUrl: string | undefined;
  if (image instanceof File && image.size > 0) {
    const uploaded = await saveUploadedImage(image);
    if (uploaded.error) return NextResponse.json({ error: uploaded.error }, { status: 400 });
    coverImageUrl = uploaded.url;
  }

  try {
    const article = createArticle({ slug, title, excerpt, content, published, coverImageUrl });
    return NextResponse.json({ article });
  } catch {
    return NextResponse.json({ error: "این اسلاگ قبلاً استفاده شده است" }, { status: 409 });
  }
}
