import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { products } from "@/db/schema";
import { eq } from "drizzle-orm";

interface RouteParams {
  params: Promise<{ id: string }>;
}

// 🚀 FIXED: Next.js treats 'params' as a Promise now. We declare and await it to prevent the sync dynamic API crash.
export async function DELETE(
  request: Request,
  { params }: RouteParams
) {
  try {
    // 🔒 1. SECURITY LOCK
    const session = await auth();
    const isMasterAdmin = session?.user?.email === "admin@store.com";

    if (!session || !isMasterAdmin) {
      return NextResponse.json({ error: "Unauthorized access denied." }, { status: 401 });
    }

    // 🎯 2. CAPTURE THE SEGMENT ID BY AWAITING THE PARAMS PROMISE
    const resolvedParams = await params;
    const productId = resolvedParams.id;

    if (!productId) {
      return NextResponse.json({ error: "Invalid product identifier segment passed." }, { status: 400 });
    }

    // 🗑️ 3. RUN THE SQL DELETION ROW FILTER USING DRIZZLE'S 'eq' METHOD
    await db.delete(products).where(eq(products.id, productId));

    return NextResponse.json({
      success: true,
      message: `Product record row successfully purged from tables.`,
    });
  } catch (error: any) {
    console.error("Admin Product Deletion Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to drop the specified table inventory row." },
      { status: 500 }
    );
  }
}