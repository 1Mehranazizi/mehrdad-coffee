import type { Metadata } from "next";
import localFont from "next/font/local";
import "./globals.css";
import MobileBottomNav from "@/components/MobileBottomNav";

// Self-hosted Vazirmatn variable font (works even where Google Fonts
// is unreachable — important for an audience mostly browsing from Iran).
const vazirmatn = localFont({
  src: "../fonts/Vazirmatn-Variable.woff2",
  variable: "--font-vazirmatn",
  weight: "100 900",
  display: "swap",
});

export const metadata: Metadata = {
  title: "قهوه مهرداد | فروشگاه دان و پودر قهوه تازه برشته",
  description:
    "فروشگاه اینترنتی قهوه مهرداد؛ دان و پودر قهوه تازه برشته‌شده، اسپرسو، فیلتر و ترک. طعم اصالت، عطر ماندگار.",
};

export default function RootLayout({
  children,
}: Readonly<{ children: React.ReactNode }>) {
  return (
    <html lang="fa" dir="rtl" className={`${vazirmatn.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-paper text-ink font-sans antialiased pb-16 md:pb-0">
        {children}
        <MobileBottomNav />
      </body>
    </html>
  );
}
