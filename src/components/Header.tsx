"use client";

import Link from "next/link";
import Image from "next/image";
import { useState } from "react";
import { Menu, ShoppingBag, User, X } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useCustomerSession } from "@/lib/use-customer-session";
import SearchBox from "@/components/SearchBox";

const NAV_LINKS = [
  { href: "/shop", label: "فروشگاه" },
  { href: "/about", label: "درباره ما" },
  { href: "/journal", label: "مجله قهوه" },
  { href: "/contact", label: "تماس با ما" },
];

export default function Header() {
  const [menuOpen, setMenuOpen] = useState(false);
  const itemCount = useCartStore((s) =>
    s.items.reduce((sum, i) => sum + i.quantity, 0)
  );
  const session = useCustomerSession();

  return (
    <header className="sticky top-0 z-50 bg-paper/95 backdrop-blur border-b border-line">
      {/* announcement strip */}
      <div className="bg-ink text-cream text-xs sm:text-sm">
        <p className="mx-auto max-w-6xl px-4 py-2 text-center">
          🚚 ارسال رایگان در کرمانشاه | تحویل در همان روز ⚡
        </p>
      </div>

      <div className="mx-auto max-w-6xl px-4">
        <div className="flex h-18 items-center justify-between py-3">
          {/* logo — first in DOM, sits on the right in RTL */}
          <Link href="/" className="flex items-center gap-2.5 shrink-0">
            <Image
              src="/images/logo.png"
              alt="قهوه مهرداد"
              width={96}
              height={96}
              className="object-contain"
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
            <SearchBox />

            <Link
              href={session?.loggedIn ? "/account" : "/login"}
              aria-label="حساب کاربری"
              className="hidden md:inline-flex p-2 rounded-full text-ink hover:bg-paper-deep transition-colors"
            >
              <User size={20} strokeWidth={1.75} />
            </Link>

            <Link
              href="/cart"
              aria-label="سبد خرید"
              className="hidden md:inline-flex relative p-2 rounded-full text-ink hover:bg-paper-deep transition-colors"
            >
              <ShoppingBag size={20} strokeWidth={1.75} />
              {itemCount > 0 && (
                <span className="absolute -top-0.5 -left-0.5 flex h-4 min-w-4 items-center justify-center rounded-full bg-coffee px-1 text-[10px] text-cream">
                  {itemCount.toLocaleString("fa-IR")}
                </span>
              )}
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
