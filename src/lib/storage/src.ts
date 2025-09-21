import { DEFAULT_PRODUCT_IMAGE } from "@/constants/product";
import { getProductImageUrl } from "./url";
import { DEFAULT_ACCOUNT_IMAGE } from "@/constants/account";

export function getProductImageSrcUrl(imageUrl: string) {
  // 画像URLが「フルURL」か「path」かで分岐し、最終的な表示用URLを決定
  return imageUrl
    ? /^https?:\/\//i.test(imageUrl)
      ? imageUrl // すでにフルURLならそのまま
      : getProductImageUrl(imageUrl) // pathなら公開URLへ変換
    : DEFAULT_PRODUCT_IMAGE;
}

export function getAccountImageSrcUrl(imageUrl: string) {
  // 画像URLが「フルURL」か「path」かで分岐し、最終的な表示用URLを決定
  return imageUrl
    ? /^https?:\/\//i.test(imageUrl)
      ? imageUrl // すでにフルURLならそのまま
      : getProductImageUrl(imageUrl) // pathなら公開URLへ変換
    : DEFAULT_ACCOUNT_IMAGE;
}
