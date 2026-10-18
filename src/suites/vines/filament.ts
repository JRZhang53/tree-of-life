import { random } from "../../core/random.ts";
import { axes, relax, type Vec3 } from "../../core/relax.ts";

/** Extensible rod on elastic tethers; no prescribed winding angle. */
export class Filament {
  vertices: Vec3[] = [];
  growth: number[];
  h: number;
  energy = 0;
  residual = 0;
  stretch = 0;
  bend = 0;
  spatial: boolean;
  constructor(seed: number, spatial = false, n = 41) {
    this.spatial = spatial;
    this.h = 12 / (n - 1);
    this.growth = Array(n - 1).fill(0);
    const rng = random(seed);
    for (let i = 0; i < n; i++) {
      const free = i > 1 && i < n - 2;
      this.vertices.push({
        x: free ? (rng() - 0.5) * 0.015 : 0,
        y: i * this.h - 6,
        z: free && spatial ? (rng() - 0.5) * 0.015 : 0,
      });
    }
  }
  evaluate(bending: number, tether: number) {
    const r = this.vertices,
      h = this.h;
    const gradient = r.map(() => ({ x: 0, y: 0, z: 0 }));
    let stretch = 0,
      bend = 0,
      substrate = 0;
    for (let i = 0; i < r.length - 1; i++) {
      const d = {
        x: r[i + 1].x - r[i].x,
        y: r[i + 1].y - r[i].y,
        z: r[i + 1].z - r[i].z,
      };
      const length = Math.hypot(d.x, d.y, d.z) || 1e-12;
      const delta = length - h * (1 + this.growth[i]);
      stretch += (10 / h) * delta * delta;
      for (const a of axes) {
        const g = ((20 / h) * delta * d[a]) / length;
        gradient[i][a] -= g;
        gradient[i + 1][a] += g;
      }
    }
    for (let i = 0; i < r.length - 2; i++)
      for (const a of axes) {
        const d = r[i][a] - 2 * r[i + 1][a] + r[i + 2][a];
        const g = (bending / h ** 3) * d;
        bend += 0.5 * g * d;
        gradient[i][a] += g;
        gradient[i + 1][a] -= 2 * g;
        gradient[i + 2][a] += g;
      }
    for (let i = 0; i < r.length; i++)
      for (const a of axes) {
        const q = r[i][a] - (a === "y" ? i * h - 6 : 0);
        const k = a === "y" ? 0.025 : tether;
        substrate += (h * k * q * q) / 2;
        gradient[i][a] += h * k * q;
      }
    return { value: stretch + bend + substrate, gradient, stretch, bend };
  }
  step(p: Record<string, number>, ticks: number) {
    if (ticks <= 600)
      for (let i = 0; i < this.growth.length; i++) {
        const a = this.vertices[i],
          b = this.vertices[i + 1];
        const strain =
          Math.hypot(b.x - a.x, b.y - a.y, b.z - a.z) /
            (this.h * (1 + this.growth[i])) -
          1;
        this.growth[i] +=
          p.extension / 600 / (1 + p.feedback * Math.abs(strain));
      }
    const out = relax(
      this.vertices,
      () => this.evaluate(p.bending, p.tether),
      (i, a) =>
        i > 1 && i < this.vertices.length - 2 && (this.spatial || a !== "z"),
      24,
      0.012 * (this.h / 0.3) ** 3,
    );
    this.energy = out.value;
    this.residual = out.residual;
    this.stretch = out.stretch;
    this.bend = out.bend;
  }
  deflection() {
    return Math.max(...this.vertices.map((v) => Math.hypot(v.x, v.z)));
  }
}
