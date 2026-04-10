import clsx from "clsx";
import type { ManualBoolean } from "@/types/review";

export function CompactYesNo(props: {
  name: string;
  value: ManualBoolean;
  onChange: (v: ManualBoolean) => void;
  disabled?: boolean;
}) {
  const { name, value, onChange, disabled } = props;
  const btn = (active: boolean) =>
    clsx(
      "h-7 rounded-md px-2 text-[12px] font-semibold ring-1",
      active ? "bg-blue-600 text-white ring-blue-600" : "bg-white text-slate-800 ring-slate-200 hover:bg-slate-50",
      disabled && "opacity-60 pointer-events-none"
    );
  return (
    <div className="inline-flex items-center gap-1">
      <button type="button" className={btn(value === true)} onClick={() => onChange(true)} disabled={disabled}>
        是
      </button>
      <button type="button" className={btn(value === false)} onClick={() => onChange(false)} disabled={disabled}>
        否
      </button>
      <button
        type="button"
        className={clsx(
          "h-7 rounded-md px-2 text-[12px] font-semibold ring-1",
          value === undefined ? "bg-slate-200 text-slate-700 ring-slate-200" : "bg-white text-slate-600 ring-slate-200 hover:bg-slate-50",
          disabled && "opacity-60 pointer-events-none"
        )}
        onClick={() => onChange(undefined)}
        disabled={disabled}
      >
        -
      </button>
    </div>
  );
}

