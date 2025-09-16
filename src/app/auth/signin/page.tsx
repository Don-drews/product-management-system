"use client";

import { useState, useTransition } from "react";
import { useRouter, useSearchParams } from "next/navigation";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { Mail } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export default function SignInPage() {
  const router = useRouter();
  const sp = useSearchParams();
  const callbackUrl = sp.get("callbackUrl") ?? "/";
  const error = sp.get("error"); // Auth.jsからのエラー文言（必要ならマッピングして表示）
  const [email, setEmail] = useState("");
  const [isPending, startTransition] = useTransition();
  const [localError, setLocalError] = useState<string | null>(null);

  const errorMessages: Record<string, string> = {
    OAuthAccountNotLinked: "同じメールで登録済みのアカウントがあります。",
    EmailSignin: "メール送信に失敗しました。入力を確認してください。",
  };

  const errorMessage = error
    ? errorMessages[error] ?? "サインインでエラーが発生しました"
    : null;

  const onSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    setLocalError(null);

    const value = email.trim();
    if (!value || !/^\S+@\S+\.\S+$/.test(value)) {
      setLocalError("正しいメールアドレスを入力してください。");
      return;
    }

    startTransition(async () => {
      // ① メール送信（リダイレクト抑止）
      await signIn("email", { email: value, callbackUrl, redirect: false });
      // ② localStorageにも保存（万一の復元用）
      try {
        localStorage.setItem("lastSignInEmail", value);
      } catch {}
      // ③ 自前で verify ページへ遷移（クエリでメールとcallbackUrlを渡す）
      router.push(
        `/auth/verify-request?email=${encodeURIComponent(
          value
        )}&callbackUrl=${encodeURIComponent(callbackUrl)}`
      );
    });
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden
      bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950"
    >
      {/* 背景のふわっと光るブロブ */}
      <div
        className="pointer-events-none absolute -left-24 -top-24 h-80 w-80 rounded-full blur-3xl opacity-30
        bg-gradient-to-tr from-indigo-400 to-fuchsia-400 dark:from-indigo-600 dark:to-fuchsia-600"
      />
      <div
        className="pointer-events-none absolute -right-24 -bottom-24 h-80 w-80 rounded-full blur-3xl opacity-20
        bg-gradient-to-tr from-cyan-400 to-emerald-400 dark:from-cyan-600 dark:to-emerald-600"
      />

      <Card
        className="w-full max-w-md backdrop-blur supports-[backdrop-filter]:bg-white/70
        dark:supports-[backdrop-filter]:bg-slate-900/60 border border-white/40 dark:border-white/10"
      >
        <CardHeader className="text-center">
          <CardTitle className="text-2xl">サインイン</CardTitle>
          <CardDescription>
            登録メール宛に<strong>マジックリンク</strong>を送ります
          </CardDescription>
        </CardHeader>

        <CardContent>
          {errorMessage && (
            <div className="mb-3 rounded-md border border-red-200 bg-red-50 px-3 py-2 text-sm text-red-700 dark:border-red-900/40 dark:bg-red-900/20">
              {errorMessage}
            </div>
          )}
          {localError && (
            <div className="mb-3 rounded-md border border-amber-200 bg-amber-50 px-3 py-2 text-sm text-amber-800 dark:border-amber-900/40 dark:bg-amber-900/20">
              {localError}
            </div>
          )}

          <form onSubmit={onSubmit} className="space-y-4" noValidate>
            <div className="space-y-2">
              <Label htmlFor="email">メールアドレス</Label>
              <Input
                id="email"
                type="email"
                placeholder="you@example.com"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                autoComplete="email"
                inputMode="email"
                autoCapitalize="none"
                spellCheck={false}
                required
              />
            </div>

            <Button
              type="submit"
              className="w-full"
              disabled={isPending}
              aria-busy={isPending}
            >
              {isPending ? (
                "送信中…"
              ) : (
                <span className="inline-flex items-center gap-2">
                  <Mail size={18} />
                  メールでサインイン
                </span>
              )}
            </Button>
          </form>

          {/* 将来の拡張（Google/Discord）を差し込む場所。実装時に解除して使う */}
          <div className="my-6">
            <Separator />
          </div>
          <div className="grid gap-3">
            <Button variant="outline" className="w-full">
              Googleで続行
            </Button>
            <Button variant="outline" className="w-full">
              Discordで続行
            </Button>
          </div>
        </CardContent>

        <CardFooter className="flex-col items-start gap-2 text-xs text-muted-foreground">
          <p>メールが届かない場合は迷惑メールをご確認ください。</p>
          <p>
            サインインにより
            <Link href="/terms" className="underline hover:opacity-80">
              利用規約
            </Link>
            と
            <Link href="/privacy" className="underline hover:opacity-80">
              プライバシーポリシー
            </Link>
            に同意したものとみなされます。
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
