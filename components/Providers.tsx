'use client';

import { SessionProvider } from 'next-auth/react';
import { CartProvider } from '@/lib/cartStore';
import { Toaster } from 'react-hot-toast';
import { ThemeProvider } from '@/lib/themeContext';

export default function Providers({ children }: { children: React.ReactNode }) {
  return (
    <SessionProvider>
      <ThemeProvider>
        <CartProvider>
          {children}
          <Toaster
            position="bottom-right"
            toastOptions={{
              style: {
                background: 'var(--toast-bg)',
                color: 'var(--toast-text)',
                borderRadius: '12px',
                padding: '14px 20px',
                fontSize: '14px',
                fontWeight: '500',
              },
            }}
          />
        </CartProvider>
      </ThemeProvider>
    </SessionProvider>
  );
}
