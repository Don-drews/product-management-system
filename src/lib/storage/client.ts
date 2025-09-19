import { supabaseClient } from "@/lib/supabase/client";

export async function uploadProductImage(file: File): Promise<string> {
  // バリデーション
  if (!["image/png", "image/jpeg", "image/webp"].includes(file.type)) {
    throw new Error("PNG/JPEG/WEBPのみアップロード可能です");
  }
  if (file.size > 50 * 1024 * 1024) {
    throw new Error("50MBを超えるファイルはアップロードできません");
  }

  // 署名付きURLを取得
  const res = await fetch("/api/uploads/create-signed-url", {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify({ filename: file.name, contentType: file.type }),
  });
  if (!res.ok) throw new Error("署名URLの発行に失敗しました");
  const { path, token } = await res.json();

  // 実際のアップロード
  const { error } = await supabaseClient.storage
    .from("products")
    .uploadToSignedUrl(path, token, file, { contentType: file.type });

  if (error) throw error;

  return path; // ← DBに保存するのはこの path
}
