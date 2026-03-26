import { isMongoConfigured } from "@/lib/mongodb";
import { SAMPLE_PRODUCTS } from "@/lib/sampleCatalog";

type DemoUser = {
  id: string;
  name: string;
  email: string;
  role: "admin" | "user";
  image?: string;
};

export type DemoOrder = {
  _id: string;
  userId: string;
  items: { name: string; image: string; size: string; quantity: number; price: number }[];
  shippingAddress: { fullName: string; phone?: string; city: string; state: string; pincode: string; addressLine1?: string; addressLine2?: string };
  totalAmount: number;
  deliveryCharge: number;
  discount: number;
  paymentStatus: "pending" | "paid" | "failed";
  orderStatus: "Processing" | "Shipped" | "Delivered" | "Cancelled" | string;
  createdAt: string;
  updatedAt?: string;
  razorpayOrderId?: string;
  razorpayPaymentId?: string;
};

type DemoCoupon = {
  code: string;
  discountType: "percentage" | "fixed";
  discountValue: number;
  minOrderAmount: number;
  isActive: boolean;
  expiresAt: string | null;
  maxUses: number;
  usedCount: number;
};

declare global {
  var __demoBackend:
    | {
        users: DemoUser[];
        orders: DemoOrder[];
        coupons: DemoCoupon[];
        products: Array<Record<string, unknown>>;
      }
    | undefined;
}

function getState() {
  if (!globalThis.__demoBackend) {
    const adminEmail = process.env.ADMIN_EMAIL || "admin@example.com";
    const userEmail = "user@example.com";
    globalThis.__demoBackend = {
      users: [
        {
          id: "demo-admin",
          name: "Admin",
          email: adminEmail,
          role: "admin",
        },
        {
          id: "demo-user",
          name: "Demo User",
          email: userEmail,
          role: "user",
        },
      ],
      orders: [],
      coupons: [
        {
          code: "DRIP50",
          discountType: "percentage",
          discountValue: 50,
          minOrderAmount: 599,
          isActive: true,
          expiresAt: null,
          maxUses: 1000,
          usedCount: 0,
        },
      ],
      // Seed admin demo products from sample catalog.
      products: SAMPLE_PRODUCTS as unknown as Array<Record<string, unknown>>,
    };
  }
  return globalThis.__demoBackend;
}

export function isDemoMode() {
  return !isMongoConfigured();
}

export function getDemoUsers() {
  return getState().users;
}

export function demoUserFromEmail(email: string) {
  const e = email.trim().toLowerCase();
  return getState().users.find((u) => u.email.toLowerCase() === e) || null;
}

export function upsertDemoUser(partial: Partial<DemoUser> & { email: string }) {
  const st = getState();
  const existing = demoUserFromEmail(partial.email);
  if (existing) {
    const idx = st.users.findIndex((u) => u.id === existing.id);
    if (idx >= 0) st.users[idx] = { ...st.users[idx], ...partial };
    return st.users[idx];
  }
  const newUser: DemoUser = {
    id: `demo-user-${Date.now()}`,
    name: partial.name || "User",
    email: partial.email,
    role: partial.role || "user",
    image: partial.image,
  };
  st.users.push(newUser);
  return newUser;
}

function nowIso() {
  return new Date().toISOString();
}

export function addDemoOrder(order: Omit<DemoOrder, "createdAt">) {
  const st = getState();
  const createdAt = nowIso();
  const orderWithTime: DemoOrder = { ...order, createdAt };
  st.orders.unshift(orderWithTime);
  return orderWithTime;
}

