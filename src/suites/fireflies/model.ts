import { random } from "../../core/random.ts";

/** Continuous phase coupling, not a pulse-response reconstruction. dt=1/60. */
export class Fireflies {
  nodes: { x: number; y: number; phase: number; offset: number }[];
  constructor(seed: number, count = 96) {
    const rng = random(seed);
    this.nodes = Array.from({ length: count }, () => ({
      x: 70 + rng() * 760,
      y: 65 + rng() * 405,
      phase: rng() * Math.PI * 2,
      offset: rng() * 2 - 1,
    }));
  }
  step(p: Record<string, number>, mode: number, dt = 1 / 60) {
    const next = this.nodes.map((a) => {
      let signal = 0,
        n = 0;
      for (const b of this.nodes) {
        if (
          a === b ||
          (mode === 1 && Math.hypot(a.x - b.x, a.y - b.y) > p.range)
        )
          continue;
        signal += Math.sin(b.phase - a.phase);
        n++;
      }
      return (
        (a.phase +
          dt *
            (2 +
              a.offset * p.diversity +
              (p.coupling * signal) / Math.max(1, n)) +
          Math.PI * 2) %
        (Math.PI * 2)
      );
    });
    this.nodes.forEach((a, i) => (a.phase = next[i]));
  }
  coherence() {
    return (
      Math.hypot(
        this.nodes.reduce((s, a) => s + Math.cos(a.phase), 0),
        this.nodes.reduce((s, a) => s + Math.sin(a.phase), 0),
      ) / this.nodes.length
    );
  }
  interact(x: number, y: number) {
    for (const a of this.nodes)
      if (Math.hypot(a.x - x, a.y - y) < 100) a.phase = 0;
  }
}
