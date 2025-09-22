// サーバー用
import { createClient } from "@supabase/supabase-js";

export const supabaseAdmin = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE!,
  {
    auth: { persistSession: false }, // サーバー側なのでセッション保持は不要
  }
);
