import { NextResponse } from "next/server";
import { z } from "zod";
import { toggleLike } from "@/server/likes";
// Auth.js v5 のユーティリティ（あなたのプロジェクトに合わせて import パス調整）
import { auth } from "@/auth";

const BodySchema = z.object({
  productId: z.string().min(1),
});

export async function POST(req: Request) {
  // 認証チェック（未ログイン→401）
  const session = await auth();
  const userId = session?.user?.id;
  if (!userId) {
    return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
  }

  // 入力バリデーション
  let productId: string;
  try {
    const body = await req.json();
    ({ productId } = BodySchema.parse(body));
  } catch {
    return NextResponse.json({ message: "Invalid body" }, { status: 400 });
  }

  try {
    const isLiked = await toggleLike(userId, productId);
    return NextResponse.json({ isLiked }, { status: 200 });
  } catch {
    // 例えば存在しない productId を弾きたければ、FK制約エラーをここで拾って 404/400 へ
    return NextResponse.json(
      { message: "Failed to toggle like" },
      { status: 500 }
    );
  }
}
