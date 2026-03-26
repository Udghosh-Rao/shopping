"use client";

import { motion } from "framer-motion";
import Image from "next/image";
import { Camera } from "lucide-react";
import RevealText from "@/components/ui/RevealText";

const posts = [
  { id: 1, image: "/lookbook/1.jpg", likes: "2.4K", tag: "@arjun.drip" },
  { id: 2, image: "/lookbook/2.jpg", likes: "1.8K", tag: "@priya.styles" },
  { id: 3, image: "/lookbook/3.jpg", likes: "3.1K", tag: "@rahul.vibe" },
  { id: 4, image: "/lookbook/4.jpg", likes: "892", tag: "@sneha.fit" },
  { id: 5, image: "/lookbook/5.jpg", likes: "4.2K", tag: "@karan.drip" },
  { id: 6, image: "/lookbook/6.jpg", likes: "1.3K", tag: "@riya.style" },
];

export default function Lookbook() {
  return (
    <section className="py-20 px-4 md:px-8 max-w-7xl mx-auto">
      <div className="text-center mb-10">
        <p className="text-[#E63946] text-xs font-bold tracking-[0.3em] mb-2">COMMUNITY VIBES</p>
        <RevealText text="#DRIPSTORE 📸" className="text-4xl md:text-5xl font-black tracking-tight mb-3 justify-center" />
        <p className="text-gray-400 text-sm">Tag us for a chance to be featured</p>
      </div>

      <div className="grid grid-cols-3 md:grid-cols-6 gap-2 md:gap-3">
        {posts.map((post, i) => (
          <motion.div
            key={post.id}
            initial={{ opacity: 0, scale: 0.9 }}
            whileInView={{ opacity: 1, scale: 1 }}
            viewport={{ once: true }}
            transition={{ delay: i * 0.07 }}
            className="group relative aspect-square bg-[#F8F5F0] rounded-xl overflow-hidden cursor-pointer"
          >
            <div className="absolute inset-0">
              <Image
                src={post.image}
                alt={post.tag}
                fill
                className="object-cover"
                sizes="(max-width: 768px) 33vw, 16vw"
                unoptimized
              />
            </div>
            <div className="absolute inset-0 bg-black/0 group-hover:bg-black/50 transition-all duration-300 flex flex-col items-center justify-center gap-1 opacity-0 group-hover:opacity-100">
              <Camera size={20} className="text-white" />
              <p className="text-white text-[10px] font-bold">{post.likes} likes</p>
              <p className="text-white/70 text-[9px]">{post.tag}</p>
            </div>
          </motion.div>
        ))}
      </div>

      <div className="text-center mt-8">
        <a
          href="https://instagram.com/dripstore"
          target="_blank"
          rel="noreferrer"
          className="inline-flex items-center gap-2 px-6 py-3 border-2 border-gray-200 rounded-full text-sm font-bold hover:border-[#E63946] hover:text-[#E63946] transition-all"
        >
          <Camera size={16} /> FOLLOW @DRIPSTORE
        </a>
      </div>
    </section>
  );
}
