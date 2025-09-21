import { DEFAULT_PRODUCT_IMAGE } from "@/constants/product";
import { getProductImageUrl } from "./url";

export function getImageSrcUrl(imageUrl: string) {
  // 画像URLが「フルURL」か「path」かで分岐し、最終的な表示用URLを決定
  return imageUrl
    ? /^https?:\/\//i.test(imageUrl)
      ? imageUrl // すでにフルURLならそのまま
      : getProductImageUrl(imageUrl) // pathなら公開URLへ変換
    : DEFAULT_PRODUCT_IMAGE;
}
