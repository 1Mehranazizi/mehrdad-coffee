import type { Metadata } from "next";
import "./globals.css";
import MobileBottomNav from "@/components/MobileBottomNav";

// Every page reads live data (products, orders, articles, sessions…), so render
// on each request instead of freezing a build-time snapshot. Segment config on
// the root layout applies to the whole app.
export const dynamic = "force-dynamic";

export const metadata: Metadata = {
  title: "قهوه مهرداد | فروشگاه دان و پودر قهوه تازه برشته",
  description:
    "فروشگاه اینترنتی قهوه مهرداد؛ دان و پودر قهوه تازه برشته‌شده، اسپرسو، فیلتر و ترک. طعم اصالت، عطر ماندگار.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={`h-full`}>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans antialiased pb-16 md:pb-0">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
