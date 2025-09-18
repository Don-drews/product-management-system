import Link from "next/link";
import { Button } from "@/components/ui/button";
import NewArrivalsSection from "@/components/top/sections/new-arrivals";
import PopularSection from "@/components/top/sections/popular";

export default function HomePage() {
  return (
    <main className="min-h-screen">
      {/* HERO */}
      <section className="py-16 md:py-24">
        {/* 画面中央に寄せる & サイド余白 */}
        <div className="container mx-auto px-4">
          {/* カード本体を中央寄せ & 幅を限定 */}
          <div
            className="
              relative overflow-hidden
              mx-auto max-w-3xl md:max-w-4xl
              rounded-3xl bg-card border shadow-sm
              px-6 md:px-12 py-12
            "
          >
            {/* 背景デコレーション */}
            <div
              className="
                pointer-events-none absolute inset-0 -z-10
                [background:radial-gradient(40rem_30rem_at_80%_-10%,theme(colors.primary/20),transparent_60%),
                radial-gradient(30rem_24rem_at_0%_100%,theme(colors.secondary/15),transparent_60%)]
                dark:[background:radial-gradient(40rem_30rem_at_80%_-10%,theme(colors.primary/25),transparent_60%),
                radial-gradient(30rem_24rem_at_0%_100%,theme(colors.secondary/20),transparent_60%)]
              "
            />

            <div className="text-center md:text-left">
              <div className="inline-flex items-center gap-2 rounded-full border px-3 py-1 text-xs text-muted-foreground mb-5 bg-background/60">
                サインインで「いいね」を保存できます
              </div>

              <h1 className="text-3xl md:text-5xl font-bold tracking-tight mb-4">
                あなたの商品を見つけよう
              </h1>

              <p className="text-muted-foreground max-w-2xl mx-auto md:mx-0 mb-8">
                新着や人気から気になるアイテムをチェック。気に入ったら「いいね」で保存できます。
              </p>

              <div className="flex flex-wrap items-center justify-center md:justify-start gap-3">
                <Button asChild size="lg">
                  <Link href="/products">商品を探す</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/auth/signin?callbackUrl=/">サインイン</Link>
                </Button>
                <span className="text-xs text-muted-foreground">
                  ゲストでもいいね数は表示されます
                </span>
              </div>
            </div>
          </div>
        </div>
      </section>

      <div className="space-y-12 md:space-y-16">
        <NewArrivalsSection />
        <PopularSection />
      </div>
    </main>
  );
}
