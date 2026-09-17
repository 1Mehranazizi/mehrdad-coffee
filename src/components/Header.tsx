"use client";

import Link from "next/link";
import { usePathname, useRouter } from "next/navigation";
import { useState } from "react";
import { Menu, Search, ShoppingBag, UserRound, X, Home, Package, Newspaper } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";

const NAV_LINKS = [
  { href: "/shop", label: "فروشگاه" },
  { href: "/about", label: "درباره ما" },
  { href: "/journal", label: "مجله قهوه" },
  { href: "/contact", label: "تماس با ما" },
];

export default function Header() {
  const router = useRouter();
  const pathname = usePathname();
  const [menuOpen, setMenuOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [query, setQuery] = useState("");
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));

  const submitSearch = (e: React.FormEvent) => {
    e.preventDefault();
    router.push(query.trim() ? `/shop?search=${encodeURIComponent(query.trim())}` : "/shop");
    setSearchOpen(false);
  };

  return (
    <>
      <header className="sticky top-0 z-50 bg-paper/90 backdrop-blur-xl border-b border-line">
        <div className="bg-ink text-cream text-xs sm:text-sm">
          <p className="mx-auto max-w-6xl px-4 py-2 text-center">ارسال به سراسر ایران · خرید بالای ۱.۵ میلیون تومان، ارسال رایگان</p>
        </div>
        <div className="mx-auto max-w-6xl px-4">
          <div className="flex min-h-[72px] items-center justify-between gap-4">
            <Link href="/" className="flex items-center shrink-0" aria-label="قهوه مهرداد">
              <img src="/logo.png" alt="قهوه مهرداد" className="h-12 w-auto object-contain" />
            </Link>

            <nav className="hidden md:flex items-center gap-7">
              {NAV_LINKS.map((link) => <Link key={link.href} href={link.href} className={`text-[14px] transition-colors ${pathname.startsWith(link.href) ? "text-ink font-semibold" : "text-ink-soft hover:text-coffee"}`}>{link.label}</Link>)}
            </nav>

            <div className="flex items-center gap-1 sm:gap-2">
              {searchOpen ? (
                <form onSubmit={submitSearch} className="hidden sm:flex items-center rounded-full border border-coffee bg-cream px-3">
                  <Search size={17} className="text-ink-soft" />
                  <input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="جستجوی محصول..." className="w-36 bg-transparent px-2 py-2 text-xs outline-none" />
                  <button type="button" onClick={()=>setSearchOpen(false)} aria-label="بستن جستجو"><X size={16}/></button>
                </form>
              ) : null}
              <button aria-label="جستجو" onClick={()=>setSearchOpen(v=>!v)} className="p-2.5 rounded-full text-ink hover:bg-paper-deep transition-colors sm:hidden"><Search size={20}/></button>
              {!searchOpen && <button aria-label="جستجو" onClick={()=>setSearchOpen(true)} className="hidden sm:block p-2.5 rounded-full text-ink hover:bg-paper-deep transition-colors"><Search size={20}/></button>}
              <Link href="/account" aria-label="حساب کاربری" className="hidden sm:flex p-2.5 rounded-full text-ink hover:bg-paper-deep"><UserRound size={20}/></Link>
              <Link href="/cart" aria-label="سبد خرید" className="relative p-2.5 rounded-full text-ink hover:bg-paper-deep">
                <ShoppingBag size={20}/>
                {itemCount > 0 && <span className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coffee px-1 text-[10px] text-cream">{itemCount.toLocaleString("fa-IR")}</span>}
              </Link>
              <button aria-label={menuOpen ? "بستن منو" : "باز کردن منو"} onClick={()=>setMenuOpen(v=>!v)} className="p-2.5 rounded-full text-ink hover:bg-paper-deep md:hidden">{menuOpen ? <X size={22}/> : <Menu size={22}/>}</button>
            </div>
          </div>
          {searchOpen && <form onSubmit={submitSearch} className="sm:hidden pb-3 flex items-center rounded-2xl border border-line bg-cream px-3"><Search size={18}/><input autoFocus value={query} onChange={e=>setQuery(e.target.value)} placeholder="جستجوی قهوه، نسکافه..." className="flex-1 bg-transparent px-2 py-3 text-sm outline-none"/><button type="submit" className="text-xs font-semibold text-coffee">جستجو</button></form>}
        </div>
        {menuOpen && <nav className="md:hidden border-t border-line bg-paper"><ul className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">{NAV_LINKS.map(link=><li key={link.href}><Link href={link.href} onClick={()=>setMenuOpen(false)} className="block py-2.5 text-[15px] text-ink-soft">{link.label}</Link></li>)}<li><Link href="/account" onClick={()=>setMenuOpen(false)} className="block py-2.5 text-[15px] text-ink-soft">حساب کاربری / ورود</Link></li></ul></nav>}
      </header>
      <nav className="fixed bottom-0 inset-x-0 z-50 md:hidden border-t border-line bg-cream/95 backdrop-blur-xl pb-[env(safe-area-inset-bottom)] shadow-[0_-8px_30px_rgba(32,28,23,0.08)]">
        <div className="grid grid-cols-4 h-16">
          <MobileNav href="/" icon={Home} label="خانه" active={pathname === "/"}/>
          <MobileNav href="/shop" icon={Package} label="محصولات" active={pathname.startsWith("/shop")}/>
          <MobileNav href="/cart" icon={ShoppingBag} label={`سبد${itemCount ? ` (${itemCount})` : ""}`} active={pathname.startsWith("/cart")}/>
          <MobileNav href="/account" icon={UserRound} label="پروفایل" active={pathname.startsWith("/account")}/>
        </div>
      </nav>
    </>
  );
}

function MobileNav({href,icon:Icon,label,active}:{href:string;icon:typeof Home;label:string;active:boolean}) {
  return <Link href={href} className={`flex flex-col items-center justify-center gap-1 text-[10px] ${active ? "text-coffee font-bold" : "text-ink-soft"}`}><Icon size={19}/><span>{label}</span></Link>;
}
