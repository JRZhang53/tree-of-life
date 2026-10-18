import { random } from "../../core/random.ts";
export interface Sheep {
  x: number;
  y: number;
  vx: number;
  vy: number;
}
export interface Position {
  x: number;
  y: number;
}
export interface Cost {
  target: number;
  spread: number;
  behind: number;
  total: number;
}
export class OptimizedFlock {
  agents: Sheep[];
  dog: Sheep = { x: 240, y: 350, vx: 0, vy: 0 };
  target: Position = { x: 740, y: 210 };
  dogPath: Position[] = [];
  flockPath: Position[] = [];
  costs: Cost[] = [];
  selected = 0;
  cost: Cost = { target: 0, spread: 0, behind: 0, total: 0 };
  ticks = 0;
  constructor(seed: number) {
    const rng = random(seed);
    this.agents = Array.from({ length: 45 }, () => {
      const a = rng() * Math.PI * 2;
      return {
        x: 340 + 80 * rng(),
        y: 240 + 80 * rng(),
        vx: Math.cos(a),
        vy: Math.sin(a),
      };
    });
  }
  center(agents = this.agents) {
    return {
      x: agents.reduce((n, a) => n + a.x, 0) / agents.length,
      y: agents.reduce((n, a) => n + a.y, 0) / agents.length,
    };
  }
  objective(agents: Sheep[], dog: Position, p: Record<string, number>): Cost {
    const c = this.center(agents),
      dx = this.target.x - c.x,
      dy = this.target.y - c.y,
      distance = Math.hypot(dx, dy);
    const spread =
      (agents.reduce(
        (s, a) => s + ((a.x - c.x) ** 2 + (a.y - c.y) ** 2) ** 2,
        0,
      ) /
        agents.length) **
      0.25;
    const behind = Math.hypot(
      dog.x - c.x + (p.dogRange * dx) / (distance || 1),
      dog.y - c.y + (p.dogRange * dy) / (distance || 1),
    );
    return {
      target: distance,
      spread,
      behind,
      total:
        p.targetWeight * distance +
        p.spreadWeight * spread +
        p.behindWeight * behind,
    };
  }
  baseVelocities() {
    const c = this.center();
    return this.agents.map((a, i) => {
      let hx = 0,
        hy = 0,
        rx = 0,
        ry = 0,
        n = 0;
      this.agents.forEach((b, j) => {
        if (i === j) return;
        const dx = a.x - b.x,
          dy = a.y - b.y,
          d = Math.hypot(dx, dy) || 1e-9;
        if (d < 60) {
          const speed = Math.hypot(b.vx, b.vy) || 1;
          hx += b.vx / speed;
          hy += b.vy / speed;
          n++;
        }
        const repulsion = 2.5 * Math.exp(-d / 9);
        rx += (repulsion * dx) / d;
        ry += (repulsion * dy) / d;
      });
      const d = Math.hypot(c.x - a.x, c.y - a.y) || 1;
      return {
        x: 1.2 * (hx / Math.max(1, n) + (0.15 * (c.x - a.x)) / d) + rx,
        y: 1.2 * (hy / Math.max(1, n) + (0.15 * (c.y - a.y)) / d) + ry,
      };
    });
  }
  predict(dog: Position, base: Position[], range: number) {
    return this.agents.map((a, i) => {
      const dx = a.x - dog.x,
        dy = a.y - dog.y,
        d = Math.hypot(dx, dy) || 1e-9,
        avoid = 4 * Math.exp(-d / range);
      const vx = base[i].x + (avoid * dx) / d,
        vy = base[i].y + (avoid * dy) / d;
      return { x: a.x + vx, y: a.y + vy, vx, vy };
    });
  }
  step(p: Record<string, number>, directions = 32) {
    const base = this.baseVelocities(),
      candidates: { dog: Sheep; agents: Sheep[]; cost: Cost }[] = [];
    for (let j = 0; j < directions; j++) {
      const angle = (2 * Math.PI * j) / directions,
        vx = p.dogSpeed * Math.cos(angle),
        vy = p.dogSpeed * Math.sin(angle);
      const dog = { x: this.dog.x + vx, y: this.dog.y + vy, vx, vy },
        agents = this.predict(dog, base, p.dogRange);
      candidates.push({ dog, agents, cost: this.objective(agents, dog, p) });
    }
    this.selected = 0;
    for (let j = 1; j < candidates.length; j++)
      if (candidates[j].cost.total < candidates[this.selected].cost.total)
        this.selected = j;
    const best = candidates[this.selected];
    this.costs = candidates.map((c) => c.cost);
    this.cost = best.cost;
    this.dog = best.dog;
    this.agents = best.agents;
    if (this.ticks++ % 4 === 0) {
      this.dogPath.push({ ...this.dog });
      this.flockPath.push(this.center());
      if (this.dogPath.length > 500) {
        this.dogPath.shift();
        this.flockPath.shift();
      }
    }
  }
  view() {
    const all = [...this.agents, this.dog, this.target],
      minX = Math.min(...all.map((a) => a.x), 160),
      maxX = Math.max(...all.map((a) => a.x), 800),
      minY = Math.min(...all.map((a) => a.y), 120),
      maxY = Math.max(...all.map((a) => a.y), 440);
    const scale = Math.min(740 / (maxX - minX + 1), 380 / (maxY - minY + 1), 1);
    return { scale, x: (minX + maxX) / 2, y: (minY + maxY) / 2 };
  }
  interact(x: number, y: number) {
    const v = this.view();
    this.target = {
      x: (x - 450) / v.scale + v.x,
      y: (y - 280) / v.scale + v.y,
    };
  }
}
