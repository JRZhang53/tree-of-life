import assert from "node:assert/strict";
import { test } from "node:test";
import { Simulation, diffuse, COLS, ROWS, leafPoint } from "../src/models.ts";
import { species, defaults } from "../src/catalog.ts";

const run = (sim, n) => {
  for (let i = 0; i < n; i++) sim.step();
  return sim;
};
const make = (id, mode = 0, overrides = {}, seed = 42) =>
  new Simulation(
    id,
    mode,
    { ...defaults(species.find((s) => s.id === id)), ...overrides },
    seed,
  );
const snapshot = (s) =>
  JSON.stringify({
    agents: s.agents,
    points: s.points,
    grid: Array.from(s.grid),
    chemical: Array.from(s.chemical),
    cells: Array.from(s.cells),
    phases: s.phases,
    bends: s.bends,
    fireflies: s.fireflies,
    physarum: s.physarum,
    volume: s.volume,
    elastic: s.elastic,
    best: s.bestLength,
  });

test("diffusion conserves mass with no sources or decay, remains nonnegative, and spreads a point source", () => {
  const f = new Float32Array(COLS * ROWS);
  f[25 * COLS + 45] = 1;
  const out = diffuse(f, 0.2);
  assert.ok(Math.abs(out.reduce((a, b) => a + b, 0) - 1) < 1e-6);
  assert.ok(out.every((v) => v >= 0));
  assert.ok(out[25 * COLS + 46] > 0);
  assert.ok(out[25 * COLS + 45] < 1);
});
for (const s of species)
  for (let mode = 0; mode < s.modes.length; mode++) {
    test(`${s.id} / ${s.modes[mode]}: seeded replay, finite state and bounded population`, () => {
      const a = run(make(s.id, mode), 300),
        b = run(make(s.id, mode), 300);
      assert.equal(snapshot(a), snapshot(b));
      for (const field of [a.grid, a.chemical, a.trails])
        assert.ok(field.every(Number.isFinite));
      for (const agent of [...a.agents, ...a.predators]) {
        assert.ok(
          [agent.x, agent.y, agent.vx, agent.vy].every(Number.isFinite),
        );
        assert.ok(
          agent.x >= 0 && agent.x <= 900 && agent.y >= 0 && agent.y <= 560,
        );
      }
      assert.ok(a.points.length <= 1800);
      for (const model of [a.fireflies, a.physarum, a.volume, a.elastic])
        if (model) assert.ok(!/NaN|Infinity|null/.test(JSON.stringify(model)));
      for (const [, value] of a.metrics())
        assert.ok(!/NaN|Infinity/.test(value));
    });
  }
