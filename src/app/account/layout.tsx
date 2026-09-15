import Link from "next/link";
import Header from "@/components/Header";
import Footer from "@/components/Footer";
import LogoutButton from "@/components/auth/LogoutButton";
import { getCurrentCustomer } from "@/server/auth/customer";

const TABS = [
  { href: "/account", label: "پروفایل" },
  { href: "/account/addresses", label: "آدرس‌ها" },
  { href: "/account/orders", label: "سفارش‌ها" },
];

export default async function AccountLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const customer = await getCurrentCustomer();

  return (
    <>
      <Header />
      <main className="flex-1">
        <div className="border-b border-line bg-paper-deep/60">
          <div className="mx-auto max-w-4xl px-4 py-8 flex items-center justify-between">
            <div>
              <h1 className="text-2xl font-extrabold text-ink">حساب کاربری</h1>
              {customer && (
                <p className="mt-1 text-sm text-ink-soft" dir="ltr">
                  {customer.phone}
                </p>
              )}
            </div>
            <LogoutButton />
          </div>
        </div>

        <div className="mx-auto max-w-4xl px-4 pt-6">
          <nav className="flex gap-2 border-b border-line">
            {TABS.map((tab) => (
              <Link
                key={tab.href}
                href={tab.href}
                className="px-4 py-2.5 text-sm text-ink-soft hover:text-coffee transition-colors"
              >
                {tab.label}
              </Link>
            ))}
          </nav>
        </div>

        <div className="mx-auto max-w-4xl px-4 py-8">{children}</div>
      </main>
      <Footer />
    </>
  );
}
