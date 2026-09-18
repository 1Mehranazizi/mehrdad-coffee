import Header from "@/components/Header";
import Footer from "@/components/Footer";
import Hero from "@/components/home/Hero";
import Categories from "@/components/home/Categories";
import FeaturedProducts from "@/components/home/FeaturedProducts";
import WhyMehrdad from "@/components/home/WhyMehrdad";
import TrustFeatures from "@/components/home/TrustFeatures";

export default function Home() {
  return (
    <>
      <Header />
      <main className="flex-1">
        <Hero />
        <Categories />
        <FeaturedProducts />
        <WhyMehrdad />
        <TrustFeatures />
      </main>
      <Footer />
    </>
  );
}
