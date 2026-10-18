export interface Vertex {
  x: number;
  y: number;
  z: number;
}
interface Spring {
  a: number;
  b: number;
  rest: number;
  longitudinal: number;
  edge: number;
}
/** Discrete elastic sheet: growing spring rest lengths + second-difference bending.
 * This is an educational energy, not a discretization of the paper's FvK solver. */
export class ElasticLeaf {
  rows = 33;
  cols = 9;
  vertices: Vertex[] = [];
  springs: Spring[] = [];
  triples: [number, number, number][] = [];
  energy = 0;
  constructor(width: number) {
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++) {
        const v = (2 * j) / (this.cols - 1) - 1;
        this.vertices.push({
          x: v * width,
          y: i * 10 - 160,
          z: 0.03 * Math.cos(i * 0.7) * v * v,
        });
      }
    for (let i = 0; i < this.rows; i++)
      for (let j = 0; j < this.cols; j++) {
        const a = i * this.cols + j;
        for (const [di, dj] of [
          [1, 0],
          [0, 1],
          [1, 1],
          [1, -1],
        ]) {
          if (i + di >= this.rows || j + dj < 0 || j + dj >= this.cols)
            continue;
          const b = (i + di) * this.cols + j + dj,
            p = this.vertices[a],
            q = this.vertices[b];
          const rest = Math.hypot(p.x - q.x, p.y - q.y);
          this.springs.push({
            a,
            b,
            rest,
            longitudinal: (p.y - q.y) ** 2 / rest ** 2,
            edge: Math.abs(((j + dj / 2) / (this.cols - 1)) * 2 - 1) ** 4,
          });
        }
        if (i + 2 < this.rows)
          this.triples.push([a, a + this.cols, a + 2 * this.cols]);
        if (j + 2 < this.cols) this.triples.push([a, a + 1, a + 2]);
      }
  }
  step(growth: number, stiffness: number, ticks: number) {
    const strain = growth * 0.18 * Math.min(1, ticks / 600),
      bend = stiffness * 0.25;
    for (let sub = 0; sub < 12; sub++) {
      const f = this.vertices.map(() => ({ x: 0, y: 0, z: 0 }));
      let energy = 0;
      for (const e of this.springs) {
        const a = this.vertices[e.a],
          b = this.vertices[e.b],
          dx = b.x - a.x,
          dy = b.y - a.y,
          dz = b.z - a.z;
        const length = Math.hypot(dx, dy, dz) || 1e-9,
          rest = e.rest * (1 + strain * e.edge * e.longitudinal),
          delta = length - rest;
        energy += 0.5 * delta * delta;
        for (const [k, d] of [
          ["x", dx],
          ["y", dy],
          ["z", dz],
        ] as const) {
          const force = (delta * d) / length;
          f[e.a][k] += force;
          f[e.b][k] -= force;
        }
      }
      for (const [a, b, c] of this.triples)
        for (const k of ["x", "y", "z"] as const) {
          const v =
            this.vertices[a][k] - 2 * this.vertices[b][k] + this.vertices[c][k];
          energy += 0.5 * bend * v * v;
          f[a][k] -= bend * v;
          f[b][k] += 2 * bend * v;
          f[c][k] -= bend * v;
        }
      this.energy = energy;
      for (let i = this.cols; i < this.vertices.length; i++)
        for (const k of ["x", "y", "z"] as const)
          this.vertices[i][k] += 0.04 * f[i][k];
    }
  }
  point(u: number, v: number): Vertex {
    const i = Math.min(this.rows - 1, Math.max(0, u * (this.rows - 1))),
      j = Math.min(this.cols - 1, Math.max(0, ((v + 1) / 2) * (this.cols - 1)));
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
      for (const k of ["x", "y", "z"] as const)
        out[k] += this.vertices[a * this.cols + b][k] * w;
    return out;
  }
}
