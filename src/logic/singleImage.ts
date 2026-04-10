import type { ImageReviewItem, ManualBoolean, SingleImageCategory } from "@/types/review";

export type ImageRequiredStatus =
  | { complete: true }
  | { complete: false; missing: Array<"text_mode" | "watermark" | "text_content_pair" | "pair_image_gte_50" | "sci"> };

function isSet(v: ManualBoolean): v is boolean {
  return typeof v === "boolean";
}

export function getImageRequiredStatus(img: ImageReviewItem): ImageRequiredStatus {
  const missing: ImageRequiredStatus["missing"] = [];

  if (!isSet(img.text_mode)) missing.push("text_mode");
  if (img.text_mode === true) {
    if (!isSet(img.watermark)) missing.push("watermark");
    if (img.watermark === false) {
      if (!isSet(img.text_content_pair)) missing.push("text_content_pair");
    }
  }
  if (img.text_mode === false) {
    if (!isSet(img.pair_image_gte_50)) missing.push("pair_image_gte_50");
    if (img.pair_image_gte_50 === false) {
      if (!isSet(img.sci)) missing.push("sci");
    }
  }

  if (missing.length > 0) return { complete: false, missing };
  return { complete: true };
}

export function classifySingleImage(img: ImageReviewItem): SingleImageCategory | undefined {
  const status = getImageRequiredStatus(img);
  if (!status.complete) return undefined;

  // Branch exactly follows the review logic.
  if (img.text_mode === true) {
    if (img.watermark === true) return "SCI";
    if (img.text_content_pair === true) return "SECOND_HAND";
    return "ORIGINAL";
  }

  // img.text_mode === false
  if (img.pair_image_gte_50 === true) return "SECOND_HAND";
  // pair_image_gte_50 === false
  if (img.sci === true) return "SCI";
  return "ORIGINAL";
}

export function normalizeDownstreamFields(img: ImageReviewItem): ImageReviewItem {
  // Keep state predictable: when upstream answer switches branch, downstream irrelevant answers are cleared.
  // This reduces reviewer confusion and keeps "incomplete" detection accurate.
  if (img.text_mode === true) {
    return {
      ...img,
      pair_image_gte_50: undefined,
      sci: undefined
    };
  }
  if (img.text_mode === false) {
    return {
      ...img,
      watermark: undefined,
      text_content_pair: undefined
    };
  }
  // text_mode is undefined: clear all downstream
  return {
    ...img,
    watermark: undefined,
    text_content_pair: undefined,
    pair_image_gte_50: undefined,
    sci: undefined
  };
}

export function aggregateImageCounts(images: Array<Pick<ImageReviewItem, "auto_category">>): {
  original_image: number;
  SCI_image: number;
  second_hand_image: number;
} {
  let original_image = 0;
  let SCI_image = 0;
  let second_hand_image = 0;
  for (const img of images) {
    if (img.auto_category === "ORIGINAL") original_image += 1;
    if (img.auto_category === "SCI") SCI_image += 1;
    if (img.auto_category === "SECOND_HAND") second_hand_image += 1;
  }
  return { original_image, SCI_image, second_hand_image };
}

