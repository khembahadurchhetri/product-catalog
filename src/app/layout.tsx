import type { Metadata } from "next";
import { Inter } from "next/font/google";
import { auth } from "@/auth";
import { Navbar } from "@/components/Navbar";
import { MobileBottomNav } from "@/components/MobileBottomNav";
import { SessionProvider } from "@/components/providers/SessionProvider";
import { CartProvider } from "@/context/CartContext";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
});

export const metadata: Metadata = {
  title: "ShopCo — Catalog",
  description: "Browse products with search, filters, and a fast local cart.",
};

export const dynamic = "force-dynamic";

export default async function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  const session = await auth();

  return (
    <html lang="en" className={`${inter.variable} h-full`}>
      <body className="min-h-full flex flex-col bg-neutral-50 font-sans text-neutral-900 antialiased">
        <SessionProvider>
          <CartProvider>
            {/* 🛒 Top Nav bar reads dynamically from CartProvider state */}
            <Navbar />
            
            <main className="flex-1">{children}</main>
            
            <footer className="hidden border-t border-neutral-200 bg-white py-5 text-xs text-neutral-400 lg:block">
              <div className="mx-auto flex max-w-7xl items-center justify-between px-8">
                <p>&copy; 2026 ShopCo. All rights reserved.</p>
                <div className="flex items-center gap-4">
                  <span>Privacy</span>
                  <span>Terms</span>
                  <span>Support</span>
                </div>
              </div>
            </footer>

            {/* 🚀 FIXED: Mobile Nav now listens directly to the CartContext client engine inside itself! */}
            <MobileBottomNav
              isSignedIn={Boolean(session?.user)}
            />
          </CartProvider>
        </SessionProvider>
      </body>
    </html>
  );
}