test("flock alignment and cohesion controls affect the trajectory", () => {
  const a = run(make("starlings"), 240),
    b = run(make("starlings", 0, { alignment: 0, cohesion: 0 }), 240);
  assert.notDeepEqual(a.agents, b.agents);
});
test("collect/drive changes the dog controller compared to drive only", () => {
  const a = run(make("sheep"), 60),
    b = run(make("sheep", 1), 60);
  assert.notDeepEqual(a.predators, b.predators);
});
test("default sheep controller delivers the flock without goal-zone congestion", () => {
  const s = run(make("sheep"), 4000);
  assert.equal(
    s.agents.filter((a) => Math.hypot(a.x - s.target.x, a.y - s.target.y) < 70)
      .length,
    45,
  );
  assert.equal(s.strategy, "At goal");
  s.interact(140, 280);
  run(s, 4000);
  assert.equal(
    s.agents.filter((a) => Math.hypot(a.x - s.target.x, a.y - s.target.y) < 70)
      .length,
    45,
  );
});
test("ant routes visit each site once, close their tour, and retain the best found length", () => {
  const a = run(make("ants"), 60);
  const first = a.bestLength;
  run(a, 300);
  assert.deepEqual([...a.bestRoute].sort(), [0, 1, 2, 3, 4, 5, 6, 7]);
  assert.ok(a.bestLength <= first);
  const measured = a.bestRoute.reduce((total, j, i) => {
    const p = a.points[j],
      q = a.points[a.bestRoute[(i + 1) % 8]];
    return total + Math.hypot(p.x - q.x, p.y - q.y);
  }, 0);
  assert.ok(Math.abs(measured - a.bestLength) < 1e-8);
});
test("foragers find food, bring it home and leave decaying trails", () => {
  const a = run(make("ants", 1), 5000);
  assert.ok(a.count > 0, "expected food delivery");
  assert.ok(a.trails.some((v) => v > 0.01));
});
test("bacterial colony consumes nutrients and grows; richer medium supports more cells", () => {
  const a = run(make("bacteria", 0), 1000),
    b = run(make("bacteria", 1), 1000);
  const occupied = (s) => s.cells.reduce((n, v) => n + v, 0);
  assert.ok(occupied(a) > 1);
  assert.ok(occupied(b) > occupied(a));
  assert.ok(a.grid.some((v) => v < 0.5));
  const before = occupied(a);
  a.interact(100, 100);
  assert.equal(occupied(a), before + 1);
});
test("termite field and particle representations both deposit material", () => {
  for (const mode of [0, 1]) {
    const a = run(make("termites", mode), 700);
    assert.ok(a.cells.reduce((n, v) => n + v, 0) > 1);
  }
});
test("coral grows in three dimensions and flow changes morphology", () => {
  const a = run(make("coral"), 300),
    b = run(make("coral", 0, { flow: 0.8 }), 300);
  assert.ok(a.points.length > 20);
  assert.ok(a.points.some((p) => p.z !== 0));
  assert.notDeepEqual(a.points, b.points);
});
test("chemical surface responds to feed/removal and remains in concentration bounds", () => {
  const a = run(make("coral", 1), 200),
    b = run(make("coral", 1, { feed: 0.022, kill: 0.051 }), 200);
  assert.ok(a.chemical.every((v) => v >= 0 && v <= 1));
  assert.notDeepEqual(a.chemical, b.chemical);
  assert.ok(a.chemical.some((v) => v > 0.1));
});
test("vine feedback approaches the support and growth has a hard stop", () => {
  const a = run(make("vines"), 1200),
    b = run(make("vines", 1), 1200);
  assert.ok(a.completed);
  assert.equal(a.points.length, 1000);
  const p = a.points.at(-1);
  assert.ok(Math.abs(Math.hypot(p.x, p.z) - 37) < 1);
  assert.notDeepEqual(a.points, b.points);
  const ticks = a.ticks;
  a.step();
  assert.equal(a.ticks, ticks);
});
test("broken worm feedback changes the downstream chain while leaving upstream identical", () => {
  const a = run(make("worms"), 600),
    b = run(make("worms", 1), 600);
  assert.deepEqual(a.phases.slice(0, 12), b.phases.slice(0, 12));
  assert.notDeepEqual(a.phases.slice(12), b.phases.slice(12));
});
test("leaf geometry starts flat, grows curvature and remains a full blade at zero mismatch", () => {
  const p = defaults(species.find((s) => s.id === "leaves"));
  for (const mode of [0, 1]) {
    assert.equal(leafPoint(0.8, 0.5, p, mode, 0).z, 0);
    assert.notEqual(leafPoint(0.8, 0.5, p, mode, 600).z, 0);
    assert.ok(
      leafPoint(1, 0, { ...p, growth: 0 }, mode, 600).y -
        leafPoint(0, 0, { ...p, growth: 0 }, mode, 600).y >
        350,
    );
  }
});
test("parameter extremes stay finite in all model modes", () => {
  for (const s of species)
    for (let mode = 0; mode < s.modes.length; mode++)
      for (const bound of ["min", "max"]) {
        const p = Object.fromEntries(s.controls.map((c) => [c.key, c[bound]]));
        const a = run(make(s.id, mode, p), 160);
        assert.ok(a.grid.every(Number.isFinite), `${s.id} ${mode} ${bound}`);
        assert.ok(a.chemical.every(Number.isFinite));
        assert.ok(a.phases.every(Number.isFinite));
        assert.ok(a.bends.every(Number.isFinite));
        for (const model of [a.fireflies, a.physarum, a.volume, a.elastic])
          if (model)
            assert.ok(
              !/NaN|Infinity|null/.test(JSON.stringify(model)),
              `${s.id} ${mode} ${bound}`,
            );
        assert.ok(
          a.agents.every((v) => Number.isFinite(v.x) && Number.isFinite(v.y)),
        );
      }
});
