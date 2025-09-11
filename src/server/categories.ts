import { prisma } from "@/lib/prisma";
import {
  CategoryDTO,
  CategorySchema,
  CreateCategoryInput,
  CreateCategorySchema,
} from "@/schemas/category";

export async function listCategories(q?: string): Promise<CategoryDTO[]> {
  const where = q
    ? {
        OR: [
          { name: { contains: q, mode: "insensitive" as const } },
          { slug: { contains: q, mode: "insensitive" as const } },
        ],
      }
    : {};

  const rows = await prisma.category.findMany({
    where,
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });
  return rows.map((row) => CategorySchema.parse(row));
}

export async function createCategory(
  input: CreateCategoryInput
): Promise<CategoryDTO> {
  const parsed = CreateCategorySchema.parse(input);
  const created = await prisma.category.create({
    data: parsed,
    select: { id: true, name: true, slug: true },
  });
  return CategorySchema.parse(created);
}
