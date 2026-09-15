import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { listCategories, createCategory } from "@/server/repo/categories";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  return NextResponse.json({ categories: listCategories() });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const body = await request.json().catch(() => null);
  if (!body?.slug || !body?.title) {
    return NextResponse.json({ error: "عنوان و اسلاگ الزامی است" }, { status: 400 });
  }
  const category = createCategory({
    slug: body.slug,
    title: body.title,
    description: body.description,
  });
  return NextResponse.json({ category });
}
