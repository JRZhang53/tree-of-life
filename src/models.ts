import { nearest } from "./suites/starlings/neighbors.ts";
import { SignalTransport } from "./suites/termites/transport.ts";
import { random } from "./core/random.ts";
export { random } from "./core/random.ts";
import { Fireflies } from "./suites/fireflies/model.ts";
import { Physarum } from "./suites/physarum/model.ts";
import { ChemicalVolume } from "./suites/coral/volume.ts";
import { ElasticLeaf } from "./suites/leaves/elastic.ts";
import { Filament } from "./suites/vines/filament.ts";
import { GrowingSheet } from "./suites/leaves/sheet.ts";
import { OptimizedFlock } from "./suites/sheep/optimizer.ts";
import { Mound } from "./suites/termites/mound.ts";
import type { Parameters, SpeciesId } from "./catalog.ts";

export interface Point {
  x: number;
  y: number;
  z?: number;
}
export interface Agent extends Point {
  vx: number;
  vy: number;
  carrying?: boolean;
}
export interface Segment {
  a: Point;
  b: Point;
}
export const WIDTH = 900,
  HEIGHT = 560,
  COLS = 90,
  ROWS = 56;
export const clamp = (n: number, lo: number, hi: number) =>
  Math.max(lo, Math.min(hi, n));
export function leafPoint(
  u: number,
  v: number,
  p: Parameters,
  mode: number,
  ticks: number,
): Point {
  const width = p.width * Math.pow(Math.sin(Math.PI * u), 0.7),
    bend = p.growth * Math.min(1, ticks / 600);
  const y =
    mode === 1
      ? (bend < 1e-6 ? u : Math.sin(u * bend * 2) / (bend * 2)) * 360 - 160
      : u * 360 - 160;
  const z =
    mode === 1
      ? bend < 1e-6
        ? 0
        : ((1 - Math.cos(u * bend * 2)) / (bend * 2)) * 260
      : v * v * bend * 22 * Math.sin(u * (8 + 8 / p.stiffness) * Math.PI) +
        u * u * bend * 35;
  return { x: v * width, y, z };
}
const distance = (a: Point, b: Point) => Math.hypot(a.x - b.x, a.y - b.y);
const center = (points: Point[]) => ({
  x: points.reduce((n, p) => n + p.x, 0) / points.length,
  y: points.reduce((n, p) => n + p.y, 0) / points.length,
});
export function diffuse(input: Float32Array, rate: number, decay = 0) {
  const out = new Float32Array(input.length);
  for (let y = 0; y < ROWS; y++)
    for (let x = 0; x < COLS; x++) {
      const i = y * COLS + x,
        v = input[i];
      const sum =
        input[y * COLS + ((x + COLS - 1) % COLS)] +
        input[y * COLS + ((x + 1) % COLS)] +
        input[((y + ROWS - 1) % ROWS) * COLS + x] +
        input[((y + 1) % ROWS) * COLS + x];
      out[i] = Math.max(0, v + rate * (sum - 4 * v) - decay * v);
    }
  return out;
}

