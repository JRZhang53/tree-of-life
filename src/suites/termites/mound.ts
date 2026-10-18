/** Cartesian cross-section reduction of thermal/odor/exterior-wall feedback.
 * Face fluxes are shared by adjacent cells; the odor budget is measured before
 * geometry edits, whose separate removal term is included in the same budget. */
export class Mound {
  nx = 40;
  ny = 28;
  heights: number[];
  mask: Uint8Array;
  heat: Float64Array;
  odor: Float64Array;
  pressure: Float64Array;
  cycleCue: Float64Array;
  faces: { a: number; b: number; vertical: boolean; flow: number }[] = [];
  boundary = new Uint8Array(this.nx * this.ny);
  ticks = 0;
  time = 0;
  divergence = 0;
  budgetError = 0;
  changed = 0;
  temperature = 0;
  constructor() {
    this.heights = Array.from({ length: this.nx }, (_, x) =>
      Math.abs(x - 19.5) < 14
        ? Math.round(17 * Math.sqrt(1 - ((x - 19.5) / 14) ** 2)) + 2
        : 0,
    );
    const n = this.nx * this.ny;
    this.mask = new Uint8Array(n);
    this.heat = new Float64Array(n);
    this.odor = new Float64Array(n);
    this.pressure = new Float64Array(n);
    this.cycleCue = new Float64Array(n);
    this.rebuild();
  }
  rebuild() {
    this.faces = [];
    this.boundary.fill(0);
    for (let y = 0; y < this.ny; y++)
      for (let x = 0; x < this.nx; x++)
        this.mask[y * this.nx + x] = y < this.heights[x] ? 1 : 0;
    for (let y = 0; y < this.ny; y++)
      for (let x = 0; x < this.nx; x++) {
        const i = y * this.nx + x;
        if (!this.mask[i]) continue;
        for (const [dx, dy] of [
          [1, 0],
          [0, 1],
        ]) {
          const j = (y + dy) * this.nx + x + dx;
          if (x + dx < this.nx && y + dy < this.ny && this.mask[j])
            this.faces.push({ a: i, b: j, vertical: dy === 1, flow: 0 });
        }
        let walls = 0;
        for (const [dx, dy] of [
          [1, 0],
          [-1, 0],
          [0, 1],
          [0, -1],
        ]) {
          if (y + dy < 0) continue; // insulated ground
          const xx = x + dx,
            yy = y + dy;
          if (
            xx < 0 ||
            xx >= this.nx ||
            yy >= this.ny ||
            !this.mask[yy * this.nx + xx]
          )
            walls++;
        }
        this.boundary[i] = walls;
      }
  }
  project(buoyancy: number, iterations = 120) {
    const rhs = new Float64Array(this.mask.length),
      neighbors: number[][] = Array.from(this.mask, () => []);
    for (const f of this.faces) {
      f.flow = f.vertical
        ? (buoyancy * (this.heat[f.a] + this.heat[f.b])) / 2
        : 0;
      rhs[f.a] += f.flow;
      rhs[f.b] -= f.flow;
      neighbors[f.a].push(f.b);
      neighbors[f.b].push(f.a);
    }
    // div(u0 - grad p)=0: p_i=(sum p_j - div u0_i)/degree.
    for (let k = 0; k < iterations; k++) {
      for (let i = 0; i < this.mask.length; i++)
        if (neighbors[i].length) {
          const next =
            (neighbors[i].reduce((s, j) => s + this.pressure[j], 0) - rhs[i]) /
            neighbors[i].length;
          this.pressure[i] += 1.5 * (next - this.pressure[i]);
        }
      const mean =
        this.pressure.reduce((s, v, i) => s + (this.mask[i] ? v : 0), 0) /
        this.area();
      for (let i = 0; i < this.mask.length; i++)
        if (this.mask[i]) this.pressure[i] -= mean;
    }
    let max = 0;
    for (const f of this.faces) {
      f.flow -= this.pressure[f.b] - this.pressure[f.a];
      max = Math.max(max, Math.abs(f.flow));
    }
    const div = new Float64Array(this.mask.length),
      scale = Math.min(1, 0.8 / (max || 1));
    for (const f of this.faces) {
      f.flow *= scale;
      div[f.a] += f.flow;
      div[f.b] -= f.flow;
    }
    this.divergence = Math.max(...div.map(Math.abs));
  }
  step(p: Record<string, number>, frozen = false, dt = 0.1) {
    const period = 16;
    const previousCycle = Math.floor((this.time + 1e-9) / period);
    this.temperature = p.thermal * Math.sin((2 * Math.PI * this.time) / period);
    const dh = new Float64Array(this.mask.length);
    for (const f of this.faces) {
      const flux = 0.6 * (this.heat[f.b] - this.heat[f.a]);
      dh[f.a] += flux;
      dh[f.b] -= flux;
    }
    for (let i = 0; i < this.mask.length; i++)
      if (this.mask[i])
        this.heat[i] +=
          dt *
          (dh[i] +
            0.6 * (this.boundary[i] || 0) * (this.temperature - this.heat[i]));
    this.project(p.buoyancy);
    const before = this.mass(),
      delta = new Float64Array(this.mask.length);
    for (const f of this.faces) {
      const flux =
        0.14 * (this.odor[f.a] - this.odor[f.b]) +
        f.flow * (f.flow >= 0 ? this.odor[f.a] : this.odor[f.b]);
      delta[f.a] -= dt * flux;
      delta[f.b] += dt * flux;
    }
    let loss = 0;
    for (let i = 0; i < this.mask.length; i++)
      if (this.mask[i]) {
        const leak = dt * 0.08 * (this.boundary[i] || 0) * this.odor[i];
        delta[i] -= leak;
        loss += leak;
      }
    const source = Math.floor(this.nx / 2),
      added = dt * 0.12;
    delta[source] += added;
    for (let i = 0; i < this.mask.length; i++)
      if (this.mask[i]) {
        this.odor[i] += delta[i];
        this.cycleCue[i] += (dt * this.odor[i]) / period;
      }
    this.ticks++;
    this.time += dt;
    if (Math.floor((this.time + 1e-9) / period) > previousCycle) {
      if (!frozen) loss += this.construct(p.wallThreshold);
      this.cycleCue.fill(0);
    }
    this.budgetError = this.mass() - before - added + loss;
  }
  construct(threshold: number) {
    const next = [...this.heights];
    let removed = 0;
    for (let x = 2; x < this.nx - 2; x++) {
      const h = this.heights[x];
      if (h > 0) {
        const cue = this.cycleCue[(h - 1) * this.nx + x];
        if (cue > threshold && h < this.ny - 2) next[x]++;
        else if (cue < threshold * 0.5 && h > 3) next[x]--;
      } else {
        for (const j of [x - 1, x + 1])
          if (this.heights[j] > 3 && this.cycleCue[j] > threshold) next[x] = 3;
      }
    }
    for (let x = 0; x < this.nx; x++) {
      this.changed += Math.abs(next[x] - this.heights[x]);
      for (
        let y = Math.min(next[x], this.heights[x]);
        y < Math.max(next[x], this.heights[x]);
        y++
      ) {
        const i = y * this.nx + x;
        removed += this.odor[i];
        this.odor[i] = 0;
        this.heat[i] = this.temperature;
        this.pressure[i] = 0;
      }
    }
    this.heights = next;
    this.rebuild();
    return removed;
  }
  mass() {
    return this.odor.reduce((s, v) => s + v, 0);
  }
  area() {
    return this.mask.reduce((s, v) => s + v, 0);
  }
}
