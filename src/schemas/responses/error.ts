import { z } from "zod";

export const ErrorResponse = z.object({
  error: z.string(), // 例: "ValidationError" | "DuplicateSlug"
  message: z.string(), // 表示用メッセージ
  code: z.string().optional(), // アプリ固有コードが欲しければ
});
export type ErrorResponseDTO = z.infer<typeof ErrorResponse>;
