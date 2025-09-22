import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { AlertTriangle } from "lucide-react";

type SearchParams = { error?: string };

const messages: Record<string, string> = {
  Verification:
    "確認リンクの有効期限が切れました。もう一度サインインしてメールを受け取ってください。",
  AccessDenied: "アクセス権限がありません。別のアカウントでお試しください。",
  OAuthAccountNotLinked:
    "このメールは別のサインイン方法で登録済みです。元の方法でサインインしてください。",
  CredentialsSignin: "メールまたはパスワードが正しくありません。",
  EmailSignin: "メールを送信できませんでした。時間をおいて再度お試しください。",
  EmailCreateAccount:
    "アカウントを作成できませんでした。時間をおいて再度お試しください。",
  Configuration: "設定エラーが発生しました。管理者にお問い合わせください。",
  Default: "エラーが発生しました。再度お試しください。",
};

export default async function ErrorPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const sp = await searchParams;
  const code = sp.error;

  const message = messages[code ?? "Default"] ?? messages.Default;

  return (
    <div className="relative min-h-[calc(100dvh-56px)] w-full overflow-hidden">
      {/* 背景グラデーション */}
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-600/40 via-fuchsia-500/20 to-cyan-400/20 blur-3xl opacity-60" />
        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-purple-500/30 to-blue-500/20 blur-3xl opacity-60" />
      </div>

      <main className="mx-auto flex w-full max-w-xl px-6 py-16">
        <Card className="w-full max-w-lg border border-white/20 bg-background/70 backdrop-blur-md shadow-xl">
          <CardHeader className="flex flex-col items-center gap-3 text-center">
            <AlertTriangle className="h-10 w-10 text-amber-400" />
            <CardTitle className="text-2xl font-semibold">
              サインインエラー
            </CardTitle>
          </CardHeader>

          <CardContent>
            <p className="text-sm text-muted-foreground text-center">
              {message} <br /> {code ? <span>（コード: {code}）</span> : null}
            </p>
          </CardContent>

          <CardFooter className="flex justify-center gap-4">
            <Button asChild variant="outline" className="w-32">
              <Link href="/auth/signin">サインインへ戻る</Link>
            </Button>
            <Button asChild variant="secondary" className="w-32">
              <Link href="/">トップへ</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
