import { toCategoryDTO } from "@/lib/mapper/category";
import { prisma } from "@/lib/prisma";
import {
  CategoryDTO,
  CategoryListItem,
  CategoryListItemSchema,
  CreateCategoryInput,
  CreateCategorySchema,
  UpdateCategoryInput,
} from "@/schemas/category";

export async function getCategoryById(id: string): Promise<CategoryDTO | null> {
  const row = await prisma.category.findUnique({
    where: { id },
  });
  console.log(`=== getCategoryById() ===\nname:` + row?.name);

  return row ? toCategoryDTO(row) : null;
}

export async function listCategories(q?: string): Promise<CategoryListItem[]> {
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
  return rows.map((row) => CategoryListItemSchema.parse(row));
}

export async function createCategory(
  input: CreateCategoryInput
): Promise<CategoryListItem> {
  const parsed = CreateCategorySchema.parse(input);
  const created = await prisma.category.create({
    data: parsed,
    select: { id: true, name: true, slug: true },
  });
  return CategoryListItemSchema.parse(created);
}

export async function updateCategory(
  id: string,
  input: UpdateCategoryInput
): Promise<CategoryDTO | null> {
  const updated = await prisma.category
    .update({
      where: { id },
      data: {
        name: input.name,
        slug: input.slug,
      },
    })
    .catch(() => null);

  return updated ? toCategoryDTO(updated) : null;
}

export async function deleteCategory(id: string): Promise<void> {
  // 参照チェック。参照があれば 409 にしたいのでここで弾く
  console.log(`----------------- deleteCategory() -----------------`);

  const usedCount = await prisma.product.count({ where: { categoryId: id } });
  console.log(`useCount:${usedCount}`);

  if (usedCount > 0) {
    // 共通ハンドラで 409 にマッピングされる想定
    throw new Error("Category is in use");
  }
  await prisma.category.delete({ where: { id } });
}
