import { NextResponse } from "next/server";
import { auth } from "@/auth"; // 🔒 IMPORT SECURITY FRAMEWORK
import { db } from "@/db";
import { products } from "@/db/schema";
import { desc } from "drizzle-orm";

export const dynamic = "force-dynamic";

export async function GET(): Promise<NextResponse> {
  try {
    // 🔒 1. SECURITY LOCK: Verify identity on the API layer
    const session = await auth();
    const isMasterAdmin = session?.user?.email === "admin@store.com";

    if (!session || !isMasterAdmin) {
      return NextResponse.json({ error: "Unauthorized access denied." }, { status: 401 });
    }

    const allProducts = await db
      .select()
      .from(products)
      .orderBy(desc(products.id));

    if (!allProducts || allProducts.length === 0) {
      return NextResponse.json({
        stats: { totalProducts: 0, totalStock: 0, averagePrice: "0.00" },
        products: [],
      });
    }

    const totalProducts = allProducts.length;
    
    const totalStock = allProducts.reduce((sum, item: any) => {
      const stockVal = item.stock;
      return sum + (typeof stockVal === "string" ? parseInt(stockVal, 10) : Number(stockVal) || 0);
    }, 0);

    const totalPriceSum = allProducts.reduce((sum, item: any) => {
      return sum + (Number(item.price) || 0);
    }, 0);

    const averagePrice = totalProducts > 0 ? (totalPriceSum / totalProducts).toFixed(2) : "0.00";

    const standardizedProducts = allProducts.map((item: any) => ({
      id: item.id,
      name: item.name,
      slug: item.slug,
      category: item.category,
      price: Number(item.price) || 0,
      stock: Number(item.stock) || 0,
      rating: Number(item.rating) || 0,
      shortDescription: item.shortDescription || item.short_description || "",
      longDescription: item.longDescription || item.long_description || "",
      imageUrl: item.imageUrl || item.image_url || "",
    }));

    return NextResponse.json({
      stats: { totalProducts, totalStock, averagePrice },
      products: standardizedProducts,
    });
  } catch (error: any) {
    console.error("Dashboard API Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to load dashboard statistics data." },
      { status: 500 }
    );
  }
}

export async function POST(req: Request): Promise<NextResponse> {
  try {
    // 🔒 2. SECURITY LOCK: Protect creation mechanics from public exploits
    const session = await auth();
    const isMasterAdmin = session?.user?.email === "admin@store.com";

    if (!session || !isMasterAdmin) {
      return NextResponse.json({ error: "Unauthorized access denied." }, { status: 401 });
    }

    const body = await req.json();
    
    const parsedPrice = Number(body.price);
    const parsedStock = parseInt(body.stock, 10) || 0;
    const productName = String(body.name || "Unnamed Product");

    // Dynamic slug creation utility generator 
    const generatedSlug = productName
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, "-")
      .replace(/(^-|-$)+/g, "") + `-${Date.now().toString().slice(-6)}`;

    await db.insert(products).values({
      name: productName,
      slug: generatedSlug, 
      category: String(body.category || "General"),
      price: isNaN(parsedPrice) ? 0 : parsedPrice, 
      stock: parsedStock,
      rating: 0, 
      shortDescription: String(body.shortDescription || body.short_description || "No short description."),
      longDescription: String(body.longDescription || body.long_description || "No detailed description."),
      imageUrl: String(body.imageUrl || body.image_url || "https://images.unsplash.com/photo-1527443224154-c4a3942d3acf"),
    } as any);

    return NextResponse.json({ success: true }, { status: 201 });
  } catch (error: any) {
    console.error("Dashboard POST Database Write Failure:", error);
    return NextResponse.json(
      { error: error.message || "Failed to create product entry." },
      { status: 500 }
    );
  }
}