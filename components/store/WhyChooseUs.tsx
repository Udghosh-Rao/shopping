"use client";
import { motion } from "framer-motion";
import { Truck, RefreshCw, ShieldCheck, Zap } from "lucide-react";

const perks = [
  {
    icon: Truck,
    title: "Free Delivery",
    desc: "On all orders above ₹599",
    color: "#E63946",
  },
  {
    icon: RefreshCw,
    title: "Easy Returns",
    desc: "15-day hassle-free returns",
    color: "#0A0A0A",
  },
  {
    icon: ShieldCheck,
    title: "100% Authentic",
    desc: "All products are genuine",
    color: "#E63946",
  },
  {
    icon: Zap,
    title: "Fast Dispatch",
    desc: "Orders ship within 24hrs",
    color: "#0A0A0A",
  },
];

export default function WhyChooseUs() {
  return (
    <section className="py-16 md:py-24 bg-[#F8F5F0]">
      <div className="max-w-7xl mx-auto px-4 md:px-8">
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-5 md:gap-7">
          {perks.map((perk, i) => (
            <motion.div
              key={perk.title}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: i * 0.1 }}
              className="bg-white rounded-2xl p-7 md:p-9 flex flex-col gap-5 hover:shadow-lg transition-shadow"
            >
              <div
                className="w-12 h-12 rounded-2xl flex items-center justify-center"
                style={{ background: `${perk.color}10` }}
              >
                <perk.icon size={22} style={{ color: perk.color }} />
              </div>
              <div>
                <h3 className="font-black text-base text-[#0A0A0A] mb-1">{perk.title}</h3>
                <p className="text-sm text-gray-500">{perk.desc}</p>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
