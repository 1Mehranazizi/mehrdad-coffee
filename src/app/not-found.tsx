import Link from "next/link";
import { Coffee, ArrowRight } from "lucide-react";
import Header from "@/components/Header";
import Footer from "@/components/Footer";

export default function NotFound() {
  return <><Header/><main className="flex-1 flex items-center justify-center px-4 py-20"><div className="max-w-lg text-center"><div className="mx-auto flex h-20 w-20 items-center justify-center rounded-3xl bg-ink text-cream"><Coffee size={34}/></div><p className="mt-7 text-xs font-semibold tracking-[0.25em] text-coffee">404</p><h1 className="mt-2 text-3xl font-extrabold text-ink">این صفحه پیدا نشد</h1><p className="mt-3 leading-7 text-ink-soft">ممکن است آدرس تغییر کرده باشد. از اینجا می‌توانید دوباره به فروشگاه برگردید.</p><Link href="/shop" className="mt-7 inline-flex items-center gap-2 rounded-full bg-ink px-6 py-3 text-sm font-semibold text-cream"><ArrowRight size={17}/> رفتن به فروشگاه</Link></div></main><Footer/></>;
}
