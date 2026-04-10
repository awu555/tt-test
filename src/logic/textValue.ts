import type { OverallTextResult, TextEntry, ValueType } from "@/types/review";

export function countValueTypes(valueTypes: ValueType[]): { high: number; low: number; none: number } {
  let high = 0;
  let low = 0;
  let none = 0;
  for (const v of valueTypes) {
    if (v === "high") high += 1;
    else if (v === "low") low += 1;
    else none += 1;
  }
  return { high, low, none };
}

export function deriveOverallTextResult(counts: { high: number; low: number }): OverallTextResult {
  if (counts.high >= 3) return "high_value";
  if (counts.high >= 1 || counts.low >= 1) return "low_value_or_above";
  return "no_value";
}

export function getTextEntryValueTypes(entries: TextEntry[]): ValueType[] {
  return entries.map((e) => e.value_type);
}

