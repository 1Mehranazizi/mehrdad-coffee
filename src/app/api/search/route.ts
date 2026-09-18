import { NextResponse } from "next/server";
import { searchProducts } from "@/server/repo/products";

export async function GET(request: Request) {
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ products: [] });

  const products = searchProducts(q, 6).map((p) => ({
    slug: p.slug,
    name: p.name,
    origin: p.origin,
    imageUrl: p.imageUrl,
    minPrice: p.minPrice,
  }));
  return NextResponse.json({ products });
}
