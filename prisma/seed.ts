import { PrismaClient } from "@prisma/client";
import fs from "node:fs";
import path from "node:path";

const prisma = new PrismaClient();

// ダミーJSONの型（ローカル定義）
type SeedProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  categoryId: string; // 例: "c-gadget"
  createdAt?: string;
  updatedAt?: string;
};

// __dirname 基準で JSON パス解決 → ファイル読込 → parse
const jsonPath = path.resolve(__dirname, "../src/mocks/products.json");
const products = JSON.parse(
  fs.readFileSync(jsonPath, "utf-8")
) as SeedProduct[];

const CATEGORIES = [
  { name: "Gadget", slug: "gadget" },
  { name: "Food", slug: "food" },
  { name: "Sports", slug: "sports" },
  { name: "Book", slug: "book" },
];

const toSlugFromDummy = (dummyId: string) =>
  dummyId?.startsWith("c-") ? dummyId.slice(2) : dummyId;

async function main() {
  // 1) カテゴリ upsert
  const slugToId = new Map<string, string>();
  for (const c of CATEGORIES) {
    const created = await prisma.category.upsert({
      where: { slug: c.slug },
      update: {},
      create: c,
      select: { id: true, slug: true },
    });
    slugToId.set(created.slug, created.id);
  }

  // 2) 商品 upsert
  for (const p of products) {
    const slug = toSlugFromDummy(p.categoryId);
    const categoryId = slugToId.get(slug);
    if (!categoryId) {
      console.warn(`Unknown category slug: ${slug} (product: ${p.id})`);
      continue;
    }

    await prisma.product.upsert({
      where: { id: p.id },
      update: {},
      create: {
        id: p.id,
        name: p.name,
        description: p.description ?? null,
        price: p.price,
        imageUrl: p.imageUrl,
        categoryId,
        ...(p.createdAt ? { createdAt: new Date(p.createdAt) } : {}),
        ...(p.updatedAt ? { updatedAt: new Date(p.updatedAt) } : {}),
      },
    });
  }

  console.log("✅ seed done");
}

main()
  .catch((e) => {
    console.error("❌ seed failed:", e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
