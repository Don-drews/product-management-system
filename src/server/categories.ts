import { prisma } from "@/lib/prisma";
import { CategoryDTO, CategorySchema } from "@/schemas/category";

export type CategoryOption = { id: string; name: string; slug: string };

export async function listCategories(): Promise<CategoryDTO[]> {
  const categoryRecords = await prisma.category.findMany({
    orderBy: { name: "asc" },
    select: { id: true, name: true, slug: true },
  });

  // Prismaレコード -> Zodで検証しつつDTO化
  return categoryRecords.map((category) => CategorySchema.parse(category));
}
