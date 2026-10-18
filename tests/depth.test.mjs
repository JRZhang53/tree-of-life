import assert from "node:assert/strict";
import { test } from "node:test";
import { Filament } from "../src/suites/vines/filament.ts";
import { GrowingSheet } from "../src/suites/leaves/sheet.ts";
import { OptimizedFlock } from "../src/suites/sheep/optimizer.ts";
import { Mound } from "../src/suites/termites/mound.ts";
import { species, defaults } from "../src/catalog.ts";
import { readRecords, normalizedSettings } from "../src/core/notebook.ts";
import { compatibleRuns } from "../src/core/comparison.ts";
const parameters = (id) => defaults(species.find((s) => s.id === id));
test("straight rod compression energy has the analytic value at three resolutions", () => {
  for (const n of [21, 41, 81]) {
    const m = new Filament(42, false, n);
    m.vertices.forEach((v) => {
      v.x = 0;
      v.z = 0;
    });
    m.growth.fill(0.2);
    assert.ok(
      Math.abs(m.evaluate(0.05, 0.12).value - (20 * 12 * 0.2 ** 2) / 2) < 1e-10,
    );
  }
});
test("mound odor transport changes little under timestep halving at matched physical time", () => {
  const a = new Mound(),
    b = new Mound(),
    p = parameters("termites");
  for (let i = 0; i < 320; i++) a.step(p, true, 0.1);
  for (let i = 0; i < 640; i++) b.step(p, true, 0.05);
  const rms = Math.sqrt(
    a.odor.reduce((s, v, i) => s + (v - b.odor[i]) ** 2, 0) / a.area(),
  );
  assert.ok(rms < 0.0001, `RMS ${rms}`);
  assert.ok(Math.abs(a.mass() - b.mass()) < 0.0001);
});
const steps = (m, p, n, start = 1) => {
  for (let i = start; i < start + n; i++) m.step(p, i);
  return m;
};

