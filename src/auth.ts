import { getServerSession } from "next-auth";
import { authOptions } from "./auth.config";

// 共通ヘルパー：サーバーコンポーネントやAPIで使える
export function auth() {
  return getServerSession(authOptions);
}
