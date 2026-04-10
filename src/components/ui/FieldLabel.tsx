import type React from "react";
import { Badge } from "@/components/ui/Badge";

export function FieldLabel(props: { label: string; mode: "manual" | "auto"; right?: React.ReactNode }) {
  return (
    <div className="flex items-center justify-between gap-2">
      <div className="flex items-center gap-2">
        <div className="text-[12px] font-semibold text-slate-700">{props.label}</div>
        <Badge tone={props.mode === "manual" ? "blue" : "violet"}>{props.mode === "manual" ? "Manual" : "Auto"}</Badge>
      </div>
      {props.right ? <div className="text-[12px] text-slate-600">{props.right}</div> : null}
    </div>
  );
}