function gradientCheck(model, evaluate, indices) {
  const exact = evaluate(),
    eps = 1e-6;
  for (const i of indices)
    for (const axis of ["x", "y", "z"]) {
      const v = model.vertices[i],
        before = v[axis];
      v[axis] = before + eps;
      const plus = evaluate().value;
      v[axis] = before - eps;
      const minus = evaluate().value;
      v[axis] = before;
      const numerical = (plus - minus) / (2 * eps);
      assert.ok(
        Math.abs(numerical - exact.gradient[i][axis]) < 2e-6,
        `${i}/${axis}: ${numerical} vs ${exact.gradient[i][axis]}`,
      );
    }
}
test("rod energy derivative agrees with finite differences in all three dimensions", () => {
  const m = new Filament(42, true);
  m.growth.fill(0.2);
  gradientCheck(m, () => m.evaluate(0.05, 0.12), [0, 1, 15, 20, 39, 40]);
});
test("rod clamps, planarity, relaxation and tether response are mechanical", () => {
  const p = parameters("vines"),
    weak = new Filament(42),
    strong = new Filament(42),
    flat = new Filament(42);
  const ends = [0, 1, 39, 40].map((i) => ({ ...weak.vertices[i] }));
  steps(weak, { ...p, tether: 0.03 }, 900);
  steps(strong, { ...p, tether: 0.6 }, 900);
  steps(flat, { ...p, extension: 0 }, 600);
  assert.ok(weak.deflection() > strong.deflection() * 1.2);
  assert.ok(flat.deflection() < 0.01);
  assert.deepEqual(
    [0, 1, 39, 40].map((i) => weak.vertices[i]),
    ends,
  );
  assert.ok(weak.vertices.every((v) => v.z === 0));
  const e = weak.energy;
  steps(weak, { ...p, tether: 0.03 }, 50, 901);
  assert.ok(weak.energy < e);
});
test("stress feedback reduces accumulated local growth without imposing a shape", () => {
  const p = parameters("vines"),
    a = new Filament(7, true),
    b = new Filament(7, true);
  steps(a, p, 600);
  steps(b, { ...p, feedback: 20 }, 600);
  assert.ok(
    b.growth.reduce((s, v) => s + v, 0) < a.growth.reduce((s, v) => s + v, 0),
  );
  assert.ok(a.vertices.some((v) => Math.abs(v.z) > 0.02));
});
test("sheet gradient is correct and energy is invariant to rigid rotation and translation", () => {
  const m = new GrowingSheet(4, 42, false, 9, 7);
  m.vertices.forEach((v, i) => {
    v.z += 0.15 * Math.sin(i * 0.3);
  });
  gradientCheck(m, () => m.evaluate(0.3, 0.7), [0, 9, 24, 40, 62]);
  const before = m.evaluate(0.3, 0.7).value;
  for (const v of m.vertices) {
    const x = v.x,
      z = v.z;
    v.x = x * Math.cos(0.6) - z * Math.sin(0.6) + 7;
    v.z = x * Math.sin(0.6) + z * Math.cos(0.6) - 3;
    v.y += 2;
  }
  assert.ok(Math.abs(before - m.evaluate(0.3, 0.7).value) < 1e-10);
});
test("growing sheet buckles, preserves the held midrib and descends at fixed loading", () => {
  const p = parameters("leaves"),
    free = new GrowingSheet(4, 42),
    held = new GrowingSheet(4, 42, true),
    flat = new GrowingSheet(4, 42);
  const midrib = held.vertices
    .filter((_, i) => i % 11 === 5)
    .map((v) => ({ ...v }));
  steps(free, p, 650);
  steps(held, p, 650);
  steps(flat, { ...p, marginGrowth: 0 }, 100);
  assert.ok(Math.max(...free.vertices.map((v) => Math.abs(v.z))) > 0.08);
  assert.ok(Math.max(...flat.vertices.map((v) => Math.abs(v.z))) < 0.01);
  assert.deepEqual(
    held.vertices.filter((_, i) => i % 11 === 5),
    midrib,
  );
  const e = free.energy;
  steps(free, p, 40, 651);
  assert.ok(free.energy < e);
});
test("sampled shepherd move minimizes the stated cost and respects constant speed", () => {
  const p = parameters("sheep");
  for (const seed of [1, 7, 42]) {
    const a = new OptimizedFlock(seed),
      b = new OptimizedFlock(seed);
    for (let i = 0; i < 400; i++) {
      const previous = { ...a.dog };
      a.step(p);
      b.step(p);
      assert.equal(a.cost.total, Math.min(...a.costs.map((c) => c.total)));
      assert.ok(
        Math.abs(
          Math.hypot(a.dog.x - previous.x, a.dog.y - previous.y) - p.dogSpeed,
        ) < 1e-10,
      );
    }
    assert.deepEqual(a.agents, b.agents);
    assert.ok(Number.isFinite(a.cost.target));
    assert.equal(a.agents.length, 45);
    a.target = a.center();
    a.step(p);
    assert.ok(a.agents.some((s) => Math.hypot(s.vx, s.vy) > 0.01));
  }
});
test("shepherding objective tradeoff holds across three seeds, including failure to reach the target", () => {
  const p = parameters("sheep");
  for (const seed of [1, 7, 42]) {
    const compact = new OptimizedFlock(seed),
      direct = new OptimizedFlock(seed);
    const start = compact.objective(compact.agents, compact.dog, p).target;
    for (let i = 0; i < 900; i++) {
      compact.step(p);
      direct.step({ ...p, spreadWeight: 0.5 });
    }
    assert.ok(compact.cost.spread < direct.cost.spread);
    assert.ok(direct.cost.target < compact.cost.target);
    // This is a useful failure of the greedy, spread-heavy controller, not a
    // guarantee of successful herding hidden in a goal-absorption rule.
    assert.ok(compact.cost.target > start);
  }
});
test("objective weights change the dog path; direction sampling remains finite", () => {
  const p = parameters("sheep"),
    a = new OptimizedFlock(42),
    b = new OptimizedFlock(42),
    fine = new OptimizedFlock(42);
  for (let i = 0; i < 200; i++) {
    a.step(p);
    b.step({ ...p, spreadWeight: 0.5 });
    fine.step(p, 64);
  }
  assert.notDeepEqual(a.dogPath, b.dogPath);
  assert.ok(Number.isFinite(fine.cost.total));
  assert.ok(Math.abs(a.cost.target - fine.cost.target) < 70);
});
test("mound transports positive odor with a closed budget and small divergence", () => {
  const m = new Mound(),
    p = parameters("termites");
  let maxError = 0,
    maxDivergence = 0;
  for (let i = 0; i < 320; i++) {
    m.step({ ...p, thermal: 2, buoyancy: 2 }, false);
    maxError = Math.max(maxError, Math.abs(m.budgetError));
    maxDivergence = Math.max(maxDivergence, m.divergence);
    assert.ok(m.odor.every((v) => Number.isFinite(v) && v >= 0));
  }
  assert.ok(maxError < 1e-10, `budget error ${maxError}`);
  assert.ok(maxDivergence < 0.002, `divergence ${maxDivergence}`);
});
test("mound construction changes the domain and future transport; frozen wall stays fixed", () => {
  const a = new Mound(),
    b = new Mound(),
    p = parameters("termites"),
    initial = [...a.heights];
  for (let i = 0; i < 321; i++) {
    a.step(p);
    b.step(p, true);
  }
  assert.notDeepEqual(a.heights, initial);
  assert.deepEqual(b.heights, initial);
  assert.notDeepEqual(a.odor, b.odor);
  assert.notDeepEqual(a.heat, b.heat);
  const noHeat = new Mound();
  for (let i = 0; i < 80; i++) noHeat.step({ ...p, thermal: 0 }, true);
  assert.ok(noHeat.faces.every((f) => f.flow === 0));
});
test("atlas-2 notebook records survive the upgrade and cannot mix with atlas-3 comparisons", () => {
  const settings = normalizedSettings("sheep", 0, 42, {
    cohesion: 0.8,
    fear: 1,
    pace: 1.1,
  });
  const old = {
    id: "old",
    settings: {
      ...settings,
      revision: "atlas-2",
      parameters: { cohesion: 0.8, fear: 1, pace: 1.1 },
    },
    metric: "delivered",
    label: "Sheep in goal",
    unit: "count",
    samples: [{ step: 0, value: 0 }],
    note: "Keep this",
    events: [],
  };
  assert.deepEqual(readRecords(JSON.stringify([old])), [old]);
  assert.equal(compatibleRuns(old, { ...old, settings }), false);
});
