export async function getJSON<T>(url: string): Promise<T> {
  const res = await fetch(url, { cache: "no-store" });
  if (!res.ok) {
    // ここで共通のログやエラー変換を入れても良い
    throw new Error(`${res.status} ${res.statusText} (${url})`);
  }
  return res.json() as Promise<T>;
}
