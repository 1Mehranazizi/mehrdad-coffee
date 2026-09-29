import { NextResponse } from "next/server";
import { searchProducts } from "@/server/repo/products";
import { currentIsPartner, priced } from "@/server/pricing";

export async function GET(request: Request) {
  const partner = await currentIsPartner();
  const url = new URL(request.url);
  const q = (url.searchParams.get("q") || "").trim();
  if (q.length < 2) return NextResponse.json({ products: [] });

  const products = priced(searchProducts(q, 6), partner).map((p) => ({
    slug: p.slug,
    name: p.name,
    origin: p.origin,
    imageUrl: p.imageUrl,
    minPrice: p.minPrice,
  }));
  return NextResponse.json({ products });
}
