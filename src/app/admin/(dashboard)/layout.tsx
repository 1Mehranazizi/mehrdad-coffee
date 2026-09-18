import Link from "next/link";
import {
  LayoutDashboard,
  Package,
  ShoppingCart,
  Newspaper,
  MessageSquare,
  Users,
  Sliders,
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
];

export default function AdminDashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="min-h-screen flex bg-paper">
      <aside className="hidden md:flex w-60 shrink-0 flex-col border-l border-line bg-cream">
        <div className="px-5 py-5 border-b border-line">
          <span className="text-lg font-extrabold text-ink">مهرداد</span>
          <span className="block text-[11px] tracking-widest text-ink-soft">
            ADMIN PANEL
          </span>
        </div>
        <nav className="flex-1 px-3 py-4 space-y-1">
          {NAV.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-2.5 rounded-xl px-3 py-2.5 text-sm text-ink-soft hover:bg-paper-deep hover:text-ink transition-colors"
            >
              <item.icon size={17} strokeWidth={1.75} />
              {item.label}
            </Link>
          ))}
        </nav>
        <div className="p-4 border-t border-line">
          <AdminLogoutButton />
        </div>
      </aside>

      <div className="flex-1 min-w-0">
        <header className="md:hidden border-b border-line bg-cream px-4 py-3 flex items-center justify-between">
          <span className="font-extrabold text-ink">پنل مدیریت مهرداد</span>
          <AdminLogoutButton />
        </header>
        <div className="p-5 md:p-8">{children}</div>
      </div>
    </div>
  );
}
