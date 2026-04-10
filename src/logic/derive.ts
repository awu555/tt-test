import type {
  DerivedReviewState,
  ImageReviewItem,
  MaterialSourceResult,
  MaterialTCResult,
  ReviewTask,
  VisualResult
} from "@/types/review";
import { deriveAudioResult } from "@/logic/audio";
import { aggregateImageCounts, classifySingleImage, getImageRequiredStatus } from "@/logic/singleImage";
import { countValueTypes, deriveOverallTextResult, getTextEntryValueTypes } from "@/logic/textValue";

function safeRatio(n: number, d: number): number {
  if (d <= 0) return 0;
  return n / d;
}

export function withAutoCategories(images: ImageReviewItem[]): ImageReviewItem[] {
  return images.map((img) => ({
    ...img,
    auto_category: classifySingleImage(img)
  }));
}

export function computeVisualResult(args: {
  total_images: number;
  original_image: number;
  overall_text_result: ReturnType<typeof deriveOverallTextResult>;
  high_value_text: number;
}): VisualResult {
  const total = args.total_images;
  const original = args.original_image;
  const original_ratio = safeRatio(original, total);

  if (total === 0) {
    // No images: keep conservative "normal" unless policy says otherwise.
    // TODO(policy-confirm): should empty image_set be blocked earlier?
    return "normal";
  }

  if (original === 0 && args.overall_text_result === "no_value") return "total_copied";

  if (original_ratio >= 0.5 || args.high_value_text >= 3) return "high_cost";

  if (original >= 1 || args.overall_text_result === "low_value_or_above") return "low_cost";

  return "normal";
}

export function computeMaterialResults(args: {
  total_images: number;
  second_hand_image: number;
  content_first_appears_on_tiktok: boolean;
}): { material_source_result: MaterialSourceResult; material_tc_result: MaterialTCResult } {
  const second_hand_ratio = safeRatio(args.second_hand_image, args.total_images);

  const material_source_result: MaterialSourceResult = args.content_first_appears_on_tiktok
    ? "first_hand_material"
    : "second_hand_material";

  const material_tc_result: MaterialTCResult = second_hand_ratio >= 1 / 3 ? "second_hand_TC" : "first_hand_TC";

  return { material_source_result, material_tc_result };
}

export function deriveReviewState(task: ReviewTask): { patchedTask: ReviewTask; derived: DerivedReviewState } {
  // Ensure each image carries latest auto_category.
  let patchedImages = withAutoCategories(task.image_set);

  // Auto-create empty entry when image becomes SCI/SECOND_HAND and has no entries.
  patchedImages = patchedImages.map((img) => {
    const cat = img.auto_category;
    if ((cat === "SCI" || cat === "SECOND_HAND") && img.new_text_entries.length === 0) {
      return {
        ...img,
        new_text_entries: [
          {
            id: `auto_${img.id}`,
            text_content: "",
            value_type: "none",
            is_manual_added: false
          }
        ]
      };
    }
    return img;
  });

  const incomplete_images = patchedImages.reduce((acc, img) => (getImageRequiredStatus(img).complete ? acc : acc + 1), 0);

  const countsByCat = aggregateImageCounts(patchedImages);

  const captionValueType = task.caption_value_type ?? "none";
  const allValueTypes = [captionValueType, ...patchedImages.flatMap((img) => getTextEntryValueTypes(img.new_text_entries))];
  const textCounts = countValueTypes(allValueTypes);

  const overall_text_result = deriveOverallTextResult({ high: textCounts.high, low: textCounts.low });

  const visual_result = computeVisualResult({
    total_images: patchedImages.length,
    original_image: countsByCat.original_image,
    overall_text_result,
    high_value_text: textCounts.high
  });

  const { material_source_result, material_tc_result } = computeMaterialResults({
    total_images: patchedImages.length,
    second_hand_image: countsByCat.second_hand_image,
    content_first_appears_on_tiktok: task.content_first_appears_on_tiktok
  });

  const audio_result = deriveAudioResult(task);

  const final_result: VisualResult = audio_result === "total_copied" ? "total_copied" : visual_result;

  const derived: DerivedReviewState = {
    counts: {
      ...countsByCat,
      high_value_text: textCounts.high,
      low_value_text: textCounts.low,
      no_value_text: textCounts.none,
      incomplete_images
    },
    results: {
      overall_text_result,
      visual_result,
      material_source_result,
      material_tc_result,
      audio_result,
      final_result
    },
    warnings: {
      audio_override_total_copied: audio_result === "total_copied"
    }
  };

  const patchedTask: ReviewTask = {
    ...task,
    caption_value_type: captionValueType,
    image_set: patchedImages
  };

  return { patchedTask, derived };
}

