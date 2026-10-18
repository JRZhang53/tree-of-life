import { axes, relax, type Vec3 } from "../../core/relax.ts";
import { random } from "../../core/random.ts";
const sub = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.x - b.x,
  y: a.y - b.y,
  z: a.z - b.z,
});
const cross = (a: Vec3, b: Vec3): Vec3 => ({
  x: a.y * b.z - a.z * b.y,
  y: a.z * b.x - a.x * b.z,
  z: a.x * b.y - a.y * b.x,
});
const dot = (a: Vec3, b: Vec3) => a.x * b.x + a.y * b.y + a.z * b.z;

/** Longitudinal growth metric + triangle-normal bending. All edges are free;
 * the optional midrib clamp is the only positional constraint. */
export class GrowingSheet {
  vertices: Vec3[] = [];
  triangles: [number, number, number][] = [];
  edges: { a: number; b: number; dx: number; dy: number; margin: number }[] =
    [];
  hinges: [number, number][] = [];
  rows: number;
  cols: number;
  clamped: boolean;
  energy = 0;
  stretch = 0;
  bend = 0;
  residual = 0;
  strain = 0;
  constructor(
    width: number,
    seed: number,
    clamped = false,
    rows = 25,
    cols = 11,
  ) {
    this.rows = rows;
    this.cols = cols;
    this.clamped = clamped;
    const rng = random(seed);
    for (let i = 0; i < rows; i++)
      for (let j = 0; j < cols; j++)
        this.vertices.push({
          x: (j / (cols - 1) - 0.5) * width,
          y: (i / (rows - 1)) * 12 - 6,
          z: clamped && j === (cols - 1) / 2 ? 0 : (rng() - 0.5) * 0.005,
        });
    for (let i = 0; i < rows - 1; i++)
      for (let j = 0; j < cols - 1; j++) {
        const a = i * cols + j,
          b = a + 1,
          c = a + cols,
          d = c + 1;
        this.triangles.push([a, b, d], [a, d, c]);
      }
    const owners = new Map<string, number>();
    this.triangles.forEach((t, ti) => {
      for (let k = 0; k < 3; k++) {
        const a = Math.min(t[k], t[(k + 1) % 3]),
          b = Math.max(t[k], t[(k + 1) % 3]);
        const key = `${a}:${b}`,
          previous = owners.get(key);
        if (previous !== undefined) this.hinges.push([previous, ti]);
        else {
          owners.set(key, ti);
          const p = this.vertices[a],
            q = this.vertices[b];
          this.edges.push({
            a,
            b,
            dx: q.x - p.x,
            dy: q.y - p.y,
            margin: Math.abs((p.x + q.x) / width) ** 10,
          });
        }
      }
    });
  }
  evaluate(strain: number, thickness: number) {
    const r = this.vertices,
      gradient = r.map(() => ({ x: 0, y: 0, z: 0 }));
    let stretch = 0,
      bend = 0;
    for (const e of this.edges) {
      const d = sub(r[e.b], r[e.a]),
        length = Math.hypot(d.x, d.y, d.z) || 1e-12;
      const rest = Math.hypot(e.dx, e.dy * (1 + strain * e.margin)),
        delta = length - rest;
      stretch += (delta * delta) / 2;
      for (const a of axes) {
        const g = (delta * d[a]) / length;
        gradient[e.a][a] -= g;
        gradient[e.b][a] += g;
      }
    }
    const normals = this.triangles.map(([a, b, c]) => {
      const u = sub(r[b], r[a]),
        v = sub(r[c], r[a]),
        n = cross(u, v);
      const area = Math.max(1e-12, Math.hypot(n.x, n.y, n.z));
      return { u, v, n: { x: n.x / area, y: n.y / area, z: n.z / area }, area };
    });
    const dn = normals.map(() => ({ x: 0, y: 0, z: 0 }));
    const B = 0.015 * thickness * thickness;
    for (const [a, b] of this.hinges) {
      bend += B * (1 - dot(normals[a].n, normals[b].n));
      for (const k of axes) {
        dn[a][k] -= B * normals[b].n[k];
        dn[b][k] -= B * normals[a].n[k];
      }
    }
    this.triangles.forEach(([a, b, c], i) => {
      const { u, v, n, area } = normals[i],
        normalPart = dot(dn[i], n);
      const dc = {
        x: (dn[i].x - n.x * normalPart) / area,
        y: (dn[i].y - n.y * normalPart) / area,
        z: (dn[i].z - n.z * normalPart) / area,
      };
      const db = cross(v, dc),
        dd = cross(dc, u);
      for (const k of axes) {
        gradient[b][k] += db[k];
        gradient[c][k] += dd[k];
        gradient[a][k] -= db[k] + dd[k];
      }
    });
    return { value: stretch + bend, gradient, stretch, bend };
  }
  step(p: Record<string, number>, ticks: number) {
    this.strain = p.marginGrowth * Math.min(1, ticks / 600);
    const out = relax(
      this.vertices,
      () => this.evaluate(this.strain, p.thickness),
      (i) => !this.clamped || i % this.cols !== (this.cols - 1) / 2,
      14,
      0.22,
    );
    this.energy = out.value;
    this.stretch = out.stretch;
    this.bend = out.bend;
    this.residual = out.residual;
  }
  point(u: number, v: number): Vec3 {
    const i = Math.max(0, Math.min(this.rows - 1, u * (this.rows - 1))),
      j = Math.max(0, Math.min(this.cols - 1, ((v + 1) / 2) * (this.cols - 1)));
    const i0 = Math.floor(i),
      j0 = Math.floor(j),
      i1 = Math.min(i0 + 1, this.rows - 1),
      j1 = Math.min(j0 + 1, this.cols - 1);
    const out = { x: 0, y: 0, z: 0 };
    for (const [a, b, w] of [
      [i0, j0, (1 - i + i0) * (1 - j + j0)],
      [i1, j0, (i - i0) * (1 - j + j0)],
      [i0, j1, (1 - i + i0) * (j - j0)],
      [i1, j1, (i - i0) * (j - j0)],
    ])
      for (const k of axes)
        out[k] += this.vertices[a * this.cols + b][k] * w * 28;
    return out;
  }
}
