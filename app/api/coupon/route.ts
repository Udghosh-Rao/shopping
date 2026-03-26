import { NextRequest, NextResponse } from "next/server";
import dbConnect from "@/lib/mongodb";
import Coupon from "@/models/Coupon";
import { applyDemoCoupon } from "@/lib/demoBackend";
import { isMongoConfigured } from "@/lib/mongodb";

export async function POST(req: NextRequest) {
  const { code, orderAmount } = await req.json();

  if (!code || typeof code !== "string") {
    return NextResponse.json({ error: "Coupon code is required" }, { status: 400 });
  }

  // Demo mode fallback.
  if (!isMongoConfigured()) {
    const result = applyDemoCoupon(code, Number(orderAmount));
    if (!result.ok) {
      return NextResponse.json({ error: result.error }, { status: 400 });
    }
    return NextResponse.json({ discount: result.discount, code: result.code, type: result.type });
  }

  await dbConnect();

  const coupon = await Coupon.findOne({
    code: code.toUpperCase(),
    isActive: true,
    $or: [{ expiresAt: { $gt: new Date() } }, { expiresAt: null }],
  });

  if (!coupon) return NextResponse.json({ error: "Invalid coupon code" }, { status: 400 });
  if (coupon.usedCount >= coupon.maxUses) {
    return NextResponse.json({ error: "Coupon limit reached" }, { status: 400 });
  }
  if (orderAmount < coupon.minOrderAmount) {
    return NextResponse.json({ error: `Min order ₹${coupon.minOrderAmount} required` }, { status: 400 });
  }

  const discount =
    coupon.discountType === "percentage"
      ? Math.floor((orderAmount * coupon.discountValue) / 100)
      : coupon.discountValue;

  return NextResponse.json({ discount, code: coupon.code, type: coupon.discountType });
}
