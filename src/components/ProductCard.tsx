"use client";

import Link from "next/link";
import Image from "next/image";
import { Plus } from "lucide-react";
import { formatToman, weightLabel } from "@/lib/products";
import { SunburstMark } from "@/components/icons";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  origin: string;
  price: number;
  weight: string;
  imageUrl: string | null;
  categorySlug?: string;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <article className="group rounded-2xl bg-cream border border-line overflow-hidden">
      <Link
        href={`/shop/${product.slug}`}
        className="block aspect-square bg-ink flex items-center justify-center relative overflow-hidden"
      >
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-300 group-hover:scale-105"
          />
        ) : (
          <SunburstMark className="h-24 w-24 text-cream/90 transition-transform duration-300 group-hover:scale-105" />
        )}
      </Link>
      <div className="p-5">
        <Link href={`/shop/${product.slug}`}>
          <h3 className="font-bold text-ink hover:text-coffee transition-colors">
            {product.name}
          </h3>
        </Link>
        <p className="mt-1 text-xs text-ink-soft">
          {product.origin} · {weightLabel(product.weight)}
        </p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm font-semibold text-ink">
            {formatToman(product.price)}
          </span>
          <Link
            href={`/shop/${product.slug}`}
            aria-label={`انتخاب وزن ${product.name}`}
            className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream hover:bg-coffee-deep transition-colors"
          >
            <Plus size={18} strokeWidth={2} />
          </Link>
        </div>
      </div>
    </article>
  );
}
