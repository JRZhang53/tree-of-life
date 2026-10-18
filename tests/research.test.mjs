import { nearest } from "../src/suites/starlings/neighbors.ts";
import assert from "node:assert/strict";
import { test } from "node:test";
import { Fireflies } from "../src/suites/fireflies/model.ts";
import { Physarum, pressures } from "../src/suites/physarum/model.ts";
import { ElasticLeaf } from "../src/suites/leaves/elastic.ts";
import { ChemicalVolume } from "../src/suites/coral/volume.ts";
import { SignalTransport } from "../src/suites/termites/transport.ts";
import { random } from "../src/core/random.ts";
import {
  readRecords,
  validSettings,
  normalizedSettings,
  csv,
} from "../src/core/notebook.ts";
import { species, defaults } from "../src/catalog.ts";
import { experiments, taxonomy } from "../src/content/taxonomy.ts";
import { Simulation } from "../src/models.ts";
import { observe } from "../src/core/observables.ts";
import { treeView } from "../src/presentation/tree.ts";
import {
  compareRuns,
  compatibleRuns,
  settingDifferences,
  formatMeasurement,
} from "../src/core/comparison.ts";

const comparisonRecord = (samples) => ({
  id: "comparison-test",
  settings: normalizedSettings(
    "fireflies",
    0,
    42,
    defaults(species.find((s) => s.id === "fireflies")),
  ),
  metric: "synchrony",
  unit: "0–1",
  label: "Synchrony",
  note: "",
  events: [],
  samples: samples.map(([step, value]) => ({ step, value })),
});

test("run comparison uses the latest exact shared step, including trimmed and irregular histories", () => {
  const a = comparisonRecord([
    [0, 0.1],
    [30, 0.2],
    [45, 0.35],
    [60, 0.7],
    [73, 0.8],
  ]);
  const b = comparisonRecord([
    [0, 0.1],
    [30, 0.25],
    [60, 0.4],
    [90, 0.5],
  ]);
  assert.deepEqual(compareRuns(a, b), {
    step: 60,
    current: 0.7,
    saved: 0.4,
    difference: 0.7 - 0.4,
  });
  a.samples = [
    { step: 0, value: 0.1 },
    { step: 3000, value: 0.9 },
  ];
  assert.equal(compareRuns(a, b).step, 0);
  a.samples = [{ step: 3000, value: 0.9 }];
  assert.equal(compareRuns(a, b), null);
});

test("comparison requires the same suite, revision, metric and unit but permits deliberate model changes", () => {
  const a = comparisonRecord([
    [0, 0],
    [30, 1],
  ]);
  for (const mutate of [
    (b) => (b.settings.suite = "starlings"),
    (b) => (b.settings.revision = "old"),
    (b) => (b.metric = "alignment"),
    (b) => (b.unit = "percent"),
  ]) {
    const b = structuredClone(a);
    mutate(b);
    assert.equal(compatibleRuns(a, b), false);
    assert.equal(compareRuns(a, b), null);
  }
  const b = structuredClone(a);
  b.settings.mode = 1;
  assert.equal(compatibleRuns(a, b), true);
});

test("setting differences identify model, seed and changed controls without inventing causal meaning", () => {
  const a = comparisonRecord([[0, 0]]),
    b = structuredClone(a);
  a.settings.mode = 1;
  a.settings.seed = 53;
  a.settings.parameters.coupling = 0;
  assert.deepEqual(settingDifferences(a.settings, b.settings), [
    { label: "Model", current: "Local coupling", saved: "Global coupling" },
    { label: "Random seed", current: "53", saved: "42" },
    { label: "Coupling strength", current: "0", saved: "1.2" },
  ]);
  assert.equal(formatMeasurement(-0), "0");
  assert.equal(formatMeasurement(1e-8), "1e-8");
  assert.equal(formatMeasurement(-0.000000123456), "-1.235e-7");
  const restored = structuredClone(b.settings);
  restored.parameters.coupling = 1.2000000000000002;
  assert.deepEqual(settingDifferences(restored, b.settings), []);
});

test("malformed samples are discarded without losing neighboring valid saved records", () => {
  const valid = comparisonRecord([
    [0, 0.1],
    [30, 0.2],
  ]);
  const records = [
    { ...valid, samples: [null] },
    comparisonRecord([
      [30, 0.2],
      [0, 0.1],
    ]),
    comparisonRecord([
      [0, 0.1],
      [0, 0.2],
    ]),
    { ...valid, events: [null] },
    valid,
  ];
  assert.deepEqual(readRecords(JSON.stringify(records)), [valid]);
});

