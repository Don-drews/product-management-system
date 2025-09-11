import { z } from "zod";
import { ProductSchema } from "../product";

export const ListProductsRes = z.object({
  items: z.array(ProductSchema),
  // 将来: total, page, pageSize 等を足す
});

export const GetProductRes = z.object({
  item: ProductSchema,
});
export type ListProductsDTO = z.infer<typeof ListProductsRes>;
export type GetProductDTO = z.infer<typeof GetProductRes>;
