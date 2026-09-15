import { listOrdersForAdmin } from "@/server/repo/orders";
import { getAllProductsForAdmin } from "@/server/repo/products";
import { listReviewsForAdmin } from "@/server/repo/reviews";
import { listCustomersForAdmin } from "@/server/repo/customers";
import { formatToman } from "@/lib/products";

export default function AdminDashboardPage() {
  const orders = listOrdersForAdmin();
  const products = getAllProductsForAdmin();
  const pendingReviews = listReviewsForAdmin(true);
  const customers = listCustomersForAdmin();

  const revenue = orders
    .filter((o) => o.status !== "PENDING_PAYMENT" && o.status !== "CANCELED")
    .reduce((sum, o) => sum + o.total, 0);

  const cards = [
    { label: "سفارش‌ها", value: orders.length },
    { label: "درآمد کل", value: formatToman(revenue) },
    { label: "محصولات", value: products.length },
    { label: "نظرات در انتظار تایید", value: pendingReviews.length },
    { label: "مشتریان", value: customers.length },
  ];

  return (
    <div>
      <h1 className="text-2xl font-extrabold text-ink mb-6">داشبورد</h1>
      <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {cards.map((card) => (
          <div key={card.label} className="rounded-2xl border border-line bg-cream p-5">
            <p className="text-sm text-ink-soft">{card.label}</p>
            <p className="mt-2 text-2xl font-extrabold text-ink">{card.value}</p>
          </div>
        ))}
      </div>
    </div>
  );
}
