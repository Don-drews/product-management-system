import { prisma } from "@/lib/prisma";

/**
 * いいねを冪等トグルする
 * 既に押していれば削除→ false、未押下なら作成→ true を返す
 */
export async function toggleLike(
  userId: string,
  productId: string
): Promise<boolean> {
  return await prisma.$transaction(async (tx) => {
    const existing = await tx.like.findUnique({
      where: { userId_productId: { userId, productId } }, // @@unique([userId, productId])
      select: { id: true },
    });

    if (existing) {
      await tx.like.delete({ where: { id: existing.id } });
      return false; // 解除後の状態
    }

    await tx.like.create({ data: { userId, productId } });
    return true; // いいね後の状態
  });
}

/* あるユーザー（userId）が、新着/人気で表示中の商品一覧（productIds）の中で、どれをいいね済みかを返す */
export async function getMyLikedSet(
  userId: string,
  productIds: string[]
): Promise<Set<string>> {
  if (productIds.length === 0) return new Set();
  const rows = await prisma.like.findMany({
    where: { userId, productId: { in: productIds } },
    select: { productId: true },
  });
  return new Set(rows.map((r) => r.productId));
}
