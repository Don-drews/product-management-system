import { Product } from "../src/types/product";
import { prisma } from "../src/lib/prisma";
import productsJson from "../src/mocks/products.json";

type SeedProduct = {
  id: string;
  name: string;
  description?: string;
  price: number;
  imageUrl: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
};

const products = productsJson as SeedProduct[];

// ダミーJSONは categoryId: "c-gadget" のような形式なので、slugに直してからDBのIDへ
const CATEGORIES = [
  { name: "Gadget", slug: "gadget" },
  { name: "Food", slug: "food" },
  { name: "Sports", slug: "sports" },
  { name: "Book", slug: "book" },
];

function toSlugFromDummy(dummyCategoryId: string) {
  return dummyCategoryId.startsWith("c-")
    ? dummyCategoryId.slice(2)
    : dummyCategoryId;
}

async function main() {
  // 1) カテゴリを upsert（存在しなければ作成）
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

  // 2) Product を upsert（同じ id があればスキップ）
  for (const p of products as Product[]) {
    const slug = toSlugFromDummy(p.categoryId);
    const categoryId = slugToId.get(slug);
    if (!categoryId) {
      console.warn(`Unknown category slug: ${slug} (product: ${p.id})`);
      continue;
    }

    await prisma.product.upsert({
      where: { id: p.id }, // ダミーJSONの id をそのまま使う
      update: {},
      create: {
        id: p.id,
        name: p.name,
        description: p.description ?? null,
        price: p.price,
        imageUrl: p.imageUrl,
        categoryId,
        // createdAt/updatedAt がJSONにあれば使う（無ければDBのdefault）
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
