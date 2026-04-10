import clsx from "clsx";
import type { ManualBoolean } from "@/types/review";

type Props = {
  name: string;
  value: ManualBoolean;
  onChange: (v: ManualBoolean) => void;
  disabled?: boolean;
  required?: boolean;
};

export function YesNo(props: Props) {
  const { name, value, onChange, disabled } = props;
  const common = "h-4 w-4";
  return (
    <div className={clsx("flex items-center gap-4", disabled && "opacity-60")}>
      <label className="inline-flex items-center gap-2 text-[13px] text-slate-800">
        <input
          className={common}
          type="radio"
          name={name}
          checked={value === true}
          onChange={() => onChange(true)}
          disabled={disabled}
        />
        是
      </label>
      <label className="inline-flex items-center gap-2 text-[13px] text-slate-800">
        <input
          className={common}
          type="radio"
          name={name}
          checked={value === false}
          onChange={() => onChange(false)}
          disabled={disabled}
        />
        否
      </label>
      <button
        type="button"
        className="text-[12px] text-slate-500 underline underline-offset-2"
        onClick={() => onChange(undefined)}
        disabled={disabled}
      >
        清空
      </button>
    </div>
  );
}

