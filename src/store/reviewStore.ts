import { create } from "zustand";
import type { ImageReviewItem, ManualBoolean, ReviewTask, ValueType } from "@/types/review";
import { deriveReviewState } from "@/logic/derive";
import { normalizeDownstreamFields } from "@/logic/singleImage";
import { mockReviewTask } from "@/mock/reviewTask";
import { makeId } from "@/utils/id";

type ImageFieldKey = "text_mode" | "watermark" | "text_content_pair" | "pair_image_gte_50" | "sci";

type ReviewStoreState = {
  task: ReviewTask;
  ui: {
    selected_image_id?: string;
    show_only_incomplete: boolean;
    expand_all: boolean;
  };
  derived: ReturnType<typeof deriveReviewState>["derived"];

  actions: {
    setContentFailToLoad(v: boolean): void;
    setCaptionValueType(v: ValueType): void;
    setAudioIdenticalToPairSource(v: ManualBoolean): void;
    setFinalResultConfirmed(v: boolean): void;
    setReviewerNote(v: string): void;

    selectImage(id: string): void;
    selectPrev(): void;
    selectNext(): void;
    toggleShowOnlyIncomplete(): void;
    expandAll(): void;
    collapseAll(): void;

    toggleImageCollapsed(id: string): void;
    resetImage(id: string): void;
    resetAll(): void;

    updateImageField(id: string, key: ImageFieldKey, v: ManualBoolean): void;

    addTextEntry(imageId: string): void;
    deleteTextEntry(imageId: string, entryId: string): void;
    updateTextEntry(imageId: string, entryId: string, patch: Partial<{ text_content: string; value_type: ValueType }>): void;
    incHighValueText(imageId: string): void;
    decHighValueText(imageId: string): void;
    incLowValueText(imageId: string): void;
    decLowValueText(imageId: string): void;
  };
};

function rederive(task: ReviewTask) {
  return deriveReviewState(task);
}

function resetJudgmentsFromMock(img: ImageReviewItem): ImageReviewItem {
  const fromMock = mockReviewTask.image_set.find((x) => x.id === img.id);
  if (!fromMock) {
    return {
      ...img,
      text_mode: undefined,
      watermark: undefined,
      text_content_pair: undefined,
      pair_image_gte_50: undefined,
      sci: undefined
    };
  }
  return {
    ...img,
    text_mode: fromMock.text_mode,
    watermark: fromMock.watermark,
    text_content_pair: fromMock.text_content_pair,
    pair_image_gte_50: fromMock.pair_image_gte_50,
    sci: fromMock.sci
  };
}

