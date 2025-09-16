import Link from "next/link";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";

type Props = { searchParams?: { error?: string } };

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

function getMessage(code?: string) {
  if (!code) return messages.Default;
  return messages[code] ?? messages.Default;
}

export default function ErrorPage({ searchParams }: Props) {
  const code = searchParams?.error;
  const message = getMessage(code);

  return (
    <div className="relative min-h-[calc(100dvh-56px)] w-full overflow-hidden">
      <div aria-hidden className="pointer-events-none absolute inset-0 -z-10">
        <div className="absolute -top-40 left-1/2 h-[600px] w-[900px] -translate-x-1/2 rounded-full bg-gradient-to-br from-indigo-600/30 via-fuchsia-500/20 to-cyan-400/20 blur-3xl" />
        <div className="absolute bottom-[-200px] right-[-200px] h-[500px] w-[500px] rounded-full bg-gradient-to-tr from-purple-500/20 to-blue-500/20 blur-3xl" />
      </div>

      <main className="mx-auto flex w-full max-w-xl px-6 py-16">
        <Card className="w-full border-white/10 bg-background/70 backdrop-blur">
          <CardHeader>
            <CardTitle>サインインエラー</CardTitle>
            <CardDescription>
              {message} {code ? <span>（コード: {code}）</span> : null}
            </CardDescription>
          </CardHeader>
          <CardContent />
          <CardFooter className="gap-3">
            <Button asChild variant="outline">
              <Link href="/auth/signin">サインインへ戻る</Link>
            </Button>
            <Button asChild variant="secondary">
              <Link href="/">トップへ</Link>
            </Button>
          </CardFooter>
        </Card>
      </main>
    </div>
  );
}
