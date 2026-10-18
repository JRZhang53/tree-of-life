import {
  Simulation,
  WIDTH,
  HEIGHT,
  COLS,
  ROWS,
  clamp,
  leafPoint,
} from "./models.ts";
import type { Point } from "./models.ts";
import { drawDepth } from "./presentation/depth-render.ts";

export function draw(
  ctx: CanvasRenderingContext2D,
  sim: Simulation,
  angle: number,
  annotations = true,
  labelScale = 1,
) {
  let caption = "";
  const w = ctx.canvas.width,
    h = ctx.canvas.height;
  ctx.setTransform(w / WIDTH, 0, 0, h / HEIGHT, 0, 0);
  ctx.clearRect(0, 0, WIDTH, HEIGHT);
  ctx.fillStyle = sim.id === "orcas" ? "#e8f2f7" : "#ffffff";
  ctx.fillRect(0, 0, WIDTH, HEIGHT);
  ctx.lineCap = "round";
  ctx.lineJoin = "round";
  const depthCaption = drawDepth(ctx, sim, angle, annotations, labelScale);
  if (depthCaption !== undefined) return depthCaption;
  const line = (a: Point, b: Point, color: string, width = 1) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };
  const circle = (x: number, y: number, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(x, y, r, 0, Math.PI * 2);
    ctx.fill();
  };
  const label = (text: string, x: number, y: number, color = "#52685b") => {
    if (!annotations) return;
    const size = Math.max(13, 12 * labelScale);
    ctx.font = `${size}px Verdana,sans-serif`;
    ctx.fillStyle = color;
    ctx.textAlign = "center";
    const half = ctx.measureText(text).width / 2 + 6 * labelScale;
    ctx.fillText(
      text,
      clamp(x, half, WIDTH - half),
      clamp(y, size, HEIGHT - 6 * labelScale),
    );
  };
  const ring = (p: Point, r: number, color: string) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = 1.5;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, Math.PI * 2);
    ctx.stroke();
  };
  const project = (p: Point, scale = 1): Point => {
    const x = p.x * Math.cos(angle) - (p.z ?? 0) * Math.sin(angle),
      z = p.x * Math.sin(angle) + (p.z ?? 0) * Math.cos(angle);
    return {
      x: 450 + x * scale,
      y: 305 - p.y * scale * 0.84 + z * scale * 0.36,
      z,
    };
  };
  if (["starlings", "sheep", "orcas"].includes(sim.id)) {
    if (sim.id === "sheep") {
      circle(sim.target.x, sim.target.y, 70, "#77935419");
      ring(sim.target, 70, "#7f9760");
      label("Goal", sim.target.x, sim.target.y + 90);
    }
    for (let i = 0; i < sim.agents.length; i++) {
      const a = sim.agents[i],
        theta = Math.atan2(a.vy, a.vx);
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(theta);
      if (sim.id === "sheep") {
        ctx.fillStyle = "#66745c25";
        ctx.beginPath();
        ctx.ellipse(1, 3, 7, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.fillStyle = "#fafbf6";
        ctx.strokeStyle = "#72816a";
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.ellipse(0, 0, 7, 4.5, 0, 0, Math.PI * 2);
        ctx.fill();
        ctx.stroke();
        circle(6, 0, 2.4, "#45563f");
      } else if (sim.id === "orcas") {
        ctx.fillStyle = i % 4 === 0 ? "#407f8b" : "#739a9e";
        ctx.beginPath();
        ctx.moveTo(5, 0);
        ctx.quadraticCurveTo(-1, -3, -5, 0);
        ctx.lineTo(-8, -3);
        ctx.lineTo(-8, 3);
        ctx.lineTo(-5, 0);
        ctx.quadraticCurveTo(-1, 3, 5, 0);
        ctx.fill();
      } else {
        const flap = Math.sin(sim.ticks * 0.2 + i) * 2;
        ctx.strokeStyle = i % 5 === 0 ? "#6b8a81" : "#314d4b";
        ctx.lineWidth = 1.8;
        ctx.beginPath();
        ctx.moveTo(-4, -5 - flap);
        ctx.quadraticCurveTo(3, -3, 3, 0);
        ctx.quadraticCurveTo(3, 3, -4, 5 + flap);
        ctx.stroke();
      }
      ctx.restore();
    }
    sim.predators.forEach((a) => {
      ctx.save();
      ctx.translate(a.x, a.y);
      ctx.rotate(Math.atan2(a.vy, a.vx));
      if (sim.id === "orcas") {
        ctx.fillStyle = "#234b52";
        ctx.beginPath();
        ctx.ellipse(0, 0, 21, 8, 0, 0, Math.PI * 2);
        ctx.fill();
        circle(10, -3, 3, "#e5f1e9");
        ctx.beginPath();
        ctx.moveTo(-16, 0);
        ctx.lineTo(-28, -10);
        ctx.lineTo(-24, 0);
        ctx.lineTo(-28, 10);
        ctx.closePath();
        ctx.fill();
        ctx.beginPath();
        ctx.moveTo(-2, 0);
        ctx.lineTo(-9, -17);
        ctx.lineTo(7, 0);
        ctx.fill();
      } else {
        ctx.fillStyle = "#8c5d35";
        ctx.beginPath();
        ctx.ellipse(0, 0, 9, 5, 0, 0, Math.PI * 2);
        ctx.fill();
        circle(8, 0, 4, "#3a463b");
        line({ x: -7, y: 0 }, { x: -15, y: -3 }, "#3a463b", 3);
      }
      ctx.restore();
    });
    if (sim.disturbance) {
      ring(sim.disturbance, 25, "#a36b5a");
      line(
        { x: sim.disturbance.x - 5, y: sim.disturbance.y - 5 },
        { x: sim.disturbance.x + 5, y: sim.disturbance.y + 5 },
        "#a36b5a",
        2,
      );
      line(
        { x: sim.disturbance.x + 5, y: sim.disturbance.y - 5 },
        { x: sim.disturbance.x - 5, y: sim.disturbance.y + 5 },
        "#a36b5a",
        2,
      );
    }
  }
  if (sim.id === "ants") {
    if (sim.mode === 0) {
      for (let a = 0; a < 8; a++)
        for (let b = a + 1; b < 8; b++)
          line(
            sim.points[a],
            sim.points[b],
            `rgba(155,104,63,${clamp(sim.pheromone[a][b] / 8, 0.035, 0.5)})`,
            clamp(sim.pheromone[a][b] / 2, 1, 5),
          );
      if (sim.bestRoute.length)
        sim.bestRoute.forEach((id, i) => {
          const a = sim.points[id],
            b = sim.points[sim.bestRoute[(i + 1) % 8]];
          line(a, b, "#95633e", 2.5);
          const t = (sim.ticks * 0.008 + i * 0.12) % 1;
          circle(a.x + (b.x - a.x) * t, a.y + (b.y - a.y) * t, 3, "#293d32");
        });
      sim.points.forEach((p, i) => {
        circle(p.x, p.y, 12, "#fbfcf7");
        ring(p, 12, "#9c7751");
        label(String(i + 1), p.x, p.y + 5);
      });
      caption =
        "Line weight shows pheromone. The solid route is the shortest tour found.";
    } else {
      for (let y = 0; y < ROWS; y++)
        for (let x = 0; x < COLS; x++) {
          const v = sim.trails[y * COLS + x];
          if (v > 0.05) {
            ctx.fillStyle = `rgba(170,125,55,${Math.min(0.6, v * 0.13)})`;
            ctx.fillRect(x * 10, y * 10, 10, 10);
          }
        }
      circle(180, 280, 21, "#c2aa7d");
      circle(180, 280, 10, "#7b6844");
      label("Nest", 180, 320);
      for (let i = 0; i < 9; i++)
        circle(
          sim.target.x + Math.cos(i * 2.4) * Math.sqrt(i) * 6,
          sim.target.y + Math.sin(i * 2.4) * Math.sqrt(i) * 6,
          4,
          "#6f8a45",
        );
      label("Food", sim.target.x, sim.target.y + 40);
      sim.agents.forEach((a) => {
        line(
          { x: a.x - a.vx, y: a.y - a.vy },
          { x: a.x + a.vx, y: a.y + a.vy },
          "#64513a",
          2.5,
        );
        if (a.carrying) circle(a.x + 3, a.y - 3, 2, "#78903e");
      });
    }
  }
  if (sim.id === "bacteria" || sim.id === "termites") {
    for (let y = 0; y < ROWS; y++)
      for (let x = 0; x < COLS; x++) {
        const i = y * COLS + x,
          v = sim.grid[i];
        ctx.fillStyle =
          sim.id === "bacteria"
            ? `rgba(127,157,97,${clamp(v * 0.21, 0, 0.25)})`
            : `rgba(214,172,70,${clamp(v * 0.7, 0, 0.65)})`;
        ctx.fillRect(x * 10, y * 10, 10, 10);
        if (sim.cells[i]) {
          if (sim.id === "bacteria") {
            ctx.fillStyle = `hsl(${275 + v * 25} 22% ${42 + v * 25}%)`;
            ctx.beginPath();
            ctx.ellipse(
              x * 10 + 5,
              y * 10 + 5,
              4.3,
              3,
              (x + y) % 3,
              0,
              Math.PI * 2,
            );
            ctx.fill();
          } else {
            ctx.fillStyle = "#9c7748";
            ctx.fillRect(x * 10 + 1, y * 10 + 1, 8, 8);
          }
        }
      }
    if (sim.id === "termites") {
      ring(sim.target, 12, "#a67b30");
      label("Signal source", sim.target.x, sim.target.y - 22);
    }
  }
  if (sim.id === "coral") {
    if (sim.volume) {
      const volume = sim.volume,
        n = volume.size,
        dots: { p: Point; v: number }[] = [];
      for (let z = 0; z < n; z++)
        for (let y = 0; y < n; y++)
          for (let x = 0; x < n; x++) {
            const v = volume.b[volume.index(x, y, z)];
            if (
              v > 0.12 &&
              ([
                [1, 0, 0],
                [-1, 0, 0],
                [0, 1, 0],
                [0, -1, 0],
                [0, 0, 1],
                [0, 0, -1],
              ].some(
                ([dx, dy, dz]) =>
                  volume.b[volume.index(x + dx, y + dy, z + dz)] <= 0.12,
              ) ||
                x === 0 ||
                y === 0 ||
                z === 0 ||
                x === n - 1 ||
                y === n - 1 ||
                z === n - 1)
            )
              dots.push({
                p: project({
                  x: (x - n / 2) * 18,
                  y: (y - n / 2) * 18,
                  z: (z - n / 2) * 18,
                }),
                v,
              });
          }
      dots.sort((a, b) => (a.p.z ?? 0) - (b.p.z ?? 0));
      for (const { p, v } of dots)
        circle(
          p.x,
          p.y,
          11,
          `hsl(${12 + v * 90} 36% ${55 + (p.z ?? 0) * 0.06}%)`,
        );
      caption = dots.length
        ? "3D chemistry: points with B above 0.12 are shown."
        : "No concentration above the display threshold of B = 0.12.";
    } else if (sim.mode === 0) {
      const radius = Math.max(
          12,
          ...sim.points.map((p) => Math.hypot(p.x, p.y, p.z ?? 0)),
        ),
        scale = Math.min(15, 205 / radius);
      const sorted = [...sim.segments].sort(
        (a, b) => (project(a.a).z ?? 0) - (project(b.a).z ?? 0),
      );
      for (const s of sorted) {
        const a = project(s.a, scale),
          b = project(s.b, scale);
        line(
          a,
          b,
          `hsl(7 33% ${clamp(51 + (a.z ?? 0) * 0.7, 30, 70)}%)`,
          Math.max(3, scale * 0.6),
        );
      }
      for (const p of sim.points.slice(0, 7)) {
        const q = project(p, scale);
        circle(q.x, q.y, scale * 0.5, "#b67970");
      }
      caption = "A diffusion-limited aggregate in three dimensions.";
    } else {
      const dots: { p: Point; v: number }[] = [];
      for (let y = 1; y < ROWS - 1; y++)
        for (let x = 0; x < COLS; x++) {
          const lat = (y / ROWS) * Math.PI,
            lng = (x / COLS) * Math.PI * 2;
          const p = project(
            {
              x: 190 * Math.sin(lat) * Math.cos(lng),
              y: 190 * Math.cos(lat),
              z: 190 * Math.sin(lat) * Math.sin(lng),
            },
            1.25,
          );
          dots.push({ p, v: sim.chemical[y * COLS + x] });
        }
      dots.sort((a, b) => (a.p.z ?? 0) - (b.p.z ?? 0));
      for (const { p, v } of dots) {
        circle(
          p.x,
          p.y,
          6.5,
          `hsl(${12 + v * 210} ${22 + v * 80}% ${76 - v * 85 + (p.z ?? 0) * 0.025}%)`,
        );
      }
      caption = "A periodic chemical grid mapped onto a sphere.";
    }
  }
  if (sim.id === "vines") {
    const radius = sim.p.radius;
    for (let j = 0; j < 16; j++) {
      const a = (j / 16) * Math.PI * 2;
      line(
        project({ x: Math.cos(a) * radius, y: -180, z: Math.sin(a) * radius }),
        project({ x: Math.cos(a) * radius, y: 225, z: Math.sin(a) * radius }),
        "#9aaa8c35",
        2,
      );
    }
    for (let i = 1; i < sim.points.length; i++) {
      const a = project(sim.points[i - 1]),
        b = project(sim.points[i]);
      line(a, b, `hsl(117 26% ${36 + (b.z ?? 0) * 0.13}%)`, 4);
      if (i % 65 === 0) {
        ctx.fillStyle = "#739361";
        ctx.beginPath();
        ctx.ellipse(b.x + 8, b.y - 6, 15, 6, -0.6, 0, Math.PI * 2);
        ctx.fill();
      }
    }
    const tip = project(sim.points[sim.points.length - 1]);
    circle(tip.x, tip.y, 5, "#aec483");
    label("Growing tip", tip.x, tip.y - 15);
  }
  if (sim.id === "leaves") {
    const leaf = (u: number, v: number) =>
      project(
        sim.elastic
          ? sim.elastic.point(u, v)
          : leafPoint(u, v, sim.p, sim.mode, sim.ticks),
        1.1,
      );
    const faces: { p: Point[]; shade: number }[] = [];
    for (let i = 0; i < 65; i++)
      for (let j = 0; j < 16; j++) {
        const u = i / 65,
          v = j / 8 - 1;
        faces.push({
          p: [
            leaf(u, v),
            leaf(u + 1 / 65, v),
            leaf(u + 1 / 65, v + 1 / 8),
            leaf(u, v + 1 / 8),
          ],
          shade: 40 + Math.sin(u * 18) * 5 + Math.abs(v) * 15,
        });
      }
    faces.sort(
      (a, b) =>
        a.p.reduce((s, p) => s + (p.z ?? 0), 0) -
        b.p.reduce((s, p) => s + (p.z ?? 0), 0),
    );
    for (const f of faces) {
      ctx.fillStyle = `hsl(109 29% ${f.shade}%)`;
      ctx.strokeStyle = ctx.fillStyle;
      ctx.lineWidth = 0.7;
      ctx.beginPath();
      f.p.forEach((p, i) => (i ? ctx.lineTo(p.x, p.y) : ctx.moveTo(p.x, p.y)));
      ctx.closePath();
      ctx.fill();
      ctx.stroke();
    }
    for (let i = 1; i <= 65; i++)
      line(leaf((i - 1) / 65, 0), leaf(i / 65, 0), "#c0cf91", 1.6);
    for (let i = 5; i < 63; i += 5)
      for (const sign of [-1, 1]) {
        let last = leaf(i / 65, 0);
        for (let j = 1; j <= 12; j++) {
          const p = leaf((i + j * 0.4) / 65, (sign * j) / 12);
          line(last, p, "#b9cb8f66", 0.7);
          last = p;
        }
      }
    caption = sim.elastic
      ? "Elastic sheet: the base is clamped; growth is greater at the edges."
      : "A prescribed growth shape, not a mechanical solution.";
  }
  if (sim.fireflies) {
    ctx.fillStyle = "#18342e";
    ctx.fillRect(0, 0, WIDTH, HEIGHT);
    for (const a of sim.fireflies.nodes) {
      const glow = (1 + Math.cos(a.phase)) / 2;
      circle(
        a.x,
        a.y,
        7 + glow * 14,
        `rgba(224,207,113,${0.02 + glow * 0.12})`,
      );
      circle(a.x, a.y, 2.2 + glow * 2.5, `hsl(49 65% ${30 + glow * 45}%)`);
    }
    caption = "Each light is a clock. Brightness shows its phase.";
  }
  if (sim.physarum) {
    const net = sim.physarum;
    for (const e of net.edges) {
      line(
        net.nodes[e.a],
        net.nodes[e.b],
        e.d > 0.05 ? "#a58638" : "#c8c9b8",
        Math.max(0.6, Math.sqrt(e.d) * 9),
      );
    }
    net.nodes.forEach((p, i) => {
      circle(
        p.x,
        p.y,
        i === net.source || i === net.sink ? 13 : 3,
        i === net.source ? "#496e4c" : i === net.sink ? "#b66f49" : "#827d55",
      );
    });
    label("Source", net.nodes[net.source].x, net.nodes[net.source].y + 32);
    label("Destination", net.nodes[net.sink].x, net.nodes[net.sink].y + 32);
    caption = "Line width shows conductance. Thin routes are still available.";
  }
  if (sim.id === "worms") {
    const pts = sim.phases.map((phase, i) => ({
      x: 170 + i * 24,
      y:
        270 +
        (sim.mode >= 2 ? sim.bends[i] : Math.sin(phase)) * sim.p.amplitude * 60,
    }));
    for (let i = 1; i < pts.length; i++) {
      line(pts[i - 1], pts[i], "#bb9bb46b", 24);
      line(pts[i - 1], pts[i], "#9b758e", 1.5);
    }
    pts.forEach((p, i) =>
      circle(
        p.x,
        p.y,
        4,
        (sim.mode >= 2 ? sim.bends[i] : Math.sin(sim.phases[i])) > 0
          ? "#705b87"
          : "#d3b46e",
      ),
    );
    circle(pts[0].x - 3, pts[0].y - 4, 2, "#3d4051");
    label("Head driver", pts[0].x, 170);
    caption = "Local feedback passes along the body.";
    if (sim.mode === 1 || sim.mode === 3) {
      line({ x: 446, y: 170 }, { x: 446, y: 360 }, "#a16f60", 1.5);
      label("Feedback cut", 446, 150);
    }
  }
  return caption;
}
