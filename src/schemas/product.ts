import { z } from "zod";

const relativePath = z
  .string()
  .regex(/^\/[^\s]*$/, "先頭が / の相対パスを指定してください");

export const ProductSchema = z.object({
  id: z.string(),
  name: z.string(),
  description: z.string().optional(),
  price: z.number(),
  imageUrl: z.string(),
  categoryId: z.string(),
  categoryName: z.string(),
  createdAt: z.string(), // API返却はISO文字列に統一
  updatedAt: z.string(), // API返却はISO文字列に統一
});

// 商品作成用
export const CreateProductSchema = z.object({
  name: z.string().min(1, "商品名は必須です"),
  description: z.string().optional(),
  price: z.number().int().nonnegative(),
  //z.union([A, B]) は 「A または B のどちらかに合格すればOK」 という意味。
  imageUrl: z.union([
    z.string().url("正しいURLを入力してください"),
    relativePath, // 「/ から始まる相対パス」を許可。
  ]),
  categoryId: z.string(),
});

// 商品更新用
export const UpdateProductSchema = CreateProductSchema.partial(); // Zodの.partial()は「スキーマのすべてのフィールドを任意（optional）に変える」メソッド

// TypeScript の型を自動生成
export type ProductDTO = z.infer<typeof ProductSchema>;
export type CreateProductInput = z.infer<typeof CreateProductSchema>;
export type UpdateProductInput = z.infer<typeof UpdateProductSchema>;
