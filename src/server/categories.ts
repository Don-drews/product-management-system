import {
  DEFAULT_CATEGORY_NAME,
  DEFAULT_CATEGORY_SLUG,
} from "@/constants/category";
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

export class NotFoundError extends Error {
  status = 404 as const;
}
export class ForbiddenError extends Error {
  status = 403 as const;
}
export class BadRequestError extends Error {
  status = 400 as const;
}

/**
 * カテゴリ名が“未分類”かどうか
 */
export function isDefaultCategorySlug(slug: string) {
  return slug === DEFAULT_CATEGORY_SLUG;
}

/**
 * “未分類”カテゴリを必ず1件だけ用意して返す（存在しなければ作成）
 * - 同時実行でも安全（upsert）
 * - 返却は最小フィールドに限定
 */
export async function getOrCreateUncategorized(): Promise<CategoryListItem> {
  return prisma.category.upsert({
    where: { slug: DEFAULT_CATEGORY_SLUG },
    update: {},
    create: { name: DEFAULT_CATEGORY_NAME, slug: DEFAULT_CATEGORY_SLUG },
    select: { id: true, name: true, slug: true },
  });
}

/** id 指定でカテゴリを1件取得（なければ null） */
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
