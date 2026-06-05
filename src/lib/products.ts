import {
  and,
  asc,
  desc,
  eq,
  gte,
  ilike,
  inArray,
  lte,
  or,
  SQL,
} from "drizzle-orm";
import { db } from "@/db";
import { products } from "@/db/schema";
import { getProductColorId, PAGE_SIZE } from "@/lib/catalog-colors";
import type { ProductQuery } from "@/lib/validations";

export function buildProductConditions(query: ProductQuery): SQL | undefined {
  const conditions: SQL[] = [];

  if (query.q?.trim()) {
    const term = `%${query.q.trim()}%`;
    conditions.push(
      or(
        ilike(products.name, term),
        ilike(products.shortDescription, term),
        ilike(products.longDescription, term),
      )!,
    );
  }

  if (query.categories) {
    const cats = query.categories
      .split(",")
      .map((c) => c.trim())
      .filter(Boolean);
    if (cats.length > 0) {
      conditions.push(inArray(products.category, cats));
    }
  }

  if (query.minPrice !== undefined) {
    conditions.push(gte(products.price, query.minPrice));
  }

  if (query.maxPrice !== undefined) {
    conditions.push(lte(products.price, query.maxPrice));
  }

  return conditions.length > 0 ? and(...conditions) : undefined;
}

export function productOrderBy(sort: ProductQuery["sort"]) {
  switch (sort) {
    case "price-asc":
      return asc(products.price);
    case "price-desc":
      return desc(products.price);
    case "rating-desc":
      return desc(products.rating);
    default:
      return asc(products.name);
  }
}

function filterByColors<T extends { slug: string }>(
  items: T[],
  colorsParam?: string,
): T[] {
  if (!colorsParam?.trim()) return items;
  const colorIds = colorsParam
    .split(",")
    .map((c) => c.trim())
    .filter(Boolean);
  if (colorIds.length === 0) return items;
  return items.filter((p) => colorIds.includes(getProductColorId(p.slug)));
}

export async function getProducts(query: ProductQuery) {
  const where = buildProductConditions(query);
  const rows = await db
    .select()
    .from(products)
    .where(where)
    .orderBy(productOrderBy(query.sort));

  const filtered = filterByColors(rows, query.colors);
  const pageSize = query.pageSize ?? PAGE_SIZE;
  const page = query.page ?? 1;
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;

  return {
    products: filtered.slice(start, start + pageSize),
    total,
    page: safePage,
    pageSize,
    totalPages,
  };
}

export async function getProductBySlug(slug: string) {
  const [product] = await db
    .select()
    .from(products)
    .where(eq(products.slug, slug))
    .limit(1);
  return product ?? null;
}

export async function getCategories() {
  const rows = await db
    .selectDistinct({ category: products.category })
    .from(products)
    .orderBy(asc(products.category));
  return rows.map((r) => r.category);
}

export async function getPriceBounds() {
  const rows = await db.select().from(products);
  if (rows.length === 0) return { min: 0, max: 100 };
  const prices = rows.map((p) => p.price);
  return {
    min: Math.floor(Math.min(...prices)),
    max: Math.ceil(Math.max(...prices)),
  };
}
