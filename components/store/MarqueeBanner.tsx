'use client';

export default function MarqueeBanner() {
  const items = [
    '🔥 FREE SHIPPING ON ORDERS ABOVE ₹999',
    '⚡ NEW ARRIVALS EVERY WEEK',
    '🎁 USE CODE WELCOME30 FOR 30% OFF',
    '✨ PREMIUM QUALITY GUARANTEED',
    '🚀 EASY RETURNS & EXCHANGES',
    '💳 PAY VIA UPI, CARDS & WALLETS',
  ];

  return (
    <div className="bg-[#0a0a0a] text-white overflow-hidden py-2.5 relative">
      <div className="animate-marquee flex whitespace-nowrap">
        {[...items, ...items].map((item, i) => (
          <span
            key={i}
            className="mx-8 text-[11px] sm:text-xs font-medium tracking-wider uppercase text-white/70"
          >
            {item}
          </span>
        ))}
      </div>
    </div>
  );
}
