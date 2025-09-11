import { getJSON } from "./http";
import {
  ListCategoriesRes,
  GetCategoryRes,
} from "@/schemas/responses/categories";
import type { CategoryDTO } from "@/schemas/category";

export async function fetchCategories(): Promise<CategoryDTO[]> {
  const json = await getJSON<unknown>("/api/categories");
  return ListCategoriesRes.parse(json).items;
}

export async function fetchCategoryById(
  id: string
): Promise<CategoryDTO | null> {
  const res = await fetch(`/api/categories/${id}`, { cache: "no-store" });
  if (res.status === 404) return null;
  if (!res.ok)
    throw new Error(`GET /api/categories/${id} failed: ${res.status}`);
  const json = await res.json();
  return GetCategoryRes.parse(json).item;
}
