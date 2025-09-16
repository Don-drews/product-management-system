"use client";

import Link from "next/link";
import { MailCheck, RefreshCcw, ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardHeader,
  CardTitle,
  CardDescription,
  CardContent,
  CardFooter,
} from "@/components/ui/card";
import { useSearchParams } from "next/navigation";
import { useEffect, useMemo, useState, useTransition } from "react";
import { signIn } from "next-auth/react";

export default function VerifyRequestPage() {
  const sp = useSearchParams();
  const qsEmail = sp.get("email") ?? "";
  const callbackUrl = sp.get("callbackUrl") ?? "/";

  // ① クエリ優先、なければ localStorage から復元
  const [email, setEmail] = useState(qsEmail);
  useEffect(() => {
    if (!qsEmail) {
      try {
        const saved = localStorage.getItem("lastSignInEmail") ?? "";
        if (saved) setEmail(saved);
      } catch {}
    }
  }, [qsEmail]);

  const [isPending, startTransition] = useTransition();
  const [msg, setMsg] = useState<string | null>(null);
  const canResend = useMemo(() => !!email, [email]);

  const handleResend = () => {
    if (!email) return;
    setMsg(null);
    startTransition(async () => {
      // ② 再送（再びメール送るだけ。画面はこのまま）
      await signIn("email", { email, callbackUrl, redirect: false });
      setMsg("確認メールを再送しました。受信トレイをご確認ください。");
    });
  };

  return (
    <div
      className="min-h-screen relative flex items-center justify-center overflow-hidden
      bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-900 dark:to-slate-950"
    >
      {/* 背景ブロブ（サインインと合わせた雰囲気） */}
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
        <CardHeader className="text-center space-y-3">
          <div
            className="mx-auto h-12 w-12 rounded-full flex items-center justify-center
            bg-black/5 dark:bg-white/10"
          >
            <MailCheck className="h-6 w-6" />
          </div>
          <CardTitle className="text-2xl">メールを送信しました</CardTitle>
          <CardDescription>
            受信トレイの<strong>マジックリンク</strong>
            をクリックしてサインインを完了してください。
          </CardDescription>
        </CardHeader>

        <CardContent className="space-y-3 text-sm text-muted-foreground">
          <p>メールが見当たらない場合は、以下をお試しください：</p>
          <ul className="list-disc pl-5 space-y-1">
            <li>迷惑メールフォルダを確認する</li>
            <li>数十秒待ってから更新する</li>
            <li>別のメールアドレスでやり直す</li>
          </ul>
        </CardContent>

        <CardFooter className="flex flex-col gap-2 items-stretch">
          {msg && <p className="mb-3 text-sm text-emerald-600">{msg}</p>}
          <div className="flex flex-col sm:flex-row gap-2 w-full">
            <Button asChild variant="outline" className="w-full sm:flex-1">
              <Link href="/auth/signin">
                <ArrowLeft className="mr-2 h-4 w-4" />
                戻る（別のメールで送る）
              </Link>
            </Button>
            <Button
              type="button"
              className="w-full sm:flex-1"
              disabled={!canResend || isPending}
              onClick={handleResend}
            >
              {isPending ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  再送中…
                </>
              ) : (
                <>
                  <RefreshCcw className="mr-2 h-4 w-4" />
                  確認メールを再送
                </>
              )}
            </Button>
          </div>

          <p className="text-xs text-muted-foreground text-center mt-2">
            {email
              ? `送信先: ${email}`
              : "送信先のメールが取得できません。戻って入力し直してください。"}
          </p>
        </CardFooter>
      </Card>
    </div>
  );
}
