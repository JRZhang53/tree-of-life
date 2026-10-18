import type { Simulation, Point } from "../models.ts";

export function drawDepth(
  ctx: CanvasRenderingContext2D,
  sim: Simulation,
  angle: number,
  annotations: boolean,
  labelScale: number,
): string | undefined {
  const line = (a: Point, b: Point, color: string, width = 1) => {
    ctx.strokeStyle = color;
    ctx.lineWidth = width;
    ctx.beginPath();
    ctx.moveTo(a.x, a.y);
    ctx.lineTo(b.x, b.y);
    ctx.stroke();
  };
  const dot = (p: Point, r: number, color: string) => {
    ctx.fillStyle = color;
    ctx.beginPath();
    ctx.arc(p.x, p.y, r, 0, 2 * Math.PI);
    ctx.fill();
  };
  const label = (text: string, x: number, y: number) => {
    if (!annotations) return;
    ctx.font = `${Math.max(13, 12 * labelScale)}px Verdana,sans-serif`;
    ctx.fillStyle = "#52685b";
    ctx.textAlign = "center";
    const half = ctx.measureText(text).width / 2 + 8;
    ctx.fillText(text, Math.max(half, Math.min(900 - half, x)), y);
  };
  const project = (p: Point, scale = 28) => ({
    x: 450 + scale * (p.x * Math.cos(angle) - (p.z ?? 0) * Math.sin(angle)),
    y:
      285 -
      scale * p.y * 0.84 +
      scale * (p.x * Math.sin(angle) + (p.z ?? 0) * Math.cos(angle)) * 0.36,
    z: p.x * Math.sin(angle) + (p.z ?? 0) * Math.cos(angle),
  });
  if (sim.filament) {
    const f = sim.filament;
    const anchor = (i: number) => project({ x: 0, y: i * f.h - 6, z: 0 });
    line(anchor(0), anchor(f.vertices.length - 1), "#97aaa5", 2);
    f.vertices.forEach((v, i) => {
      const p = project(v);
      if (i % 2 === 0) {
        line(anchor(i), p, "#a9bec0", 1);
        dot(anchor(i), 2, "#879b98");
      }
      if (i) line(project(f.vertices[i - 1]), p, "#477456", 4);
      if (i < 2 || i > f.vertices.length - 3) dot(p, 5, "#b34a2f");
    });
    label(
      sim.ticks < 600
        ? "Adding rest length"
        : "Growth stopped · still relaxing",
      450,
      70,
    );
    return "Green: elastic rod. Fine lines: elastic tethers. Rust: clamped ends. The shape comes from energy relaxation; it is not a prescribed coil.";
  }
  if (sim.sheet) {
    const s = sim.sheet,
      points = s.vertices.map((v) => project(v));
    const faces = s.triangles
      .map((t) => ({ t, depth: t.reduce((n, i) => n + points[i].z, 0) / 3 }))
      .sort((a, b) => a.depth - b.depth);
    for (const { t } of faces) {
      const p = t.map((i) => points[i]);
      ctx.beginPath();
      ctx.moveTo(p[0].x, p[0].y);
      ctx.lineTo(p[1].x, p[1].y);
      ctx.lineTo(p[2].x, p[2].y);
      ctx.closePath();
      const h = t.reduce((n, i) => n + s.vertices[i].z, 0) / 3;
      ctx.fillStyle = `hsl(112 22% ${Math.max(36, Math.min(78, 62 + h * 20))}%)`;
      ctx.fill();
      ctx.strokeStyle = "#536e4d55";
      ctx.lineWidth = 0.5;
      ctx.stroke();
    }
    for (let i = 1; i < s.rows; i++)
      line(
        points[(i - 1) * s.cols + (s.cols - 1) / 2],
        points[i * s.cols + (s.cols - 1) / 2],
        s.clamped ? "#b34a2f" : "#486d49",
        2,
      );
    label(
      s.clamped ? "Midrib held in place" : "Free edges · free midrib",
      450,
      65,
    );
    return `${sim.ticks < 600 ? "Margins are gaining length" : "Growth has stopped; the sheet is still relaxing"}. ${s.clamped ? "The rust line is the held midrib." : "The center line is a visual reference, not a clamp."} Shading shows height, not stress.`;
  }
  if (sim.flock) {
    const f = sim.flock,
      v = f.view(),
      to = (p: Point) => ({
        x: 450 + (p.x - v.x) * v.scale,
        y: 280 + (p.y - v.y) * v.scale,
      });
    for (const [path, color] of [
      [f.dogPath, "#b55a3d88"],
      [f.flockPath, "#638b5b88"],
    ] as const)
      for (let i = 1; i < path.length; i++)
        line(to(path[i - 1]), to(path[i]), color, 1.5);
    const target = to(f.target);
    ctx.strokeStyle = "#889b78";
    ctx.lineWidth = 1;
    ctx.beginPath();
    ctx.arc(target.x, target.y, 24, 0, Math.PI * 2);
    ctx.stroke();
    line(
      { x: target.x - 8, y: target.y },
      { x: target.x + 8, y: target.y },
      "#889b78",
    );
    line(
      { x: target.x, y: target.y - 8 },
      { x: target.x, y: target.y + 8 },
      "#889b78",
    );
    label("Target", target.x, Math.min(515, target.y + 52));
    for (const a of f.agents) {
      const p = to(a);
      ctx.save();
      ctx.translate(p.x, p.y);
      ctx.rotate(Math.atan2(a.vy, a.vx));
      ctx.fillStyle = "#f8faf3";
      ctx.strokeStyle = "#647b59";
      ctx.lineWidth = 1.2;
      ctx.beginPath();
      ctx.ellipse(
        0,
        0,
        Math.max(3, 7 * v.scale),
        Math.max(2, 4 * v.scale),
        0,
        0,
        Math.PI * 2,
      );
      ctx.fill();
      ctx.stroke();
      dot({ x: 6 * v.scale, y: 0 }, 2, "#45563f");
      ctx.restore();
    }
    const dog = to(f.dog);
    dot(dog, 7, "#ad4f33");
    line(
      dog,
      { x: dog.x + f.dog.vx * 6, y: dog.y + f.dog.vy * 6 },
      "#743b2b",
      2,
    );
    return "The dog chooses the lowest-cost one-step prediction from 32 headings. Rust: dog path. Green: flock-center path. The target does not stop sheep; the camera fits the open plane.";
  }
  if (sim.mound) {
    const m = sim.mound,
      size = 15,
      left = 55,
      bottom = 490;
    for (let y = 0; y < m.ny; y++)
      for (let x = 0; x < m.nx; x++) {
        const i = y * m.nx + x;
        if (!m.mask[i]) continue;
        const signal = Math.min(1, Math.sqrt(Math.max(0, m.odor[i]) / 0.08));
        ctx.fillStyle = `hsl(${42 - 22 * signal} ${32 + 40 * signal}% ${94 - 54 * signal}%)`;
        ctx.fillRect(
          left + x * size,
          bottom - (y + 1) * size,
          size + 0.5,
          size + 0.5,
        );
        const t = Math.max(-1, Math.min(1, m.heat[i] / 2));
        ctx.fillStyle =
          t > 0
            ? `hsl(15 58% ${93 - t * 45}%)`
            : `hsl(201 45% ${93 + t * 45}%)`;
        ctx.fillRect(710 + x * 3.6, 220 - (y + 1) * 3.6, 3.8, 3.8);
      }
    for (let x = 0; x < m.nx; x++)
      if (m.heights[x]) {
        const a = { x: left + x * size, y: bottom - m.heights[x] * size },
          b = { x: a.x + size, y: a.y };
        line(a, b, "#887254", 2);
        if (x && m.heights[x - 1] !== m.heights[x])
          line(
            a,
            { x: a.x, y: bottom - m.heights[x - 1] * size },
            "#887254",
            2,
          );
        if (x === m.nx - 1 || !m.heights[x + 1])
          line(b, { x: b.x, y: bottom }, "#887254", 2);
      }
    for (const f of m.faces)
      if (
        f.a % 3 === 0 &&
        Math.floor(f.a / m.nx) % 3 === 0 &&
        Math.abs(f.flow) > 0.0005
      ) {
        const x = f.a % m.nx,
          y = Math.floor(f.a / m.nx),
          a = { x: left + (x + 0.5) * size, y: bottom - (y + 0.5) * size };
        const length = Math.min(10, Math.abs(f.flow) * 180),
          d = Math.sign(f.flow),
          b = {
            x: a.x + (f.vertical ? 0 : d * length),
            y: a.y - (f.vertical ? d * length : 0),
          };
        line(a, b, "#395e66", 1.3);
        dot(b, 1.7, "#395e66");
      }
    line(
      { x: left, y: bottom },
      { x: left + size * m.nx, y: bottom },
      "#968978",
      2,
    );
    dot(
      { x: left + (Math.floor(m.nx / 2) + 0.5) * size, y: bottom - 7 },
      5,
      "#ba5130",
    );
    label("Odor", 350, 45);
    label("Heat", 780, 105);
    label(m.temperature >= 0 ? "Warm outside" : "Cool outside", 780, 260);
    return `${sim.mode === 3 ? "Fixed wall" : "Wall rebuilds every 160 steps"}. Main section: odor concentration (darker means more). Dots at arrow ends mark flow direction; the inset shows heat. This is an exterior mound, not an underground floor-and-ramp model.`;
  }
}
