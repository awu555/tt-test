import type { DerivedReviewState, ReviewTask } from "@/types/review";
import { Badge } from "@/components/ui/Badge";
import { FieldLabel } from "@/components/ui/FieldLabel";
import { canSubmit } from "@/logic/validation";

function resultTone(finalResult: DerivedReviewState["results"]["final_result"]) {
  if (finalResult === "total_copied") return "red" as const;
  if (finalResult === "high_cost") return "violet" as const;
  if (finalResult === "low_cost") return "amber" as const;
  return "green" as const;
}

export function RightPanel(props: {
  task: ReviewTask;
  derived: DerivedReviewState;
  onSetConfirmed: (v: boolean) => void;
  onSetReviewerNote: (v: string) => void;
  onResetSelected: () => void;
  onResetAll: () => void;
  onSubmit: () => void;
}) {
  const eligibility = canSubmit(props.task);
  const abandon = props.task.content_fail_to_load;

  return (
    <div className="sticky top-4 space-y-3">
      <div className="rounded-lg bg-white shadow-panel ring-1 ring-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-semibold text-slate-900">结果面板</div>
          <Badge tone="violet">Auto</Badge>
        </div>

        {abandon ? (
          <div className="mt-3 rounded-md bg-red-50 ring-1 ring-red-200 p-3">
            <div className="text-[13px] font-semibold text-red-900">Abandon 模式（content_fail_to_load = true）</div>
            <div className="mt-1 text-[12px] text-red-800">
              结果仍可展示，但提交会被禁用，payload 会明确携带 abandon 状态。
            </div>
          </div>
        ) : null}

        {props.derived.warnings.audio_override_total_copied ? (
          <div className="mt-3 rounded-md bg-amber-50 ring-1 ring-amber-200 p-3">
            <div className="text-[13px] font-semibold text-amber-900">音频覆盖警告</div>
            <div className="mt-1 text-[12px] text-amber-800">audio_result 触发 total_copied，将覆盖 final_result。</div>
          </div>
        ) : null}

        <div className="mt-3 grid grid-cols-2 gap-2">
          <div className="rounded-md bg-slate-50 ring-1 ring-slate-200 p-2">
            <div className="text-[12px] font-semibold text-slate-700">Image counts</div>
            <div className="mt-2 space-y-1 text-[12px] text-slate-800">
              <div className="flex justify-between"><span>ORIGINAL</span><span>{props.derived.counts.original_image}</span></div>
              <div className="flex justify-between"><span>SCI</span><span>{props.derived.counts.SCI_image}</span></div>
              <div className="flex justify-between"><span>SECOND_HAND</span><span>{props.derived.counts.second_hand_image}</span></div>
              <div className="mt-1 flex justify-between text-red-700"><span>incomplete</span><span>{props.derived.counts.incomplete_images}</span></div>
            </div>
          </div>
          <div className="rounded-md bg-slate-50 ring-1 ring-slate-200 p-2">
            <div className="text-[12px] font-semibold text-slate-700">Text counts</div>
            <div className="mt-2 space-y-1 text-[12px] text-slate-800">
              <div className="flex justify-between"><span>high</span><span>{props.derived.counts.high_value_text}</span></div>
              <div className="flex justify-between"><span>low</span><span>{props.derived.counts.low_value_text}</span></div>
              <div className="flex justify-between"><span>none</span><span>{props.derived.counts.no_value_text}</span></div>
            </div>
          </div>
        </div>

        <div className="mt-3 rounded-md ring-1 ring-slate-200 p-3">
          <div className="flex items-center justify-between">
            <FieldLabel label="final_result" mode="auto" />
            <Badge tone={resultTone(props.derived.results.final_result)} className="text-[12px] px-2 py-1">
              {props.derived.results.final_result}
            </Badge>
          </div>
          <details className="mt-2">
            <summary className="cursor-pointer text-[12px] text-slate-600">展开查看派生字段</summary>
            <div className="mt-2 grid grid-cols-1 gap-2 text-[12px] text-slate-800">
              <div className="flex justify-between"><span>overall_text_result</span><span>{props.derived.results.overall_text_result}</span></div>
              <div className="flex justify-between"><span>visual_result</span><span>{props.derived.results.visual_result}</span></div>
              <div className="flex justify-between"><span>material_source_result</span><span>{props.derived.results.material_source_result}</span></div>
              <div className="flex justify-between"><span>material_tc_result</span><span>{props.derived.results.material_tc_result}</span></div>
              <div className="flex justify-between"><span>audio_result</span><span>{props.derived.results.audio_result}</span></div>
            </div>
          </details>
        </div>
      </div>

      <div className="rounded-lg bg-white shadow-panel ring-1 ring-slate-200 p-4">
        <div className="flex items-center justify-between">
          <div className="text-[13px] font-semibold text-slate-900">Review Confirmation</div>
          <Badge tone="blue">Manual</Badge>
        </div>

        <div className="mt-3 space-y-3">
          <label className="flex items-center gap-2 text-[13px] text-slate-800">
            <input
              type="checkbox"
              className="h-4 w-4 rounded"
              checked={props.task.final_result_confirmed}
              onChange={(e) => props.onSetConfirmed(e.target.checked)}
            />
            final_result_confirmed
          </label>

          <div>
            <div className="text-[12px] font-semibold text-slate-700">reviewer_note</div>
            <textarea
              className="mt-2 w-full rounded-md text-[13px]"
              rows={4}
              value={props.task.reviewer_note ?? ""}
              onChange={(e) => props.onSetReviewerNote(e.target.value)}
              placeholder="可选：记录异常、疑点、或补充说明"
            />
          </div>

          {eligibility.ok ? null : (
            <div className="rounded-md bg-red-50 ring-1 ring-red-200 p-2 text-[12px] text-red-800">
              Submit disabled：{eligibility.reasons.join(", ")}
            </div>
          )}

          <div className="grid grid-cols-2 gap-2">
            <button
              type="button"
              className="h-10 rounded-md bg-blue-600 text-[13px] font-semibold text-white hover:bg-blue-700 disabled:bg-slate-300"
              onClick={props.onSubmit}
              disabled={!eligibility.ok}
            >
              Submit
            </button>
            <button
              type="button"
              className="h-10 rounded-md bg-slate-100 text-[13px] font-semibold text-slate-800 hover:bg-slate-200"
              onClick={props.onResetSelected}
            >
              Reset 当前图
            </button>
          </div>
          <button
            type="button"
            className="h-10 w-full rounded-md bg-slate-100 text-[13px] font-semibold text-slate-800 hover:bg-slate-200"
            onClick={props.onResetAll}
          >
            Reset All
          </button>
        </div>
      </div>
    </div>
  );
}

