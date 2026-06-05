import { NextResponse } from "next/server";
import { auth } from "@/auth";
import { db } from "@/db";
import { orders, products } from "@/db/schema";
import { eq } from "drizzle-orm";

export async function POST(req: Request) {
  try {
    // 🔒 1. Check client session state safely
    const session = await auth();
    if (!session || !session.user?.email) {
      return NextResponse.json(
        { error: "Authentication required to complete your purchase." },
        { status: 401 }
      );
    }

    // 📩 2. Capture the cart details from the request
    const body = await req.json();
    const { cartItems, total } = body;

    if (!cartItems || cartItems.length === 0) {
      return NextResponse.json(
        { error: "Your cart is empty. Cannot process an empty order." },
        { status: 400 }
      );
    }

    // 🔄 3. Process Inventory Stock Adjustments
    for (const item of cartItems) {
      // Find the database product row matching the UUID string
      const fetched = await db
        .select()
        .from(products)
        .where(eq(products.id, item.id));

      if (fetched.length > 0) {
        const dbProduct = fetched[0];
        // Ensure inventory stock count never dips dangerously below zero
        const updatedStock = Math.max(0, (dbProduct.stock || 0) - Number(item.quantity));
        
        // Update product inventory levels using Drizzle
        await db
          .update(products)
          .set({ stock: updatedStock })
          .where(eq(products.id, item.id));
      }
    }

    // 📝 4. Log the finalized order details to your Neon database
    const [newOrder] = await db
      .insert(orders)
      .values({
        userEmail: session.user.email,
        items: JSON.stringify(cartItems),
        totalAmount: Number(total) || 0, // Injected matching your 'real' data type
        status: "completed",
      })
      .returning();

    return NextResponse.json({ success: true, orderId: newOrder.id }, { status: 201 });
  } catch (error: any) {
    console.error("Checkout Engine Error:", error);
    return NextResponse.json(
      { error: error.message || "Failed to finalize database order logging." },
      { status: 500 }
    );
  }
}