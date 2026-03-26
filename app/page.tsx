import HeroBanner from "@/components/store/HeroBanner";
import MarqueeBanner from "@/components/store/MarqueeBanner";
import NewArrivals from "@/components/store/NewArrivals";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import WhyChooseUs from "@/components/store/WhyChooseUs";
import ReviewsSection from "@/components/store/ReviewsSection";
import OfferBanner from "@/components/store/OfferBanner";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import Lookbook from "@/components/store/Lookbook";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden pb-20 md:pb-0">
      <HeroBanner />
      <MarqueeBanner />

      <div className="bg-[#0A0A0A] py-16 md:py-24 text-white">
        <div className="grid grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto text-center gap-8 md:gap-10 px-6 divide-y sm:divide-y-0 sm:divide-x divide-white/10">
          {[
            { end: 50000, suffix: "+", label: "HAPPY CUSTOMERS" },
            { end: 500, suffix: "+", label: "STYLES AVAILABLE" },
            { end: 99, suffix: "%", label: "SATISFACTION RATE" },
          ].map((stat) => (
            <div key={stat.label} className="py-4 sm:py-0">
              <p className="text-4xl sm:text-5xl font-black text-[#E63946]">
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              </p>
              <p className="text-[11px] tracking-[0.22em] text-gray-400 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <NewArrivals />
      <OfferBanner />
      <FeaturedProducts />
      <WhyChooseUs />
      <ReviewsSection />
      <Lookbook />
    </div>
  );
}
