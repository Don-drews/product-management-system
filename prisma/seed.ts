// prisma/seed.ts
import { PrismaClient } from "@prisma/client";
import productsJson from "../src/mocks/products.json";

const prisma = new PrismaClient(); // seed 内で直接 PrismaClient を生成

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