/** Pure seeded simulation state. Rendering and elapsed wall time never affect it. */
export class Simulation {
  filament?: Filament;
  sheet?: GrowingSheet;
  flock?: OptimizedFlock;
  mound?: Mound;
  transport?: SignalTransport;
  fireflies?: Fireflies;
  physarum?: Physarum;
  volume?: ChemicalVolume;
  elastic?: ElasticLeaf;
  id: SpeciesId;
  mode: number;
  p: Parameters;
  rng: () => number;
  ticks = 0;
  agents: Agent[] = [];
  predators: Agent[] = [];
  points: Point[] = [];
  segments: Segment[] = [];
  grid: Float32Array = new Float32Array(COLS * ROWS);
  chemical = new Float32Array(COLS * ROWS);
  cells = new Uint8Array(COLS * ROWS);
  target: Point = { x: 760, y: 280 };
  disturbance: Point | null = null;
  trails = new Float32Array(COLS * ROWS);
  pheromone: number[][] = [];
  bestRoute: number[] = [];
  bestLength = Infinity;
  phases: number[] = [];
  bends: number[] = Array(24).fill(0);
  count = 0;
  strategy = "Collecting";
  completed = false;
  private occupied = new Set<string>();
  private radius = 4;
  private walkers: Point[] = [];
  private vineRadius = 80;
  constructor(id: SpeciesId, mode: number, p: Parameters, seed: number) {
    this.id = id;
    this.mode = mode;
    this.p = { ...p };
    this.rng = random(seed);
    if (id === "vines" && mode >= 2)
      this.filament = new Filament(seed, mode === 3);
    if (id === "leaves" && mode >= 3)
      this.sheet = new GrowingSheet(p.sheetWidth, seed, mode === 4);
    if (id === "sheep" && mode === 2) this.flock = new OptimizedFlock(seed);
    if (id === "termites" && mode >= 2) this.mound = new Mound();
    if (this.filament) {
      const e = this.filament.evaluate(p.bending, p.tether);
      this.filament.energy = e.value;
      this.filament.stretch = e.stretch;
      this.filament.bend = e.bend;
      this.filament.residual = Math.sqrt(
        e.gradient.reduce(
          (s, g, i) =>
            s +
            (i > 1 && i < this.filament!.vertices.length - 2
              ? g.x * g.x + g.y * g.y + (mode === 3 ? g.z * g.z : 0)
              : 0),
          0,
        ),
      );
    }
    if (this.sheet) {
      const e = this.sheet.evaluate(0, p.thickness);
      this.sheet.energy = e.value;
      this.sheet.stretch = e.stretch;
      this.sheet.bend = e.bend;
      this.sheet.residual = Math.sqrt(
        e.gradient.reduce(
          (s, g, i) =>
            s +
            (mode === 4 && i % this.sheet!.cols === (this.sheet!.cols - 1) / 2
              ? 0
              : g.x * g.x + g.y * g.y + g.z * g.z),
          0,
        ),
      );
    }
    if (this.flock)
      this.flock.cost = this.flock.objective(
        this.flock.agents,
        this.flock.dog,
        p,
      );
    if (id === "fireflies") this.fireflies = new Fireflies(seed);
    if (id === "physarum") this.physarum = new Physarum(seed);
    if (id === "leaves" && mode === 2) this.elastic = new ElasticLeaf(p.width);
    if (id === "coral" && mode === 2)
      this.volume = new ChemicalVolume(this.rng);
    const swarm = ["starlings", "sheep", "orcas"].includes(id);
    if (swarm) {
      const n = id === "sheep" ? 45 : 150;
      this.agents = Array.from({ length: n }, () => {
        const a = this.rng() * Math.PI * 2,
          r = Math.sqrt(this.rng()) * (id === "orcas" ? 95 : 180);
        return {
          x: 380 + Math.cos(a) * r,
          y: 280 + Math.sin(a) * r,
          vx: (this.rng() - 0.5) * 2,
          vy: (this.rng() - 0.5) * 2,
        };
      });
      this.predators = Array.from(
        { length: id === "sheep" ? 1 : id === "orcas" ? 4 : 0 },
        (_, i) => ({
          x: (id === "orcas" ? 380 : 170) + Math.cos((i * Math.PI) / 2) * 180,
          y: 280 + Math.sin((i * Math.PI) / 2) * 180,
          vx: 0,
          vy: 0,
        }),
      );
    }
    if (id === "ants") {
      this.points = Array.from({ length: 8 }, (_, i) => ({
        x: 450 + Math.cos((i * Math.PI) / 4) * (170 + this.rng() * 90),
        y: 280 + Math.sin((i * Math.PI) / 4) * (130 + this.rng() * 55),
      }));
      this.pheromone = this.points.map(() => this.points.map(() => 1));
      this.agents = Array.from({ length: 100 }, () => {
        const a = this.rng() * Math.PI * 2;
        return {
          x: 180,
          y: 280,
          vx: Math.cos(a),
          vy: Math.sin(a),
          carrying: false,
        };
      });
      this.target = { x: 710, y: 260 };
    }
    if (id === "bacteria") {
      this.grid.fill(0.7);
      this.cells[28 * COLS + 45] = 1;
    }
    if (id === "termites") {
      this.transport = new SignalTransport(COLS, ROWS);
      this.target = { x: 450, y: 360 };
      this.cells[36 * COLS + 45] = 1;
    }
    if (id === "coral") {
      this.grid.fill(1);
      for (let j = 0; j < 8; j++) {
        const cx = 10 + Math.floor(this.rng() * 70),
          cy = 8 + Math.floor(this.rng() * 40);
        for (let y = cy - 2; y <= cy + 2; y++)
          for (let x = cx - 2; x <= cx + 2; x++) {
            this.chemical[y * COLS + x] = 0.8;
            this.grid[y * COLS + x] = 0.4;
          }
      }
      for (let y = -3; y <= 3; y++) {
        this.points.push({ x: 0, y, z: 0 });
        this.occupied.add(`0,${y},0`);
      }
      this.walkers = Array.from({ length: 32 }, () => this.spawnWalker());
    }
    if (id === "vines") this.points = [{ x: 80, y: -170, z: 0 }];
    if (id === "worms")
      this.phases = Array.from(
        { length: 24 },
        (_, i) => -i * 0.45 + this.rng() * 0.15,
      );
  }
  step() {
    if (this.completed) return;
    this.ticks++;
    if (this.filament) this.filament.step(this.p, this.ticks);
    else if (this.sheet) this.sheet.step(this.p, this.ticks);
    else if (this.flock) this.flock.step(this.p);
    else if (this.mound) this.mound.step(this.p, this.mode === 3);
    else if (this.fireflies) this.fireflies.step(this.p, this.mode);
    else if (this.physarum) {
      if (this.ticks % 4 === 0) this.physarum.step(this.p, this.mode);
    } else if (this.elastic)
      this.elastic.step(this.p.growth, this.p.stiffness, this.ticks);
    else if (this.volume) {
      for (let i = 0; i < 3; i++) this.volume.step(this.p.feed, this.p.kill);
    } else if (["starlings", "sheep", "orcas"].includes(this.id)) this.swarm();
    else if (this.id === "ants")
      this.mode === 0 ? this.optimize() : this.forage();
    else if (this.id === "bacteria") this.bacteria();
    else if (this.id === "termites") this.termites();
    else if (this.id === "coral")
      this.mode === 0 ? this.aggregate() : this.react();
    else if (this.id === "vines") this.vine();
    else if (this.id === "leaves" && this.ticks >= 600) this.completed = true;
    else if (this.id === "worms") this.worm();
  }
  private move(a: Agent, fx: number, fy: number, speed: number) {
    a.vx = a.vx * 0.94 + fx;
    a.vy = a.vy * 0.94 + fy;
    const v = Math.hypot(a.vx, a.vy);
    if (v > speed) {
      a.vx *= speed / v;
      a.vy *= speed / v;
    }
    a.x += a.vx;
    a.y += a.vy;
    if (a.x < 24 || a.x > WIDTH - 24) {
      a.x = clamp(a.x, 24, WIDTH - 24);
      a.vx *= -0.7;
    }
    if (a.y < 24 || a.y > HEIGHT - 24) {
      a.y = clamp(a.y, 24, HEIGHT - 24);
      a.vy *= -0.7;
    }
  }
  private swarm() {
    const sheep = this.id === "sheep",
      orca = this.id === "orcas";
    const active = sheep
      ? this.agents.filter((a) => distance(a, this.target) >= 70)
      : this.agents;
    const centroid = center(active.length ? active : this.agents);
    if (sheep) {
      if (!active.length) {
        this.strategy = "At goal";
        this.predators[0].vx = 0;
        this.predators[0].vy = 0;
        return;
      }
      const far = (active.length ? active : this.agents).reduce((a, b) =>
        distance(a, centroid) > distance(b, centroid) ? a : b,
      );
      const collect = this.mode === 0 && distance(far, centroid) > 110;
      this.strategy = collect ? "Collecting" : "Driving";
      const from = collect ? centroid : this.target,
        to = collect ? far : centroid,
        d = Math.max(1, distance(from, to));
      const desired = {
        x: to.x + ((to.x - from.x) / d) * 65,
        y: to.y + ((to.y - from.y) / d) * 65,
      };
      const dog = this.predators[0],
        dd = Math.max(1, distance(dog, desired));
      this.move(
        dog,
        ((desired.x - dog.x) / dd) * 0.35,
        ((desired.y - dog.y) / dd) * 0.35,
        2.5 * this.p.pace,
      );
    }
    if (orca)
      this.predators.forEach((a, i) => {
        const angle = this.ticks * 0.006 + (i * Math.PI) / 2;
        const dest =
          this.mode === 0
            ? {
                x: centroid.x + Math.cos(angle) * 135,
                y: centroid.y + Math.sin(angle) * 135,
              }
            : this.agents[i * 33];
        const d = Math.max(1, distance(a, dest));
        this.move(
          a,
          ((dest.x - a.x) / d) * 0.3,
          ((dest.y - a.y) / d) * 0.3,
          2.6 * this.p.pace,
        );
      });
    const next = this.agents.map((a) => {
      if (sheep && distance(a, this.target) < 70) return { ...a, vx: 0, vy: 0 };
      let sx = 0,
        sy = 0,
        ax = 0,
        ay = 0,
        cx = 0,
        cy = 0,
        n = 0;
      const neighbors =
        this.id === "starlings" && this.mode === 1
          ? nearest(active, a, 7)
          : active;
      for (const b of neighbors) {
        const dx = b.x - a.x,
          dy = b.y - a.y,
          d2 = dx * dx + dy * dy;
        if (
          d2 > 0 &&
          ((this.id === "starlings" && this.mode === 1) || d2 < 85 * 85)
        ) {
          n++;
          cx += b.x;
          cy += b.y;
          ax += b.vx;
          ay += b.vy;
          if (d2 < 22 * 22) {
            sx -= dx / (d2 + 1);
            sy -= dy / (d2 + 1);
          }
        }
      }
      const align = this.p.alignment ?? 0.6,
        cohesion = this.p.cohesion,
        sep = this.p.separation ?? 1.2;
      let fx = sx * sep * 2,
        fy = sy * sep * 2;
      if (n) {
        fx +=
          (cx / n - a.x) * 0.0009 * cohesion + (ax / n - a.vx) * 0.12 * align;
        fy +=
          (cy / n - a.y) * 0.0009 * cohesion + (ay / n - a.vy) * 0.12 * align;
      }
      if (sheep || orca) {
        fx += (centroid.x - a.x) * 0.0025 * cohesion;
        fy += (centroid.y - a.y) * 0.0025 * cohesion;
      }
      for (const pred of this.predators) {
        const dx = a.x - pred.x,
          dy = a.y - pred.y,
          d = Math.hypot(dx, dy);
        if (d < 100) {
          fx += (dx / (d + 1)) * (1 - d / 100) * 0.8 * this.p.fear;
          fy += (dy / (d + 1)) * (1 - d / 100) * 0.8 * this.p.fear;
        }
      }
      if (this.disturbance) {
        const dx = a.x - this.disturbance.x,
          dy = a.y - this.disturbance.y,
          d = Math.hypot(dx, dy);
        if (d < 130) {
          fx += (dx / (d + 1)) * 0.8;
          fy += (dy / (d + 1)) * 0.8;
        }
      }
      fx +=
        (a.x < 80 ? 0.08 : a.x > 820 ? -0.08 : 0) + (this.rng() - 0.5) * 0.035;
      fy +=
        (a.y < 70 ? 0.08 : a.y > 490 ? -0.08 : 0) + (this.rng() - 0.5) * 0.035;
      const copy = { ...a };
      this.move(copy, fx, fy, sheep ? 1.4 : 2.6);
      if (!sheep) {
        const v = Math.hypot(copy.vx, copy.vy) || 1;
        copy.vx = (copy.vx / v) * 2.2;
        copy.vy = (copy.vy / v) * 2.2;
      }
      return copy;
    });
    this.agents = next;
  }
  private optimize() {
    if (this.ticks % 6 !== 0) return;
    for (const row of this.pheromone)
      for (let j = 0; j < row.length; j++)
        row[j] = Math.max(0.02, row[j] * (1 - this.p.evaporation));
    for (let ant = 0; ant < 12; ant++) {
      const route = [Math.floor(this.rng() * 8)];
      while (route.length < 8) {
        const last = route[route.length - 1],
          choices = this.points
            .map((_, i) => i)
            .filter((i) => !route.includes(i));
        const weights = choices.map(
          (i) =>
            Math.pow(this.pheromone[last][i], this.p.influence) *
            Math.pow(200 / distance(this.points[last], this.points[i]), 2),
        );
        let pick = choices[Math.floor(this.rng() * choices.length)];
        if (this.rng() > this.p.exploration) {
          let ticket = this.rng() * weights.reduce((a, b) => a + b, 0);
          for (let k = 0; k < choices.length; k++) {
            ticket -= weights[k];
            if (ticket <= 0) {
              pick = choices[k];
              break;
            }
          }
        }
        route.push(pick);
      }
      const length = route.reduce(
        (n, a, i) =>
          n + distance(this.points[a], this.points[route[(i + 1) % 8]]),
        0,
      );
      if (length < this.bestLength) {
        this.bestLength = length;
        this.bestRoute = [...route];
      }
      route.forEach((a, i) => {
        const b = route[(i + 1) % 8];
        this.pheromone[a][b] += 150 / length;
        this.pheromone[b][a] = this.pheromone[a][b];
      });
      this.count++;
    }
  }
  private forage() {
    const home = { x: 180, y: 280 };
    for (let i = 0; i < this.trails.length; i++)
      this.trails[i] *= 1 - this.p.evaporation * 0.04;
    for (const ant of this.agents) {
      const goal = ant.carrying ? home : this.target;
      if (distance(ant, goal) < 18) {
        if (ant.carrying) this.count++;
        ant.carrying = !ant.carrying;
        ant.vx *= -1;
        ant.vy *= -1;
      }
      let angle = Math.atan2(ant.vy, ant.vx);
      if (ant.carrying || distance(ant, this.target) < 100)
        angle =
          Math.atan2(goal.y - ant.y, goal.x - ant.x) + (this.rng() - 0.5) * 0.4;
      else {
        const candidates = [angle - 0.5, angle, angle + 0.5];
        const score = candidates.map((a) => {
          const x = clamp(
              Math.floor((ant.x + Math.cos(a) * 24) / 10),
              0,
              COLS - 1,
            ),
            y = clamp(Math.floor((ant.y + Math.sin(a) * 24) / 10), 0, ROWS - 1);
          return (
            this.trails[y * COLS + x] * this.p.influence + this.rng() * 0.25
          );
        });
        angle = candidates[score.indexOf(Math.max(...score))];
        angle += (this.rng() - 0.5) * (0.25 + this.p.exploration * 2);
      }
      ant.vx = Math.cos(angle) * 2;
      ant.vy = Math.sin(angle) * 2;
      this.move(ant, 0, 0, 2);
      if (ant.carrying) {
        const i =
          clamp(Math.floor(ant.y / 10), 0, ROWS - 1) * COLS +
          clamp(Math.floor(ant.x / 10), 0, COLS - 1);
        this.trails[i] = Math.min(6, this.trails[i] + 0.4);
      }
    }
  }
  private bacteria() {
    this.grid = diffuse(this.grid, this.p.diffusion);
    const next = this.cells.slice();
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) {
        const i = y * COLS + x;
        if (x === 0 || y === 0 || x === COLS - 1 || y === ROWS - 1)
          this.grid[i] = this.p.supply;
        if (this.mode === 1)
          this.grid[i] += (this.p.supply - this.grid[i]) * 0.015;
        if (!this.cells[i]) continue;
        this.grid[i] = Math.max(0, this.grid[i] - 0.008);
        if (this.rng() < this.p.growth * this.grid[i]) {
          const dirs = [
              [-1, 0],
              [1, 0],
              [0, -1],
              [0, 1],
            ],
            d = dirs[Math.floor(this.rng() * 4)],
            xx = x + d[0],
            yy = y + d[1];
          if (xx > 0 && xx < COLS - 1 && yy > 0 && yy < ROWS - 1) {
            const j = yy * COLS + xx;
            if (!this.cells[j] && this.grid[j] > 0.03) {
              next[j] = 1;
              this.grid[j] = Math.max(0, this.grid[j] - 0.03);
            }
          }
        }
      }
    this.cells = next;
  }
  private termites() {
    const sx = clamp(Math.floor(this.target.x / 10), 1, COLS - 2),
      sy = clamp(Math.floor(this.target.y / 10), 1, ROWS - 2);
    this.transport!.step(
      this.p.diffusion,
      this.p.decay,
      sy * COLS + sx,
      this.mode,
      this.rng,
    );
    this.grid = this.transport!.field;
    if (this.ticks % 4 === 0) {
      const next = this.cells.slice();
      for (let y = 1; y < ROWS - 1; y++)
        for (let x = 1; x < COLS - 1; x++) {
          const i = y * COLS + x;
          if (
            !this.cells[i] &&
            this.grid[i] > this.p.threshold &&
            (this.cells[i - 1] ||
              this.cells[i + 1] ||
              this.cells[i - COLS] ||
              this.cells[i + COLS]) &&
            this.rng() < 0.14
          )
            next[i] = 1;
        }
      this.cells = next;
    }
  }
  private spawnWalker(): Point {
    const a = this.rng() * Math.PI * 2,
      z = this.rng() * 2 - 1,
      r = this.radius + 4;
    return {
      x: Math.round(Math.sqrt(1 - z * z) * Math.cos(a) * r),
      y: Math.round(Math.sqrt(1 - z * z) * Math.sin(a) * r),
      z: Math.round(z * r),
    };
  }
  private aggregate() {
    const dirs = [
      [1, 0, 0],
      [-1, 0, 0],
      [0, 1, 0],
      [0, -1, 0],
      [0, 0, 1],
      [0, 0, -1],
    ];
    for (let j = 0; j < this.walkers.length; j++)
      for (let k = 0; k < 18; k++) {
        let w = this.walkers[j];
        const d =
          this.rng() < this.p.flow
            ? [1, 0, 0]
            : dirs[Math.floor(this.rng() * 6)];
        const candidate = { x: w.x + d[0], y: w.y + d[1], z: w.z! + d[2] };
        if (this.occupied.has(`${candidate.x},${candidate.y},${candidate.z}`)) {
          this.walkers[j] = this.spawnWalker();
          continue;
        }
        w = candidate;
        this.walkers[j] = w;
        const neighbor = dirs.find((d) =>
          this.occupied.has(`${w.x + d[0]},${w.y + d[1]},${w.z! + d[2]}`),
        );
        if (neighbor) {
          this.occupied.add(`${w.x},${w.y},${w.z}`);
          this.points.push({ ...w });
          this.segments.push({
            a: { ...w },
            b: {
              x: w.x + neighbor[0],
              y: w.y + neighbor[1],
              z: w.z! + neighbor[2],
            },
          });
          this.radius = Math.max(this.radius, Math.hypot(w.x, w.y, w.z!));
          this.walkers[j] = this.spawnWalker();
        } else if (Math.hypot(w.x, w.y, w.z!) > this.radius + 14)
          this.walkers[j] = this.spawnWalker();
        if (this.points.length >= 1800) {
          this.completed = true;
          return;
        }
      }
  }
  private react() {
    for (let sub = 0; sub < 6; sub++) {
      const a = diffuse(this.grid, 0.19),
        b = diffuse(this.chemical, 0.095);
      for (let i = 0; i < a.length; i++) {
        const reaction = this.grid[i] * this.chemical[i] ** 2;
        a[i] = clamp(a[i] - reaction + this.p.feed * (1 - this.grid[i]), 0, 1);
        b[i] = clamp(
          b[i] + reaction - (this.p.kill + this.p.feed) * this.chemical[i],
          0,
          1,
        );
      }
      this.grid = a;
      this.chemical = b;
    }
  }
  private vine() {
    if (this.points.length >= 1000) {
      this.completed = true;
      return;
    }
    if (this.mode === 0)
      this.vineRadius +=
        (this.p.radius + 5 - this.vineRadius) * this.p.response * 0.012;
    else this.vineRadius += (80 - this.vineRadius) * 0.02;
    const angle = this.ticks * 0.035 * this.p.twist;
    this.points.push({
      x: Math.cos(angle) * this.vineRadius,
      y: -170 + this.ticks * 0.4,
      z: Math.sin(angle) * this.vineRadius,
    });
  }
  private worm() {
    if (this.mode >= 2) {
      const previous = [...this.bends];
      this.bends[0] = Math.sin(
        (this.ticks / 60) * this.p.frequency * Math.PI * 2,
      );
      for (let i = 1; i < 24; i++) {
        const target = this.mode === 3 && i === 12 ? 0 : previous[i - 1];
        this.bends[i] += ((target - previous[i]) * this.p.coupling * 8) / 60;
      }
      return;
    }
    const prev = [...this.phases],
      dt = 1 / 60,
      frequency = this.p.frequency * Math.PI * 2;
    this.phases[0] += frequency * dt;
    for (let i = 1; i < prev.length; i++) {
      const coupling = this.mode === 1 && i === 12 ? 0 : this.p.coupling;
      this.phases[i] +=
        (frequency * 0.65 + coupling * Math.sin(prev[i - 1] - prev[i] - 0.4)) *
        dt;
    }
  }
  interact(x: number, y: number) {
    if (this.flock) {
      this.flock.interact(x, y);
      return;
    }
    if (this.mound) return;
    if (this.fireflies) this.fireflies.interact(x, y);
    if (this.physarum) this.physarum.interact(x, y);
    if (
      this.id === "sheep" ||
      this.id === "termites" ||
      (this.id === "ants" && this.mode === 1)
    )
      this.target = { x: clamp(x, 40, 860), y: clamp(y, 40, 520) };
    else if (this.id === "bacteria")
      this.cells[
        clamp(Math.floor(y / 10), 1, ROWS - 2) * COLS +
          clamp(Math.floor(x / 10), 1, COLS - 2)
      ] = 1;
    else if (this.id === "starlings" || this.id === "orcas")
      this.disturbance = { x, y };
  }
  metrics(): [string, string][] {
    if (this.filament)
      return [
        ["Sideways displacement", this.filament.deflection().toFixed(3)],
        ["Elastic energy", this.filament.energy.toFixed(3)],
        ["Force residual", this.filament.residual.toExponential(2)],
      ];
    if (this.sheet)
      return [
        ["Stretching energy", this.sheet.stretch.toFixed(4)],
        ["Bending energy", this.sheet.bend.toFixed(4)],
        ["Force residual", this.sheet.residual.toExponential(2)],
      ];
    if (this.flock) {
      const c = this.flock.objective(this.flock.agents, this.flock.dog, this.p);
      return [
        ["Target distance", c.target.toFixed(1) + " u"],
        ["Flock spread (4th moment)", c.spread.toFixed(1) + " u"],
        ["Chosen move cost", this.flock.cost.total.toFixed(2)],
      ];
    }
    if (this.mound)
      return [
        ["Cavity area", String(this.mound.area()) + " cells"],
        ["Thermal cycle", (this.mound.ticks / 160).toFixed(1)],
        ["Flux divergence", this.mound.divergence.toExponential(1)],
        [
          "Odor budget error",
          Math.abs(this.mound.budgetError).toExponential(1),
        ],
      ];
    if (this.fireflies)
      return [
        ["Oscillators", String(this.fireflies.nodes.length)],
        ["Synchrony", this.fireflies.coherence().toFixed(3)],
      ];
    if (this.physarum)
      return [
        ["Tube investment", this.physarum.cost().toFixed(2)],
        ["Flow residual", this.physarum.residual.toExponential(1)],
      ];
    if (this.elastic)
      return [
        ["Elastic energy", this.elastic.energy.toFixed(2)],
        [
          "Peak deflection",
          Math.max(...this.elastic.vertices.map((p) => Math.abs(p.z))).toFixed(
            2,
          ) + " u",
        ],
      ];
    if (this.volume)
      return [
        ["Volume sites", String(this.volume.a.length)],
        [
          "Mean chemical B",
          (
            this.volume.b.reduce((a, b) => a + b, 0) / this.volume.b.length
          ).toFixed(3),
        ],
      ];
    if (this.id === "starlings") {
      const sum = this.agents.reduce(
        (s, a) => {
          const v = Math.hypot(a.vx, a.vy) || 1;
          return { x: s.x + a.vx / v, y: s.y + a.vy / v };
        },
        { x: 0, y: 0 },
      );
      return [
        ["Birds", String(this.agents.length)],
        [
          "Alignment",
          (Math.hypot(sum.x, sum.y) / this.agents.length).toFixed(2),
        ],
      ];
    }
    if (this.id === "sheep")
      return [
        [
          "In goal",
          `${this.agents.filter((a) => distance(a, this.target) < 70).length} / ${this.agents.length}`,
        ],
        ["Dog strategy", this.strategy],
      ];
    if (this.id === "orcas") {
      const c = center(this.agents);
      return [
        ["Fish", String(this.agents.length)],
        [
          "School spread",
          `${Math.round(this.agents.reduce((n, a) => n + distance(a, c), 0) / this.agents.length)} u`,
        ],
      ];
    }
    if (this.id === "ants")
      return this.mode === 0
        ? [
            ["Tours tried", String(this.count)],
            [
              "Best tour",
              Number.isFinite(this.bestLength)
                ? `${Math.round(this.bestLength)} u`
                : "Searching",
            ],
          ]
        : [
            ["Foragers", "100"],
            ["Food delivered", String(this.count)],
          ];
    if (this.id === "bacteria")
      return [
        ["Occupied sites", String(this.cells.reduce((a, b) => a + b, 0))],
        [
          "Mean nutrient",
          (this.grid.reduce((a, b) => a + b, 0) / this.grid.length).toFixed(2),
        ],
      ];
    if (this.id === "termites")
      return [
        ["Material sites", String(this.cells.reduce((a, b) => a + b, 0))],
        ["Signal model", this.mode === 0 ? "Field" : "Particles"],
      ];
    if (this.id === "coral")
      return this.mode === 0
        ? [
            ["Growth sites", String(this.points.length)],
            ["Dimensions", "3D"],
          ]
        : [
            ["Chemical steps", String(this.ticks * 6)],
            [
              "Mean chemical B",
              (
                this.chemical.reduce((a, b) => a + b, 0) / this.chemical.length
              ).toFixed(3),
            ],
          ];
    if (this.id === "vines")
      return [
        ["Stem samples", String(this.points.length)],
        ["Tip radius", `${this.vineRadius.toFixed(1)} u`],
      ];
    if (this.id === "leaves")
      return [
        [
          "Applied mismatch",
          (this.p.growth * Math.min(1, this.ticks / 600)).toFixed(2),
        ],
        ["Model", "Shape sketch"],
      ];
    if (this.id === "worms" && this.mode >= 2)
      return [
        ["Body segments", "24"],
        ["Feedback", this.mode === 2 ? "Bend relay" : "Relay cut at 12"],
      ];
    return [
      ["Body segments", String(this.phases.length)],
      ["Feedback", this.mode === 0 ? "Intact" : "Cut at 12"],
    ];
  }
}
