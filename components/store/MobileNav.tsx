'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { Home, Search, ShoppingBag, User } from 'lucide-react';
import { useCart } from '@/lib/cartStore';
import { motion } from 'framer-motion';

export default function MobileNav() {
  const pathname = usePathname();
  const { totalItems } = useCart();

  const links = [
    { href: '/', icon: Home, label: 'Home' },
    { href: '/shop', icon: Search, label: 'Shop' },
    { href: '/cart', icon: ShoppingBag, label: 'Cart', badge: totalItems },
    { href: '/profile', icon: User, label: 'Profile' },
  ];

  // Hide on admin pages
  if (pathname.startsWith('/admin')) return null;

  return (
    <nav className="lg:hidden fixed bottom-0 left-0 right-0 z-50 bg-[var(--nav-bg)] backdrop-blur-xl border-t border-[var(--border)] safe-area-pb">
      <div className="flex items-center justify-around h-16">
        {links.map((link) => {
          const isActive =
            link.href === '/'
              ? pathname === '/'
              : pathname.startsWith(link.href);

          return (
            <Link
              key={link.label}
              href={link.href}
              className="relative flex flex-col items-center justify-center gap-0.5 w-16 py-1"
            >
              <div className="relative">
                <link.icon
                  className={`w-5 h-5 transition-colors ${
                    isActive ? 'text-accent' : 'text-muted'
                  }`}
                />
                {link.badge && link.badge > 0 ? (
                  <motion.span
                    key={link.badge}
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    className="absolute -top-1.5 -right-2 w-4 h-4 bg-accent text-white text-[9px] font-bold rounded-full flex items-center justify-center"
                  >
                    {link.badge > 9 ? '9+' : link.badge}
                  </motion.span>
                ) : null}
              </div>
              <span
                className={`text-[10px] font-medium transition-colors ${
                  isActive ? 'text-accent' : 'text-muted'
                }`}
              >
                {link.label}
              </span>
              {isActive && (
                <motion.div
                  layoutId="mobile-nav-indicator"
                  className="absolute -top-px left-3 right-3 h-0.5 bg-accent rounded-full"
                />
              )}
            </Link>
          );
        })}
      </div>
    </nav>
  );
}
