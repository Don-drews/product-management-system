import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import Image from "next/image";
import ProfileForm from "@/components/account/profile-form";

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) {
    // ここで null を返すか、/api/auth/signin へリダイレクトする保護を middleware 側で行う
    return null;
  }

  const me = await prisma.user.findUnique({
    where: { id: session.user.id },
    select: { name: true, email: true, image: true },
  });

  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <h1 className="text-2xl font-semibold">アカウント設定</h1>
      <p className="mt-1 text-sm text-muted-foreground">
        表示名を編集できます。変更はヘッダーなどにも即時反映されます。
      </p>

      <div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr]">
        {/* サイド: プロフィール概要 */}
        <Card>
          <CardHeader>
            <CardTitle>プロフィール</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-4">
              <div className="relative h-14 w-14 overflow-hidden rounded-full bg-muted">
                {/* 画像URLがない場合はプレースホルダを表示 */}
                {me?.image ? (
                  <Image
                    src={me.image}
                    alt="avatar"
                    fill
                    sizes="56px"
                    className="object-cover"
                  />
                ) : (
                  <div className="flex h-14 w-14 items-center justify-center text-lg font-medium">
                    {(me?.name?.[0] ?? "?").toUpperCase()}
                  </div>
                )}
              </div>
              <div className="min-w-0">
                <div className="truncate font-medium">
                  {me?.name ?? "未設定"}
                </div>
                <div className="truncate text-sm text-muted-foreground">
                  {me?.email}
                </div>
              </div>
            </div>
            <Separator />
            <ul className="space-y-1 text-sm text-muted-foreground">
              <li>ユーザーIDは非表示です（内部的に保持）。</li>
              <li>メールアドレスはログイン専用です。</li>
            </ul>
          </CardContent>
        </Card>

        {/* メイン: 編集フォーム */}
        <Card>
          <CardHeader>
            <CardTitle>プロフィールを編集</CardTitle>
          </CardHeader>
          <CardContent>
            <ProfileForm
              defaultValues={{
                name: me?.name ?? "",
              }}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
