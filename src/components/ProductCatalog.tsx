"use client";

import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import type { Product } from "@/db/schema";
import { CategoryChips } from "./CategoryChips";
import { IconSearch, IconSliders } from "./icons";
import { Pagination } from "./Pagination";
import { ProductCard } from "./ProductCard";

type CatalogData = {
  products: Product[];
  categories: string[];
  priceBounds: { min: number; max: number };
  total: number;
  page: number;
  totalPages: number;
};

const SORT_OPTIONS = [
  { value: "name-asc", label: "Name (A–Z)" },
  { value: "price-asc", label: "Price: Low to High" },
  { value: "price-desc", label: "Price: High to Low" },
  { value: "rating-desc", label: "Popularity" },
] as const;

// 🚀 NAMED EXPORT: Matches the homepage curly braces layout perfectly!
export function ProductCatalog({
  initialData,
}: {
  initialData: CatalogData;
}) {
  const router = useRouter();
  const searchParams = useSearchParams();
  const [data, setData] = useState(initialData);
  const [loading, setLoading] = useState(false);
  const [searchInput, setSearchInput] = useState(searchParams.get("q") ?? "");

  const selectedCategories = useMemo(() => {
    const raw = searchParams.get("categories");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const selectedColors = useMemo(() => {
    const raw = searchParams.get("colors");
    return raw ? raw.split(",").filter(Boolean) : [];
  }, [searchParams]);

  const sort = searchParams.get("sort") ?? "name-asc";
  const highlightColor = selectedColors.length === 1 ? selectedColors[0] : null;

  const updateParams = useCallback(
    (updates: Record<string, string | null>) => {
      const params = new URLSearchParams(searchParams.toString());
      Object.entries(updates).forEach(([key, value]) => {
        if (value === null || value === "") params.delete(key);
        else params.set(key, value);
      });
      if (!("page" in updates)) params.delete("page");
      
      router.push(`?${params.toString()}`, { scroll: false });
    },
    [router, searchParams],
  );

  useEffect(() => {
    const timer = setTimeout(() => {
      const current = searchParams.get("q") ?? "";
      if (searchInput.trim() !== current.trim()) {
        updateParams({ q: searchInput.trim() || null, page: null });
      }
    }, 350);
    return () => clearTimeout(timer);
  }, [searchInput, searchParams, updateParams]);

  useEffect(() => {
    setData(initialData);
  }, [initialData]);

  useEffect(() => {
    const controller = new AbortController();
    async function load() {
      setLoading(true);
      try {
        const res = await fetch(`/api/products?${searchParams.toString()}`, {
          signal: controller.signal,
        });
        if (!res.ok) return;
        const json = (await res.json()) as CatalogData & {
          priceBounds: { min: number; max: number };
        };
        setData({
          products: json.products,
          categories: json.categories,
          priceBounds: json.priceBounds,
          total: json.total,
          page: json.page,
          totalPages: json.totalPages,
        });
      } catch (err) {
        // Safe catch block to prevent unhandled rejection noise in console log streams
      } finally {
        setLoading(false);
      }
    }
    load();
    return () => controller.abort();
  }, [searchParams]);

  return (
    <div className="mx-auto max-w-7xl px-4 py-6 pb-24 sm:px-6 lg:px-8 lg:pb-10">
      <p className="text-xs text-neutral-400">Discover</p>
      <div className="mb-3 flex items-center justify-between">
        <h1 className="text-3xl font-bold tracking-tight text-neutral-900">Catalog</h1>
        <button
          type="button"
          className="inline-flex h-9 w-9 items-center justify-center rounded-lg border border-neutral-200 bg-white text-neutral-500 lg:hidden"
          aria-label="Filters"
        >
          <IconSliders className="h-4 w-4" />
        </button>
      </div>

      <label className="relative block lg:hidden">
        <span className="sr-only">Search products</span>
        <IconSearch className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-neutral-400" />
        <input
          type="search"
          value={searchInput}
          onChange={(e) => setSearchInput(e.target.value)}
          placeholder="Search products..."
          className="w-full rounded-xl border border-neutral-200 bg-neutral-100 py-2.5 pl-9 pr-3 text-sm focus:border-neutral-400 focus:bg-white focus:outline-none"
          aria-label="Search products"
        />
      </label>

      <CategoryChips
        categories={data.categories}
        selected={selectedCategories}
        onChange={(cats) =>
          updateParams({
            categories: cats.length > 0 ? cats.join(",") : null,
            page: null,
          })
        }
      />

      <div className="mt-4 flex items-center justify-between">
        <p className="text-xs text-neutral-400">
          {data.total} results
        </p>
        <label className="flex items-center gap-2 text-xs font-medium text-neutral-700">
          <IconSliders className="h-3.5 w-3.5" />
          <select
            value={sort}
            onChange={(e) => {
              const newValue = e.target.value;
              updateParams({ sort: newValue, page: null });
              e.target.blur();
            }}
            className="bg-transparent focus:outline-none cursor-pointer"
            aria-label="Sort products"
          >
            {SORT_OPTIONS.map((opt) => (
              <option key={opt.value} value={opt.value}>
                {opt.label}
              </option>
            ))}
          </select>
        </label>
      </div>

      <section className="mt-4 min-w-0" aria-live="polite" aria-busy={loading}>
          {loading && (
            <p className="mb-4 text-sm text-neutral-500">Updating results…</p>
          )}
          {data.products.length === 0 ? (
            <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-12 text-center">
              <p className="text-lg font-medium text-neutral-900">
                No products found
              </p>
              <p className="mt-2 text-neutral-600">
                Try adjusting your search or filters.
              </p>
            </div>
          ) : (
            <>
              <ul className="grid grid-cols-2 gap-3 sm:gap-4 lg:grid-cols-4">
                {data.products.map((product) => (
                  <li key={product.id}>
                    <ProductCard
                      product={product}
                      highlightColorId={highlightColor}
                    />
                  </li>
                ))}
              </ul>
              <Pagination
                page={data.page}
                totalPages={data.totalPages}
                onPageChange={(p) => updateParams({ page: String(p) })}
              />
            </>
          )}
      </section>
    </div>
  );
}