test("cladogram search retains the selected lineage and recovers every branch", () => {
  const result = treeView("vines", "  CLIMBING  ");
  assert.equal(result.count, 1);
  assert.deepEqual(result.ancestry, ["Life", "Eukaryotes", "Flowering plants"]);
  assert.match(result.markup, /data-species="vines" aria-current="page"/);
  const empty = treeView("vines", "no-such-organism");
  assert.equal(empty.count, 0);
  assert.equal(empty.markup, "");
  const full = treeView("fireflies");
  assert.equal(full.count, species.length);
  assert.deepEqual(full.ancestry, [
    "Life",
    "Eukaryotes",
    "Animals",
    "Bilaterians",
    "Protostomes",
    "Insects",
  ]);
  assert.equal((full.markup.match(/aria-current="page"/g) ?? []).length, 1);
});

test("firefly coupling synchronizes across seeds, with a distinct uncoupled baseline", () => {
  for (const seed of [1, 42, 123]) {
    const a = new Fireflies(seed),
      b = new Fireflies(seed),
      p = { coupling: 1.2, diversity: 0.2, range: 150 };
    for (let i = 0; i < 1200; i++) {
      a.step(p, 0);
      b.step({ ...p, coupling: 0 }, 0);
    }
    assert.ok(a.coherence() > 0.97);
    assert.ok(b.coherence() < 0.3);
  }
});
test("phase integration converges on step refinement and zero coupling preserves identical-frequency offsets", () => {
  const a = new Fireflies(42),
    b = new Fireflies(42),
    p = { coupling: 1.2, diversity: 0.2, range: 150 };
  for (let i = 0; i < 600; i++) a.step(p, 0);
  for (let i = 0; i < 1200; i++) b.step(p, 0, 1 / 120);
  assert.ok(Math.abs(a.coherence() - b.coherence()) < 0.005);
  const c = new Fireflies(42),
    initial = c.coherence();
  for (let i = 0; i < 1000; i++) c.step({ ...p, coupling: 0, diversity: 0 }, 0);
  assert.ok(Math.abs(initial - c.coherence()) < 1e-12);
});
test("pressure solver agrees with an analytic two-branch circuit", () => {
  const edges = [
    { a: 0, b: 1, length: 1, d: 1, q: 0 },
    { a: 0, b: 2, length: 2, d: 1, q: 0 },
    { a: 2, b: 1, length: 2, d: 1, q: 0 },
  ];
  const p = pressures(3, edges, 0, 1);
  assert.ok(Math.abs(p[0] - 0.8) < 1e-12);
  assert.ok(Math.abs(p[2] - 0.4) < 1e-12);
});
test("adaptive networks conserve flow, reduce investment and remain connected after retargeting", () => {
  for (const seed of [1, 42, 123]) {
    const a = new Physarum(seed),
      b = new Physarum(seed),
      initial = a.cost(),
      p = { reinforcement: 1, decay: 1, adaptation: 1 };
    for (let i = 0; i < 300; i++) {
      a.step(p, 0);
      b.step(p, 1);
    }
    assert.ok(a.cost() < initial * 0.3);
    assert.equal(b.cost(), initial);
    assert.ok(a.residual < 1e-10);
    a.interact(760, 75);
    for (let i = 0; i < 100; i++) a.step(p, 0);
    assert.ok(a.residual < 1e-10);
    assert.ok(a.edges.every((e) => Number.isFinite(e.q) && e.d >= 0.002));
  }
});
test("matched transport conserves source mass and particle ensemble approaches field expectation", () => {
  const f = new SignalTransport(21, 21),
    sum = new Float64Array(441);
  for (let i = 0; i < 80; i++) f.step(0.18, 0, 220, 0, random(42));
  assert.ok(Math.abs(f.field.reduce((a, b) => a + b, 0) - 80) < 1e-4);
  for (let seed = 1; seed <= 30; seed++) {
    const p = new SignalTransport(21, 21),
      rng = random(seed);
    for (let i = 0; i < 80; i++) p.step(0.18, 0, 220, 1, rng);
    assert.ok(Math.abs(p.field.reduce((a, b) => a + b, 0) - 80) < 1e-4);
    p.field.forEach((v, i) => (sum[i] += v / 30));
  }
  const error = Math.sqrt(
    sum.reduce((e, v, i) => e + (v - f.field[i]) ** 2, 0) / 441,
  );
  assert.ok(error < 0.025, `RMSE ${error}`);
});
test("elastic sheet relaxes energy after growth stops and zero mismatch stays nearly planar", () => {
  const a = new ElasticLeaf(55),
    flat = new ElasticLeaf(55);
  for (let i = 1; i <= 600; i++) {
    a.step(1.2, 0.6, i);
    flat.step(0, 0.6, i);
  }
  const e = a.energy;
  for (let i = 0; i < 300; i++) a.step(1.2, 0.6, 600);
  assert.ok(a.energy < e);
  assert.ok(Math.max(...flat.vertices.map((v) => Math.abs(v.z))) < 0.031);
  assert.ok(Math.max(...a.vertices.map((v) => Math.abs(v.z))) > 0.3);
  assert.ok(a.vertices.every((v) => [v.x, v.y, v.z].every(Number.isFinite)));
});
test("3D chemistry preserves homogeneous equilibrium and responds to timestep refinement", () => {
  const a = new ChemicalVolume(random(42));
  a.a.fill(1);
  a.b.fill(0);
  for (let i = 0; i < 100; i++) a.step(0.025, 0.055);
  assert.ok(a.a.every((v) => v === 1));
  assert.ok(a.b.every((v) => v === 0));
  const b = new ChemicalVolume(random(42)),
    c = new ChemicalVolume(random(42));
  for (let i = 0; i < 120; i++) b.step(0.025, 0.055);
  for (let i = 0; i < 240; i++) c.step(0.025, 0.055, 0.25);
  const rms = Math.sqrt(
    b.b.reduce((sum, v, i) => sum + (v - c.b[i]) ** 2, 0) / b.b.length,
  );
  assert.ok(rms < 0.005, `RMS ${rms}`);
  assert.ok(b.b.every((v) => v >= 0 && v <= 1));
});
test("every suite has a stable experiment id, unique tree leaf and finite observable", () => {
  const leaves = [];
  const visit = (b) =>
    "suite" in b ? leaves.push(b.suite) : b.children.forEach(visit);
  visit(taxonomy);
  assert.equal(new Set(leaves).size, species.length);
  for (const s of species) {
    assert.equal(experiments[s.id].length, s.modes.length);
    for (let mode = 0; mode < s.modes.length; mode++)
      assert.ok(
        Number.isFinite(
          observe(new Simulation(s.id, mode, defaults(s), 42)).value,
        ),
      );
  }
});
test("notebook rejects malformed storage and obsolete settings, round-trips exports", () => {
  const settings = normalizedSettings("fireflies", 0, 42, {
    coupling: 1.2,
    diversity: 0.2,
    range: 150,
  });
  assert.ok(validSettings(settings));
  assert.ok(!validSettings({ ...settings, revision: "old" }));
  assert.ok(
    !validSettings({ ...settings, parameters: { coupling: Infinity } }),
  );
  const record = {
    id: "sample",
    settings,
    metric: "synchrony",
    label: "Synchrony",
    unit: "0–1",
    note: "A run",
    samples: [
      { step: 0, value: 0.1 },
      { step: 600, value: 0.98 },
    ],
    events: [],
  };
  assert.deepEqual(readRecords(JSON.stringify([record])), [record]);
  assert.equal(readRecords("{broken").length, 0);
  assert.equal(
    readRecords(JSON.stringify([{ ...record, samples: [] }])).length,
    0,
  );
  assert.ok(csv(record).includes("600,0.98"));
});

