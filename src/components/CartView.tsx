"use client";

import Image from "next/image";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useState } from "react";

export type CartLine = {
  id: string;
  quantity: number;
  productId: string;
  slug: string;
  name: string;
  price: number;
  imageUrl: string;
  stock: number;
};

type CartViewProps = {
  items: CartLine[];
  subtotal: number;
};

export function CartView({ items: initialItems, subtotal: initialSubtotal }: CartViewProps) {
  const router = useRouter();
  const [items, setItems] = useState(initialItems);
  const [subtotal, setSubtotal] = useState(initialSubtotal);
  const [updating, setUpdating] = useState<string | null>(null);

  async function updateQuantity(productId: string, quantity: number) {
    setUpdating(productId);
    try {
      const res = await fetch("/api/cart", {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ productId, quantity }),
      });
      if (!res.ok) return;
      const res2 = await fetch("/api/cart");
      if (res2.ok) {
        const data = await res2.json();
        setItems(data.items);
        setSubtotal(data.subtotal);
      }
      router.refresh();
    } finally {
      setUpdating(null);
    }
  }

  async function removeItem(productId: string) {
    setUpdating(productId);
    try {
      await fetch(`/api/cart?productId=${productId}`, { method: "DELETE" });
      const res = await fetch("/api/cart");
      if (res.ok) {
        const data = await res.json();
        setItems(data.items);
        setSubtotal(data.subtotal);
      }
      router.refresh();
    } finally {
      setUpdating(null);
    }
  }

  if (items.length === 0) {
    return (
      <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
        <p className="text-lg font-medium text-neutral-900">Your cart is empty</p>
        <Link
          href="/"
          className="mt-4 inline-block font-medium text-neutral-900 underline-offset-2 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
        >
          Continue shopping
        </Link>
      </div>
    );
  }

  return (
    <div className="grid gap-8 lg:grid-cols-3">
      <ul className="space-y-4 lg:col-span-2" aria-label="Cart items">
        {items.map((item) => (
          <li
            key={item.id}
            className="flex gap-4 rounded-xl border border-neutral-200 bg-white p-4"
          >
            <div className="relative h-24 w-24 shrink-0 overflow-hidden rounded-lg bg-neutral-100">
              <Image
                src={item.imageUrl}
                alt={item.name}
                fill
                sizes="96px"
                className="object-cover"
              />
            </div>
            <div className="flex flex-1 flex-col gap-2">
              <Link
                href={`/products/${item.slug}`}
                className="font-semibold text-neutral-900 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-neutral-900"
              >
                {item.name}
              </Link>
              <p className="text-sm text-neutral-600">${item.price.toFixed(2)} each</p>
              <div className="mt-auto flex flex-wrap items-center gap-3">
                <label className="flex items-center gap-2 text-sm">
                  <span className="sr-only">Quantity for {item.name}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity - 1)}
                    disabled={updating === item.productId}
                    className="h-8 w-8 rounded border border-neutral-300 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-900"
                    aria-label={`Decrease quantity of ${item.name}`}
                  >
                    −
                  </button>
                  <span aria-live="polite">{item.quantity}</span>
                  <button
                    type="button"
                    onClick={() => updateQuantity(item.productId, item.quantity + 1)}
                    disabled={
                      updating === item.productId || item.quantity >= item.stock
                    }
                    className="h-8 w-8 rounded border border-neutral-300 hover:bg-neutral-50 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-900 disabled:opacity-50"
                    aria-label={`Increase quantity of ${item.name}`}
                  >
                    +
                  </button>
                </label>
                <button
                  type="button"
                  onClick={() => removeItem(item.productId)}
                  disabled={updating === item.productId}
                  className="text-sm text-red-600 hover:underline focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-red-600"
                >
                  Remove
                </button>
              </div>
            </div>
            <p className="font-semibold text-neutral-900">
              ${(item.price * item.quantity).toFixed(2)}
            </p>
          </li>
        ))}
      </ul>

      <aside className="h-fit rounded-xl border border-neutral-200 bg-white p-6">
        <h2 className="text-lg font-semibold text-neutral-900">Order summary</h2>
        <dl className="mt-4 space-y-2 text-sm">
          <div className="flex justify-between">
            <dt className="text-neutral-600">Subtotal</dt>
            <dd className="font-medium">${subtotal.toFixed(2)}</dd>
          </div>
        </dl>
        <p className="mt-4 text-xs text-neutral-500">
          Checkout is not implemented — this demo focuses on server-persisted carts.
        </p>
      </aside>
    </div>
  );
}
