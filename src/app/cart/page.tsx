"use client";

import { useCart } from "@/context/CartContext";
import Link from "next/link";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

export default function CartPage() {
  const { items, removeFromCart, updateQuantity, clearCart, subtotal } = useCart();
  const { data: session, status } = useSession();
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [orderToast, setOrderToast] = useState("");

  useEffect(() => {
    if (status === "unauthenticated") router.push("/login");
  }, [status, router]);

  if (status === "loading" || status === "unauthenticated") {
    return (
      <div className="min-h-screen flex items-center justify-center text-sm text-neutral-400">
        Loading...
      </div>
    );
  }

  const shipping = items.length > 0 ? 5.99 : 0;
  const totalAmount = subtotal + shipping;

  async function handleCheckout() {
    if (items.length === 0) return;
    try {
      setIsSubmitting(true);
      const res = await fetch("/api/orders", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ cartItems: items, total: totalAmount }),
      });

      if (res.ok) {
        const json = await res.json();
        // ✅ Show order ID in a nice toast instead of alert
        setOrderToast("Order #" + (json.orderId || json.id || "confirmed") + " placed successfully!");
        clearCart();
        setTimeout(() => {
          setOrderToast("");
          window.location.href = "/";
        }, 3000);
      } else {
        const errJson = await res.json();
        alert("Checkout Failed: " + (errJson.error || "Please try again later."));
      }
    } catch (err) {
      console.error(err);
      alert("Network error creating order.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <div className="mx-auto max-w-4xl px-4 py-8 sm:px-6 lg:px-8 min-h-screen">

      {/* ✅ Order success toast */}
      {orderToast && (
        <div className="fixed top-4 left-1/2 -translate-x-1/2 z-50 bg-green-600 text-white px-6 py-3 rounded-xl text-sm font-bold shadow-lg">
          🎉 {orderToast}
        </div>
      )}

      <h1 className="text-2xl font-black tracking-tight text-neutral-900 mb-6">
        Your Shopping Cart
      </h1>

      {items.length === 0 ? (
        <div className="rounded-2xl border border-dashed border-neutral-200 bg-white p-12 text-center shadow-xs">
          <span className="text-4xl" role="img" aria-label="empty-cart">🛒</span>
          <h2 className="mt-4 text-base font-bold text-neutral-900">Your cart is empty</h2>
          <p className="mt-1 text-sm text-neutral-400">Looks like you haven't added anything yet.</p>
          <Link href="/" className="mt-6 inline-block rounded-xl bg-black px-4 py-2.5 text-xs font-bold text-white hover:bg-neutral-800 transition">
            Explore Catalog 🛍️
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-8 lg:grid-cols-12">

          {/* Left: Items */}
          <div className="lg:col-span-7 space-y-4">
            {items.map((item) => (
              <div key={item.productId} className="flex items-center gap-4 rounded-xl border border-neutral-200/60 bg-white p-4 shadow-xs">
                <img
                  src={item.imageUrl}
                  alt={item.name}
                  className="h-16 w-16 rounded-lg object-cover bg-neutral-50 border border-neutral-100"
                />
                <div className="flex-1 min-w-0">
                  <h3 className="text-sm font-bold text-neutral-900 truncate">{item.name}</h3>
                  <p className="text-xs text-neutral-400 capitalize mb-2">{item.category}</p>
                  <span className="text-sm font-extrabold text-neutral-900">
                    ${Number(item.price).toFixed(2)}
                  </span>
                </div>

                <div className="flex flex-col items-end gap-2">
                  <div className="flex items-center gap-2 border border-neutral-200 rounded-lg bg-neutral-50 p-1">
                    <button
                      disabled={isSubmitting}
                      onClick={() => updateQuantity(item.productId, Math.max(1, item.quantity - 1))}
                      className="px-2 py-0.5 text-xs font-bold text-neutral-500 hover:text-black transition disabled:opacity-50"
                    >-</button>
                    <span className="text-xs font-bold text-neutral-800 w-4 text-center">{item.quantity}</span>
                    <button
                      disabled={isSubmitting}
                      onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                      className="px-2 py-0.5 text-xs font-bold text-neutral-500 hover:text-black transition disabled:opacity-50"
                    >+</button>
                  </div>
                  <button
                    disabled={isSubmitting}
                    onClick={() => removeFromCart(item.productId)}
                    className="text-[10px] font-semibold text-neutral-400 hover:text-red-500 transition disabled:opacity-50"
                  >Remove</button>
                </div>
              </div>
            ))}

            <button
              disabled={isSubmitting}
              onClick={clearCart}
              className="text-xs font-bold text-neutral-400 hover:text-neutral-900 transition underline pl-2 disabled:opacity-50"
            >
              Empty entire cart
            </button>
          </div>

          {/* Right: Summary */}
          <div className="lg:col-span-5">
            <div className="rounded-2xl border border-neutral-200 bg-white p-6 shadow-xs">
              <h2 className="text-sm font-black text-neutral-900 border-b border-neutral-100 pb-3 uppercase tracking-wider">
                Order Summary
              </h2>
              <div className="mt-4 space-y-3 border-b border-neutral-100 pb-4">
                <div className="flex justify-between text-xs font-medium text-neutral-500">
                  <span>Subtotal</span>
                  <span className="text-neutral-900">${subtotal.toFixed(2)}</span>
                </div>
                <div className="flex justify-between text-xs font-medium text-neutral-500">
                  <span>Estimated Shipping</span>
                  <span className="text-neutral-900">${shipping.toFixed(2)}</span>
                </div>
              </div>
              <div className="mt-4 flex justify-between text-sm font-black text-neutral-900 mb-6">
                <span>Total Amount</span>
                <span>${totalAmount.toFixed(2)}</span>
              </div>
              <button
                disabled={isSubmitting}
                onClick={handleCheckout}
                className="w-full rounded-xl bg-black py-3 text-xs font-bold text-white shadow-xs hover:bg-neutral-800 transition cursor-pointer disabled:opacity-50"
              >
                {isSubmitting ? "Processing Order..." : "Confirm & Pay 🚀"}
              </button>
            </div>
          </div>

        </div>
      )}
    </div>
  );
}