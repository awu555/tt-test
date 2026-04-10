import type { DerivedReviewState, ReviewSubmissionPayload, ReviewTask } from "@/types/review";

export function buildSubmissionPayload(task: ReviewTask, derived: DerivedReviewState): ReviewSubmissionPayload {
  return {
    task_id: task.task_id,
    post_id: task.post_id,
    content_fail_to_load: task.content_fail_to_load,
    image_results: task.image_set.map((img) => ({
      image_id: img.id,
      auto_category: img.auto_category,
      text_mode: img.text_mode,
      watermark: img.watermark,
      text_content_pair: img.text_content_pair,
      pair_image_gte_50: img.pair_image_gte_50,
      sci: img.sci,
      new_text_entries: img.new_text_entries
    })),
    caption_value_type: task.caption_value_type,
    derived_counts: {
      original_image: derived.counts.original_image,
      SCI_image: derived.counts.SCI_image,
      second_hand_image: derived.counts.second_hand_image,
      high_value_text: derived.counts.high_value_text,
      low_value_text: derived.counts.low_value_text,
      no_value_text: derived.counts.no_value_text
    },
    derived_results: derived.results,
    reviewer_note: task.reviewer_note,
    final_result_confirmed: task.final_result_confirmed
  };
}

