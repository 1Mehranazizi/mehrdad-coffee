import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { getProductById, updateProduct, deleteProduct } from "@/server/repo/products";
import { saveUploadedImage } from "@/server/uploads";

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await params;
  const product = getProductById(id);
  if (!product) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });
  return NextResponse.json({ product });
}

export async function PATCH(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await params;
  const existing = getProductById(id);
  if (!existing) return NextResponse.json({ error: "پیدا نشد" }, { status: 404 });

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  const name = String(form.get("name") ?? "").trim();
  const origin = String(form.get("origin") ?? "").trim();
  const price = Number(form.get("price"));
  const weight = String(form.get("weight") ?? "");
  const categoryId = String(form.get("categoryId") ?? "");
  const description = String(form.get("description") ?? "");
  const published = form.get("published") === "true";
  const image = form.get("image");

  if (!slug || !name || !origin || !categoryId || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "لطفاً همه‌ی فیلدهای ضروری را کامل و معتبر پر کنید" }, { status: 400 });
  }

  let imageUrl = existing.imageUrl;
  if (image instanceof File && image.size > 0) {
    const uploaded = await saveUploadedImage(image);
    if (uploaded.error) {
      return NextResponse.json({ error: uploaded.error }, { status: 400 });
    }
    imageUrl = uploaded.url ?? null;
  }

  updateProduct(id, {
    slug,
    name,
    origin,
    price,
    weight,
    categoryId,
    description,
    published,
    imageUrl,
  });
  return NextResponse.json({ product: getProductById(id) });
}

export async function DELETE(
  _request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  const { id } = await params;
  deleteProduct(id);
  return NextResponse.json({ ok: true });
}
