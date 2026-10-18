import type { Simulation } from "../models.ts";
export interface Observation {
  key: string;
  label: string;
  unit: string;
  value: number;
  definition: string;
}
export function observe(s: Simulation): Observation {
  const o = (
    key: string,
    label: string,
    unit: string,
    value: number,
    definition: string,
  ) => ({ key, label, unit, value, definition });
  if (s.filament)
    return o(
      "rod-deflection",
      "Sideways displacement",
      "u",
      s.filament.deflection(),
      "Largest distance from the straight substrate axis. Growth stops at step 600; relaxation continues.",
    );
  if (s.sheet)
    return o(
      "sheet-energy",
      "Sheet elastic energy",
      "model units",
      s.sheet.energy,
      "Stretching plus triangle-normal bending energy. Loading can raise energy; relaxation at fixed growth lowers it.",
    );
  if (s.flock)
    return o(
      "target-distance",
      "Target distance",
      "u",
      s.flock.objective(s.flock.agents, s.flock.dog, s.p).target,
      "Distance from the flock centroid to the target on an open plane. Sheep are not absorbed at the target.",
    );
  if (s.mound)
    return o(
      "cavity-area",
      "Cavity area",
      "cells",
      s.mound.area(),
      "Number of air cells inside the exterior envelope; not deposited dirt mass. Construction updates once per thermal cycle.",
    );
  if (s.fireflies)
    return o(
      "synchrony",
      "Synchrony",
      "0–1",
      s.fireflies.coherence(),
      "Magnitude of the mean unit phase vector across all oscillators.",
    );
  if (s.physarum)
    return o(
      "investment",
      "Tube investment",
      "model units",
      s.physarum.cost(),
      "Sum of conductance × edge length. This is a model proxy, not biological mass.",
    );
  if (s.elastic)
    return o(
      "deflection",
      "Peak deflection",
      "u",
      Math.max(...s.elastic.vertices.map((p) => Math.abs(p.z))),
      "Largest absolute displacement normal to the initially flat sheet.",
    );
  if (s.volume)
    return o(
      "chemical-volume",
      "Mean chemical B",
      "concentration",
      s.volume.b.reduce((a, b) => a + b, 0) / s.volume.b.length,
      "Arithmetic mean of B across the entire 3D periodic lattice.",
    );
  if (s.id === "starlings") {
    let x = 0,
      y = 0;
    for (const a of s.agents) {
      const v = Math.hypot(a.vx, a.vy) || 1;
      x += a.vx / v;
      y += a.vy / v;
    }
    return o(
      "alignment",
      "Alignment",
      "0–1",
      Math.hypot(x, y) / s.agents.length,
      "Magnitude of the mean unit velocity. Measures directional agreement, not cohesion.",
    );
  }
  if (s.id === "sheep")
    return o(
      "delivered",
      "Sheep in goal",
      "count",
      s.agents.filter(
        (a) => Math.hypot(a.x - s.target.x, a.y - s.target.y) < 70,
      ).length,
      "Agents within the absorbing goal radius of 70 habitat units.",
    );
  if (s.id === "orcas") {
    const x = s.agents.reduce((n, a) => n + a.x, 0) / s.agents.length,
      y = s.agents.reduce((n, a) => n + a.y, 0) / s.agents.length;
    return o(
      "spread",
      "School spread",
      "u",
      s.agents.reduce((n, a) => n + Math.hypot(a.x - x, a.y - y), 0) /
        s.agents.length,
      "Mean distance of fish from their instantaneous centroid. No fish capture is simulated.",
    );
  }
  if (s.id === "ants")
    return s.mode === 0
      ? o(
          "tour",
          "Best tour",
          "u",
          Number.isFinite(s.bestLength) ? s.bestLength : 0,
          "Shortest closed tour found so far. Zero at initialization means no tour sampled.",
        )
      : o(
          "delivery",
          "Food delivered",
          "count",
          s.count,
          "Cumulative returns to the nest carrying food; the food source is inexhaustible.",
        );
  if (s.id === "bacteria" || s.id === "termites")
    return o(
      "occupancy",
      "Occupied sites",
      "count",
      s.cells.reduce((a, b) => a + b, 0),
      "Number of occupied lattice sites. Site area is not calibrated to a real organism.",
    );
  if (s.id === "coral")
    return s.mode === 0
      ? o(
          "aggregate",
          "Growth sites",
          "count",
          s.points.length,
          "Number of occupied voxels in the 3D aggregate.",
        )
      : o(
          "chemical-surface",
          "Mean chemical B",
          "concentration",
          s.chemical.reduce((a, b) => a + b, 0) / s.chemical.length,
          "Mean over the flat periodic grid, not area-weighted on the display sphere.",
        );
  if (s.id === "vines") {
    const p = s.points.at(-1)!;
    return o(
      "tip-radius",
      "Tip radius",
      "u",
      Math.hypot(p.x, p.z ?? 0),
      "Distance of the growing tip from the support axis.",
    );
  }
  if (s.id === "leaves")
    return o(
      "mismatch",
      "Applied mismatch",
      "model units",
      s.p.growth * Math.min(1, s.ticks / 600),
      "Prescribed shape control in the two geometry sketches; not computed mechanical strain.",
    );
  if (s.mode >= 2)
    return o(
      "tail-bend",
      "Tail bend",
      "model units",
      s.bends[23],
      "Signed output of the final passive bend relay. A severed relay decays toward zero.",
    );
  let x = 0,
    y = 0;
  for (let i = 1; i < s.phases.length; i++) {
    const lag = s.phases[i - 1] - s.phases[i];
    x += Math.cos(lag);
    y += Math.sin(lag);
  }
  return o(
    "phase-lag",
    "Lag consistency",
    "0–1",
    Math.hypot(x, y) / (s.phases.length - 1),
    "Magnitude of the mean adjacent phase-difference vector. A cut can disrupt uniform lag.",
  );
}
