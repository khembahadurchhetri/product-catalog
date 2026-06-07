"use client";

import {
  createContext,
  useContext,
  useState,
  useEffect,
  useCallback,
  type ReactNode,
} from "react";
import { useSession } from "next-auth/react";

export type CartItem = {
  id: string;
  productId: string;
  name: string;
  price: number;
  imageUrl: string;
  category: string;
  quantity: number;
};

type CartContextType = {
  items: CartItem[];
  totalItems: number;
  subtotal: number;
  addToCart: (item: Omit<CartItem, "id">) => Promise<void>;
  removeFromCart: (productId: string) => Promise<void>;
  updateQuantity: (productId: string, quantity: number) => Promise<void>;
  clearCart: () => void;
  loading: boolean;
};

const CartContext = createContext<CartContextType | null>(null);

export function CartProvider({ children }: { children: ReactNode }) {
  const { data: session, status } = useSession();
  const [items, setItems] = useState<CartItem[]>([]);
  const [loading, setLoading] = useState(false);

  const userId = session?.user?.id;

  const fetchCart = useCallback(async () => {
    if (!userId) {
      setItems([]);
      return;
    }
    setLoading(true);
    try {
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setItems(
          (data.items ?? []).map((item: any) => ({
            id: item.id,
            productId: item.productId,
            name: item.name,
            price: Number(item.price),
            imageUrl: item.imageUrl || "/placeholder.jpg",
            category: item.category || "General",
            quantity: item.quantity,
          }))
        );
      }
    } catch (err) {
      console.error("Failed to fetch cart:", err);
    } finally {
      setLoading(false);
    }
  }, [userId]);

  useEffect(() => {
    if (status !== "loading") fetchCart();
  }, [fetchCart, status]);

  const addToCart = async (item: Omit<CartItem, "id">) => {
    if (!userId) return;
    try {
      const res = await fetch("/api/cart", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId: item.productId, quantity: item.quantity }),
      });
      if (res.ok) await fetchCart();
    } catch (err) {
      console.error("addToCart error:", err);
    }
  };

  const removeFromCart = async (productId: string) => {
    if (!userId) return;
    try {
      const res = await fetch(`/api/cart?productId=${productId}`, {
        method: "DELETE",
      });
      if (res.ok) await fetchCart();
    } catch (err) {
      console.error("removeFromCart error:", err);
    }
  };

  const updateQuantity = async (productId: string, quantity: number) => {
    if (!userId) return;
    if (quantity <= 0) {
      await removeFromCart(productId);
      return;
    }
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (res.ok) await fetchCart();
    } catch (err) {
      console.error("updateQuantity error:", err);
    }
  };

  const clearCart = () => setItems([]);

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0);
  const subtotal = items.reduce((sum, i) => sum + i.price * i.quantity, 0);

  return (
    <CartContext.Provider
      value={{
        items,
        totalItems,
        subtotal,
        addToCart,
        removeFromCart,
        updateQuantity,
        clearCart,
        loading,
      }}
    >
      {children}
    </CartContext.Provider>
  );
}

export function useCart() {
  const ctx = useContext(CartContext);
  if (!ctx) throw new Error("useCart must be used within a CartProvider");
  return ctx;
}