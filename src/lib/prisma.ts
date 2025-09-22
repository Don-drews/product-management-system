import { PrismaClient } from "@prisma/client";

// 1. globalオブジェクトに prisma をキャッシュするための型定義
const globalForPrisma = global as unknown as { prisma?: PrismaClient };

// 2. もし global に prisma がなければ new PrismaClient()
//    あればそれを使い回す → シングルトン化
export const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({ log: ["query", "error", "warn"] }); // オプションをつけることでログ出力される（query：指定すると、Prismaが実行した生のSQLクエリをコンソールに出力。error：エラー時にログ出る。warn：警告時にログが出る。）

// 3. 本番以外の環境のときだけ global に prisma を保存
if (process.env.NODE_ENV !== "production") globalForPrisma.prisma = prisma;
