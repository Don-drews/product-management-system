import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { getLikedProductsByUser } from "@/server/products"; // ← products.ts から取得
import ProductCard from "@/components/product-card";

export default async function FavoritesPage() {
  const session = await auth();
  if (!session?.user?.id) {
    redirect(
      `/api/auth/signin?callbackUrl=${encodeURIComponent("/favorites")}`
    );
  }

  const products = await getLikedProductsByUser(session.user.id);

  return (
    <main className="mx-auto max-w-6xl px-4 py-6">
      <h1 className="mb-4 text-2xl font-semibold">お気に入り</h1>

      {products.length === 0 ? (
        <div className="rounded-lg border p-8 text-center text-muted-foreground">
          まだお気に入りはありません。
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:grid-cols-3">
          {products.map((p) => (
            <ProductCard key={p.id} product={p} />
          ))}
        </div>
      )}
    </main>
  );
}
