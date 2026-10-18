import { species } from "../catalog.ts";
import type { Simulation } from "../models.ts";
import { observe } from "../core/observables.ts";
import {
  compatibleRuns,
  compareRuns,
  settingDifferences,
  formatMeasurement as number,
} from "../core/comparison.ts";
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
  constructor(root: HTMLElement, restore: (settings: Settings) => void) {
    this.root = root;
    this.restore = restore;
    this.status = (message) => {
      this.el("notebook-status").textContent = message;
    };
    try {
      this.records = readRecords(localStorage.getItem(STORAGE_KEY));
    } catch {
      /* Storage can be disabled. */
    }
    root.innerHTML = `<div class="notebook-heading"><div><h2>Compare your runs</h2></div><button id="save-run">Save this run</button></div><p class="notebook-intro">Save a result, reset, then change one thing. Compare the two at the same step.</p><div class="notebook-grid"><div><div class="chart-heading"><strong id="chart-label"></strong><label>Compare with <select id="baseline"><option value="">No saved baseline</option></select></label></div><div id="history-chart"></div><p id="metric-definition" class="muted"></p><section id="comparison-readout" tabindex="-1" aria-label="Run comparison"><div id="comparison-values"></div><details id="run-details"><summary>Settings and changes during the run</summary><div id="comparison-settings"></div><div id="comparison-events"></div></details></section></div><div class="notebook-tools"><label for="run-note">What did you notice?</label><textarea id="run-note" maxlength="280" rows="3" placeholder="What changed when you adjusted the settings?"></textarea><div class="export-buttons"><button id="export-csv">Export CSV</button><button id="export-json">Export full record</button></div><p class="muted">Saved here in this browser: settings, measurements, your note and any changes you made. Export to keep a separate copy. You can restart from the settings, but you can’t resume a saved run.</p><p id="notebook-status" role="status"></p><div id="saved-runs" tabindex="-1"></div></div></div>`;
    this.el("save-run").onclick = () => {
      this.record.note = this.el<HTMLTextAreaElement>("run-note").value;
      this.records.push(
        structuredClone({ ...this.record, id: crypto.randomUUID() }),
      );
      this.records = this.records.slice(-12);
      this.persist("Saved. Your latest 12 runs stay in this browser.");
      this.list();
      this.context();
      this.chart();
    };
    this.el<HTMLSelectElement>("baseline").onchange = (e) => {
      this.baseline = (e.target as HTMLSelectElement).value;
      this.context();
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
  persist(message: string) {
    try {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(this.records));
      this.status(message);
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
    this.el("notebook-status").textContent = "";
    this.list();
    this.context();
    this.chart();
  }
  event(step: number, description: string) {
    if (this.record.events.length < 500)
      this.record.events.push({ step, description });
    else
      this.status(
        "Intervention log limit reached; reset to begin a new record.",
      );
    this.context();
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
    const compatible = this.records.filter((r) =>
      compatibleRuns(this.record, r),
    );
    if (!compatible.some((r) => r.id === this.baseline)) this.baseline = "";
    this.el("baseline").innerHTML =
      '<option value="">No saved baseline</option>' +
      compatible
        .map(
          (r) =>
            `<option value="${escape(r.id)}">${escape(species.find((s) => s.id === r.settings.suite)!.modes[r.settings.mode])} / seed ${r.settings.seed} / ${r.samples.at(-1)!.step} steps${r.note ? ` / ${escape(r.note.slice(0, 40))}` : ""}</option>`,
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
            `<div class="saved-run"><p><strong>${escape(species.find((s) => s.id === r.settings.suite)!.name)}</strong> / ${r.samples.at(-1)!.step} steps<br>${escape(species.find((s) => s.id === r.settings.suite)!.modes[r.settings.mode])}, seed ${r.settings.seed}<br><span>${escape(r.label)}: ${number(r.samples.at(-1)!.value)} ${escape(r.unit)}</span>${r.note ? `<br><em>${escape(r.note)}</em>` : ""}</p><div>${compatibleRuns(this.record, r) ? `<button data-compare="${escape(r.id)}">Compare</button>` : ""}<button data-restore="${escape(r.id)}">Start with settings</button><button data-remove="${escape(r.id)}" aria-label="Remove saved ${escape(r.label)} run">Remove</button></div>${compatibleRuns(this.record, r) ? "" : '<p class="muted">Open this experiment to compare the same measurement.</p>'}</div>`,
        )
        .join("");
    this.root
      .querySelectorAll<HTMLButtonElement>("[data-compare]")
      .forEach((b) => {
        b.onclick = () => {
          this.baseline = b.dataset.compare!;
          this.el<HTMLSelectElement>("baseline").value = this.baseline;
          this.context();
          this.chart();
          this.el("comparison-readout").scrollIntoView({ block: "center" });
          this.el("comparison-readout").focus({ preventScroll: true });
          this.status(
            "Comparing with the saved run. The current experiment is unchanged.",
          );
        };
      });
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
          this.persist("Removed the saved run.");
          this.list();
          this.context();
          this.chart();
          this.el("saved-runs").focus({ preventScroll: true });
        }),
    );
  }
  chart() {
    const baseline = this.records.find((r) => r.id === this.baseline);
    const a = this.record.samples,
      b = baseline?.samples ?? [],
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
      `<svg viewBox="0 0 680 215" role="img" aria-label="${escape(this.record.label)} history: current ${number(a.at(-1)!.value)} at step ${a.at(-1)!.step}${b.length ? `, baseline ${number(b.at(-1)!.value)} at step ${b.at(-1)!.step}` : ""}"><path class="chart-axis" d="M48 25V170H658"/><path class="chart-grid" d="M48 100H658M48 30H658"/><text x="42" y="35" text-anchor="end">${maxY.toFixed(maxY < 2 ? 2 : 0)}</text><text x="42" y="174" text-anchor="end">${minY}</text><text x="48" y="193">0</text><text x="658" y="193" text-anchor="end">${maxX} steps</text>${b.length ? `<path class="chart-baseline" d="${path(b)}"/>` : ""}<path class="chart-current" d="${path(a)}"/></svg><p class="chart-legend"><span>— Current run</span>${b.length ? "<span>┄ Saved baseline</span>" : ""}<span>${this.record.events.length} interventions</span></p>`;
    const shared = baseline ? compareRuns(this.record, baseline) : null;
    const readout = this.el("comparison-values");
    if (!baseline) {
      readout.innerHTML =
        '<p class="muted">Choose a saved run above to compare measurements at the same step.</p>';
    } else if (!shared) {
      readout.innerHTML =
        '<p class="muted">These records have no matching measurement steps yet.</p>';
    } else {
      const end = this.record.samples.at(-1)!.step,
        savedEnd = baseline.samples.at(-1)!.step;
      readout.innerHTML = `<h3>${escape(this.record.label)} at step ${shared.step.toLocaleString()}</h3><dl class="paired-values"><div><dt>Current</dt><dd>${number(shared.current)}</dd></div><div><dt>Saved</dt><dd>${number(shared.saved)}</dd></div><div><dt>Difference</dt><dd>${shared.difference > 0 ? "+" : ""}${number(shared.difference)}</dd></div></dl><p class="muted">${this.record.unit === "0–1" ? "Scale: 0–1." : `Units: ${escape(this.record.unit)}.`} Difference is current minus saved.</p><p class="comparison-caveat">${shared.step === 0 ? "Only the starting measurements overlap so far." : `Latest step recorded in both runs. Current ends at ${end.toLocaleString()}; saved ends at ${savedEnd.toLocaleString()}.`}</p>${this.record.events.some((e) => e.step > shared.step) || baseline.events.some((e) => e.step > shared.step) ? '<p class="comparison-caveat">Some logged changes happened after this shared step. They cannot explain the difference shown here.</p>' : ""}`;
    }
  }
  context() {
    const baseline = this.records.find((r) => r.id === this.baseline);
    const changes = baseline
      ? settingDifferences(this.record.settings, baseline.settings)
      : [];
    this.el("comparison-settings").innerHTML = baseline
      ? `<h4>Starting settings</h4>${changes.length ? `<table class="settings-table"><thead><tr><th scope="col">Setting</th><th scope="col">Saved</th><th scope="col">Current</th></tr></thead><tbody>${changes.map((c) => `<tr><th scope="row">${escape(c.label)}</th><td>${escape(c.saved)}</td><td>${escape(c.current)}</td></tr>`).join("")}</tbody></table>` : "<p>The starting model, seed and parameter values are the same.</p>"}<p class="muted">These are starting settings. Live adjustments appear in the log below.</p>`
      : "";
    const events = (record: RunRecord, label: string) =>
      `<h4>${label}</h4>${record.events.length ? `<ol class="event-log">${record.events.map((e) => `<li><span>Step ${e.step.toLocaleString()}</span> ${escape(e.description)}</li>`).join("")}</ol>` : '<p class="muted">No changes logged.</p>'}`;
    this.el("comparison-events").innerHTML =
      events(this.record, "Changes during the current run") +
      (baseline ? events(baseline, "Changes during the saved run") : "");
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
