import { PrismaClient } from "@prisma/client";
import {
  DEFAULT_CATEGORY_NAME,
  DEFAULT_CATEGORY_SLUG,
} from "@/constants/category";

const prisma = new PrismaClient();

async function main() {
  await prisma.category.upsert({
    where: { slug: DEFAULT_CATEGORY_SLUG },
    update: {},
    create: { name: DEFAULT_CATEGORY_NAME, slug: DEFAULT_CATEGORY_SLUG },
  });
}

main().finally(() => prisma.$disconnect());
