"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Home, ShoppingBag, ShoppingCart, User } from "lucide-react";
import { useCartStore } from "@/lib/cart-store";
import { useCustomerSession } from "@/lib/use-customer-session";

export default function MobileBottomNav() {
  const pathname = usePathname();
  const itemCount = useCartStore((s) => s.items.reduce((sum, i) => sum + i.quantity, 0));
  const session = useCustomerSession();

  if (pathname.startsWith("/admin")) return null;

  const items = [
    { href: "/", label: "خانه", icon: Home },
    { href: "/shop", label: "محصولات", icon: ShoppingBag },
    { href: "/cart", label: "سبد خرید", icon: ShoppingCart, badge: itemCount },
    {
      href: session?.loggedIn ? "/account" : "/login",
      label: "پروفایل",
      icon: User,
    },
  ];

  return (
    <nav className="md:hidden fixed inset-x-0 bottom-0 z-50 h-16 border-t border-line bg-cream/95 backdrop-blur">
      <ul className="flex h-full items-stretch">
        {items.map((item) => {
          const active =
            item.href === "/" ? pathname === "/" : pathname.startsWith(item.href);
          return (
            <li key={item.label} className="flex-1">
              <Link
                href={item.href}
                className={`relative flex h-full flex-col items-center justify-center gap-1 text-[11px] transition-colors ${
                  active ? "text-coffee" : "text-ink-soft"
                }`}
              >
                <item.icon size={20} strokeWidth={active ? 2.2 : 1.75} />
                {item.label}
                {!!item.badge && item.badge > 0 && (
                  <span className="absolute top-1.5 left-1/2 translate-x-3 flex h-4 min-w-4 items-center justify-center rounded-full bg-coffee px-1 text-[10px] text-cream">
                    {item.badge.toLocaleString("fa-IR")}
                  </span>
                )}
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