export const useReviewStore = create<ReviewStoreState>((set, get) => {
  const init = rederive(mockReviewTask);
  const firstId = init.patchedTask.image_set[0]?.id;

  return {
    task: init.patchedTask,
    derived: init.derived,
    ui: {
      selected_image_id: firstId,
      show_only_incomplete: false,
      expand_all: true
    },
    actions: {
      setContentFailToLoad(v) {
        set((s) => {
          const next = rederive({ ...s.task, content_fail_to_load: v });
          return { task: next.patchedTask, derived: next.derived };
        });
      },
      setCaptionValueType(v) {
        set((s) => {
          const next = rederive({ ...s.task, caption_value_type: v });
          return { task: next.patchedTask, derived: next.derived };
        });
      },
      setAudioIdenticalToPairSource(v) {
        set((s) => {
          const next = rederive({ ...s.task, audio_identical_to_pair_source: v });
          return { task: next.patchedTask, derived: next.derived };
        });
      },
      setFinalResultConfirmed(v) {
        set((s) => ({ task: { ...s.task, final_result_confirmed: v } }));
      },
      setReviewerNote(v) {
        set((s) => ({ task: { ...s.task, reviewer_note: v } }));
      },

      selectImage(id) {
        set((s) => ({ ui: { ...s.ui, selected_image_id: id } }));
      },
      selectPrev() {
        const s = get();
        const ids = s.task.image_set.map((x) => x.id);
        const cur = s.ui.selected_image_id;
        const idx = cur ? ids.indexOf(cur) : -1;
        const prev = idx > 0 ? ids[idx - 1] : ids[0];
        set({ ui: { ...s.ui, selected_image_id: prev } });
      },
      selectNext() {
        const s = get();
        const ids = s.task.image_set.map((x) => x.id);
        const cur = s.ui.selected_image_id;
        const idx = cur ? ids.indexOf(cur) : -1;
        const next = idx >= 0 && idx < ids.length - 1 ? ids[idx + 1] : ids[ids.length - 1];
        set({ ui: { ...s.ui, selected_image_id: next } });
      },
      toggleShowOnlyIncomplete() {
        set((s) => ({ ui: { ...s.ui, show_only_incomplete: !s.ui.show_only_incomplete } }));
      },
      expandAll() {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => ({ ...img, collapsed: false }))
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived, ui: { ...s.ui, expand_all: true } };
        });
      },
      collapseAll() {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => ({ ...img, collapsed: true }))
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived, ui: { ...s.ui, expand_all: false } };
        });
      },

      toggleImageCollapsed(id) {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => (img.id === id ? { ...img, collapsed: !img.collapsed } : img))
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived };
        });
      },
      resetImage(id) {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => (img.id === id ? resetJudgmentsFromMock(img) : img))
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived };
        });
      },
      resetAll() {
        const next = rederive(mockReviewTask);
        set({
          task: next.patchedTask,
          derived: next.derived,
          ui: { selected_image_id: next.patchedTask.image_set[0]?.id, show_only_incomplete: false, expand_all: true }
        });
      },

      updateImageField(id, key, v) {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => {
              if (img.id !== id) return img;
              const patched = normalizeDownstreamFields({ ...img, [key]: v } as ImageReviewItem);
              // Additional downstream clearing when watermark toggles to true.
              if (patched.text_mode === true && patched.watermark === true) {
                return { ...patched, text_content_pair: undefined };
              }
              if (patched.text_mode === false && patched.pair_image_gte_50 === true) {
                return { ...patched, sci: undefined };
              }
              // If no pair image, pair_gte_50 is not selectable. Force it to false to unlock Q5.
              if (patched.text_mode === false && !patched.pair_image_url) {
                return { ...patched, pair_image_gte_50: false };
              }
              return patched;
            })
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived };
        });
      },

      addTextEntry(imageId) {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => {
              if (img.id !== imageId) return img;
              return {
                ...img,
                new_text_entries: [
                  ...img.new_text_entries,
                  { id: makeId("t"), text_content: "", value_type: "none", is_manual_added: true }
                ]
              };
            })
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived };
        });
      },
      deleteTextEntry(imageId, entryId) {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => {
              if (img.id !== imageId) return img;
              return { ...img, new_text_entries: img.new_text_entries.filter((e) => e.id !== entryId) };
            })
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived };
        });
      },
      updateTextEntry(imageId, entryId, patch) {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => {
              if (img.id !== imageId) return img;
              return {
                ...img,
                new_text_entries: img.new_text_entries.map((e) => (e.id === entryId ? { ...e, ...patch } : e))
              };
            })
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived };
        });
      }
      ,
      incHighValueText(imageId) {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => {
              if (img.id !== imageId) return img;
              return {
                ...img,
                new_text_entries: [
                  ...img.new_text_entries,
                  { id: makeId("hv"), text_content: "", value_type: "high", is_manual_added: true }
                ]
              };
            })
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived };
        });
      },
      decHighValueText(imageId) {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => {
              if (img.id !== imageId) return img;
              const idx = [...img.new_text_entries].reverse().findIndex((e) => e.value_type === "high");
              if (idx < 0) return img;
              const removeAt = img.new_text_entries.length - 1 - idx;
              return {
                ...img,
                new_text_entries: img.new_text_entries.filter((_, i) => i !== removeAt)
              };
            })
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived };
        });
      },
      incLowValueText(imageId) {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => {
              if (img.id !== imageId) return img;
              return {
                ...img,
                new_text_entries: [
                  ...img.new_text_entries,
                  { id: makeId("lv"), text_content: "", value_type: "low", is_manual_added: true }
                ]
              };
            })
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived };
        });
      },
      decLowValueText(imageId) {
        set((s) => {
          const nextTask = {
            ...s.task,
            image_set: s.task.image_set.map((img) => {
              if (img.id !== imageId) return img;
              const idx = [...img.new_text_entries].reverse().findIndex((e) => e.value_type === "low");
              if (idx < 0) return img;
              const removeAt = img.new_text_entries.length - 1 - idx;
              return {
                ...img,
                new_text_entries: img.new_text_entries.filter((_, i) => i !== removeAt)
              };
            })
          };
          const next = rederive(nextTask);
          return { task: next.patchedTask, derived: next.derived };
        });
      }
    }
  };
});