export function getDemoOrdersByUserId(userId: string) {
  return getState().orders.filter((o) => o.userId === userId).sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function getDemoOrderById(orderId: string) {
  return getState().orders.find((o) => o._id === orderId) || null;
}

export function updateDemoOrder(orderId: string, patch: Partial<DemoOrder>) {
  const st = getState();
  const idx = st.orders.findIndex((o) => o._id === orderId);
  if (idx < 0) return null;
  st.orders[idx] = { ...st.orders[idx], ...patch, updatedAt: nowIso() };
  return st.orders[idx];
}

export function listDemoOrders() {
  return getState().orders.slice().sort((a, b) => +new Date(b.createdAt) - +new Date(a.createdAt));
}

export function listDemoCustomers() {
  return getState().users.slice().map((u) => ({
    _id: u.id,
    name: u.name,
    email: u.email,
    role: u.role,
    createdAt: nowIso(),
  }));
}

export function listDemoProducts() {
  const st = getState();
  // Ensure deterministic ordering even if `createdAt` isn't present.
  return st.products
    .slice()
    .sort((a, b) => {
      const atRaw = (a as Record<string, unknown>).createdAt;
      const btRaw = (b as Record<string, unknown>).createdAt;
      const at = typeof atRaw === "string" ? +new Date(atRaw) : 0;
      const bt = typeof btRaw === "string" ? +new Date(btRaw) : 0;
      return bt - at;
    });
}

export function createDemoProduct(body: Record<string, unknown>) {
  const st = getState();
  const slug = String(body.slug || "").trim();
  const id = String(body._id || slug || `demo-prod-${Date.now()}`);
  const createdAt = nowIso();
  const updatedAt = createdAt;

  const product = {
    _id: id,
    name: String(body.name || "Product"),
    slug: slug || String(body.name || "").toLowerCase().replace(/[^a-z0-9]+/g, "-"),
    description: String(body.description || ""),
    category: body.category,
    gender: body.gender,
    price: Number(body.price || 0),
    discountPrice: body.discountPrice !== undefined ? Number(body.discountPrice) : undefined,
    images: Array.isArray(body.images) ? body.images : [],
    sizes: Array.isArray(body.sizes) ? body.sizes : [],
    stock: Number(body.stock || 0),
    tags: Array.isArray(body.tags) ? body.tags : [],
    isFeatured: Boolean(body.isFeatured),
    isNewArrival: Boolean(body.isNewArrival),
    careInstructions: body.careInstructions ? String(body.careInstructions) : undefined,
    createdAt,
    updatedAt,
  } as unknown as Record<string, unknown>;

  st.products.unshift(product);
  return product;
}

export function updateDemoProduct(id: string, body: Record<string, unknown>) {
  const st = getState();
  const idx = st.products.findIndex((p) => String((p as Record<string, unknown>)._id) === id);
  if (idx < 0) return null;

  const updatedAt = nowIso();
  const next = {
    ...st.products[idx],
    ...body,
    updatedAt,
  } as unknown as Record<string, unknown>;

  // Ensure `_id` stays stable.
  (next as Record<string, unknown>)._id = (st.products[idx] as Record<string, unknown>)._id;
  st.products[idx] = next;
  return next;
}

export function deleteDemoProduct(id: string) {
  const st = getState();
  const idx = st.products.findIndex((p) => String((p as Record<string, unknown>)._id) === id);
  if (idx < 0) return false;
  st.products.splice(idx, 1);
  return true;
}

export function getDemoCoupon(code: string) {
  const c = code.trim().toUpperCase();
  return getState().coupons.find((x) => x.code.toUpperCase() === c) || null;
}

export function applyDemoCoupon(code: string, orderAmount: number) {
  const coupon = getDemoCoupon(code);
  if (!coupon || !coupon.isActive) {
    return { ok: false as const, error: "Invalid coupon code" };
  }
  if (coupon.usedCount >= coupon.maxUses) {
    return { ok: false as const, error: "Coupon limit reached" };
  }
  if (orderAmount < coupon.minOrderAmount) {
    return { ok: false as const, error: `Min order ₹${coupon.minOrderAmount} required` };
  }

  const discount =
    coupon.discountType === "percentage" ? Math.floor((orderAmount * coupon.discountValue) / 100) : coupon.discountValue;

  coupon.usedCount += 1;
  return { ok: true as const, discount, code: coupon.code, type: coupon.discountType };
}

