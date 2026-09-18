import Link from "next/link";
import Image from "next/image";
import { ArrowLeft } from "lucide-react";
import { formatToman } from "@/lib/products";
import { SunburstMark } from "@/components/icons";

export type ProductCardData = {
  id: string;
  slug: string;
  name: string;
  origin: string;
  imageUrl: string | null;
  minPrice: number;
  categorySlug?: string;
};

export default function ProductCard({ product }: { product: ProductCardData }) {
  return (
    <Link
      href={`/shop/${product.slug}`}
      className="group block rounded-2xl bg-cream border border-line overflow-hidden transition-all hover:border-coffee hover:shadow-[0_16px_30px_-20px_rgba(32,28,23,0.35)]"
    >
      <div className="relative aspect-square bg-ink flex items-center justify-center overflow-hidden">
        {product.imageUrl ? (
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover transition-transform duration-500 group-hover:scale-105"
          />
        ) : (
          <SunburstMark className="h-24 w-24 text-cream/90 transition-transform duration-500 group-hover:scale-105" />
        )}
      </div>
      <div className="p-5">
        <h3 className="font-bold text-ink group-hover:text-coffee transition-colors">
          {product.name}
        </h3>
        <p className="mt-1 text-xs text-ink-soft">{product.origin}</p>
        <div className="mt-4 flex items-center justify-between">
          <span className="text-sm text-ink-soft">
            از <span className="font-semibold text-ink">{formatToman(product.minPrice)}</span>
          </span>
          <span className="flex h-9 w-9 items-center justify-center rounded-full bg-ink text-cream transition-colors group-hover:bg-coffee-deep">
            <ArrowLeft size={16} strokeWidth={2} />
          </span>
        </div>
      </div>
    </Link>
  );
}
