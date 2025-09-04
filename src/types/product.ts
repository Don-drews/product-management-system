export type Product = {
  id: string;
  name: string;
  description?: string | null;
  price: number; // 円（整数）
  imageUrl: string;
  categoryId: string;
  createdAt?: string;
  updatedAt?: string;
};
