"use client";

import { useRouter } from "next/navigation";
import { useSession } from "next-auth/react";
import { useState, useEffect } from "react";
import { useCart } from "@/context/CartContext";

export type AddToCartButtonProps = {
  productId: string;
  inStock: boolean;
  quantity?: number;
  className?: string;
  buttonLabel?: string;
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

  // Use a flexible type to prevent "Yellow" warnings in Cursor/VS Code
  const cart = useCart() as any; 
  
  // Find if item is already in cart to handle "Update" vs "Add"
  const items = cart?.items || [];
  const existingItem = items.find((item: any) => item.id === productId);

  // Clear message after 3 seconds
  useEffect(() => {
    if (message) {
      const timer = setTimeout(() => setMessage(null), 3000);
      return () => clearTimeout(timer);
    }
  }, [message]);

  async function handleAdd() {
    if (status === "unauthenticated") {
      router.push(`/login?callbackUrl=${encodeURIComponent(window.location.pathname)}`);
      return;
    }

    setLoading(true);
    
    try {
      // Calculate delta so we don't "double stack" the quantity
      const quantityToAdd = existingItem ? quantity - existingItem.quantity : quantity;

      if (quantityToAdd !== 0) {
        cart.addToCart({
          id: productId,
          name: productName,
          slug: productSlug,
          price: Number(productPrice),
          imageUrl: productImageUrl || "",
          category: productCategory || "Uncategorized",
          quantity: quantityToAdd,
          stock: productStockMax || 10
        });
        setMessage(existingItem ? "Quantity updated!" : "Added to cart!");
      } else {
        setMessage("Already in cart at this quantity");
      }
    } catch (error) {
      setMessage("Error updating cart");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className={`w-full ${className || ""}`}>
      <button
        onClick={handleAdd}
        disabled={!inStock || loading || status === "loading"}
        className="w-full rounded-lg bg-neutral-900 py-3 text-sm font-bold text-white transition hover:bg-black disabled:bg-neutral-300"
      >
        {loading ? "Processing..." : !inStock ? "Sold Out" : buttonLabel}
      </button>
      {message && (
        <p className="mt-2 text-center text-xs font-medium text-green-600 animate-in fade-in slide-in-from-top-1">
          {message}
        </p>
      )}
    </div>
  );
}