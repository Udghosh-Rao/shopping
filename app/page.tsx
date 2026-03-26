import HomeHeroClient from "@/components/store/HomeHeroClient";
import NewArrivals from "@/components/store/NewArrivals";
import FeaturedProducts from "@/components/store/FeaturedProducts";
import WhyChooseUs from "@/components/store/WhyChooseUs";
import AnimatedCounter from "@/components/ui/AnimatedCounter";
import RecentlyViewed from "@/components/store/RecentlyViewed";

export default function HomePage() {
  return (
    <div className="overflow-x-hidden pb-20 md:pb-0">
      <HomeHeroClient />

      <div className="bg-white py-12 md:py-16 border-b border-gray-100">
        <div className="grid grid-cols-1 sm:grid-cols-3 max-w-5xl mx-auto text-center gap-8 md:gap-10 px-6 divide-y sm:divide-y-0 sm:divide-x divide-gray-100">
          {[
            { end: 50000, suffix: "+", label: "HAPPY CUSTOMERS" },
            { end: 500, suffix: "+", label: "STYLES AVAILABLE" },
            { end: 99, suffix: "%", label: "SATISFACTION RATE" },
          ].map((stat) => (
            <div key={stat.label} className="py-4 sm:py-0">
              <p className="text-4xl sm:text-5xl font-black text-[#0A0A0A]">
                <AnimatedCounter end={stat.end} suffix={stat.suffix} />
              </p>
              <p className="text-[11px] tracking-[0.08em] text-gray-500 mt-2">{stat.label}</p>
            </div>
          ))}
        </div>
      </div>

      <NewArrivals />
      <FeaturedProducts />
      <RecentlyViewed />
      <WhyChooseUs />
    </div>
  );
}
