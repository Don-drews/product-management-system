import { z } from "zod";

export const CategorySchema = z.object({
  id: z.string(),
  name: z.string().min(1, "カテゴリ名は必須です"),
  slug: z.string().regex(/^[a-z0-9-]+$/, "slugは英小文字・数字・ハイフンのみ"),
});

export const CreateCategorySchema = CategorySchema.pick({
  name: true,
  slug: true,
});

export const UpdateCategorySchema = CreateCategorySchema.partial();

// TypeScript の型を自動生成
export type CategoryDTO = z.infer<typeof CategorySchema>;
export type CategoryOption = Pick<CategoryDTO, "id" | "name">; // フォームのセレクト用
export type CreateCategoryInput = z.infer<typeof CreateCategorySchema>;
export type UpdateCategoryInput = z.infer<typeof UpdateCategorySchema>;
