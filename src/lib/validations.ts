import { z } from "zod";
import { PAGE_SIZE } from "./catalog-colors";

export const registerSchema = z.object({
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  email: z.string().email("Invalid email address"),
  password: z
    .string()
    .min(8, "Password must be at least 8 characters")
    .max(72),
});

export const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
});

// ✅ Changed from z.string().uuid() to z.string() 
// — uuid() validation was rejecting valid product IDs
export const cartAddSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(1).max(99).default(1),
});

export const cartUpdateSchema = z.object({
  productId: z.string().min(1),
  quantity: z.number().int().min(0).max(99),
});

export const productQuerySchema = z.object({
  q: z.string().optional(),
  categories: z.string().optional(),
  colors: z.string().optional(),
  minPrice: z.coerce.number().min(0).optional(),
  maxPrice: z.coerce.number().min(0).optional(),
  sort: z
    .enum([
      "price-asc",
      "price-desc",
      "rating-desc",
      "name-asc",
    ])
    .optional()
    .default("name-asc"),
  page: z.coerce.number().int().min(1).optional().default(1),
  pageSize: z.coerce.number().int().min(1).max(48).optional().default(PAGE_SIZE),
});

export type ProductQuery = z.infer<typeof productQuerySchema>;
