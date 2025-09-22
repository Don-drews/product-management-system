import { CategorySchema, type CategoryDTO } from "@/schemas/category";

type CategoryRow = {
  id: string;
  name: string;
  slug: string;
  createdAt: Date;
  updatedAt: Date;
};

export function toCategoryDTO(row: CategoryRow): CategoryDTO {
  return CategorySchema.parse({
    id: row.id,
    name: row.name,
    slug: row.slug,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  });
}
