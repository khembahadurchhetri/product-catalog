"use client";

import { useState } from "react";
import { CATALOG_COLORS } from "@/lib/catalog-colors";
import { IconChevron } from "./icons";

type ProductFiltersProps = {
  categories: string[];
  selectedCategories: string[];
  selectedColors: string[];
  minPrice: number;
  maxPrice: number;
  priceBounds: { min: number; max: number };
  onCategoriesChange: (categories: string[]) => void;
  onColorsChange: (colors: string[]) => void;
  onPriceChange: (min: number, max: number) => void;
  onClearAll?: () => void;
  activeFilterCount?: number;
  className?: string;
};

function FilterSection({
  title,
  defaultOpen = true,
  children,
}: {
  title: string;
  defaultOpen?: boolean;
  children: React.ReactNode;
}) {
  const [open, setOpen] = useState(defaultOpen);

  return (
    <div className="border-b border-neutral-200 py-4 last:border-b-0">
      <button
        type="button"
        onClick={() => setOpen(!open)}
        className="flex w-full items-center justify-between text-left text-sm font-semibold text-neutral-900"
        aria-expanded={open}
      >
        {title}
        <IconChevron
          className={`h-5 w-5 text-neutral-500 transition ${open ? "rotate-180" : ""}`}
        />
      </button>
      {open && <div className="mt-3">{children}</div>}
    </div>
  );
}

export function ProductFilters({
  categories,
  selectedCategories,
  selectedColors,
  minPrice,
  maxPrice,
  priceBounds,
  onCategoriesChange,
  onColorsChange,
  onPriceChange,
  onClearAll,
  activeFilterCount = 0,
  className = "",
}: ProductFiltersProps) {
  const toggleCategory = (category: string) => {
    const next = selectedCategories.includes(category)
      ? selectedCategories.filter((c) => c !== category)
      : [...selectedCategories, category];
    onCategoriesChange(next);
  };

  const toggleColor = (colorId: string) => {
    const next = selectedColors.includes(colorId)
      ? selectedColors.filter((c) => c !== colorId)
      : [...selectedColors, colorId];
    onColorsChange(next);
  };

  return (
    <aside
      className={`flex flex-col ${className}`}
      aria-label="Product filters"
    >
      <div className="flex items-center justify-between">
        <h2 className="text-lg font-semibold text-neutral-900">Filters</h2>
        {activeFilterCount > 0 && onClearAll && (
          <button
            type="button"
            onClick={onClearAll}
            className="text-sm font-medium text-neutral-600 underline-offset-2 hover:text-neutral-900 hover:underline"
          >
            Clear all ({activeFilterCount})
          </button>
        )}
      </div>

      <div className="mt-2">
        <FilterSection title="Category">
          <ul className="space-y-2.5">
            {categories.map((category) => {
              const id = `cat-${category.replace(/\s+/g, "-").toLowerCase()}`;
              return (
                <li key={category}>
                  <label
                    htmlFor={id}
                    className="flex cursor-pointer items-center gap-2.5 text-sm text-neutral-700"
                  >
                    <input
                      id={id}
                      type="checkbox"
                      checked={selectedCategories.includes(category)}
                      onChange={() => toggleCategory(category)}
                      className="h-4 w-4 rounded border-neutral-300 text-neutral-900 focus:ring-neutral-900"
                    />
                    {category}
                  </label>
                </li>
              );
            })}
          </ul>
        </FilterSection>

        <FilterSection title="Color">
          <div className="flex flex-wrap gap-2">
            {CATALOG_COLORS.map((color) => {
              const selected = selectedColors.includes(color.id);
              return (
                <button
                  key={color.id}
                  type="button"
                  onClick={() => toggleColor(color.id)}
                  aria-label={`${color.label}${selected ? ", selected" : ""}`}
                  aria-pressed={selected}
                  className={`flex h-9 w-9 items-center justify-center rounded-full ring-2 ring-offset-2 transition ${
                    selected ? "ring-neutral-900" : "ring-transparent"
                  } ${color.id === "white" ? "border border-neutral-200" : ""}`}
                  style={{ backgroundColor: color.hex }}
                  title={color.label}
                />
              );
            })}
          </div>
        </FilterSection>

        <FilterSection title="Price">
          <p className="mb-3 text-sm text-neutral-600">
            ${minPrice} – ${maxPrice}
          </p>
          <div className="space-y-3">
            <label className="flex flex-col gap-1 text-xs text-neutral-500">
              Min
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={minPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onPriceChange(Math.min(val, maxPrice), maxPrice);
                }}
                className="w-full accent-neutral-900"
                aria-label="Minimum price"
              />
            </label>
            <label className="flex flex-col gap-1 text-xs text-neutral-500">
              Max
              <input
                type="range"
                min={priceBounds.min}
                max={priceBounds.max}
                value={maxPrice}
                onChange={(e) => {
                  const val = Number(e.target.value);
                  onPriceChange(minPrice, Math.max(val, minPrice));
                }}
                className="w-full accent-neutral-900"
                aria-label="Maximum price"
              />
            </label>
          </div>
        </FilterSection>
      </div>
    </aside>
  );
}
