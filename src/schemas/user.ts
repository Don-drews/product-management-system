import { z } from "zod";

/**
 * ユーザーのプロフィール編集用スキーマ
 * - 名前だけ必須
 */
export const EditProfileSchema = z.object({
  name: z.string().min(1, "名前は必須です").max(50),
});

export type EditProfileInput = z.infer<typeof EditProfileSchema>;
