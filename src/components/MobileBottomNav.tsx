"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { IconCart, IconHome, IconSearch, IconUser } from "./icons";
// 🚀 Import your global state hook
import { useCart } from "@/context/CartContext";

type MobileBottomNavProps = {
  isSignedIn: boolean;
};

export function MobileBottomNav({ isSignedIn }: MobileBottomNavProps) {
  const pathname = usePathname();
  
  // 🛒 FIXED: Track changes inside the client cart context directly
  const { totalItems } = useCart();

  const linkClass = (href: string) =>
    `flex flex-1 flex-col items-center gap-1 py-2 text-[10px] font-medium ${
      pathname === href ? "text-blue-500" : "text-neutral-500"
    }`;

  return (
    <nav
      className="fixed bottom-0 left-0 right-0 z-50 border-t border-neutral-200 bg-white pb-[env(safe-area-inset-bottom)] lg:hidden"
      aria-label="Mobile navigation"
    >
      <div className="mx-auto flex max-w-lg items-stretch justify-around">
        <Link href="/" className={linkClass("/")}>
          <IconHome className="h-6 w-6" />
          Browse
        </Link>
        <a href="/#search" className={linkClass("/")}>
          <IconSearch className="h-6 w-6" />
          Search
        </a>
        <Link href="/cart" className={`relative ${linkClass("/cart")}`}>
          <IconCart className="h-6 w-6" />
          Cart
          {/* 🚀 The badge now automatically listens to your cart state updates */}
          {totalItems > 0 && (
            <span className="absolute right-1/4 top-0 flex h-4 min-w-4 -translate-y-0.5 items-center justify-center rounded-full bg-neutral-900 px-1 text-[9px] font-bold text-white">
              {totalItems > 99 ? "99+" : totalItems}
            </span>
          )}
        </Link>
        <Link
          href={isSignedIn ? "/" : "/login"}
          className={linkClass(isSignedIn ? "/" : "/login")}
        >
          <IconUser className="h-6 w-6" />
          Account
        </Link>
      </div>
    </nav>
  );
}