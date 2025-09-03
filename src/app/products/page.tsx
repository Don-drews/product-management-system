import ThemeToggle from "@/components/theme-toggle";

export default function Page() {
  return (
    <div className="container mx-auto px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">Products</h1>
      <ThemeToggle />
      <p>ここに商品一覧を作る予定</p>
    </div>
  );
}
