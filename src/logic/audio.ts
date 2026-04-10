import type { AudioResult, ReviewTask } from "@/types/review";

// TODO(policy-confirm): confirm exact highPossibilityUnoriginalAudioTypes list from policy.
export const highPossibilityUnoriginalAudioTypes = new Set<string>([
  "music",
  "sound",
  "song",
  "original_sound",
  "licensed_music",
  "voiceover"
]);

export function deriveAudioResult(task: Pick<ReviewTask, "has_audio_asr" | "audio_type" | "audio_identical_to_pair_source">): AudioResult {
  const audioType = task.audio_type ?? "";
  const identical = Boolean(task.audio_identical_to_pair_source);
  if (task.has_audio_asr && highPossibilityUnoriginalAudioTypes.has(audioType) && identical) {
    return "total_copied";
  }
  return "maintain_visual_result";
}

