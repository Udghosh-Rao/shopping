"use client";

import { SessionProvider } from "next-auth/react";
import { CartProvider } from "@/lib/cartStore";
import { ThemeProvider } from "@/lib/themeContext";
import { FlyToCartProvider } from "@/components/ui/FlyToCart";

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CartProvider>
          <FlyToCartProvider>{children}</FlyToCartProvider>
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
