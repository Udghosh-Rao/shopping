"use client";

import { useEffect, useState } from "react";
import { motion } from "framer-motion";

function getTimeLeft(endTime: Date) {
  const diff = endTime.getTime() - Date.now();
  if (diff <= 0) return { h: 0, m: 0, s: 0 };
  return {
    h: Math.floor(diff / 3600000),
    m: Math.floor((diff % 3600000) / 60000),
    s: Math.floor((diff % 60000) / 1000),
  };
}

function TimeBlock({ val, label }: { val: number; label: string }) {
  return (
    <div className="flex flex-col items-center">
      <motion.div
        key={val}
        initial={{ rotateX: -90, opacity: 0 }}
        animate={{ rotateX: 0, opacity: 1 }}
        className="w-14 h-14 bg-[#0A0A0A] text-white rounded-xl flex items-center justify-center text-2xl font-black"
      >
        {String(val).padStart(2, "0")}
      </motion.div>
      <span className="text-[10px] font-bold tracking-widest text-gray-400 mt-1">{label}</span>
    </div>
  );
}

export default function CountdownTimer({ hoursFromNow = 6 }: { hoursFromNow?: number }) {
  const [endTime] = useState(() => new Date(Date.now() + hoursFromNow * 3600000));
  const [time, setTime] = useState(getTimeLeft(endTime));

  useEffect(() => {
    const timer = setInterval(() => setTime(getTimeLeft(endTime)), 1000);
    return () => clearInterval(timer);
  }, [endTime]);

  return (
    <div className="bg-[#FFF7ED] border-2 border-orange-200 rounded-2xl p-5">
      <p className="text-xs font-black tracking-[0.3em] text-orange-500 mb-3">⚡ FLASH SALE ENDS IN</p>
      <div className="flex items-end gap-3">
        <TimeBlock val={time.h} label="HOURS" />
        <span className="text-2xl font-black text-gray-300 mb-3">:</span>
        <TimeBlock val={time.m} label="MINS" />
        <span className="text-2xl font-black text-gray-300 mb-3">:</span>
        <TimeBlock val={time.s} label="SECS" />
      </div>
    </div>
  );
}
