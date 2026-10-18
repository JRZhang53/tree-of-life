/** Reflecting lattice, one unit point source per tick. Identical expected kernels. */
export class SignalTransport {
  width: number;
  height: number;
  field: Float32Array;
  particles: { i: number; w: number }[] = [];
  constructor(width: number, height: number) {
    this.width = width;
    this.height = height;
    this.field = new Float32Array(width * height);
  }
  neighbor(i: number, d: number) {
    const x = i % this.width,
      y = Math.floor(i / this.width);
    return d === 0
      ? x > 0
        ? i - 1
        : i
      : d === 1
        ? x < this.width - 1
          ? i + 1
          : i
        : d === 2
          ? y > 0
            ? i - this.width
            : i
          : y < this.height - 1
            ? i + this.width
            : i;
  }
  step(
    rate: number,
    decay: number,
    source: number,
    mode: number,
    rng: () => number,
  ) {
    if (mode === 0) {
      const out = new Float32Array(this.field.length);
      for (let i = 0; i < out.length; i++) {
        const mass = this.field[i] * (1 - decay);
        out[i] += mass * (1 - 4 * rate);
        for (let d = 0; d < 4; d++) out[this.neighbor(i, d)] += mass * rate;
      }
      out[source] += 1;
      this.field = out;
    } else {
      this.particles = this.particles.filter(() => rng() >= decay);
      for (const p of this.particles) {
        const r = rng();
        if (r < 4 * rate) p.i = this.neighbor(p.i, Math.floor(r / rate));
      }
      for (let k = 0; k < 24; k++)
        this.particles.push({ i: source, w: 1 / 24 });
      if (this.particles.length > 12000) {
        const mass = this.particles.reduce((s, p) => s + p.w, 0),
          w = mass / 8000;
        const out: { i: number; w: number }[] = [];
        let j = 0,
          sum = this.particles[0].w,
          offset = rng() * w;
        for (let k = 0; k < 8000; k++) {
          const target = offset + k * w;
          while (sum < target && j < this.particles.length - 1)
            sum += this.particles[++j].w;
          out.push({ i: this.particles[j].i, w });
        }
        this.particles = out;
      }
      this.field.fill(0);
      for (const p of this.particles) this.field[p.i] += p.w;
    }
  }
}