test("passive bend relay transmits head input and a cut silences only downstream segments", () => {
  const definition = species.find((s) => s.id === "worms"),
    p = defaults(definition),
    a = new Simulation("worms", 2, p, 42),
    b = new Simulation("worms", 3, p, 42);
  let power = 0;
  for (let i = 0; i < 1200; i++) {
    a.step();
    b.step();
    if (i > 600) power += a.bends[23] ** 2;
  }
  assert.ok(power > 1);
  assert.deepEqual(a.bends.slice(0, 12), b.bends.slice(0, 12));
  assert.ok(b.bends.slice(12).every((v) => v === 0));
});

test("topological neighbors match a full distance ordering and are invariant to uniform dilation", () => {
  const points = Array.from({ length: 31 }, (_, i) => ({
      x: Math.sin(i) * i,
      y: Math.cos(i) * i,
    })),
    focal = points[8];
  const expected = points
    .filter((p) => p !== focal)
    .sort(
      (a, b) =>
        (a.x - focal.x) ** 2 +
        (a.y - focal.y) ** 2 -
        ((b.x - focal.x) ** 2 + (b.y - focal.y) ** 2),
    )
    .slice(0, 7);
  assert.deepEqual(nearest(points, focal), expected);
  const dilated = points.map((p) => ({ x: p.x * 5, y: p.y * 5 }));
  assert.deepEqual(
    nearest(dilated, dilated[8]).map((p) => dilated.indexOf(p)),
    expected.map((p) => points.indexOf(p)),
  );
});
