import { species } from "../catalog.ts";
import type { Simulation } from "../models.ts";
import { observe } from "../core/observables.ts";
import {
  csv,
  readRecords,
  STORAGE_KEY,
  type Settings,
  type RunRecord,
} from "../core/notebook.ts";
const escape = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) =>
      ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[
        c
      ]!,
  );
export class Notebook {
  record!: RunRecord;
  records: RunRecord[] = [];
  baseline = "";
  root: HTMLElement;
  restore: (settings: Settings) => void;
  status: (text: string) => void;
  constructor(
    root: HTMLElement,
    restore: (settings: Settings) => void,
    status: (text: string) => void,
  ) {
    this.root = root;
    this.restore = restore;
    this.status = status;
    try {
      this.records = readRecords(localStorage.getItem(STORAGE_KEY));
    } catch {
      /* Storage can be disabled. */
    }
    root.innerHTML = `<div class="notebook-heading"><div><h2>Compare your runs</h2></div><button id="save-run">Save this run</button></div><p class="notebook-intro">Save a result, reset, then change one thing. Compare the two at the same step.</p><div class="notebook-grid"><div><div class="chart-heading"><strong id="chart-label"></strong><label>Compare with <select id="baseline"><option value="">No saved baseline</option></select></label></div><div id="history-chart"></div><p id="metric-definition" class="muted"></p></div><div class="notebook-tools"><label for="run-note">What did you notice?</label><textarea id="run-note" maxlength="280" rows="3" placeholder="What changed when you adjusted the settings?"></textarea><div class="export-buttons"><button id="export-csv">Export CSV</button><button id="export-json">Export full record</button></div><p class="muted">Saved here in this browser: settings, measurements, your note and any changes you made. Export to keep a separate copy. You can restart from the settings, but you can’t resume a saved run.</p><div id="saved-runs"></div></div></div>`;
    this.el("save-run").onclick = () => {
      this.record.note = this.el<HTMLTextAreaElement>("run-note").value;
      this.records.push(
        structuredClone({ ...this.record, id: crypto.randomUUID() }),
      );
      this.records = this.records.slice(-12);
      this.persist();
      this.list();
      this.chart();
    };
    this.el<HTMLSelectElement>("baseline").onchange = (e) => {
      this.baseline = (e.target as HTMLSelectElement).value;
      this.chart();
    };
    this.el("export-csv").onclick = () =>
      this.download(csv(this.record), "csv", "text/csv");
    this.el("export-json").onclick = () => {
      this.record.note = this.el<HTMLTextAreaElement>("run-note").value;
      this.download(
        JSON.stringify(this.record, null, 2),
        "json",
        "application/json",
      );
    };
  }
  el<T extends HTMLElement = HTMLElement>(id: string) {
    return this.root.querySelector<T>(`#${id}`)!;
  }
  persist() {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
      this.status("Saved. Your latest 12 runs stay in this browser.");
    } catch {
      this.status(
        "Browser storage is unavailable. Export your record to keep it.",
      );
    }
  }
  reset(settings: Settings, s: Simulation) {
    const o = observe(s);
    this.record = {
      id: "current",
      settings: structuredClone(settings),
      metric: o.key,
      label: o.label,
      unit: o.unit,
      samples: [{ step: 0, value: o.value }],
      note: "",
      events: [],
    };
    this.el<HTMLTextAreaElement>("run-note").value = "";
    this.el("metric-definition").textContent = o.definition;
    this.list();
    this.chart();
  }
  event(step: number, description: string) {
    if (this.record.events.length < 500)
      this.record.events.push({ step, description });
    else
      this.status(
        "Intervention log limit reached; reset to begin a new record.",
      );
    this.chart();
  }
  sample(s: Simulation, force = false) {
    if (!this.record || (s.ticks % 30 !== 0 && !force)) return;
    const value = observe(s).value,
      last = this.record.samples.at(-1)!;
    if (last.step === s.ticks) last.value = value;
    else this.record.samples.push({ step: s.ticks, value });
    if (this.record.samples.length > 1200) this.record.samples.splice(1, 1);
  }
  list() {
    const compatible = this.records.filter(
      (r) =>
        r.settings.suite === this.record.settings.suite &&
        r.metric === this.record.metric,
    );
    if (!compatible.some((r) => r.id === this.baseline)) this.baseline = "";
    this.el("baseline").innerHTML =
      '<option value="">No saved baseline</option>' +
      compatible
        .map(
          (r) =>
            `<option value="${escape(r.id)}">${escape(species.find((s) => s.id === r.settings.suite)!.modes[r.settings.mode])} / seed ${r.settings.seed} / ${r.samples.at(-1)!.step} steps</option>`,
        )
        .join("");
    this.el<HTMLSelectElement>("baseline").value = this.baseline;
    this.el("saved-runs").innerHTML =
      `<h3>${this.records.length} saved ${this.records.length === 1 ? "run" : "runs"}</h3>${this.records.length ? "" : '<p class="empty-notebook">Nothing saved yet. Use ‘Save this run’ when there’s a result you want to compare.</p>'}` +
      this.records
        .slice()
        .reverse()
        .map(
          (r) =>
            `<div class="saved-run"><p><strong>${escape(species.find((s) => s.id === r.settings.suite)!.name)}</strong> / ${r.samples.at(-1)!.step} steps<br><span>${escape(r.label)}: ${r.samples.at(-1)!.value.toFixed(3)} ${escape(r.unit)}</span>${r.note ? `<br><em>${escape(r.note)}</em>` : ""}</p><div><button data-restore="${escape(r.id)}">Start with settings</button><button data-remove="${escape(r.id)}" aria-label="Remove saved ${escape(r.label)} run">Remove</button></div></div>`,
        )
        .join("");
    this.root.querySelectorAll<HTMLButtonElement>("[data-restore]").forEach(
      (b) =>
        (b.onclick = () => {
          const r = this.records.find((r) => r.id === b.dataset.restore)!;
          this.restore(structuredClone(r.settings));
        }),
    );
    this.root.querySelectorAll<HTMLButtonElement>("[data-remove]").forEach(
      (b) =>
        (b.onclick = () => {
          this.records = this.records.filter((r) => r.id !== b.dataset.remove);
          this.persist();
          this.list();
          this.chart();
        }),
    );
  }
  chart() {
    const a = this.record.samples,
      b = this.records.find((r) => r.id === this.baseline)?.samples ?? [],
      all = [...a, ...b];
    const maxX = Math.max(30, ...all.map((p) => p.step)),
      maxY = Math.max(0.001, ...all.map((p) => p.value)),
      minY = Math.min(0, ...all.map((p) => p.value));
    const path = (points: typeof a) =>
      points
        .map(
          (p, i) =>
            `${i ? "L" : "M"}${(48 + (p.step / maxX) * 610).toFixed(2)},${(170 - ((p.value - minY) / (maxY - minY)) * 140).toFixed(2)}`,
        )
        .join(" ");
    this.el("chart-label").textContent =
      `${this.record.label} (${this.record.unit})`;
    this.el("history-chart").innerHTML =
      `<svg viewBox="0 0 680 215" role="img" aria-label="${escape(this.record.label)} history: current ${a.at(-1)!.value.toFixed(3)} at step ${a.at(-1)!.step}${b.length ? `, baseline ${b.at(-1)!.value.toFixed(3)} at step ${b.at(-1)!.step}` : ""}"><path class="chart-axis" d="M48 25V170H658"/><path class="chart-grid" d="M48 100H658M48 30H658"/><text x="42" y="35" text-anchor="end">${maxY.toFixed(maxY < 2 ? 2 : 0)}</text><text x="42" y="174" text-anchor="end">${minY}</text><text x="48" y="193">0</text><text x="658" y="193" text-anchor="end">${maxX} steps</text>${b.length ? `<path class="chart-baseline" d="${path(b)}"/>` : ""}<path class="chart-current" d="${path(a)}"/></svg><p class="chart-legend"><span>— Current run</span>${b.length ? "<span>┄ Saved baseline</span>" : ""}<span>${this.record.events.length} interventions</span></p>`;
  }
  download(content: string, extension: string, mime: string) {
    const url = URL.createObjectURL(new Blob([content], { type: mime })),
      a = document.createElement("a");
    a.href = url;
    a.download = `tree-of-life-${this.record.settings.suite}-${this.record.settings.seed}.${extension}`;
    a.click();
    setTimeout(() => URL.revokeObjectURL(url), 1000);
    this.status("Export prepared.");
  }
}
