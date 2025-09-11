// src/lib/api-error.ts
import { Prisma } from "@prisma/client";
import { ZodError } from "zod";

export type ApiError = { status: number; message: string };

// Prisma の既知エラーを HTTP に対応づけ
export function mapError(e: unknown): ApiError {
  // 1) Prisma 既知のリクエストエラー（Constraint 等）
  if (e instanceof Prisma.PrismaClientKnownRequestError) {
    switch (e.code) {
      case "P2002":
        // 一意制約 (unique) 違反
        return {
          status: 409,
          message: "Duplicate key (unique constraint violated)",
        };
      case "P2025":
        // 条件に合致するレコードなし（update/delete で起こりやすい）
        return { status: 404, message: "Record not found" };
      case "P2003":
        // 外部キー制約違反（参照があるのに削除しようとした等）
        return { status: 409, message: "Foreign key constraint violation" };
      default:
        return { status: 400, message: `Prisma error (${e.code})` };
    }
  }

  // 2) Zod のバリデーションエラー
  if (e instanceof ZodError) {
    const first = e.issues[0]?.message ?? "Validation error";
    return { status: 400, message: first };
  }

  // 3) 通常の Error
  if (e instanceof Error) {
    // ここで自前の業務エラー文字列に応じた分岐も可能
    if (e.message.includes("in use")) {
      // 例: サービス層 deleteCategory で投げた「参照あり」メッセージ
      return { status: 409, message: "Resource is in use" };
    }
    return { status: 400, message: e.message };
  }

  // 4) 予期しない型
  return { status: 500, message: "Unknown error" };
}
