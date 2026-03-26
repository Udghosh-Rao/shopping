import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import Providers from "@/components/Providers";
import Navbar from "@/components/store/Navbar";
import Footer from "@/components/store/Footer";
import MobileNav from "@/components/store/MobileNav";
import CartSidebar from "@/components/store/CartSidebar";
import WhatsAppButton from "@/components/store/WhatsAppButton";
import PageLoader from "@/components/ui/PageLoader";
import ScrollProgress from "@/components/ui/ScrollProgress";
import CustomCursor from "@/components/ui/CustomCursor";
import PullRefresh from "@/components/ui/PullRefresh";
import { Toaster } from "react-hot-toast";

const inter = Inter({
  subsets: ["latin"],
  display: "swap",
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: {
    default: "DripStore — Fashion Ecommerce",
    template: "%s | DripStore",
  },
  description: "Bold, premium fashion e-commerce shopping experience.",
  keywords: ["fashion", "ecommerce", "men", "women", "sneakers"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} h-full antialiased`}
      suppressHydrationWarning
    >
      <body className="min-h-full flex flex-col">
        <Providers>
          <PageLoader />
          <ScrollProgress />
          <CustomCursor />
          <PullRefresh />
          <Navbar />
          <main className="flex-1">{children}</main>
          <Footer />
          <MobileNav />
          <CartSidebar />
          <WhatsAppButton />
          <Toaster
            position="bottom-center"
            gutter={8}
            toastOptions={{
              duration: 2500,
              style: {
                background: "#0A0A0A",
                color: "#FFFFFF",
                fontWeight: "700",
                fontSize: "13px",
                borderRadius: "14px",
                padding: "12px 18px",
                letterSpacing: "0.05em",
                boxShadow: "0 20px 60px rgba(0,0,0,0.3)",
              },
              success: {
                iconTheme: { primary: "#E63946", secondary: "#fff" },
                style: {
                  background: "#0A0A0A",
                  color: "#fff",
                },
              },
              error: {
                style: {
                  background: "#E63946",
                  color: "#fff",
                },
              },
            }}
          />
        </Providers>
      </body>
    </html>
  );
}
