import { db } from "@/db";
import { products } from "@/db/schema";
// 🚀 FIXED: Wrapped in curly braces to match the named export in your component file perfectly
import { ProductCatalog } from "@/components/ProductCatalog"; 

export const dynamic = "force-dynamic";

export default async function HomePage() {
  // 1. Fetch initial product rows directly from your database on the server
  const allProducts = await db.select().from(products);

  // 2. Extract unique product categories for the filter sidebar layout
  const categories = Array.from(
    new Set(allProducts.map((p) => p.category).filter(Boolean))
  ) as string[];

  // 3. Find price boundaries dynamically for client-side state sliders
  const prices = allProducts.map((p) => Number(p.price || 0));
  const minPrice = prices.length > 0 ? Math.min(...prices) : 0;
  const maxPrice = prices.length > 0 ? Math.max(...prices) : 1000;

  // 4. Build the structured payload object expected by ProductCatalog
  const initialData = {
    products: allProducts,
    categories: categories,
    priceBounds: { min: minPrice, max: maxPrice },
    total: allProducts.length,
    page: 1,
    totalPages: 1,
  };

  return (
    <main className="min-h-screen bg-neutral-50/50">
      {/* Render the marketplace UI layout safely */}
      <ProductCatalog initialData={initialData} />
    </main>
  );
}