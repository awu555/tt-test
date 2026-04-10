import clsx from "clsx";
import type React from "react";

type BadgeTone = "slate" | "green" | "amber" | "red" | "blue" | "violet";

const toneClasses: Record<BadgeTone, string> = {
  slate: "bg-slate-100 text-slate-800 ring-slate-200",
  green: "bg-emerald-100 text-emerald-900 ring-emerald-200",
  amber: "bg-amber-100 text-amber-950 ring-amber-200",
  red: "bg-red-100 text-red-950 ring-red-200",
  blue: "bg-blue-100 text-blue-950 ring-blue-200",
  violet: "bg-violet-100 text-violet-950 ring-violet-200"
};

export function Badge(props: { tone?: BadgeTone; children: React.ReactNode; className?: string }) {
  const tone = props.tone ?? "slate";
  return (
    <span
      className={clsx(
        "inline-flex items-center rounded-full px-2 py-0.5 text-[12px] font-semibold ring-1 ring-inset",
        toneClasses[tone],
        props.className
      )}
    >
      {props.children}
    </span>
  );
}

