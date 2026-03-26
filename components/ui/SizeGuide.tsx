"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X, Ruler } from "lucide-react";
import { useState } from "react";

const sizeData = {
  tops: [
    { size: "XS", chest: "34-36", waist: "28-30", height: "5'3\"-5'5\"" },
    { size: "S", chest: "36-38", waist: "30-32", height: "5'5\"-5'7\"" },
    { size: "M", chest: "38-40", waist: "32-34", height: "5'7\"-5'9\"" },
    { size: "L", chest: "40-42", waist: "34-36", height: "5'9\"-6'0\"" },
    { size: "XL", chest: "42-44", waist: "36-38", height: "6'0\"-6'2\"" },
  ],
  shoes: [
    { size: "6", uk: "6", eu: "39", cm: "24.5" },
    { size: "7", uk: "7", eu: "40", cm: "25.5" },
    { size: "8", uk: "8", eu: "41", cm: "26.5" },
    { size: "9", uk: "9", eu: "42", cm: "27.5" },
    { size: "10", uk: "10", eu: "43", cm: "28.5" },
  ],
};

export default function SizeGuide() {
  const [open, setOpen] = useState(false);
  const [tab, setTab] = useState<"tops" | "shoes">("tops");

  return (
    <>
      <button
        onClick={() => setOpen(true)}
        className="flex items-center gap-1.5 text-xs font-bold underline underline-offset-2 text-gray-500 hover:text-[#E63946] transition-colors"
      >
        <Ruler size={13} /> SIZE GUIDE
      </button>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-50"
              onClick={() => setOpen(false)}
            />
            <motion.div
              initial={{ opacity: 0, y: 50 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 50 }}
              className="fixed bottom-0 left-0 right-0 md:inset-auto md:top-1/2 md:left-1/2 md:-translate-x-1/2 md:-translate-y-1/2 bg-white z-[60] rounded-t-3xl md:rounded-3xl p-6 md:p-8 md:max-w-lg w-full max-h-[85vh] overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-6">
                <h3 className="text-xl font-black">SIZE GUIDE 📏</h3>
                <button onClick={() => setOpen(false)} className="p-2 hover:bg-gray-100 rounded-xl">
                  <X size={18} />
                </button>
              </div>

              <div className="flex gap-2 mb-5">
                {(["tops", "shoes"] as const).map((t) => (
                  <button
                    key={t}
                    onClick={() => setTab(t)}
                    className={`px-5 py-2 rounded-full text-xs font-black tracking-widest transition-all ${
                      tab === t ? "bg-[#0A0A0A] text-white" : "border-2 border-gray-200 text-gray-500"
                    }`}
                  >
                    {t.toUpperCase()}
                  </button>
                ))}
              </div>

              <div className="overflow-x-auto rounded-2xl border border-gray-100">
                <table className="w-full text-sm">
                  <thead className="bg-[#F8F5F0]">
                    <tr>
                      {tab === "tops"
                        ? ["SIZE", "CHEST (in)", "WAIST (in)", "HEIGHT"].map((h) => (
                            <th key={h} className="py-3 px-4 text-left text-xs font-black tracking-widest text-gray-500">
                              {h}
                            </th>
                          ))
                        : ["SIZE (IN)", "UK", "EU", "CM"].map((h) => (
                            <th key={h} className="py-3 px-4 text-left text-xs font-black tracking-widest text-gray-500">
                              {h}
                            </th>
                          ))}
                    </tr>
                  </thead>
                  <tbody>
                    {tab === "tops"
                      ? sizeData.tops.map((row) => (
                          <tr key={row.size} className="border-t border-gray-100">
                            <td className="py-3 px-4 font-black text-[#E63946]">{row.size}</td>
                            <td className="py-3 px-4">{row.chest}</td>
                            <td className="py-3 px-4">{row.waist}</td>
                            <td className="py-3 px-4 text-gray-500">{row.height}</td>
                          </tr>
                        ))
                      : sizeData.shoes.map((row) => (
                          <tr key={row.size} className="border-t border-gray-100">
                            <td className="py-3 px-4 font-black text-[#E63946]">{row.size}</td>
                            <td className="py-3 px-4">{row.uk}</td>
                            <td className="py-3 px-4">{row.eu}</td>
                            <td className="py-3 px-4">{row.cm}</td>
                          </tr>
                        ))}
                  </tbody>
                </table>
              </div>

              <p className="text-xs text-gray-400 mt-4 text-center">💡 Tip: If between sizes, size up for a relaxed fit</p>
            </motion.div>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
