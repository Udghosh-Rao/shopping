"use client";

import { useEffect, useState } from "react";

interface SaleCountdownProps {
  endTime: string;
}

export default function SaleCountdown({ endTime }: SaleCountdownProps) {
  const [time, setTime] = useState({ hours: 0, minutes: 0, seconds: 0 });
  const [isExpired, setIsExpired] = useState(false);

  useEffect(() => {
    const updateCountdown = () => {
      const now = new Date().getTime();
      const endTimeMs = new Date(endTime).getTime();
      const distance = endTimeMs - now;

      if (distance < 0) {
        setIsExpired(true);
        return;
      }

      const hours = Math.floor((distance % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
      const minutes = Math.floor((distance % (1000 * 60 * 60)) / (1000 * 60));
      const seconds = Math.floor((distance % (1000 * 60)) / 1000);

      setTime({ hours, minutes, seconds });
    };

    updateCountdown();
    const interval = setInterval(updateCountdown, 1000);

    return () => clearInterval(interval);
  }, [endTime]);

  if (isExpired) {
    return null;
  }

  const isUrgent = time.hours < 1;

  return (
    <div className={`font-bold text-2xl md:text-3xl tracking-wider font-mono ${isUrgent ? "text-yellow-200" : ""}`}>
      {String(time.hours).padStart(2, "0")}:{String(time.minutes).padStart(2, "0")}:
      {String(time.seconds).padStart(2, "0")}
    </div>
  );
}
