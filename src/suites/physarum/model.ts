import { random } from "../../core/random.ts";
export interface Tube {
  a: number;
  b: number;
  length: number;
  d: number;
  q: number;
}

/** Grounded weighted graph Laplacian solved with pivoted elimination. */
export function pressures(
  n: number,
  edges: Tube[],
  source: number,
  sink: number,
) {
  const a = Array.from({ length: n }, () => new Float64Array(n + 1));
  for (const e of edges) {
    const g = e.d / e.length;
    a[e.a][e.a] += g;
    a[e.b][e.b] += g;
    a[e.a][e.b] -= g;
    a[e.b][e.a] -= g;
  }
  a[source][n] = 1;
  a[sink][n] = -1;
  a[sink].fill(0);
  a[sink][sink] = 1;
  for (let k = 0; k < n; k++) {
    let pivot = k;
    for (let i = k + 1; i < n; i++)
      if (Math.abs(a[i][k]) > Math.abs(a[pivot][k])) pivot = i;
    [a[k], a[pivot]] = [a[pivot], a[k]];
    if (Math.abs(a[k][k]) < 1e-14)
      throw new Error("Disconnected transport graph");
    for (let i = k + 1; i < n; i++) {
      const f = a[i][k] / a[k][k];
      for (let j = k; j <= n; j++) a[i][j] -= f * a[k][j];
    }
  }
  const p = new Float64Array(n);
  for (let i = n - 1; i >= 0; i--) {
    let v = a[i][n];
    for (let j = i + 1; j < n; j++) v -= a[i][j] * p[j];
    p[i] = v / a[i][i];
  }
  return p;
}
export class Physarum {
  nodes: { x: number; y: number }[] = [];
  edges: Tube[] = [];
  source = 14;
  sink = 20;
  residual = 0;
  constructor(seed: number) {
    const rng = random(seed);
    for (let y = 0; y < 5; y++)
      for (let x = 0; x < 7; x++)
        this.nodes.push({
          x: 100 + x * 115 + (rng() - 0.5) * 28,
          y: 80 + y * 100 + (rng() - 0.5) * 28,
        });
    for (let a = 0; a < 35; a++)
      for (let b = a + 1; b < 35; b++) {
        const dx = Math.abs((a % 7) - (b % 7)),
          dy = Math.abs(Math.floor(a / 7) - Math.floor(b / 7));
        if (dx <= 1 && dy <= 1)
          this.edges.push({
            a,
            b,
            length:
              Math.hypot(
                this.nodes[a].x - this.nodes[b].x,
                this.nodes[a].y - this.nodes[b].y,
              ) / 100,
            d: 0.35,
            q: 0,
          });
      }
    this.solve();
  }
  solve() {
    const p = pressures(this.nodes.length, this.edges, this.source, this.sink);
    const balance = new Float64Array(this.nodes.length);
    for (const e of this.edges) {
      e.q = (e.d / e.length) * (p[e.a] - p[e.b]);
      balance[e.a] += e.q;
      balance[e.b] -= e.q;
    }
    balance[this.source] -= 1;
    balance[this.sink] += 1;
    this.residual = Math.max(...balance.map(Math.abs));
  }
  step(p: Record<string, number>, mode: number, dt = 0.03) {
    this.solve();
    if (mode === 0)
      for (const e of this.edges)
        e.d = Math.max(
          0.002,
          Math.min(
            5,
            e.d +
              dt *
                p.adaptation *
                (Math.pow(Math.abs(e.q), p.reinforcement) - p.decay * e.d),
          ),
        );
    this.solve();
  }
  interact(x: number, y: number) {
    let best = Infinity;
    this.nodes.forEach((p, i) => {
      const d = Math.hypot(x - p.x, y - p.y);
      if (i !== this.source && d < best) {
        best = d;
        this.sink = i;
      }
    });
    this.solve();
  }
  cost() {
    return this.edges.reduce((s, e) => s + e.d * e.length, 0);
  }
}
