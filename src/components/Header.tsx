"use client";

import Link from "next/link";
import { useState } from "react";
import { Menu, Search, ShoppingBag, X } from "lucide-react";
import Image from "next/image";

const NAV_LINKS = [
  { href: "/shop", label: "فروشگاه" },
  { href: "/about", label: "درباره ما" },
  { href: "/journal", label: "مجله قهوه" },
  { href: "/contact", label: "تماس با ما" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-line">
      {/* announcement strip */}
      <div className="bg-ink text-cream text-xs sm:text-sm">
        <p className="mx-auto max-w-6xl px-4 py-2 text-center">
          ارسال به سراسر ایران · ارسال رایگان و همان روز در کرمانشاه
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-18 items-center justify-between py-3">
          {/* logo — first in DOM, sits on the right in RTL */}
          <Link href="/" className="flex items-baseline gap-2 shrink-0">
          
            <Image
  src="/images/logo.png"
  width={300}
  height={100}
  quality={100}
  alt="Mehrdad Coffee"
  className="w-30 h-auto"
/>
          </Link>

          {/* nav */}
          <nav className="hidden md:flex items-center gap-8">
            {NAV_LINKS.map((link) => (
              <Link
                key={link.href}
                href={link.href}
                className="text-[15px] text-ink-soft hover:text-coffee transition-colors"
              >
                {link.label}
              </Link>
            ))}
          </nav>

          {/* actions */}
          <div className="flex items-center gap-1 sm:gap-2">
            <button
              aria-label="جستجو"
              className="p-2 rounded-full text-ink hover:bg-paper-deep transition-colors"
            >
              <Search size={20} strokeWidth={1.75} />
            </button>
            <Link
              href="/cart"
              aria-label="سبد خرید"
              className="relative p-2 rounded-full text-ink hover:bg-paper-deep transition-colors"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />
              <span className="absolute -top-0.5 -left-0.5 flex h-4 w-4 items-center justify-center rounded-full bg-coffee text-[10px] text-cream">
                ۰
              </span>
            </Link>
            <button
              aria-label={menuOpen ? "بستن منو" : "باز کردن منو"}
              onClick={() => setMenuOpen((v) => !v)}
              className="p-2 rounded-full text-ink hover:bg-paper-deep transition-colors md:hidden"
            >
              {menuOpen ? (
                <X size={22} strokeWidth={1.75} />
              ) : (
                <Menu size={22} strokeWidth={1.75} />
              )}
            </button>
          </div>
        </div>
      </div>

      {/* mobile nav */}
      {menuOpen && (
        <nav className="md:hidden border-t border-line bg-paper">
          <ul className="mx-auto max-w-6xl px-4 py-3 flex flex-col gap-1">
            {NAV_LINKS.map((link) => (
              <li key={link.href}>
                <Link
                  href={link.href}
                  onClick={() => setMenuOpen(false)}
                  className="block py-2.5 text-[15px] text-ink-soft hover:text-coffee transition-colors"
                >
                  {link.label}
                </Link>
              </li>
            ))}
          </ul>
        </nav>
      )}
    </header>
  );
}
