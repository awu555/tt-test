export type ValueType = "high" | "low" | "none";

export type SingleImageCategory = "SCI" | "SECOND_HAND" | "ORIGINAL";
export type OverallTextResult = "high_value" | "low_value_or_above" | "no_value";
export type VisualResult = "normal" | "low_cost" | "high_cost" | "total_copied";
export type MaterialSourceResult = "first_hand_material" | "second_hand_material";
export type MaterialTCResult = "first_hand_TC" | "second_hand_TC";
export type AudioResult = "total_copied" | "maintain_visual_result";

export type TextEntry = {
  id: string;
  text_content: string;
  value_type: ValueType;
  is_manual_added: boolean;
};

export type ManualBoolean = boolean | undefined;

export type ImageReviewItem = {
  id: string;
  index: number;
  label_image_url: string;
  pair_image_url?: string;
  ocr_text?: string;
  pair_similarity?: number;

  // Manual judgments (only necessary questions)
  text_mode?: ManualBoolean;
  watermark?: ManualBoolean;
  text_content_pair?: ManualBoolean;
  pair_image_gte_50?: ManualBoolean;
  sci?: ManualBoolean;

  auto_category?: SingleImageCategory;
  new_text_entries: TextEntry[];
  collapsed?: boolean;
};

export type ReviewTask = {
  task_id: string;
  post_id: string;
  username: string;
  title?: string;
  caption?: string;
  caption_value_type?: ValueType;

  audio_asr?: string;
  has_audio_asr: boolean;
  audio_type?: string;
  audio_identical_to_pair_source?: ManualBoolean;

  content_first_appears_on_tiktok: boolean;
  content_fail_to_load: boolean;

  image_set: ImageReviewItem[];

  reviewer_note?: string;
  final_result_confirmed: boolean;
};

export type DerivedCounts = {
  original_image: number;
  SCI_image: number;
  second_hand_image: number;

  high_value_text: number;
  low_value_text: number;
  no_value_text: number;

  incomplete_images: number;
};

export type DerivedResults = {
  overall_text_result: OverallTextResult;
  visual_result: VisualResult;
  material_source_result: MaterialSourceResult;
  material_tc_result: MaterialTCResult;
  audio_result: AudioResult;
  final_result: VisualResult;
};

export type DerivedReviewState = {
  counts: DerivedCounts;
  results: DerivedResults;
  warnings: {
    audio_override_total_copied: boolean;
  };
};

// Future backend integration (input/output interfaces)
export type ReviewTaskInput = ReviewTask;

export type ReviewSubmissionPayload = {
  task_id: string;
  post_id: string;
  content_fail_to_load: boolean;
  image_results: Array<{
    image_id: string;
    auto_category?: SingleImageCategory;
    text_mode?: ManualBoolean;
    watermark?: ManualBoolean;
    text_content_pair?: ManualBoolean;
    pair_image_gte_50?: ManualBoolean;
    sci?: ManualBoolean;
    new_text_entries: TextEntry[];
  }>;
  caption_value_type?: ValueType;
  derived_counts: Omit<DerivedCounts, "incomplete_images">;
  derived_results: DerivedResults;
  reviewer_note?: string;
  final_result_confirmed: boolean;
};

