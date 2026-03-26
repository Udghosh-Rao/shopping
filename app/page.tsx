import HeroBanner from "@/components/store/HeroBanner";
import MarqueeBanner from "@/components/store/MarqueeBanner";
import CategoryCards from "@/components/store/CategoryCards";
import NewArrivals from "@/components/store/NewArrivals";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import WhyChooseUs from "@/components/store/WhyChooseUs";
import ReviewsSection from "@/components/store/ReviewsSection";
import OfferBanner from "@/components/store/OfferBanner";
import AnimatedCounter from "@/components/ui/AnimatedCounter";

export default function HomePage() {
  return (
    <main className="overflow-x-hidden">
      <HeroBanner />
      <MarqueeBanner />
      <CategoryCards />

      <div className="bg-[#0A0A0A] py-12 text-white">
        <div className="grid grid-cols-3 max-w-3xl mx-auto text-center gap-8 px-4">
          {[
            { end: 50000, suffix: "+", label: "HAPPY CUSTOMERS" },
            { end: 500, suffix: "+", label: "STYLES AVAILABLE" },
            { end: 99, suffix: "%", label: "SATISFACTION RATE" },
          ].map((stat) => (
            <div key={stat.label}>
              <p className="text-4xl font-black text-[#E63946]">
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              </p>
              <p className="text-xs tracking-widest text-gray-400 mt-1">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <NewArrivals />
      <OfferBanner />
      <FeaturedProducts />
      <WhyChooseUs />
      <ReviewsSection />
    </main>
  );
}
