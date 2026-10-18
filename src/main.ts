import "./style.css";
import { species, byId, defaults } from "./catalog.ts";
import type { Species } from "./catalog.ts";
import { Simulation, WIDTH, HEIGHT, clamp } from "./models.ts";
import { draw } from "./render.ts";

const icons: Record<string, string> = {
  starlings: "M3 8 Q9 6 12 13 Q15 6 22 5 M12 13 L10 19 M12 13 L17 17",
  sheep:
    "M6 15 C0 13 3 7 7 8 C6 3 13 3 14 7 C18 3 22 8 19 11 L22 13 L19 17 L15 16 C12 20 5 19 6 15 M8 19 V22 M16 18 V21",
  orcas: "M2 16 Q9 1 21 11 Q15 19 5 17 L2 21 L2 16 M12 8 L10 3 L16 8 M17 11 h1",
  ants: "M12 4 V20 M9 7 L4 3 M15 7 L20 3 M9 12 L3 10 M15 12 L21 10 M9 16 L4 21 M15 16 L20 21 M9 6 a3 3 0 1 0 6 0 a3 3 0 1 0 -6 0 M9 16 a3 5 0 1 0 6 0 a3 5 0 1 0 -6 0",
  termites: "M4 21 L7 12 L9 15 L12 3 L15 12 L17 9 L21 21 Z M12 21 V17",
  coral:
    "M12 22 V8 M12 15 L6 10 V5 M6 10 L2 8 M12 18 L18 12 V6 M18 12 L23 10 M12 10 L16 4 M12 11 L9 6",
  vines:
    "M12 23 C2 16 23 16 12 10 C2 4 19 2 12 1 M12 10 Q23 3 22 11 Q16 15 12 10",
  leaves: "M5 22 Q1 4 21 2 Q24 19 5 22 M5 22 L19 5 M9 16 L7 10 M13 12 L19 12",
  bacteria: "M5 15 L13 5 C18 0 24 6 19 11 L10 21 C4 26 0 20 5 15 M9 15 L14 10",
  worms: "M3 5 C19 -3 22 12 12 12 C-1 12 2 27 21 20",
};
const icon = (id: string) =>
  `<svg viewBox="0 0 26 26" aria-hidden="true"><path d="${icons[id]}"/></svg>`;
const leaf = (id: string) => {
  const s = byId(id);
  return `<li class="species-leaf"><a href="#${id}" data-species="${id}">${icon(id)}<span>${s.name}</span><span class="leaf-dot"></span></a></li>`;
};
const group = (title: string, children: string) =>
  `<li class="clade"><span class="clade-name">${title}</span><ul>${children}</ul></li>`;
