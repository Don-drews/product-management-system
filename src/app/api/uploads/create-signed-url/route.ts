import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";
import { auth } from "@/auth";
import z from "zod";

const BodySchema = z.object({
  filename: z.string().min(1),
  contentType: z.string().min(1),
  kind: z.enum(["product", "account"]).optional(),
});

export async function POST(req: Request) {
  const {
    filename,
    contentType,
    kind = "product",
  } = BodySchema.parse(await req.json());

  if (!filename || !contentType) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }
  if (!["product", "account"].includes(kind)) {
    return NextResponse.json({ message: "Invalid kind" }, { status: 400 });
  }

  // 拡張子サニタイズ
  const rawExt = (filename.split(".").pop()?.toLowerCase() || "png").trim();
  const safeExt = ["png", "jpg", "jpeg", "webp", "gif", "bmp", "avif"].includes(
    rawExt
  )
    ? rawExt
    : "png";

  // kind ごとのバケット＆保存パスを決定
  let bucket = "products";
  let path: string;

  if (kind === "account") {
    // アバターは本人ログイン必須
    const session = await auth();
    const userId = session?.user?.id;
    if (!userId) {
      return NextResponse.json({ message: "Unauthorized" }, { status: 401 });
    }
    bucket = "account";
    path = `${userId}/${Date.now()}.${safeExt}`; // account/<uid>/timestamp.ext
  } else {
    // product
    const now = new Date();
    const yyyy = now.getFullYear();
    const mm = String(now.getMonth() + 1).padStart(2, "0");
    const dd = String(now.getDate()).padStart(2, "0");
    path = `${yyyy}/${mm}/${dd}/${randomUUID()}.${safeExt}`; // products/YYYY/MM/DD/uuid.ext
  }

  // 署名付きアップロードURL（60秒）
  const { data, error } = await supabaseAdmin.storage
    .from(bucket)
    .createSignedUploadUrl(path, { upsert: false });

  if (error || !data) {
    return NextResponse.json(
      { message: error?.message ?? "Failed" },
      { status: 500 }
    );
  }

  // フロントは signedUrl に PUT する
  return NextResponse.json({
    bucket,
    path, // ← DBに保存するのはこの「パス」を推奨
    signedUrl: data.signedUrl,
    token: data.token, // supabase-js の uploadToSignedUrl を使う場合に利用
  });
}
