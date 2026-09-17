import { NextResponse } from "next/server";
import { requireAdmin } from "@/server/auth/admin";
import { getAllProductsForAdmin, createProduct } from "@/server/repo/products";
import { saveUploadedImage } from "@/server/uploads";

export async function GET() {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }
  return NextResponse.json({ products: getAllProductsForAdmin() });
}

export async function POST(request: Request) {
  try {
    await requireAdmin();
  } catch {
    return NextResponse.json({ error: "unauthenticated" }, { status: 401 });
  }

  const form = await request.formData();
  const slug = String(form.get("slug") ?? "").trim();
  const name = String(form.get("name") ?? "").trim();
  const origin = String(form.get("origin") ?? "").trim();
  const price = Number(form.get("price"));
  const weight = String(form.get("weight") ?? "");
  const categoryId = String(form.get("categoryId") ?? "");
  const description = String(form.get("description") ?? "");
  const variantsRaw = String(form.get("variants") ?? "");
  let variants: Array<{ weight: string; grindOptionId?: string | null; price: number; active?: boolean }> | undefined;
  if (variantsRaw) { try { variants = JSON.parse(variantsRaw); } catch { return NextResponse.json({ error: "متغیرهای محصول نامعتبر است" }, { status: 400 }); } }
  const published = form.get("published") === "true";
  const image = form.get("image");

  if (!slug || !name || !origin || !categoryId || !Number.isFinite(price) || price <= 0) {
    return NextResponse.json({ error: "لطفاً همه‌ی فیلدهای ضروری را کامل و معتبر پر کنید" }, { status: 400 });
  }

  let imageUrl: string | undefined;
  if (image instanceof File && image.size > 0) {
    const uploaded = await saveUploadedImage(image);
    if (uploaded.error) {
      return NextResponse.json({ error: uploaded.error }, { status: 400 });
    }
    imageUrl = uploaded.url;
  }

  try {
    const product = createProduct({
      slug,
      name,
      origin,
      price,
      weight,
      categoryId,
      description,
      published,
      imageUrl,
      variants,
    });
    return NextResponse.json({ product });
  } catch {
    return NextResponse.json({ error: "این اسلاگ قبلاً استفاده شده است" }, { status: 409 });
  }
}
