import HeroBanner from "@/components/store/HeroBanner";
import CategoryCards from "@/components/store/CategoryCards";
import NewArrivals from "@/components/store/NewArrivals";
import dbConnect from "@/lib/mongodb";
import Product from "@/models/Product";

async function getNewArrivals() {
  try {
    await dbConnect();
    const products = await Product.find({ isNewArrival: true })
      .sort({ createdAt: -1 })
      .limit(8)
      .lean();
    return JSON.parse(JSON.stringify(products));
  } catch {
    return [];
  }
}

export default async function HomePage() {
  const newArrivals = await getNewArrivals();

  return (
    <>
      <HeroBanner />
      <CategoryCards />
      <NewArrivals products={newArrivals} />
    </>
  );
}
