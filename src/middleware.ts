import { withAuth } from "next-auth/middleware";

export default withAuth({
  callbacks: {
    authorized: ({ token, req }) => {
      const { pathname } = req.nextUrl;
      // 未ログインは即NG
      if (!token) return false;

      // /admin は ADMIN のみ
      if (pathname.startsWith("/admin")) {
        return token.role === "ADMIN";
      }

      // それ以外（/dashboardなど）はログインさえしていればOK
      return true;
    },
  },
  // pages を書かなければデフォルトで /api/auth/signin にリダイレクト
  pages: { signIn: "/auth/signin" },
});

export const config = {
  // ここに保護したいルートを列挙
  matcher: ["/dashboard/:path*", "/admin/:path*"],
};
