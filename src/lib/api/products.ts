import { getJSON } from "./http";
import { ListProductsRes, GetProductRes } from "@/schemas/responses/products";
import type { ProductDTO } from "@/schemas/product";

export async function fetchProducts(q?: string): Promise<ProductDTO[]> {
  const url = q ? `/api/products?q=${encodeURIComponent(q)}` : "/api/products";
  const json = await getJSON<unknown>(url);
  return ListProductsRes.parse(json).items;
}

export async function fetchProductById(id: string): Promise<ProductDTO | null> {
  const res = await fetch(`/api/products/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`GET /api/products/${id} failed: ${res.status}`);
  const json = await res.json();
  return GetProductRes.parse(json).item;
}
