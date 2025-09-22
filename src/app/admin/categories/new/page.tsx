import CreateCategoryForm from "./create-category-form";

export default function Page() {
  return (
    <div className="container mx-auto max-w-xl px-4 py-6 space-y-4">
      <h1 className="text-2xl font-bold">カテゴリ作成</h1>
      <CreateCategoryForm />
    </div>
  );
}
