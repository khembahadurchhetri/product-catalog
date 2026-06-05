"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState } from "react";
import { useCart } from "@/context/CartContext";

type AddToCartButtonProps = {
  productId: string;
  inStock: boolean;
  quantity?: number;
  className?: string;
  buttonLabel?: string;
  // 🚀 Pass along additional parameters required to populate your Context state model
  productName: string;
  productSlug: string;
  productPrice: number | string;
  productImageUrl?: string | null;
  productCategory?: string | null;
  productStockMax?: number;
};

export function AddToCartButton({
  productId,
  inStock,
  quantity = 1,
  className,
  buttonLabel = "Add to Cart",
  productName,
  productSlug,
  productPrice,
  productImageUrl,
  productCategory,
  productStockMax,
}: AddToCartButtonProps) {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState<string | null>(null);

  // 🛒 Pull the active item addition hook engine from context
  const { addToCart } = useCart();

  function handleAdd() {
    // If you want to force sign-in before adding items, leave this here.
    // If you want guests to be able to add items to their local cart, remove this block!
    if (!session) {
      router.push(
        `/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`,
      );
      return;
    }

    setLoading(true);
    setMessage(null);

    try {
      // 🚀 FIXED: Instead of hitting an external api endpoint, update your client state engine!
      addToCart({
        id: productId,
        name: productName,
        slug: productSlug,
        price: Number(productPrice) || 0,
        imageUrl: productImageUrl || "",
        category: productCategory || "General",
        quantity: quantity,
        stock: productStockMax ?? (inStock ? 99 : 0),
      });

      setMessage("Added to cart!");
    } catch (err) {
      console.error(err);
      setMessage("Something went wrong");
    } finally {
      setLoading(false);
    }
  }

  if (status === "loading") {
    return (
      <button
        type="button"
        disabled
        className="w-full rounded-lg bg-neutral-200 px-6 py-3.5 font-semibold text-neutral-500"
      >
        Loading…
      </button>
    );
  }

  return (
    <div className={`space-y-2 ${className ?? ""}`}>
      <button
        type="button"
        onClick={handleAdd}
        disabled={!inStock || loading}
        className="w-full rounded-lg bg-neutral-900 px-6 py-3.5 font-semibold text-white transition hover:bg-neutral-800 disabled:cursor-not-allowed disabled:bg-neutral-300 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900 cursor-pointer"
      >
        {!inStock
          ? "Out of stock"
          : loading
            ? "Adding…"
            : session
              ? buttonLabel
              : "Sign in to Add to Cart"}
      </button>
      
      {message && (
        <p
          className={`text-sm ${message.includes("Added") ? "text-green-700" : "text-red-600"}`}
          role="status"
        >
          {message}
        </p>
      )}
      
      {!session && inStock && (
        <p className="text-sm text-neutral-500">
          Cart is saved to your account when signed in.
        </p>
      )}
    </div>
  );
}