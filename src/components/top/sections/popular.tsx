import { auth } from "@/auth";
import ProductCard from "@/components/products/product-card";
import { getMyLikedSet } from "@/server/likes";
import { getPopularIn7Days } from "@/server/products";

export default async function PopularSection() {
  const items = await getPopularIn7Days(8);

  const session = await auth();
  let likedSet = new Set<string>();
  if (session?.user && items.length > 0) {
    likedSet = await getMyLikedSet(
      session.user.id,
      items.map((i) => i.id)
    );
  }

  const itemsWithIsLiked = items.map((p) => ({
    ...p,
    isLiked: session?.user ? likedSet.has(p.id) : undefined,
  }));

  return (
    <section className="container px-4">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold">
          人気アイテム（直近7日）
        </h2>
        <a
          href="../../products"
          className="text-sm text-muted-foreground hover:underline"
        >
          もっと見る
        </a>
      </div>

      {items.length === 0 ? (
        <div className="text-sm text-muted-foreground">
          直近の人気データはまだありません。
        </div>
      ) : (
        <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
          {itemsWithIsLiked.map((p) => (
            <li key={p.id}>
              <ProductCard product={p} />
            </li>
          ))}
        </ul>
      )}
    </section>
  );
}
