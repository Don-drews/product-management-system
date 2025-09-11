import { z } from "zod";
import { CategorySchema } from "../category";

export const ListCategoriesRes = z.object({
  items: z.array(CategorySchema),
});

export const GetCategoryRes = z.object({
  item: CategorySchema,
});
export type ListCategoriesDTO = z.infer<typeof ListCategoriesRes>;
export type GetCategoryDTO = z.infer<typeof GetCategoryRes>;
