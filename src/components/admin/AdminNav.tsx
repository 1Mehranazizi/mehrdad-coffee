"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Newspaper,
  MessageSquare,
  Users,
  Handshake,
  Sliders,
  Menu,
  X,
  Store,
} from "lucide-react";
import AdminLogoutButton from "@/components/admin/AdminLogoutButton";

const NAV = [
  { href: "/admin", label: "داشبورد", icon: LayoutDashboard },
  { href: "/admin/products", label: "محصولات", icon: Package },
  { href: "/admin/grind-types", label: "متغیرهای محصول", icon: Sliders },
  { href: "/admin/orders", label: "سفارش‌ها", icon: ShoppingCart },
  { href: "/admin/articles", label: "مقالات", icon: Newspaper },
  { href: "/admin/reviews", label: "نظرات", icon: MessageSquare },
  { href: "/admin/customers", label: "مشتریان", icon: Users },
  { href: "/admin/partners", label: "درخواست‌های همکاری", icon: Handshake },
];

function isActive(pathname: string, href: string) {
  return href === "/admin" ? pathname === "/admin" : pathname.startsWith(href);
}

function NavLinks({ onNavigate }: { onNavigate?: () => void }) {
  const pathname = usePathname();
  return (
    <>
      {NAV.map((item) => {
        const active = isActive(pathname, item.href);
        return (
          <Link
            key={item.href}
            href={item.href}
            onClick={onNavigate}
            aria-current={active ? "page" : undefined}
            className={`flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm transition-colors ${
              active
                ? "bg-ink text-cream font-semibold"
                : "text-ink-soft hover:bg-paper-deep hover:text-ink"
            }`}
          >
            <item.icon size={17} strokeWidth={1.75} />
            {item.label}
          </Link>
        );
      })}
    </>
  );
}

function Brand() {
  return (
    <div>
      <span className="text-lg font-extrabold text-ink">مهرداد</span>
      <span className="block text-[11px] tracking-widest text-ink-soft">ADMIN PANEL</span>
    </div>
  );
}

/** Fixed sidebar — desktop only. */
export function AdminSidebar() {
  return (
    <aside className="hidden md:flex sticky top-0 h-screen w-60 shrink-0 flex-col border-l border-line bg-cream">
      <div className="px-5 py-5 border-b border-line">
        <Brand />
      </div>
      <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
        <NavLinks />
      </nav>
      <div className="p-4 border-t border-line space-y-3">
        <Link
          href="/"
          className="flex items-center gap-2 text-sm text-ink-soft hover:text-coffee transition-colors"
        >
          <Store size={16} />
          مشاهده فروشگاه
        </Link>
        <AdminLogoutButton />
      </div>
    </aside>
  );
}

/** Sticky top bar with a slide-in drawer menu — phones/tablets only. */
export function AdminMobileNav() {
  const [open, setOpen] = useState(false);
  const pathname = usePathname();
  const current = NAV.find((n) => isActive(pathname, n.href));

  // while the drawer is open: lock page scroll and close on Escape
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("keydown", onKey);
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    return () => {
      document.removeEventListener("keydown", onKey);
      document.body.style.overflow = prev;
    };
  }, [open]);

  const setDrawer = setOpen;

  return (
    <div className="md:hidden">
      <header className="sticky top-0 z-40 flex items-center gap-3 border-b border-line bg-cream/95 px-4 py-3 backdrop-blur">
        <button
          onClick={() => setDrawer(true)}
          aria-label="باز کردن منو"
          aria-expanded={open}
          aria-controls="admin-mobile-drawer"
          className="-mr-2 rounded-full p-2 text-ink hover:bg-paper-deep"
        >
          <Menu size={22} />
        </button>
        <span className="font-extrabold text-ink">{current?.label ?? "پنل مدیریت"}</span>
        <span className="mr-auto text-[11px] tracking-widest text-ink-soft">MEHRDAD</span>
      </header>

      <div className={`fixed inset-0 z-50 ${open ? "" : "pointer-events-none"}`}>
        <div
          onClick={() => setDrawer(false)}
          aria-hidden="true"
          className={`absolute inset-0 bg-ink/40 transition-opacity duration-200 ${
            open ? "opacity-100" : "opacity-0"
          }`}
        />
        <aside
          id="admin-mobile-drawer"
          inert={!open}
          aria-label="منوی مدیریت"
          className={`absolute inset-y-0 right-0 flex w-72 max-w-[85%] flex-col bg-cream shadow-xl transition-transform duration-200 ${
            open ? "translate-x-0" : "translate-x-full"
          }`}
        >
          <div className="flex items-center justify-between border-b border-line px-5 py-4">
            <Brand />
            <button
              onClick={() => setDrawer(false)}
              aria-label="بستن منو"
              className="-ml-2 rounded-full p-2 text-ink-soft hover:bg-paper-deep"
            >
              <X size={20} />
            </button>
          </div>
          <nav className="flex-1 overflow-y-auto px-3 py-4 space-y-1">
            <NavLinks onNavigate={() => setDrawer(false)} />
          </nav>
          <div className="space-y-3 border-t border-line p-4">
            <Link
              href="/"
              onClick={() => setDrawer(false)}
              className="flex items-center gap-2 text-sm text-ink-soft hover:text-coffee transition-colors"
            >
              <Store size={16} />
              مشاهده فروشگاه
            </Link>
            <AdminLogoutButton />
          </div>
        </aside>
      </div>
    </div>
  );
}
