import { prisma } from "@/lib/prisma";
import {
  CategoryDTO,
  CategorySchema,
  CreateCategoryInput,
  CreateCategorySchema,
} from "@/schemas/category";

export async function listCategories(): Promise<CategoryDTO[]> {
  const categoryRecords = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  // Prismaレコード -> Zodで検証しつつDTO化
  return categoryRecords.map((category) => CategorySchema.parse(category));
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
