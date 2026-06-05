"use client";

import Image from "next/image";
import Link from "next/link";
import { useState } from "react";
import type { Product } from "@/db/schema";
import { CATALOG_COLORS, getProductColor } from "@/lib/catalog-colors";
import { AddToCartButton } from "./AddToCartButton";
import { IconHeart } from "./icons";
import { RatingStars } from "./RatingStars";

type ProductDetailViewProps = {
  product: Product;
  inStock: boolean;
};

export function ProductDetailView({ product, inStock }: ProductDetailViewProps) {
  const defaultColor = getProductColor(product.slug);
  const [selectedColorId, setSelectedColorId] = useState(defaultColor.id);
  const selectedColor =
    CATALOG_COLORS.find((c) => c.id === selectedColorId) ?? defaultColor;

  const gallery = [
    product.imageUrl,
    `${product.imageUrl.split("?")[0]}?w=800&q=80&fit=crop&crop=entropy`,
    `${product.imageUrl.split("?")[0]}?w=800&q=80&sat=-20`,
  ];

  const [activeImage, setActiveImage] = useState(0);
  const [quantity, setQuantity] = useState(1);

  return (
    <>
      <nav aria-label="Breadcrumb" className="mb-6 text-sm text-neutral-500">
        <ol className="flex items-center gap-2">
          <li>
            <Link
              href="/"
              className="hover:text-neutral-900 focus-visible:outline focus-visible:outline-2 focus-visible:outline-neutral-900"
            >
              Catalog
            </Link>
          </li>
          <li aria-hidden>/</li>
          <li className="text-neutral-800">{product.name}</li>
        </ol>
      </nav>

      <article className="grid gap-8 lg:grid-cols-2">
        <div>
          <div
            className="relative aspect-square overflow-hidden rounded-xl border border-neutral-200"
            style={{ backgroundColor: selectedColor.surface }}
          >
            <Image
              src={gallery[activeImage] ?? product.imageUrl}
              alt={product.name}
              fill
              priority
              sizes="(max-width: 1024px) 100vw, 50vw"
              className="object-cover"
            />
            <button
              type="button"
              className="absolute right-3 top-3 rounded-full bg-white p-2 text-neutral-700 shadow-sm"
              aria-label="Save item"
            >
              <IconHeart className="h-4 w-4" />
            </button>
          </div>
          <ul className="mt-3 flex gap-2" aria-label="Product images">
            {gallery.map((src, index) => (
              <li key={index}>
                <button
                  type="button"
                  onClick={() => setActiveImage(index)}
                  className={`relative h-12 w-12 overflow-hidden rounded-md ring-2 ${
                    activeImage === index
                      ? "ring-neutral-900"
                      : "ring-transparent"
                  }`}
                >
                  <Image
                    src={src}
                    alt=""
                    fill
                    sizes="64px"
                    className="object-cover"
                  />
                </button>
              </li>
            ))}
          </ul>
        </div>

        <div className="flex flex-col gap-5">
          <div>
            <p className="text-xs text-neutral-500">{product.category}</p>
            <h1 className="mt-1 text-3xl font-bold tracking-tight text-neutral-900">
              {product.name}
            </h1>
            <div className="mt-2 flex items-center gap-2">
              <RatingStars rating={product.rating} />
              <span className="text-xs text-neutral-500">
                ({Math.round(product.rating * 24)} reviews)
              </span>
            </div>
          </div>

          <p className="text-3xl font-bold text-neutral-900">
            ${product.price.toFixed(2)}
          </p>

          <p className="text-sm text-neutral-600">{product.shortDescription}</p>

          <div>
            <p className="text-sm font-medium text-neutral-900">Color</p>
            <div className="mt-2 flex flex-wrap gap-2">
              {CATALOG_COLORS.slice(0, 5).map((color) => (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => setSelectedColorId(color.id)}
                  aria-label={color.label}
                  aria-pressed={selectedColorId === color.id}
                  className={`h-7 w-7 rounded-full ring-2 ring-offset-1 ${
                    selectedColorId === color.id
                      ? "ring-neutral-900"
                      : "ring-transparent"
                  }`}
                  style={{ backgroundColor: color.hex }}
                />
              ))}
            </div>
          </div>

          <p className="text-sm leading-relaxed text-neutral-600">
            {product.longDescription}
          </p>

          <p className="text-xs text-green-700">
            {inStock ? `${product.stock} in stock` : "Out of stock"}
          </p>

          <div className="flex items-center gap-4 text-sm">
            <span className="font-medium text-neutral-900">Quantity</span>
            <div className="flex items-center gap-3 rounded-md border border-neutral-200 px-3 py-1.5">
              <button
                type="button"
                className="text-neutral-500 disabled:opacity-40"
                onClick={() => setQuantity((q) => Math.max(1, q - 1))}
                disabled={quantity <= 1}
                aria-label="Decrease quantity"
              >
                −
              </button>
              <span className="min-w-4 text-center">{quantity}</span>
              <button
                type="button"
                className="text-neutral-500"
                onClick={() => setQuantity((q) => Math.min(product.stock, q + 1))}
                aria-label="Increase quantity"
              >
                +
              </button>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-3">
            <button
              type="button"
              className="rounded-lg border border-neutral-300 py-3 text-sm font-medium text-neutral-800"
            >
              Add to Wishlist
            </button>
            <AddToCartButton
              productId={product.id}
              inStock={inStock}
              quantity={quantity}
              className="space-y-0"
            />
          </div>
        </div>
      </article>
    </>
  );
}
