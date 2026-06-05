import { NextResponse } from "next/server";
import {
  addToCart,
  getCartForUser,
  removeFromCart,
  updateCartQuantity,
} from "@/lib/cart";
import { requireAuth } from "@/lib/api-auth";
import { cartAddSchema, cartUpdateSchema } from "@/lib/validations";

export async function GET() {
  const { session, error } = await requireAuth();
  if (error) return error;

  try {
    const items = await getCartForUser(session!.user.id);
    const subtotal = items.reduce(
      (sum, item) => sum + item.price * item.quantity,
      0,
    );
    return NextResponse.json({ items, subtotal });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch cart" },
      { status: 500 },
    );
  }
}

export async function POST(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = cartAddSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await addToCart(
    session!.user.id,
    parsed.data.productId,
    parsed.data.quantity,
  );

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true }, { status: 201 });
}

export async function PATCH(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  let body: unknown;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: "Invalid JSON body" }, { status: 400 });
  }

  const parsed = cartUpdateSchema.safeParse(body);
  if (!parsed.success) {
    return NextResponse.json(
      { error: "Validation failed", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  const result = await updateCartQuantity(
    session!.user.id,
    parsed.data.productId,
    parsed.data.quantity,
  );

  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true });
}

export async function DELETE(request: Request) {
  const { session, error } = await requireAuth();
  if (error) return error;

  const productId = new URL(request.url).searchParams.get("productId");
  if (!productId) {
    return NextResponse.json(
      { error: "productId query parameter required" },
      { status: 400 },
    );
  }

  const result = await removeFromCart(session!.user.id, productId);
  if ("error" in result) {
    return NextResponse.json({ error: result.error }, { status: result.status });
  }

  return NextResponse.json({ success: true });
}
