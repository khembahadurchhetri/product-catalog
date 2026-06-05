import { NextResponse } from "next/server";
import { getCategories, getPriceBounds, getProducts } from "@/lib/products";
import { productQuerySchema } from "@/lib/validations";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const parsed = productQuerySchema.safeParse({
    q: searchParams.get("q") ?? undefined,
    categories: searchParams.get("categories") ?? undefined,
    colors: searchParams.get("colors") ?? undefined,
    minPrice: searchParams.get("minPrice") ?? undefined,
    maxPrice: searchParams.get("maxPrice") ?? undefined,
    sort: searchParams.get("sort") ?? undefined,
    page: searchParams.get("page") ?? undefined,
    pageSize: searchParams.get("pageSize") ?? undefined,
  });

  if (!parsed.success) {
    return NextResponse.json(
      { error: "Invalid query parameters", details: parsed.error.flatten() },
      { status: 400 },
    );
  }

  try {
    const [result, categories, priceBounds] = await Promise.all([
      getProducts(parsed.data),
      getCategories(),
      getPriceBounds(),
    ]);

    return NextResponse.json({
      products: result.products,
      categories,
      priceBounds,
      total: result.total,
      page: result.page,
      pageSize: result.pageSize,
      totalPages: result.totalPages,
    });
  } catch {
    return NextResponse.json(
      { error: "Failed to fetch products" },
      { status: 500 },
    );
  }
}
