import { and, eq } from "drizzle-orm";
import { db } from "@/db";
import { cartItems, products } from "@/db/schema";

export async function getCartForUser(userId: string) {
  return db
    .select({
      id: cartItems.id,
      quantity: cartItems.quantity,
      productId: products.id,
      slug: products.slug,
      name: products.name,
      price: products.price,
      imageUrl: products.imageUrl,
      stock: products.stock,
    })
    .from(cartItems)
    .innerJoin(products, eq(cartItems.productId, products.id))
    .where(eq(cartItems.userId, userId));
}

export async function getCartItemCount(userId: string) {
  const items = await db
    .select({ quantity: cartItems.quantity })
    .from(cartItems)
    .where(eq(cartItems.userId, userId));
  return items.reduce((sum, item) => sum + item.quantity, 0);
}

export async function addToCart(
  userId: string,
  productId: string,
  quantity: number,
) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product) return { error: "Product not found", status: 404 as const };
  if (product.stock < 1)
    return { error: "Product out of stock", status: 400 as const };

  const [existing] = await db
    .select()
    .from(cartItems)
    .where(
      and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)),
    )
    .limit(1);

  const newQty = (existing?.quantity ?? 0) + quantity;
  if (newQty > product.stock) {
    return {
      error: `Only ${product.stock} in stock`,
      status: 400 as const,
    };
  }

  if (existing) {
    await db
      .update(cartItems)
      .set({ quantity: newQty, updatedAt: new Date() })
      .where(eq(cartItems.id, existing.id));
  } else {
    await db.insert(cartItems).values({
      userId,
      productId,
      quantity,
    });
  }

  return { success: true as const };
}

export async function updateCartQuantity(
  userId: string,
  productId: string,
  quantity: number,
) {
  if (quantity === 0) {
    await db
      .delete(cartItems)
      .where(
        and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)),
      );
    return { success: true as const };
  }

  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.id, productId))
    .limit(1);

  if (!product) return { error: "Product not found", status: 404 as const };
  if (quantity > product.stock) {
    return {
      error: `Only ${product.stock} in stock`,
      status: 400 as const,
    };
  }

  const result = await db
    .update(cartItems)
    .set({ quantity, updatedAt: new Date() })
    .where(
      and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)),
    )
    .returning();

  if (result.length === 0) {
    return { error: "Cart item not found", status: 404 as const };
  }

  return { success: true as const };
}

export async function removeFromCart(userId: string, productId: string) {
  const result = await db
    .delete(cartItems)
    .where(
      and(eq(cartItems.userId, userId), eq(cartItems.productId, productId)),
    )
    .returning();

  if (result.length === 0) {
    return { error: "Cart item not found", status: 404 as const };
  }

  return { success: true as const };
}
