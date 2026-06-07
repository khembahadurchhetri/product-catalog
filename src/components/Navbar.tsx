"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useSession, signOut } from "next-auth/react";

export function Navbar() {
  // 🛒 1. Pull totalItems directly — already computed in CartContext
  const { totalItems } = useCart();

  // 🔐 2. Pull user authentication status on the client side
  const { data: session } = useSession();

  return (
    <nav className="border-b border-neutral-200 bg-white sticky top-0 z-50">
      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <div className="flex h-16 items-center justify-between">

          {/* Logo Brand Link */}
          <div className="flex items-center">
            <Link href="/" className="text-xl font-black tracking-tight text-black">
              ShopCo
            </Link>
          </div>

          {/* Right Navigation Controls */}
          <div className="flex items-center gap-6">

            {/* Cart Badge */}
            <Link href="/cart" className="relative group p-2 text-neutral-600 hover:text-black transition">
              <span className="text-xl" role="img" aria-label="cart">🛒</span>
              {totalItems > 0 && (
                <span className="absolute -top-1 -right-1 flex h-4 min-w-4 items-center justify-center rounded-full bg-red-500 px-1 text-[10px] font-bold text-white shadow-xs">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Admin Portal Shortcut */}
            {session?.user?.email === "admin@store.com" && (
              <Link
                href="/admin"
                className="rounded-lg bg-neutral-100 px-3 py-1.5 text-xs font-bold text-neutral-700 hover:bg-neutral-200 transition"
              >
                Admin Panel 🛠️
              </Link>
            )}

            {/* Auth Button */}
            {session ? (
              <div className="flex items-center gap-3">
                <span className="hidden text-xs text-neutral-400 sm:inline">
                  {session.user?.name || "User"}
                </span>
                <button
                  onClick={() => signOut({ callbackUrl: "/" })}
                  className="text-xs font-semibold text-neutral-500 hover:text-red-600 transition cursor-pointer"
                >
                  Sign out
                </button>
              </div>
            ) : (
              <Link
                href="/login"
                className="text-xs font-bold text-black hover:underline"
              >
                Sign In
              </Link>
            )}

          </div>
        </div>
      </div>
    </nav>
  );
}