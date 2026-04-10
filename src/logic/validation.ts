import type { ReviewTask } from "@/types/review";
import { getImageRequiredStatus } from "@/logic/singleImage";

export type SubmitEligibility =
  | { ok: true }
  | { ok: false; reasons: Array<"incomplete_images" | "final_result_not_confirmed" | "abandon_mode"> };

export function canSubmit(task: ReviewTask): SubmitEligibility {
  const reasons: SubmitEligibility extends { ok: false } ? never : Array<"incomplete_images" | "final_result_not_confirmed" | "abandon_mode"> =
    [];

  if (task.content_fail_to_load) reasons.push("abandon_mode");

  const incomplete = task.image_set.some((img) => !getImageRequiredStatus(img).complete);
  if (incomplete) reasons.push("incomplete_images");

  if (!task.final_result_confirmed) reasons.push("final_result_not_confirmed");

  if (reasons.length > 0) return { ok: false, reasons };
  return { ok: true };
}

