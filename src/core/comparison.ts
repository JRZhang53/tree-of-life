import { byId } from "../catalog.ts";
import type { RunRecord, Settings } from "./notebook.ts";

export const formatMeasurement = (n: number) =>
  Number(n.toPrecision(4)).toString();

export function compatibleRuns(a: RunRecord, b: RunRecord) {
  return (
    a.settings.suite === b.settings.suite &&
    a.settings.revision === b.settings.revision &&
    a.metric === b.metric &&
    a.unit === b.unit
  );
}

/** Compare recorded observations at an identical step. Never interpolate. */
export function compareRuns(current: RunRecord, saved: RunRecord) {
  if (!compatibleRuns(current, saved)) return null;
  let i = current.samples.length - 1,
    j = saved.samples.length - 1;
  while (i >= 0 && j >= 0) {
    const a = current.samples[i],
      b = saved.samples[j];
    if (a.step === b.step)
      return {
        step: a.step,
        current: a.value,
        saved: b.value,
        difference: a.value - b.value,
      };
    if (a.step > b.step) i--;
    else j--;
  }
  return null;
}

export function settingDifferences(current: Settings, saved: Settings) {
  if (current.suite !== saved.suite) return [];
  const suite = byId(current.suite);
  const rows: { label: string; current: string; saved: string }[] = [];
  if (current.mode !== saved.mode)
    rows.push({
      label: "Model",
      current: suite.modes[current.mode],
      saved: suite.modes[saved.mode],
    });
  if (current.seed !== saved.seed)
    rows.push({
      label:
        current.suite === "leaves" ? "Seed (unused for leaves)" : "Random seed",
      current: String(current.seed),
      saved: String(saved.seed),
    });
  for (const c of suite.controls) {
    // Ignore binary rounding introduced when URL settings snap to slider steps.
    const currentValue = Number(
      current.parameters[c.key].toPrecision(12),
    ).toString();
    const savedValue = Number(
      saved.parameters[c.key].toPrecision(12),
    ).toString();
    if (currentValue === savedValue) continue;
    rows.push({
      label: c.label,
      current: currentValue,
      saved: savedValue,
    });
  }
  return rows;
}