const tree = group(
  "Life",
  leaf("bacteria") +
    group(
      "Eukaryotes",
      group("Flowering plants", leaf("vines") + leaf("leaves")) +
        group(
          "Animals",
          leaf("coral") +
            group(
              "Bilaterians",
              group(
                "Protostomes",
                leaf("worms") +
                  group("Insects", leaf("ants") + leaf("termites")),
              ) +
                group(
                  "Vertebrates",
                  leaf("starlings") +
                    group("Mammals", leaf("sheep") + leaf("orcas")),
                ),
            ),
        ),
    ),
);
document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <a class="skip-link" href="#experiment">Skip to experiment</a>
  <header class="site-header"><a class="wordmark" href="#starlings"><svg viewBox="0 0 32 36" aria-hidden="true"><path d="M16 33V4M16 25L5 15V9M16 18L26 9V3M16 11L10 5M16 28L27 20"/><circle cx="5" cy="7" r="3"/><circle cx="10" cy="4" r="2"/><circle cx="27" cy="18" r="3"/><circle cx="26" cy="3" r="2"/></svg><span>Tree of Life<small>An atlas of living systems</small></span></a><button class="text-button" id="about-button">About the atlas <span aria-hidden="true">↗</span></button></header>
  <div class="atlas-layout"><aside class="sidebar"><details id="tree-panel" open><summary>Explore the tree <span>10 branches</span></summary><nav aria-label="Species"><ul class="phylogeny">${tree}</ul></nav><p class="tree-note">Selected branches of life.<br>Branch lengths do not represent time.</p></details></aside>
  <main id="experiment" tabindex="-1"><div id="species-header"></div><div class="workspace"><section class="habitat" aria-label="Interactive simulation"><div class="habitat-bar"><span id="model-label"></span><span class="run-state" id="run-state"></span></div><canvas id="habitat" tabindex="0" aria-describedby="interaction-help" aria-label="Simulation habitat">The simulation requires canvas support. Its model description and live measurements are available below.</canvas><div class="playback"><div class="playback-buttons"><button id="play" class="primary"></button><button id="step" title="Advance one model step">Step</button><button id="reset" title="Restart with the same seed and settings">Reset</button></div><label class="speed-label">Speed <select id="speed"><option value=".5">½×</option><option value="1" selected>1×</option><option value="2">2×</option><option value="4">4×</option></select></label></div><div class="metrics" id="metrics" aria-label="Simulation measurements"></div><p class="canvas-help" id="interaction-help"></p></section><aside class="controls" aria-label="Experiment controls"><h2>Experiment</h2><label class="field-label" for="mode">Model</label><select id="mode"></select><div id="presets" class="presets" aria-label="Experiment presets"></div><div id="parameters"></div><div class="view-control" id="view-control"><label for="angle">View angle <output id="angle-value">25°</output></label><input id="angle" type="range" min="-180" max="180" step="1" value="25"></div><div class="seed-row"><label for="seed">Seed<input id="seed" type="number" min="1" max="999999" step="1" value="42"></label><button id="new-seed" title="Restart with a new random seed">New seed</button></div><button class="share-button" id="share">Copy experiment link</button><p class="control-note">Reset replays the same seed. Links preserve starting settings, not elapsed steps.</p><p id="status" class="status" role="status"></p></aside></div><section class="field-notes" aria-label="Research and model notes" id="notes"></section><footer>Made for curiosity. Built from local rules.<span>Educational models · No measured biological data</span></footer></main></div>
  <dialog id="about"><div class="dialog-top"><span class="dialog-kicker">A living collection</span><button id="close-about" aria-label="Close about dialog">×</button></div><h2>Small rules.<br>Remarkable worlds.</h2><p>Explore how movement, growth and coordination can emerge from simple interactions. Choose a branch, change a rule, and watch what follows.</p><p>This atlas contains ten educational simulation suites. Every branch identifies its assumptions and research inspiration. The tree is a simplified selection: it omits most of life, including Archaea and fungi, and does not encode evolutionary time. Some labels represent groups or growth forms rather than individual species.</p><h3>Branches worth growing next</h3><div class="future-branch"><strong>Slime molds / Adaptive networks</strong><p>Place food sources, then compare transport efficiency, construction cost and resilience. Inspired by <a href="https://doi.org/10.1126/science.1177894" target="_blank" rel="noreferrer">Tero et al. (2010)</a>.</p></div><div class="future-branch"><strong>Fireflies / Collective timing</strong><p>Vary pulse coupling and oscillator diversity to explore synchronization. Inspired by <a href="https://doi.org/10.1137/0150098" target="_blank" rel="noreferrer">Mirollo & Strogatz (1990)</a>.</p></div><p class="muted">These are proposed experiments, not implemented simulations. All current simulations run locally in your browser.</p></dialog>`;

function el<T extends HTMLElement = HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}
const canvas = el<HTMLCanvasElement>("habitat"),
  ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Canvas 2D is unavailable in this browser.");
const context = ctx;
let current: Species = species[0],
  seed = 42,
  mode = 0,
  sim: Simulation,
  paused = matchMedia("(prefers-reduced-motion: reduce)").matches,
  speed = 1,
  angle = (25 * Math.PI) / 180;
let last = 0,
  accumulator = 0,
  metricTime = 0;
let cursor = { x: WIDTH / 2, y: HEIGHT / 2 },
  keyboardCursor = false;
const is3d = () => ["coral", "vines", "leaves"].includes(current.id);
function setStatus(text: string) {
  el("status").textContent = text;
}
function format(n: number, step: number) {
  return n.toFixed(step < 0.01 ? 3 : step < 1 ? 2 : 0);
}
function saveHash() {
  const q = new URLSearchParams({ mode: String(mode), seed: String(seed) });
  for (const [key, value] of Object.entries(sim.p))
    q.set(key, String(Number(value.toFixed(6))));
  history.replaceState(null, "", `#${current.id}?${q}`);
}
function render() {
  draw(context, sim, angle);
  if (keyboardCursor && !is3d()) {
    context.strokeStyle = "#3a654b";
    context.lineWidth = 1.5;
    context.beginPath();
    context.arc(cursor.x, cursor.y, 10, 0, Math.PI * 2);
    context.moveTo(cursor.x - 16, cursor.y);
    context.lineTo(cursor.x + 16, cursor.y);
    context.moveTo(cursor.x, cursor.y - 16);
    context.lineTo(cursor.x, cursor.y + 16);
    context.stroke();
  }
}
function playback() {
  el("play").textContent = paused ? "▶ Run" : "Ⅱ Pause";
  el("run-state").textContent = sim.completed
    ? "Growth limit reached"
    : paused
      ? "Paused"
      : "Running";
  el("run-state").classList.toggle("paused", paused);
  el<HTMLButtonElement>("step").disabled = sim.completed;
}
function metrics() {
  el("metrics").innerHTML =
    sim
      .metrics()
      .map(
        ([label, value]) =>
          `<div><span>${label}</span><strong>${value}</strong></div>`,
      )
      .join("") +
    `<div><span>Model step</span><strong>${sim.ticks.toLocaleString()}</strong></div>`;
}
function restart() {
  sim = new Simulation(current.id, mode, sim?.p ?? defaults(current), seed);
  accumulator = 0;
  render();
  metrics();
  playback();
  saveHash();
}
function syncParameters() {
  for (const c of current.controls) {
    el<HTMLInputElement>(`param-${c.key}`).value = String(sim.p[c.key]);
    el(`value-${c.key}`).textContent = format(sim.p[c.key], c.step);
    const disabled =
      (current.id === "coral" &&
        (mode === 0 ? c.key !== "flow" : c.key === "flow")) ||
      (current.id === "leaves" && mode === 1 && c.key === "stiffness") ||
      (current.id === "vines" && mode === 1 && c.key === "response");
    el<HTMLInputElement>(`param-${c.key}`).disabled = disabled;
    el(`row-${c.key}`).classList.toggle("inactive", disabled);
  }
  el<HTMLSelectElement>("mode").value = String(mode);
  el<HTMLInputElement>("seed").value = String(seed);
  el<HTMLInputElement>("seed").disabled = current.id === "leaves";
  el<HTMLButtonElement>("new-seed").disabled = current.id === "leaves";
}
function presetButtons() {
  el("presets")
    .querySelectorAll("button")
    .forEach((b, i) => {
      const p = current.presets[i];
      const active =
        p.mode === mode &&
        Object.entries(p.values).every(
          ([key, v]) => Math.abs(sim.p[key] - v) < 1e-8,
        );
      b.setAttribute("aria-pressed", String(active));
    });
}
function load() {
  const [id, query = ""] = location.hash.slice(1).split("?"),
    q = new URLSearchParams(query);
  current = byId(id);
  mode = clamp(Number(q.get("mode")) || 0, 0, current.modes.length - 1);
  mode = Math.floor(mode);
  seed = clamp(Math.floor(Number(q.get("seed")) || 42), 1, 999999);
  const p = defaults(current);
  for (const c of current.controls) {
    if (q.has(c.key)) {
      const v = Number(q.get(c.key));
      if (Number.isFinite(v))
        p[c.key] = clamp(Math.round(v / c.step) * c.step, c.min, c.max);
    }
  }
  sim = new Simulation(current.id, mode, p, seed);
  angle = (25 * Math.PI) / 180;
  el<HTMLInputElement>("angle").value = "25";
  el("angle-value").textContent = "25°";
  document.title = `${current.name} · Tree of Life`;
  document.documentElement.style.setProperty("--species-color", current.color);
  el("species-header").innerHTML =
    `<div class="species-context"><span>${current.family}</span><span class="latin">${current.latin}</span></div><div class="title-row"><h1>${current.name}</h1><span class="specimen-icon">${icon(current.id)}</span></div><p class="species-title">${current.title}</p><p class="question">${current.question}</p>`;
  document
    .querySelectorAll<HTMLAnchorElement>("[data-species]")
    .forEach((a) => {
      if (a.dataset.species === current.id)
        a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  el("model-label").textContent =
    current.id === "leaves" ? "Growth geometry" : "Live habitat";
  el("mode").innerHTML = current.modes
    .map((name, i) => `<option value="${i}">${name}</option>`)
    .join("");
  el("presets").innerHTML = current.presets
    .map(
      (p, i) =>
        `<button data-preset="${i}" aria-pressed="false">${p.name}</button>`,
    )
    .join("");
  el("parameters").innerHTML = current.controls
    .map(
      (c) =>
        `<div class="parameter" id="row-${c.key}"><label for="param-${c.key}">${c.label}<output id="value-${c.key}" for="param-${c.key}"></output></label><input type="range" id="param-${c.key}" min="${c.min}" max="${c.max}" step="${c.step}" aria-describedby="hint-${c.key}"><p id="hint-${c.key}">${c.hint}</p></div>`,
    )
    .join("");
  el("interaction-help").textContent =
    current.interaction +
    (is3d()
      ? " Keyboard: left/right arrows rotate the view."
      : " Keyboard: arrows move the cursor; Enter applies it.");
  el("view-control").hidden = !is3d();
  el("notes").innerHTML =
    `<div class="notes-intro"><h2>Inside the model</h2><p>Observe. Change a rule. Compare.</p></div><div class="note-columns"><article><h3>The mechanism</h3><p>${current.algorithm}</p><h3>What to look for</h3><p>${current.lesson}</p></article><article><h3>Try this experiment</h3><p>${current.experiment}</p><details class="limits" open><summary>What this model leaves out</summary><p>${current.limitation}</p></details></article></div><div class="sources"><h3>Follow the research</h3>${current.sources.map((s) => `<a href="${s.url}" target="_blank" rel="noreferrer">${s.title}<span aria-hidden="true">↗</span></a>`).join("")}</div>`;
  if (["starlings", "orcas"].includes(current.id)) {
    const clear = document.createElement("button");
    clear.textContent = "Clear disturbance";
    clear.className = "clear-button";
    clear.onclick = () => {
      sim.disturbance = null;
      render();
      setStatus("Disturbance cleared.");
    };
    el("interaction-help").append(" ", clear);
  }
  for (const c of current.controls)
    el<HTMLInputElement>(`param-${c.key}`).addEventListener("input", (e) => {
      sim.p[c.key] = Number((e.target as HTMLInputElement).value);
      el(`value-${c.key}`).textContent = format(sim.p[c.key], c.step);
      presetButtons();
      saveHash();
      render();
      metrics();
    });
  el("presets")
    .querySelectorAll<HTMLButtonElement>("button")
    .forEach(
      (b, i) =>
        (b.onclick = () => {
          const p = current.presets[i];
          mode = p.mode;
          sim.p = { ...p.values };
          restart();
          syncParameters();
          presetButtons();
          setStatus(`${p.name}. Restarted with seed ${seed}.`);
        }),
    );
  syncParameters();
  presetButtons();
  metrics();
  playback();
  setStatus("");
  accumulator = 0;
  render();
  if (!matchMedia("(max-width: 760px)").matches) {
    const nav = document.querySelector("nav")!,
      active = nav.querySelector("[aria-current]")!;
    const r = active.getBoundingClientRect(),
      n = nav.getBoundingClientRect();
    if (r.bottom > n.bottom) nav.scrollTop += r.bottom - n.bottom + 10;
  }
}
el<HTMLSelectElement>("mode").onchange = (e) => {
  mode = Number((e.target as HTMLSelectElement).value);
  restart();
  syncParameters();
  presetButtons();
  setStatus("Model changed. Restarted with the same seed.");
};
el("play").onclick = () => {
  if (sim.completed) restart();
  paused = !paused;
  accumulator = 0;
  playback();
};
el("step").onclick = () => {
  paused = true;
  sim.step();
  render();
  metrics();
  playback();
};
el("reset").onclick = () => {
  restart();
  setStatus(`Restarted with seed ${seed}.`);
};
el("new-seed").onclick = () => {
  seed = (crypto.getRandomValues(new Uint32Array(1))[0] % 999999) + 1;
  restart();
  syncParameters();
  setStatus(`New experiment: seed ${seed}.`);
};
el<HTMLInputElement>("seed").oninput = (e) => {
  const input = e.target as HTMLInputElement;
  if (!input.value || !input.validity.valid) return;
  seed = Number(input.value);
  restart();
  setStatus(`Restarted with seed ${seed}.`);
};
el<HTMLInputElement>("seed").onchange = (e) => {
  const input = e.target as HTMLInputElement;
  if (!input.value || !input.validity.valid) {
    input.value = String(seed);
    setStatus("Enter a whole-number seed from 1 to 999999.");
  }
};
el<HTMLSelectElement>("speed").onchange = (e) => {
  speed = Number((e.target as HTMLSelectElement).value);
};
el<HTMLInputElement>("angle").oninput = (e) => {
  const value = Number((e.target as HTMLInputElement).value);
  angle = (value * Math.PI) / 180;
  el("angle-value").textContent = `${value}°`;
  render();
};
el("share").onclick = async () => {
  saveHash();
  try {
    await navigator.clipboard.writeText(location.href);
    setStatus("Experiment link copied.");
  } catch {
    setStatus("Copy the experiment URL from your browser’s address bar.");
  }
};
const about = el<HTMLDialogElement>("about");
el("about-button").onclick = () => about.showModal();
el("close-about").onclick = () => about.close();
about.addEventListener("click", (e) => {
  if (e.target === about) {
    const r = about.getBoundingClientRect();
    if (
      e.clientX < r.left ||
      e.clientX > r.right ||
      e.clientY < r.top ||
      e.clientY > r.bottom
    )
      about.close();
  }
});
let dragging = false,
  startX = 0;
canvas.addEventListener("pointerdown", (e) => {
  keyboardCursor = false;
  if (is3d()) {
    dragging = true;
    startX = e.clientX;
    canvas.setPointerCapture(e.pointerId);
  } else {
    const r = canvas.getBoundingClientRect();
    cursor = {
      x: ((e.clientX - r.left) / r.width) * WIDTH,
      y: ((e.clientY - r.top) / r.height) * HEIGHT,
    };
    sim.interact(cursor.x, cursor.y);
    render();
    metrics();
  }
});
canvas.addEventListener("pointermove", (e) => {
  if (dragging) {
    angle += (e.clientX - startX) * 0.008;
    startX = e.clientX;
    angle =
      ((((angle + Math.PI) % (2 * Math.PI)) + 2 * Math.PI) % (2 * Math.PI)) -
      Math.PI;
    const degrees = Math.round((angle * 180) / Math.PI);
    el<HTMLInputElement>("angle").value = String(degrees);
    el("angle-value").textContent = `${degrees}°`;
    render();
  }
});
canvas.addEventListener("pointerup", () => {
  dragging = false;
});
canvas.addEventListener("pointercancel", () => {
  dragging = false;
});
canvas.addEventListener("keydown", (e) => {
  if (e.key === " ") {
    e.preventDefault();
    el("play").click();
  } else if (e.key === "Enter" && !is3d()) {
    sim.interact(cursor.x, cursor.y);
    render();
    metrics();
    setStatus("Applied habitat interaction at the cursor.");
  } else if (
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
  ) {
    e.preventDefault();
    if (is3d()) {
      el<HTMLInputElement>("angle").value = String(
        clamp(
          Number(el<HTMLInputElement>("angle").value) +
            (e.key === "ArrowRight" || e.key === "ArrowUp" ? 5 : -5),
          -180,
          180,
        ),
      );
      el("angle").dispatchEvent(new Event("input"));
    } else {
      keyboardCursor = true;
      cursor.x = clamp(
        cursor.x +
          (e.key === "ArrowRight" ? 20 : e.key === "ArrowLeft" ? -20 : 0),
        20,
        880,
      );
      cursor.y = clamp(
        cursor.y + (e.key === "ArrowDown" ? 20 : e.key === "ArrowUp" ? -20 : 0),
        20,
        540,
      );
      render();
    }
  }
});
canvas.addEventListener("blur", () => {
  keyboardCursor = false;
  render();
});
document.querySelector<HTMLAnchorElement>(".skip-link")!.onclick = (e) => {
  e.preventDefault();
  el("experiment").focus();
  el("experiment").scrollIntoView({ block: "start" });
};
window.addEventListener("hashchange", () => {
  load();
  if (matchMedia("(max-width: 760px)").matches) {
    el<HTMLDetailsElement>("tree-panel").open = false;
    el("experiment").focus({ preventScroll: true });
  }
  window.scrollTo({ top: 0 });
});
const responsive = matchMedia("(max-width: 760px)");
el<HTMLDetailsElement>("tree-panel").open = !responsive.matches;
responsive.addEventListener("change", (e) => {
  el<HTMLDetailsElement>("tree-panel").open = !e.matches;
});
new ResizeObserver(() => {
  const r = canvas.getBoundingClientRect(),
    dpr = Math.min(devicePixelRatio || 1, 2);
  canvas.width = Math.round(r.width * dpr);
  canvas.height = Math.round(r.height * dpr);
  if (sim) render();
}).observe(canvas);
document.addEventListener("visibilitychange", () => {
  last = 0;
  accumulator = 0;
});
load();
function frame(time: number) {
  const dt = last ? Math.min((time - last) / 1000, 0.1) : 0;
  last = time;
  if (!paused && !document.hidden && !sim.completed) {
    accumulator += dt * speed;
    let steps = 0;
    while (accumulator >= 1 / 60 && steps < 12) {
      sim.step();
      accumulator -= 1 / 60;
      steps++;
    }
    if (steps === 12) accumulator = 0;
    render();
    if (time - metricTime > 220) {
      metrics();
      metricTime = time;
    }
    if (sim.completed) {
      paused = true;
      metrics();
      playback();
      setStatus(
        "Growth limit reached. Reset or choose a new seed to run another experiment.",
      );
    }
  }
  requestAnimationFrame(frame);
}
requestAnimationFrame(frame);
