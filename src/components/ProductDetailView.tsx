"use client";

import Image from "next/image";
import { useState } from "react";
import { AddToCartButton } from "./AddToCartButton";
import { RatingStars } from "./RatingStars";

// Explicitly define what a Product looks like to stop the "Yellow" errors
interface ProductProps {
  product: {
    id: string;
    name: string;
    slug: string;
    price: number | string;
    shortDescription: string;
    longDescription: string;
    category: string;
    imageUrl: string;
    rating: number;
    stock: number;
  };
  inStock: boolean;
}

export function ProductDetailView({ product, inStock }: ProductProps) {
  const [quantity, setQuantity] = useState(1);

  return (
    <div className="mx-auto max-w-7xl px-4 py-8">
      <div className="grid grid-cols-1 gap-12 lg:grid-cols-2">
        {/* Left: Image */}
        <div className="relative aspect-square overflow-hidden rounded-2xl bg-neutral-100">
          <Image
            src={product.imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            priority
          />
        </div>

        {/* Right: Content */}
        <div className="flex flex-col">
          <span className="text-sm font-semibold uppercase tracking-wider text-neutral-500">
            {product.category}
          </span>
          <h1 className="mt-2 text-4xl font-bold text-neutral-900">{product.name}</h1>
          
          <div className="mt-4 flex items-center gap-4">
            <RatingStars rating={product.rating} />
            <span className="text-sm text-neutral-500">Verified Purchase</span>
          </div>

          <p className="mt-6 text-2xl font-bold text-neutral-900">
            ${Number(product.price).toFixed(2)}
          </p>

          <p className="mt-6 leading-relaxed text-neutral-600">
            {product.longDescription || product.shortDescription}
          </p>

          {/* Quantity Selector */}
          <div className="mt-8 flex items-center gap-6">
            <div className="flex items-center rounded-lg border border-neutral-200">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="px-4 py-2 hover:bg-neutral-50"
              >−</button>
              <span className="w-10 text-center font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(Math.min(product.stock, quantity + 1))}
                className="px-4 py-2 hover:bg-neutral-50"
              >+</button>
            </div>
            <span className="text-sm text-neutral-500">{product.stock} available</span>
          </div>

          <div className="mt-8">
            <AddToCartButton
              productId={product.id}
              inStock={inStock}
              quantity={quantity}
              productName={product.name}
              productSlug={product.slug}
              productPrice={product.price}
              productImageUrl={product.imageUrl}
              productCategory={product.category}
              productStockMax={product.stock}
            />
          </div>
        </div>
      </div>
    </div>
  );
}