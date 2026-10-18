import {
  species,
  defaults,
  type Parameters,
  type SpeciesId,
} from "../catalog.ts";
import { MODEL_REVISION } from "../content/taxonomy.ts";
export interface Settings {
  suite: SpeciesId;
  mode: number;
  seed: number;
  parameters: Parameters;
  revision: string;
}
export interface Sample {
  step: number;
  value: number;
}
export interface RunRecord {
  id: string;
  settings: Settings;
  metric: string;
  unit: string;
  label: string;
  samples: Sample[];
  note: string;
  events: { step: number; description: string }[];
}
export const STORAGE_KEY = "tree-of-life:notebook:v2";
export function validSettings(raw: unknown): raw is Settings {
  if (!raw || typeof raw !== "object") return false;
  const r = raw as Settings,
    s = species.find((s) => s.id === r.suite);
  return (
    !!s &&
    r.revision === MODEL_REVISION &&
    Number.isInteger(r.mode) &&
    r.mode >= 0 &&
    r.mode < s.modes.length &&
    Number.isInteger(r.seed) &&
    r.seed >= 1 &&
    r.seed <= 999999 &&
    !!r.parameters &&
    s.controls.every(
      (c) =>
        Number.isFinite(r.parameters[c.key]) &&
        r.parameters[c.key] >= c.min &&
        r.parameters[c.key] <= c.max,
    )
  );
}
export function readRecords(value: string | null): RunRecord[] {
  try {
    const parsed = JSON.parse(value ?? "[]");
    if (!Array.isArray(parsed)) return [];
    return parsed
      .filter(
        (r) =>
          r &&
          typeof r.id === "string" &&
          storedSettings(r.settings) &&
          typeof r.metric === "string" &&
          typeof r.unit === "string" &&
          typeof r.label === "string" &&
          typeof r.note === "string" &&
          Array.isArray(r.samples) &&
          r.samples.length > 0 &&
          r.samples.length <= 1201 &&
          r.samples.every(
            (s: Sample, i: number, samples: Sample[]) =>
              !!s &&
              Number.isFinite(s.value) &&
              Number.isInteger(s.step) &&
              s.step >= 0 &&
              (i === 0 || s.step > samples[i - 1].step),
          ) &&
          Array.isArray(r.events) &&
          r.events.length <= 500 &&
          r.events.every(
            (e: { step: number; description: string }) =>
              !!e &&
              Number.isInteger(e.step) &&
              e.step >= 0 &&
              typeof e.description === "string",
          ),
      )
      .slice(-12);
  } catch {
    return [];
  }
}
/** Preserve the previous release's measurements verbatim. They can be exported
 * or used as starting settings, but revision-aware comparisons reject mixing. */
function storedSettings(raw: unknown): boolean {
  if (validSettings(raw)) return true;
  if (!raw || typeof raw !== "object") return false;
  const r = raw as Settings,
    s = species.find((s) => s.id === r.suite);
  const oldCount: Partial<Record<SpeciesId, number>> = {
    vines: 2,
    leaves: 3,
    sheep: 2,
    termites: 2,
  };
  return (
    !!s &&
    r.revision === "atlas-2" &&
    Number.isInteger(r.mode) &&
    r.mode >= 0 &&
    r.mode < (oldCount[s.id] ?? s.modes.length) &&
    Number.isInteger(r.seed) &&
    r.seed >= 1 &&
    r.seed <= 999999 &&
    !!r.parameters &&
    s.controls
      .filter((c) => !c.modes || c.modes.includes(r.mode))
      .every(
        (c) =>
          Number.isFinite(r.parameters[c.key]) &&
          r.parameters[c.key] >= c.min &&
          r.parameters[c.key] <= c.max,
      )
  );
}
export function normalizedSettings(
  suite: SpeciesId,
  mode: number,
  seed: number,
  parameters: Parameters,
): Settings {
  return {
    suite,
    mode,
    seed,
    parameters: {
      ...defaults(species.find((s) => s.id === suite)!),
      ...parameters,
    },
    revision: MODEL_REVISION,
  };
}
export function csv(record: RunRecord) {
  const quote = (s: string) => '"' + s.replaceAll('"', '""') + '"';
  return [
    "revision,suite,mode,seed,metric,unit,step,value",
    ...record.samples.map((s) =>
      [
        record.settings.revision,
        record.settings.suite,
        record.settings.mode,
        record.settings.seed,
        quote(record.metric),
        quote(record.unit),
        s.step,
        s.value,
      ].join(","),
    ),
  ].join("\r\n");
}
