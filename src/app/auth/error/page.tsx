import Link from "next/link";

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
    <main className="mx-auto max-w-md px-6 py-12">
      <h1 className="text-2xl font-semibold">サインインエラー</h1>
      <p className="mt-4 text-sm text-muted-foreground">
        {message}
        {code ? `（コード: ${code}）` : null}
      </p>

      <div className="mt-8 flex gap-3">
        <Link
          href="/auth/signin"
          className="rounded-xl border px-4 py-2 text-sm"
        >
          サインインへ戻る
        </Link>
        <Link href="/" className="rounded-xl border px-4 py-2 text-sm">
          トップへ
        </Link>
      </div>

      <p className="mt-6 text-xs text-muted-foreground">
        問題が解決しない場合は管理者にお問い合わせください。
      </p>
    </main>
  );
}
