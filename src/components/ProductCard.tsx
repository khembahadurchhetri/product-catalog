"use client";

import Link from "next/link";
import { useSession } from "next-auth/react";
import { useState } from "react";
import type { Product } from "@/db/schema";
import { useCart } from "@/context/CartContext";

interface ProductCardProps {
  product: Product;
  highlightColorId?: string | null;
}

export function ProductCard({ product }: ProductCardProps) {
  const { addToCart } = useCart();
  const { data: session } = useSession();
  const [added, setAdded] = useState(false);
  const [toast, setToast] = useState("");

  const p = product as any;
  const currentImageUrl = p.imageUrl || p.image_url;
  const currentDescription = p.shortDescription || p.short_description;

  const showToast = (msg: string) => {
    setToast(msg);
    setTimeout(() => setToast(""), 2500);
  };

  const handleAddToCartClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();

    if (!session) {
      showToast("Please sign in first");
      return;
    }

    addToCart({
      productId: product.id,
      name: product.name,
      price: Number(product.price),
      imageUrl: currentImageUrl || "/placeholder.jpg",
      category: product.category || "General",
      quantity: 1,
    });

    setAdded(true);
    showToast("Added to cart!");
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    // ✅ removed overflow-hidden from card — was clipping button on mobile
    <Link
      href={`/products/${product.slug}`}
      className="group relative bg-white rounded-xl border border-neutral-100 shadow-sm hover:shadow-md transition duration-200 flex flex-col cursor-pointer block h-full"
    >
      {/* Toast — now works because card is not overflow-hidden */}
      {toast && (
        <div className={`absolute top-2 left-1/2 -translate-x-1/2 z-50 px-3 py-1.5 rounded-lg text-xs font-bold shadow-md text-white whitespace-nowrap ${
          toast.includes("sign in") ? "bg-orange-500" : "bg-green-600"
        }`}>
          {toast}
        </div>
      )}

      {/* Product Image — overflow-hidden only on image div */}
      <div className="h-44 bg-neutral-50 relative overflow-hidden rounded-t-xl shrink-0 sm:h-48">
        {currentImageUrl ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={currentImageUrl}
            alt={product.name}
            className="w-full h-full object-cover group-hover:scale-102 transition duration-300"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-xs font-semibold text-neutral-400">
            No Image Available
          </div>
        )}
      </div>

      {/* Product Info */}
      <div className="p-3 flex flex-col flex-1 justify-between space-y-1.5 sm:p-4">
        <div>
          <span className="text-[10px] font-bold tracking-widest uppercase text-neutral-400 block">
            {product.category}
          </span>
          <h4 className="font-bold text-neutral-900 text-sm line-clamp-1 group-hover:text-neutral-700 transition">
            {product.name}
          </h4>
          <p className="text-xs text-neutral-500 line-clamp-2 mt-0.5 leading-relaxed">
            {currentDescription || "No product specifications listed."}
          </p>
        </div>

        {/* Price + Action Bar */}
        <div className="flex justify-between items-center pt-2 border-t border-neutral-100 mt-auto gap-2">
          <div className="flex flex-col">
            <span className="font-bold text-sm sm:text-base text-neutral-900">
              ${Number(product.price).toFixed(2)}
            </span>
            <span className={`text-[9px] font-medium ${product.stock > 0 ? "text-green-600" : "text-red-500"}`}>
              {product.stock > 0 ? `${product.stock} available` : "Out of stock"}
            </span>
          </div>

          {/* ✅ Always visible button */}
          <button
            type="button"
            disabled={product.stock <= 0}
            onClick={handleAddToCartClick}
            className={`rounded-lg px-3 py-1.5 text-xs font-bold text-white transition active:scale-95 disabled:bg-neutral-200 disabled:text-neutral-400 disabled:scale-100 disabled:cursor-not-allowed cursor-pointer shrink-0 ${
              added ? "bg-green-600 hover:bg-green-700" : "bg-neutral-950 hover:bg-neutral-800"
            }`}
          >
            {added ? "✓ Added" : "Add +"}
          </button>
        </div>
      </div>
    </Link>
  );
}