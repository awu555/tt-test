import type { ReviewTask, ValueType } from "@/types/review";
import { Badge } from "@/components/ui/Badge";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { YesNo } from "@/components/ui/YesNo";

export function TopInfoPanel(props: {
  task: ReviewTask;
  progressText: string;
  onSetCaptionValueType: (v: ValueType) => void;
  onSetAudioIdentical: (v: boolean | undefined) => void;
  onToggleContentFailToLoad: (v: boolean) => void;
}) {
  const t = props.task;
  return (
    <div className="rounded-lg bg-white shadow-panel ring-1 ring-slate-200 p-4">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap items-center gap-2 min-w-0">
          <div className="text-[14px] font-semibold text-slate-900">Photomode Unoriginal 5.0</div>
          <Badge tone="slate">task_id: {t.task_id}</Badge>
          <Badge tone="slate">post_id: {t.post_id}</Badge>
          <Badge tone="slate">@{t.username}</Badge>
          <Badge tone="blue">进度 {props.progressText}</Badge>
          <Badge tone="slate">images: {t.image_set.length}</Badge>
        </div>
        <label className="flex items-center gap-2 text-[13px] text-slate-800">
          <input
            type="checkbox"
            className="h-4 w-4 rounded"
            checked={t.content_fail_to_load}
            onChange={(e) => props.onToggleContentFailToLoad(e.target.checked)}
          />
          <span className="font-semibold">content_fail_to_load</span>
          <Badge tone="blue">Manual</Badge>
        </label>
      </div>

      <div className="mt-3 grid grid-cols-1 gap-3 md:grid-cols-3">
        <div className="rounded-md bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="text-[12px] font-semibold text-slate-700">Item Title</div>
          <div className="mt-1 text-[13px] text-slate-900 break-words">{t.title ?? "-"}</div>
        </div>

        <div className="rounded-md bg-slate-50 ring-1 ring-slate-200 p-3">
          <FieldLabel label="Caption value_type" mode="manual" />
          <div className="mt-2 flex items-center gap-2">
            <select
              className="h-9 w-40 rounded-md"
              value={t.caption_value_type ?? "none"}
              onChange={(e) => props.onSetCaptionValueType(e.target.value as ValueType)}
            >
              <option value="high">high</option>
              <option value="low">low</option>
              <option value="none">none</option>
            </select>
            <div className="text-[12px] text-slate-600">计入全局</div>
          </div>
          <div className="mt-2 text-[13px] text-slate-900 whitespace-pre-wrap break-words">{t.caption ?? "-"}</div>
          <div className="mt-2 text-[12px] text-slate-500">占位：Text unoriginality search（后续接 API）</div>
        </div>

        <div className="rounded-md bg-slate-50 ring-1 ring-slate-200 p-3">
          <div className="flex items-center justify-between">
            <div className="text-[12px] font-semibold text-slate-700">Audio</div>
            <Badge tone="slate">{t.has_audio_asr ? "has_asr" : "no_asr"}</Badge>
          </div>
          <div className="mt-1 text-[13px] text-slate-900 whitespace-pre-wrap break-words">{t.audio_asr ?? "-"}</div>
          <div className="mt-2 text-[12px] text-slate-700">audio_type: {t.audio_type ?? "-"}</div>
          <div className="mt-3">
            <FieldLabel label="audio_identical_to_pair_source" mode="manual" />
            <div className="mt-2">
              <YesNo
                name="audio_identical"
                value={t.audio_identical_to_pair_source}
                onChange={props.onSetAudioIdentical}
                disabled={!t.has_audio_asr}
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

