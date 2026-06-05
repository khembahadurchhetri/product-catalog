export type CatalogColor = {
  id: string;
  label: string;
  hex: string;
  surface: string;
};

export const CATALOG_COLORS: CatalogColor[] = [
  { id: "black", label: "Black", hex: "#171717", surface: "#f4f4f5" },
  { id: "white", label: "White", hex: "#fafafa", surface: "#ffffff" },
  { id: "gray", label: "Gray", hex: "#737373", surface: "#f4f4f5" },
  { id: "blue", label: "Blue", hex: "#2563eb", surface: "#eff6ff" },
  { id: "green", label: "Green", hex: "#16a34a", surface: "#f0fdf4" },
  { id: "red", label: "Red", hex: "#dc2626", surface: "#fef2f2" },
  { id: "brown", label: "Brown", hex: "#92400e", surface: "#fffbeb" },
];

const slugColorMap: Record<string, string> = {
  "wireless-noise-canceling-headphones": "black",
  "smartwatch-fitness-tracker": "black",
  "mechanical-keyboard-rgb": "black",
  "4k-portable-monitor": "black",
  "organic-cotton-tee": "white",
  "ceramic-pour-over-set": "white",
  "minimalist-desk-lamp": "white",
  "memory-foam-pillow": "white",
  "slim-denim-jacket": "blue",
  "insulated-water-bottle": "blue",
  "running-shoes-lightweight": "red",
  "resistance-bands-set": "red",
  "yoga-mat-pro-grip": "green",
  "trail-running-backpack": "green",
  "design-systems-book": "brown",
  "javascript-patterns-guide": "brown",
  "product-thinking-playbook": "brown",
  "linen-throw-blanket": "brown",
};

export function getProductColorId(slug: string): string {
  return slugColorMap[slug] ?? "gray";
}

export function getProductColor(slug: string): CatalogColor {
  const id = getProductColorId(slug);
  return CATALOG_COLORS.find((c) => c.id === id) ?? CATALOG_COLORS[2];
}

export const PAGE_SIZE = 12;
