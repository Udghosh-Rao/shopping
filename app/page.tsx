import HeroBanner from "@/components/store/HeroBanner";
import MarqueeBanner from "@/components/store/MarqueeBanner";
import CategoryCards from "@/components/store/CategoryCards";
import NewArrivals from "@/components/store/NewArrivals";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import WhyChooseUs from "@/components/store/WhyChooseUs";
import ReviewsSection from "@/components/store/ReviewsSection";
import OfferBanner from "@/components/store/OfferBanner";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeroBanner />
      <MarqueeBanner />
      <CategoryCards />
      <NewArrivals />
      <OfferBanner />
      <FeaturedProducts />
      <WhyChooseUs />
      <ReviewsSection />
    </main>
  );
}
