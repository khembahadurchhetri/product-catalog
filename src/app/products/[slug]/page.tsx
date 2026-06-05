import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";
import { notFound } from "next/navigation";
import Link from "next/link";
// 🚀 Import your newly updated interactive client button component
import { AddToCartButton } from "@/components/AddToCartButton";

export const dynamic = "force-dynamic";

interface ProductPageProps {
  params: Promise<{ slug: string }>;
}

export default async function ProductDetailPage({ params }: ProductPageProps) {
  // Next.js requires awaiting dynamic route params
  const { slug } = await params;

  // 1. Query the single product matching this URL slug
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);

  // 2. If the product doesn't exist, trigger Next.js built-in 404 page
  if (!product) {
    notFound();
  }

  return (
    <div className="bg-gray-50 min-h-screen py-12">
      <div className="max-w-4xl mx-auto px-4">
        {/* Back Link */}
        <Link href="/" className="text-sm font-medium text-gray-500 hover:text-black transition flex items-center gap-1 mb-6">
          ◀ Back to Marketplace
        </Link>

        {/* Product Layout Card */}
        <div className="bg-white rounded-2xl border border-gray-100 shadow-sm overflow-hidden grid grid-cols-1 md:grid-cols-2">
          {/* Left: Product Image */}
          <div className="bg-gray-50 h-96 md:h-auto relative">
            {product.imageUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={product.imageUrl}
                alt={product.name}
                className="w-full h-full object-cover"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-sm font-semibold text-gray-400">
                No Image Available
              </div>
            )}
          </div>

          {/* Right: Product Details */}
          <div className="p-8 flex flex-col justify-between">
            <div className="space-y-4">
              <span className="text-xs font-bold uppercase tracking-widest text-gray-400">
                {product.category}
              </span>
              <h1 className="text-2xl font-bold text-gray-900">
                {product.name}
              </h1>
              <p className="text-2xl font-extrabold text-gray-900">
                ${Number(product.price).toFixed(2)}
              </p>
              
              <div className="pt-2">
                <h3 className="text-xs font-bold text-gray-400 uppercase tracking-wider mb-1">Description</h3>
                <p className="text-sm text-gray-600 leading-relaxed">
                  {product.longDescription || product.shortDescription || "No product specifications listed."}
                </p>
              </div>
            </div>

            <div className="pt-6 border-t border-gray-100 flex items-center justify-between gap-4">
              <div>
                <span className={`text-xs font-bold px-2.5 py-1 rounded-full ${product.stock > 0 ? "bg-green-50 text-green-700" : "bg-red-50 text-red-600"}`}>
                  {product.stock > 0 ? `${product.stock} Units Available` : "Out of Stock"}
                </span>
              </div>
              
              {/* 🚀 CRUCIAL FIX: Replaced static <button> with our fully synchronized AddToCartButton component */}
              <AddToCartButton 
                productId={product.id}
                inStock={product.stock > 0}
                productName={product.name}
                productSlug={product.slug}
                productPrice={product.price}
                productImageUrl={product.imageUrl}
                productCategory={product.category}
                productStockMax={product.stock}
                className="flex-1"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}