"use client";

import Link from "next/link";
import { useState } from "react";
import { Share2, Mail, Heart, Send } from "lucide-react";
import toast from "react-hot-toast";

export default function Footer() {
  const [email, setEmail] = useState("");

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    if (!email.trim()) return;
    toast.success("Subscribed successfully!");
    setEmail("");
  };

  return (
    <footer className="bg-[#0A0A0A] text-white">
      <div className="border-b border-white/10 py-12 px-4 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div>
            <h3 className="text-2xl font-black tracking-tight mb-1">JOIN THE CLUB</h3>
            <p className="text-gray-400 text-sm">Get exclusive drops, offers & style tips</p>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter your email"
              className="bg-white/10 border border-white/20 px-4 py-3 text-sm w-full md:w-72 outline-none focus:border-[#E63946]"
              required
            />
            <button className="bg-[#E63946] px-6 py-3 text-sm font-bold tracking-widest hover:bg-red-700 transition-colors whitespace-nowrap">
              SUBSCRIBE
            </button>
          </form>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 md:px-16 py-12 grid grid-cols-2 md:grid-cols-4 gap-8">
        <div>
          <h4 className="font-black text-lg tracking-tight mb-4">
            DRIP<span className="text-[#E63946]">STORE</span>
          </h4>
          <p className="text-gray-400 text-sm leading-relaxed">
            Homegrown Indian brand. Crafted with intent, curated for you.
          </p>
          <div className="flex gap-4 mt-4">
            <Share2 size={18} className="text-gray-400 hover:text-[#E63946] cursor-pointer transition-colors" />
            <Mail size={18} className="text-gray-400 hover:text-[#E63946] cursor-pointer transition-colors" />
            <Heart size={18} className="text-gray-400 hover:text-[#E63946] cursor-pointer transition-colors" />
            <Send size={18} className="text-gray-400 hover:text-[#E63946] cursor-pointer transition-colors" />
          </div>
        </div>

        {[
          { title: "SHOP", links: ["Men", "Women", "Sneakers", "New Arrivals", "Sale"] },
          { title: "HELP", links: ["Size Guide", "Track Order", "Returns", "Contact Us", "FAQ"] },
          { title: "COMPANY", links: ["About Us", "Careers", "Press", "Blog", "Sustainability"] },
        ].map((col) => (
          <div key={col.title}>
            <h4 className="font-bold text-xs tracking-widest mb-4 text-gray-400">{col.title}</h4>
            <ul className="space-y-2">
              {col.links.map((link) => (
                <li key={link}>
                  <Link href="#" className="text-sm text-gray-300 hover:text-[#E63946] transition-colors">
                    {link}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>

      <div className="border-t border-white/10 py-4 px-4 md:px-16">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row justify-between items-center gap-2 text-xs text-gray-500">
          <p>© 2026 DripStore. All rights reserved.</p>
          <div className="flex gap-4">
            <Link href="#" className="hover:text-white transition-colors">Privacy Policy</Link>
            <Link href="#" className="hover:text-white transition-colors">Terms of Service</Link>
            <Link href="#" className="hover:text-white transition-colors">Shipping Policy</Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
