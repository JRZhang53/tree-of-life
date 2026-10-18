/** Periodic 3D Gray–Scott lattice. Unit spacing; explicit Euler dt=.5. */
export class ChemicalVolume {
  size = 22;
  a: Float32Array;
  b: Float32Array;
  constructor(rng: () => number) {
    const n = this.size;
    this.a = new Float32Array(n ** 3).fill(1);
    this.b = new Float32Array(n ** 3);
    for (let z = 0; z < n; z++)
      for (let y = 0; y < n; y++)
        for (let x = 0; x < n; x++) {
          if (Math.hypot(x - n / 2, y - n / 2, z - n / 2) < 4) {
            const i = this.index(x, y, z);
            this.a[i] = 0.5;
            this.b[i] = 0.25 + rng() * 0.05;
          }
        }
  }
  index(x: number, y: number, z: number) {
    const n = this.size;
    return ((z + n) % n) * n * n + ((y + n) % n) * n + ((x + n) % n);
  }
  step(feed: number, kill: number, dt = 0.5) {
    const n = this.size,
      a = new Float32Array(this.a.length),
      b = new Float32Array(this.b.length);
    for (let z = 0; z < n; z++)
      for (let y = 0; y < n; y++)
        for (let x = 0; x < n; x++) {
          const i = this.index(x, y, z),
            neighbors = [
              this.index(x - 1, y, z),
              this.index(x + 1, y, z),
              this.index(x, y - 1, z),
              this.index(x, y + 1, z),
              this.index(x, y, z - 1),
              this.index(x, y, z + 1),
            ];
          let la = -6 * this.a[i],
            lb = -6 * this.b[i];
          for (const j of neighbors) {
            la += this.a[j];
            lb += this.b[j];
          }
          const reaction = this.a[i] * this.b[i] ** 2;
          a[i] =
            this.a[i] + dt * (0.16 * la - reaction + feed * (1 - this.a[i]));
          b[i] =
            this.b[i] + dt * (0.08 * lb + reaction - (feed + kill) * this.b[i]);
        }
    this.a = a;
    this.b = b;
  }
}
