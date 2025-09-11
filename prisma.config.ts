import { defineConfig } from "@prisma/config";

export default defineConfig({
  schema: "./prisma/schema.prisma",
  migrations: {
    seed: "ts-node prisma/seed.ts",
  },
  // 必要に応じて generator や datasource の設定もここに書ける
});
