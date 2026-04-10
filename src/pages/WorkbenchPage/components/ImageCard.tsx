import clsx from "clsx";
import type { ImageReviewItem, ManualBoolean } from "@/types/review";
import { Badge } from "@/components/ui/Badge";
import { getImageRequiredStatus } from "@/logic/singleImage";
import { countValueTypes, getTextEntryValueTypes } from "@/logic/textValue";
import { ChecklistYesNo } from "@/components/ui/ChecklistYesNo";

function categoryTone(cat: ImageReviewItem["auto_category"]) {
  if (cat === "SCI") return "red" as const;
  if (cat === "SECOND_HAND") return "amber" as const;
  if (cat === "ORIGINAL") return "green" as const;
  return "slate" as const;
}

function requiredBadge(img: ImageReviewItem) {
  const status = getImageRequiredStatus(img);
  if (status.complete) return <Badge tone="green">已完成</Badge>;
  return <Badge tone="red">未完成：{status.missing.length} 项</Badge>;
}

export function ImageCard(props: {
  image: ImageReviewItem;
  selected: boolean;
  onSelect: () => void;
  onUpdateField: (key: "text_mode" | "watermark" | "text_content_pair" | "pair_image_gte_50" | "sci", v: ManualBoolean) => void;
  onIncHighValue: () => void;
  onDecHighValue: () => void;
  onIncLowValue: () => void;
  onDecLowValue: () => void;
  onReset: () => void;
}) {
  const img = props.image;
  const status = getImageRequiredStatus(img);
  const perImageCounts = countValueTypes(getTextEntryValueTypes(img.new_text_entries));

  const showTextBranch = img.text_mode === true;
  const showImageBranch = img.text_mode === false;

  const showQ2 = showTextBranch; // watermark
  const showQ3 = showTextBranch && img.watermark === false; // text_content_pair

  const showQ4 = showImageBranch; // pair_image_gte_50
  const showQ5 = showImageBranch && img.pair_image_gte_50 === false; // sci

  const showTextValueArea = img.auto_category === "SCI" || img.auto_category === "SECOND_HAND";
  const noPair = !img.pair_image_url;

  return (
    <div
      className={clsx(
        "rounded-lg bg-white shadow-panel ring-1 p-2",
        props.selected ? "ring-blue-400" : "ring-slate-200"
      )}
      onClick={props.onSelect}
    >
      <div className="flex items-center justify-between gap-2">
        <div className="flex items-center gap-2">
          <Badge tone="slate">#{img.index}</Badge>
          <Badge tone={categoryTone(img.auto_category)}>{img.auto_category ?? "UNCLASSIFIED"}</Badge>
          {requiredBadge(img)}
        </div>
        <button
          type="button"
          className="h-7 rounded-md bg-slate-100 px-2 text-[12px] font-semibold text-slate-800 hover:bg-slate-200"
          onClick={(e) => {
            e.stopPropagation();
            props.onReset();
          }}
        >
          Reset
        </button>
      </div>

      <div className="mt-2 grid grid-cols-2 gap-2">
        <div className="overflow-hidden rounded-md ring-1 ring-slate-200 bg-white">
          <img src={img.label_image_url} alt={`label_${img.id}`} className="h-28 w-full object-cover" />
        </div>
        <div className="overflow-hidden rounded-md ring-1 ring-slate-200 bg-white">
          {img.pair_image_url ? (
            <img src={img.pair_image_url} alt={`pair_${img.id}`} className="h-28 w-full object-cover" />
          ) : (
            <div className="flex h-28 items-center justify-center text-[12px] text-slate-500">No pair</div>
          )}
        </div>
      </div>

      <div className="mt-2 text-[11px] text-slate-600 line-clamp-2 whitespace-pre-wrap">{img.ocr_text ?? ""}</div>

      <div className="mt-2 space-y-2">
        <div className="text-[13px] font-semibold text-slate-900">Text Mode</div>
        <ChecklistYesNo value={img.text_mode} onChange={(v) => props.onUpdateField("text_mode", v)} />

        {showQ2 ? (
          <div>
            <div className="text-[13px] font-semibold text-slate-900">Watermark / source mark</div>
            <ChecklistYesNo value={img.watermark} onChange={(v) => props.onUpdateField("watermark", v)} />
          </div>
        ) : null}

        {showQ3 ? (
          <div>
            <div className="text-[13px] font-semibold text-slate-900">Text content pair</div>
            <ChecklistYesNo value={img.text_content_pair} onChange={(v) => props.onUpdateField("text_content_pair", v)} />
          </div>
        ) : null}

        {showQ4 ? (
          <div>
            <div className="text-[13px] font-semibold text-slate-900">Similar image</div>
            <ChecklistYesNo
              value={img.pair_image_gte_50}
              onChange={(v) => props.onUpdateField("pair_image_gte_50", v)}
              disabled={noPair}
            />
            {noPair ? <div className="mt-1 text-[12px] text-slate-500">无 pair 图：该项不可选，系统将按 No 处理</div> : null}
          </div>
        ) : null}

        {showQ5 ? (
          <div>
            <div className="text-[13px] font-semibold text-slate-900">Suspected Copyright Image</div>
            <ChecklistYesNo value={img.sci} onChange={(v) => props.onUpdateField("sci", v)} />
          </div>
        ) : null}
      </div>

      {showTextValueArea ? (
        <div className="mt-2 rounded-md bg-amber-50 ring-1 ring-amber-200 p-2">
          <div className="grid grid-cols-2 gap-2">
            <div className="rounded-md bg-white/70 ring-1 ring-amber-200 p-2">
              <div className="text-[12px] font-semibold text-amber-950">High value</div>
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="h-8 w-10 rounded-md bg-white text-[14px] font-bold ring-1 ring-amber-200 hover:bg-amber-100 disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onDecHighValue();
                  }}
                  disabled={perImageCounts.high <= 0}
                >
                  -
                </button>
                <div className="text-[14px] font-semibold text-amber-950">{perImageCounts.high}</div>
                <button
                  type="button"
                  className="h-8 w-10 rounded-md bg-white text-[14px] font-bold ring-1 ring-amber-200 hover:bg-amber-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onIncHighValue();
                  }}
                >
                  +
                </button>
              </div>
            </div>

            <div className="rounded-md bg-white/70 ring-1 ring-amber-200 p-2">
              <div className="text-[12px] font-semibold text-amber-950">Low value</div>
              <div className="mt-2 flex items-center justify-between">
                <button
                  type="button"
                  className="h-8 w-10 rounded-md bg-white text-[14px] font-bold ring-1 ring-amber-200 hover:bg-amber-100 disabled:opacity-50"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onDecLowValue();
                  }}
                  disabled={perImageCounts.low <= 0}
                >
                  -
                </button>
                <div className="text-[14px] font-semibold text-amber-950">{perImageCounts.low}</div>
                <button
                  type="button"
                  className="h-8 w-10 rounded-md bg-white text-[14px] font-bold ring-1 ring-amber-200 hover:bg-amber-100"
                  onClick={(e) => {
                    e.stopPropagation();
                    props.onIncLowValue();
                  }}
                >
                  +
                </button>
              </div>
            </div>
          </div>

          <div className="mt-2 text-[11px] text-amber-900">none {perImageCounts.none}（系统仍会聚合）</div>
        </div>
      ) : null}
    </div>
  );
}

