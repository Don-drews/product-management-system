export type ProductCardData = {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  createdAt: Date;
  likeCount: number; // 新着 = 累計 / 人気 = 直近7日
};
