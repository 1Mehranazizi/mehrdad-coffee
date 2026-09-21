import Link from "next/link";
import { getOrderStats } from "@/server/repo/orders";
import { countProducts } from "@/server/repo/products";
import { countPendingReviews } from "@/server/repo/reviews";
import { countCustomers } from "@/server/repo/customers";
import { formatToman } from "@/lib/products";

export default function AdminDashboardPage() {
  const { orderCount, revenue } = getOrderStats();

  const cards = [
    { label: "سفارش‌ها", value: orderCount.toLocaleString("fa-IR"), href: "/admin/orders" },
    { label: "درآمد کل", value: formatToman(revenue), href: "/admin/orders" },
    { label: "محصولات", value: countProducts().toLocaleString("fa-IR"), href: "/admin/products" },
    {
      label: "نظرات در انتظار تایید",
      value: countPendingReviews().toLocaleString("fa-IR"),
      href: "/admin/reviews?status=pending",
    },
    { label: "مشتریان", value: countCustomers().toLocaleString("fa-IR"), href: "/admin/customers" },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-6">داشبورد</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <Link
            key={card.label}
            href={card.href}
            className="rounded-2xl border border-line bg-cream p-5 transition-colors hover:border-coffee"
          >
            <p className="text-sm text-ink-soft">{card.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-ink">{card.value}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
