import { getServerSession } from "next-auth";
import { authOptions } from "./auth.config";

// 共通ヘルパー：サーバーコンポーネントやAPIで使える
// getServerSession をラップして共通化しただけの便利関数
// どこからでも auth() でセッション取得できる
export function auth() {
  return getServerSession(authOptions);
}
