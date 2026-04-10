import { useMemo, useState } from "react";
import { TopInfoPanel } from "@/pages/WorkbenchPage/components/TopInfoPanel";
import { RightPanel } from "@/pages/WorkbenchPage/components/RightPanel";
import { ImageCard } from "@/pages/WorkbenchPage/components/ImageCard";
import { JsonPreview } from "@/pages/WorkbenchPage/components/JsonPreview";
import { useReviewStore } from "@/store/reviewStore";
import { buildSubmissionPayload } from "@/logic/payload";
import { canSubmit } from "@/logic/validation";
import { getImageRequiredStatus } from "@/logic/singleImage";
import { Badge } from "@/components/ui/Badge";

export function WorkbenchPage() {
  const { task, derived, ui, actions } = useReviewStore();
  const [lastSubmit, setLastSubmit] = useState<unknown>(null);

  const visibleImages = useMemo(() => {
    if (!ui.show_only_incomplete) return task.image_set;
    return task.image_set.filter((img) => !getImageRequiredStatus(img).complete);
  }, [task.image_set, ui.show_only_incomplete]);
  const progressText = `${task.image_set.length - derived.counts.incomplete_images} / ${task.image_set.length}`;

  const payload = useMemo(() => buildSubmissionPayload(task, derived), [task, derived]);

  const onSubmit = () => {
    const eligibility = canSubmit(task);
    if (!eligibility.ok) return;
    // Prototype: no backend. Persist last payload locally for reviewer confidence.
    setLastSubmit(payload);
  };

  return (
    <div className="min-h-screen">
      <div className="mx-auto max-w-[1480px] px-4 py-4 space-y-4">
        <TopInfoPanel
          task={task}
          progressText={progressText}
          onSetCaptionValueType={actions.setCaptionValueType}
          onSetAudioIdentical={actions.setAudioIdenticalToPairSource}
          onToggleContentFailToLoad={actions.setContentFailToLoad}
        />

        <div className="grid grid-cols-1 gap-4 lg:grid-cols-[1fr_360px]">
          <div className="space-y-3">
            <div className="rounded-lg bg-white shadow-panel ring-1 ring-slate-200 p-3">
              <div className="flex flex-wrap items-center justify-between gap-2">
                <div className="flex items-center gap-2">
                  <Badge tone="slate">共 {task.image_set.length} 图</Badge>
                  <Badge tone="slate">未完成 {derived.counts.incomplete_images}</Badge>
                </div>
                <label className="flex items-center gap-2 text-[13px] text-slate-800">
                  <input
                    type="checkbox"
                    className="h-4 w-4 rounded"
                    checked={ui.show_only_incomplete}
                    onChange={() => actions.toggleShowOnlyIncomplete()}
                  />
                  仅看未完成
                </label>
              </div>
            </div>

            <div className="grid grid-cols-1 gap-3 md:grid-cols-2 xl:grid-cols-3">
              {visibleImages.map((img) => (
                <ImageCard
                  key={img.id}
                  image={img}
                  selected={false}
                  onSelect={() => actions.selectImage(img.id)}
                  onUpdateField={(key, v) => actions.updateImageField(img.id, key, v)}
                  onIncHighValue={() => actions.incHighValueText(img.id)}
                  onDecHighValue={() => actions.decHighValueText(img.id)}
                  onIncLowValue={() => actions.incLowValueText(img.id)}
                  onDecLowValue={() => actions.decLowValueText(img.id)}
                  onReset={() => actions.resetImage(img.id)}
                />
              ))}
            </div>

            <JsonPreview title="Final submission payload（预览）" value={payload} />
            {lastSubmit ? <JsonPreview title="Last submit snapshot（本地）" value={lastSubmit} /> : null}
          </div>

          <RightPanel
            task={task}
            derived={derived}
            onSetConfirmed={actions.setFinalResultConfirmed}
            onSetReviewerNote={actions.setReviewerNote}
            onResetSelected={() => selectedImageId && actions.resetImage(selectedImageId)}
            onResetAll={actions.resetAll}
            onSubmit={onSubmit}
          />
        </div>
      </div>
    </div>
  );
}

