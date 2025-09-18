import ProductCard from "@/components/products/product-card";
import { getNewArrivals } from "@/server/products";

export default async function NewArrivalsSection() {
  const items = await getNewArrivals(6);

  if (items.length === 0) {
    return (
      <section className="container px-4">
        <h2 className="text-xl md:text-2xl font-semibold mb-4">新着アイテム</h2>
        <div className="text-sm text-muted-foreground">商品は準備中です。</div>
      </section>
    );
  }

  return (
    <section className="container px-4">
      <div className="flex items-baseline justify-between mb-4">
        <h2 className="text-xl md:text-2xl font-semibold">新着アイテム</h2>
        <a
          href="../../products"
          className="text-sm text-muted-foreground hover:underline"
        >
          すべて見る
        </a>
      </div>

      <ul className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
        {items.map((p) => (
          <li key={p.id}>
            <ProductCard product={p} />
          </li>
        ))}
      </ul>
    </section>
  );
}
