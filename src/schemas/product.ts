import { z } from "zod";

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  imageUrl: z.string(),
  categoryId: z.string(),
  categoryName: z.string().optional(),
  createdAt: z.string(), // API返却はISO文字列に統一
  updatedAt: z.string(), // API返却はISO文字列に統一
});

// TypeScript の型を自動生成
export type ProductDTO = z.infer<typeof ProductSchema>;
