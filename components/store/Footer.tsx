"use client";

import Link from "next/link";
import { Share2, Send, Mail, Zap } from "lucide-react";

const footerLinks = [
  {
    title: "SHOP",
    links: [
      { label: "Men", href: "/shop?gender=Men" },
      { label: "Women", href: "/shop?gender=Women" },
      { label: "Sneakers", href: "/shop?category=Shoes" },
      { label: "New Arrivals", href: "/shop?filter=new" },
      { label: "Sale 🔥", href: "/shop?filter=sale" },
    ],
  },
  {
    title: "HELP",
    links: [
      { label: "Size Guide", href: "#" },
      { label: "Track Order", href: "/profile" },
      { label: "Easy Returns", href: "#" },
      { label: "Contact Us", href: "#" },
      { label: "FAQs", href: "#" },
    ],
  },
  {
    title: "COMPANY",
    links: [
      { label: "About Us", href: "#" },
      { label: "Careers", href: "#" },
      { label: "Blog", href: "#" },
      { label: "Sustainability", href: "#" },
      { label: "Affiliates", href: "#" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-[#0A0A0A] text-white pb-24 md:pb-0">
      <div className="border-b border-white/10">
        <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div>
            <p className="text-[#E63946] text-xs font-bold tracking-[0.3em] mb-2">STAY IN THE LOOP</p>
            <h3 className="text-2xl font-black tracking-tight">DROP ALERTS + EXCLUSIVE OFFERS</h3>
            <p className="text-gray-400 text-sm mt-1">Get notified before everyone else. No spam, only drip. 🔥</p>
          </div>
          <div className="flex w-full md:w-auto">
            <input
              type="email"
              placeholder="your@email.com"
              className="bg-white/5 border border-white/20 px-4 py-3 text-sm w-full md:w-64 outline-none focus:border-[#E63946] rounded-l-xl transition-colors placeholder:text-gray-500"
            />
            <button className="bg-[#E63946] px-5 py-3 text-sm font-black tracking-widest hover:bg-red-700 transition-colors rounded-r-xl whitespace-nowrap">
              SUBSCRIBE
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-8 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <Link href="/" className="flex items-center gap-1.5 mb-4">
            <div className="w-8 h-8 bg-[#E63946] rounded-xl flex items-center justify-center">
              <Zap size={18} className="text-white" fill="white" />
            </div>
            <span className="text-xl font-black">
              DRIP<span className="text-[#E63946]">STORE</span>
            </span>
          </Link>
          <p className="text-gray-400 text-sm leading-relaxed mb-5">
            Homegrown Indian streetwear. Built for the bold, designed for the young. 🇮🇳
          </p>
          <div className="flex gap-3">
            {[Share2, Send, Mail].map((Icon, i) => (
              <a
                key={i}
                href="#"
                className="w-9 h-9 rounded-xl bg-white/5 flex items-center justify-center hover:bg-[#E63946] transition-colors"
              >
                <Icon size={16} />
              </a>
            ))}
          </div>
        </div>

        {footerLinks.map((col) => (
          <div key={col.title}>
            <h4 className="text-xs font-black tracking-[0.3em] text-gray-500 mb-4">{col.title}</h4>
            <ul className="space-y-2.5">
              {col.links.map((link) => (
                <li key={link.label}>
                  <Link href={link.href} className="text-sm text-gray-400 hover:text-white transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-5 px-4 md:px-8">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-3 text-xs text-gray-500">
          <p>© 2026 DripStore. All rights reserved. Made with ❤️ in India.</p>
          <div className="flex flex-wrap gap-4 justify-center">
            {["Privacy Policy", "Terms", "Shipping Policy", "Refund Policy"].map((t) => (
              <Link key={t} href="#" className="hover:text-white transition-colors">
                {t}
              </Link>
            ))}
          </div>
        </div>
      </div>
    </footer>
  );
}
