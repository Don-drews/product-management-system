export default function Loading() {
  return (
    <div className="mx-auto w-full max-w-4xl p-6">
      <div className="h-8 w-40 animate-pulse rounded bg-muted" />
      <div className="mt-6 grid gap-6 md:grid-cols-[280px_1fr]">
        <div className="h-64 rounded-lg bg-muted/50" />
        <div className="h-64 rounded-lg bg-muted/50" />
      </div>
    </div>
  );
}
