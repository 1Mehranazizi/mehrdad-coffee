import Header from "@/components/Header";
import Footer from "@/components/Footer";
import ShopClient from "@/components/shop/ShopClient";

export const metadata = {
  title: "فروشگاه | قهوه مهرداد",
  description: "خرید دان و پودر قهوه تازه برشته‌شده مهرداد؛ اسپرسو، فیلتر، ترک و دان کامل.",
};

type SearchParams = Promise<{ category?: string }>;

export default async function ShopPage({
  searchParams,
}: {
  searchParams: SearchParams;
}) {
  const { category } = await searchParams;

  return (
    <>
      <Header />
      <main className="flex-1">
        <ShopClient initialCategory={category} />
      </main>
      <Footer />
    </>
  );
}
