import type { ReviewTask } from "@/types/review";

const PLACEHOLDER_IMG =
  "data:image/svg+xml;utf8," +
  encodeURIComponent(`
<svg xmlns="http://www.w3.org/2000/svg" width="640" height="360">
  <defs>
    <linearGradient id="g" x1="0" x2="1">
      <stop offset="0" stop-color="#e2e8f0"/>
      <stop offset="1" stop-color="#f8fafc"/>
    </linearGradient>
  </defs>
  <rect width="100%" height="100%" fill="url(#g)"/>
  <rect x="20" y="20" width="600" height="320" rx="16" fill="#ffffff" stroke="#cbd5e1"/>
  <text x="40" y="75" font-family="Inter, Arial" font-size="20" fill="#0f172a">Mock Image</text>
  <text x="40" y="110" font-family="Inter, Arial" font-size="14" fill="#334155">Pair/Label placeholder</text>
  <text x="40" y="150" font-family="Inter, Arial" font-size="14" fill="#64748b">Use judgments to drive auto-category</text>
</svg>
`);

export const mockReviewTask: ReviewTask = {
  task_id: "task_20260408_0001",
  post_id: "post_88990011",
  username: "review_demo_user",
  title: "Photomode Unoriginal 5.0 - Demo Set",
  caption: "示例 caption：这是一段说明文字（用于文本价值聚合）。",
  caption_value_type: "low",

  audio_asr: "hello world this is a demo asr",
  has_audio_asr: true,
  audio_type: "music",
  audio_identical_to_pair_source: false,

  content_first_appears_on_tiktok: false,
  content_fail_to_load: false,

  image_set: [
    {
      id: "img_001",
      index: 1,
      label_image_url: PLACEHOLDER_IMG,
      pair_image_url: PLACEHOLDER_IMG,
      ocr_text: "原创文本：今天的心情很好",
      pair_similarity: 12,

      // Example that can become ORIGINAL (text_mode yes, watermark no, text_content_pair no)
      text_mode: true,
      watermark: false,
      text_content_pair: false,

      new_text_entries: [],
      collapsed: false
    },
    {
      id: "img_002",
      index: 2,
      label_image_url: PLACEHOLDER_IMG,
      pair_image_url: PLACEHOLDER_IMG,
      ocr_text: "水印：@some_source",
      pair_similarity: 78,

      // Example that becomes SCI (text_mode yes, watermark yes)
      text_mode: true,
      watermark: true,

      new_text_entries: [],
      collapsed: false
    },
    {
      id: "img_003",
      index: 3,
      label_image_url: PLACEHOLDER_IMG,
      pair_image_url: PLACEHOLDER_IMG,
      ocr_text: "无文字，疑似素材拼接",
      pair_similarity: 61,

      // Example that becomes SECOND_HAND (text_mode no, pair_image_gte_50 yes)
      text_mode: false,
      pair_image_gte_50: true,

      new_text_entries: [
        {
          id: "t_003_1",
          text_content: "示例高价值文本（可编辑）",
          value_type: "high",
          is_manual_added: true
        }
      ],
      collapsed: false
    }
  ],

  reviewer_note: "",
  final_result_confirmed: false
};

