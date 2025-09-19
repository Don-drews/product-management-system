import { NextResponse } from "next/server";
import { supabaseAdmin } from "@/lib/supabase/admin";
import { randomUUID } from "crypto";

export async function POST(req: Request) {
  const { filename, contentType } = await req.json();
  if (!filename || !contentType) {
    return NextResponse.json({ message: "Bad Request" }, { status: 400 });
  }

  // 例: products/2025/09/19/uuid.ext
  const ext = filename.split(".").pop()?.toLowerCase() || "bin";
  const now = new Date();
  const path = `${now.getFullYear()}/${String(now.getMonth() + 1).padStart(
    2,
    "0"
  )}/${String(now.getDate()).padStart(2, "0")}/${randomUUID()}.${ext}`;

  // 60秒のアップロード専用URLを発行
  const { data, error } = await supabaseAdmin.storage
    .from("products")
    .createSignedUploadUrl(path, { upsert: false });

  if (error || !data) {
    return NextResponse.json(
      { message: error?.message ?? "Failed" },
      { status: 500 }
    );
  }

  // data: { signedUrl, token, path }
  return NextResponse.json({
    path,
    signedUrl: data.signedUrl,
    token: data.token,
  });
}
