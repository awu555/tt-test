import clsx from "clsx";
import type { ManualBoolean } from "@/types/review";

function Row(props: {
  label: string;
  checked: boolean;
  onClick: () => void;
  disabled?: boolean;
}) {
  return (
    <button
      type="button"
      className={clsx(
        "w-full rounded-md border px-3 py-2 text-left text-[13px]",
        props.checked ? "border-blue-400 bg-blue-50" : "border-slate-200 bg-white hover:bg-slate-50",
        props.disabled && "opacity-50 pointer-events-none"
      )}
      onClick={props.onClick}
      disabled={props.disabled}
    >
      <span className="inline-flex items-center gap-3">
        <span
          className={clsx(
            "inline-flex h-4 w-4 items-center justify-center rounded-sm border",
            props.checked ? "border-blue-500 bg-blue-600" : "border-slate-300 bg-white"
          )}
          aria-hidden
        />
        <span className="text-slate-900">{props.label}</span>
      </span>
    </button>
  );
}

export function ChecklistYesNo(props: {
  value: ManualBoolean;
  onChange: (v: ManualBoolean) => void;
  disabled?: boolean;
}) {
  const v = props.value;
  return (
    <div className="space-y-2">
      <Row label="Yes" checked={v === true} onClick={() => props.onChange(true)} disabled={props.disabled} />
      <Row label="No" checked={v === false} onClick={() => props.onChange(false)} disabled={props.disabled} />
    </div>
  );
}

