import { treeView } from "./presentation/tree.ts";
import { showPreviews } from "./presentation/previews.ts";
import { shell } from "./presentation/shell.ts";
import "./style.css";
import { methods } from "./content/methods.ts";
import { depthNote } from "./content/depth.ts";
import { experiments, MODEL_REVISION } from "./content/taxonomy.ts";
import { Notebook } from "./presentation/notebook.ts";
import { normalizedSettings, type Settings } from "./core/notebook.ts";
import { species, byId, defaults } from "./catalog.ts";
import type { Species } from "./catalog.ts";
import { Simulation, WIDTH, HEIGHT, clamp } from "./models.ts";
import { draw } from "./render.ts";

const tree = treeView("starlings").markup;

document.querySelector<HTMLDivElement>("#app")!.innerHTML = shell(
  tree,
  species.length,
);

function el<T extends HTMLElement = HTMLElement>(id: string) {
  return document.getElementById(id) as T;
}
const canvas = el<HTMLCanvasElement>("habitat"),
  ctx = canvas.getContext("2d");
if (!ctx) throw new Error("Canvas 2D is unavailable in this browser.");
const context = ctx;
let canvasCssWidth = 900;
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
  return n.toFixed(Math.max(0, Math.ceil(-Math.log10(step))));
}
function saveHash() {
  const q = new URLSearchParams({
    v: "2",
    rev: MODEL_REVISION,
    experiment: experiments[current.id][mode],
    seed: String(seed),
  });
  for (const [key, value] of Object.entries(sim.p))
    q.set(key, String(Number(value.toFixed(6))));
  history.replaceState(null, "", `#${current.id}?${q}`);
}
function render() {
  const caption = draw(context, sim, angle, true, WIDTH / canvasCssWidth);
  if (el("scene-caption").textContent !== caption)
    el("scene-caption").textContent = caption;
  if (keyboardCursor && !is3d() && !sim.mound) {
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
  advanceToken++;
  sim = new Simulation(current.id, mode, sim?.p ?? defaults(current), seed);
  accumulator = 0;
  render();
  metrics();
  playback();
  saveHash();
  notebook.reset(normalizedSettings(current.id, mode, seed, sim.p), sim);
}
function syncParameters() {
  el("model-label").textContent =
    (current.id === "leaves" && mode < 2) ||
    (current.id === "vines" && mode < 2)
      ? "Geometry sketch"
      : "Educational model";
  for (const c of current.controls) {
    el(`row-${c.key}`).hidden = !!c.modes && !c.modes.includes(mode);
    el<HTMLInputElement>(`param-${c.key}`).value = String(sim.p[c.key]);
    el(`value-${c.key}`).textContent = format(sim.p[c.key], c.step);
    const disabled =
      (current.id === "coral" &&
        (mode === 0 ? c.key !== "flow" : c.key === "flow")) ||
      (current.id === "leaves" && mode === 1 && c.key === "stiffness") ||
      (current.id === "vines" && mode === 1 && c.key === "response") ||
      (current.id === "fireflies" && mode === 0 && c.key === "range") ||
      (current.id === "physarum" && mode === 1);
    el<HTMLInputElement>(`param-${c.key}`).disabled = disabled;
    el(`row-${c.key}`).classList.toggle("inactive", disabled);
  }
  el<HTMLSelectElement>("mode").value = String(mode);
  el<HTMLInputElement>("seed").value = String(seed);
  const deterministic = (current.id === "leaves" && mode < 3) || !!sim.mound;
  el<HTMLInputElement>("seed").disabled = deterministic;
  el<HTMLButtonElement>("new-seed").disabled = deterministic;
  const note = depthNote(current.id, mode);
  const method = methods[current.id];
  el("try-this").innerHTML =
    `<h2>Try this</h2><p>${note?.compare ?? current.experiment}</p>`;
  if (!["starlings", "orcas"].includes(current.id))
    el("interaction-help").textContent =
      (note?.interaction ?? current.interaction) +
      (is3d()
        ? " Keyboard: left/right arrows rotate the view."
        : sim.mound
          ? ""
          : " Keyboard: arrows move the cursor; Enter applies it.");
  // Keep the existing clear-disturbance control when this is a flocking suite.
  if (!["starlings", "orcas"].includes(current.id)) {
    el("notes").innerHTML =
      `<div class="notes-intro"><h2>${current.question}</h2></div><div class="note-columns"><article class="explanation"><p>${note?.algorithm ?? current.algorithm}</p><p>${note?.lesson ?? current.lesson}</p></article><aside class="research-margin"><details class="limits" open><summary>What this leaves out</summary><p>${note?.limitation ?? current.limitation}</p></details><div class="sources"><h3>Further reading</h3>${current.sources.map((s) => `<a href="${s.url}" target="_blank" rel="noreferrer">${s.title.replaceAll(" · ", ": ")}</a>`).join("")}</div></aside></div><details class="model-method"><summary>Equations and comparison notes</summary><p>${note?.equation ?? method.equation}</p><p>${note?.scale ?? method.scale}</p><p>${note?.compare ?? method.compare}</p><p class="muted">Model revision ${MODEL_REVISION}. A step means something different in each experiment; it isn’t a shared biological clock.</p></details><div class="related-branches"><h3>Related experiments</h3>${method.related.map((id) => `<a href="#${id}">${byId(id).name}</a>`).join("")}</div>`;
  }
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
  advanceToken++;
  const [id, query = ""] = location.hash.slice(1).split("?"),
    q = new URLSearchParams(query);
  current = byId(id);
  updateTree();
  const namedMode = experiments[current.id].indexOf(q.get("experiment") ?? "");
  mode =
    namedMode >= 0
      ? namedMode
      : clamp(
          q.has("mode")
            ? Number(q.get("mode")) || 0
            : (current.defaultMode ?? 0),
          0,
          current.modes.length - 1,
        );
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
    `<div class="specimen-title"><h1>${current.name}</h1><p class="latin">${current.latin}</p></div><div class="opening-question"><p class="intro">${current.title}</p><a href="#notes" class="read-notes">Read about this model</a></div>`;
  el("try-this").innerHTML = `<h2>Try this</h2><p>${current.experiment}</p>`;
  el("habitat").setAttribute("aria-label", `${current.name} simulation`);
  el("species-header").querySelector<HTMLAnchorElement>(
    ".read-notes",
  )!.onclick = (e) => {
    e.preventDefault();
    el("notes").scrollIntoView({ block: "start" });
    el("notes").setAttribute("tabindex", "-1");
    el("notes").focus({ preventScroll: true });
  };
  document
    .querySelectorAll<HTMLAnchorElement>("[data-species]")
    .forEach((a) => {
      if (a.dataset.species === current.id)
        a.setAttribute("aria-current", "page");
      else a.removeAttribute("aria-current");
    });
  el("model-label").textContent =
    (current.id === "leaves" && mode !== 2) || current.id === "vines"
      ? "Geometry sketch"
      : "Educational model";
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
    `<div class="notes-intro"><h2>${current.question}</h2></div><div class="note-columns"><article class="explanation"><p>${current.algorithm}</p><p>${current.lesson}</p></article><aside class="research-margin"><details class="limits" open><summary>What this leaves out</summary><p>${current.limitation}</p></details><div class="sources"><h3>Further reading</h3>${current.sources.map((s) => `<a href="${s.url}" target="_blank" rel="noreferrer">${s.title.replaceAll(" · ", ": ")}</a>`).join("")}</div></aside></div>`;
  const method = methods[current.id];
  el("notes").insertAdjacentHTML(
    "beforeend",
    `<details class="model-method"><summary>Equations and comparison notes</summary><p>${method.equation}</p><p>${method.scale}</p><p>${method.compare}</p><p class="muted">Model revision ${MODEL_REVISION}. A step means something different in each experiment; it isn’t a shared biological clock.</p></details><div class="related-branches"><h3>Related experiments</h3>${method.related.map((id) => `<a href="#${id}">${byId(id).name}</a>`).join("")}</div>`,
  );
  if (["starlings", "orcas"].includes(current.id)) {
    const clear = document.createElement("button");
    clear.textContent = "Clear disturbance";
    clear.className = "clear-button";
    clear.onclick = () => {
      sim.disturbance = null;
      notebook.sample(sim, true);
      notebook.event(sim.ticks, "Clear disturbance");
      render();
      setStatus("Disturbance cleared.");
    };
    el("interaction-help").append(" ", clear);
  }
  for (const c of current.controls)
    el<HTMLInputElement>(`param-${c.key}`).addEventListener("input", (e) => {
      advanceToken++;
      sim.p[c.key] = Number((e.target as HTMLInputElement).value);
      if (
        c.restart ||
        (current.id === "leaves" && mode === 2 && c.key === "width")
      ) {
        restart();
        setStatus(`${c.label} changed; restarted the model.`);
      } else {
        notebook.sample(sim, true);
        notebook.event(
          sim.ticks,
          `${c.label}: ${format(sim.p[c.key], c.step)}`,
        );
      }
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
          sim.p = { ...defaults(current), ...p.values };
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
  notebook.reset(normalizedSettings(current.id, mode, seed, sim.p), sim);
  let routeMessage = "";
  if (id && !species.some((s) => s.id === id))
    routeMessage = "Unknown branch; opened Starlings.";
  else if (q.has("rev") && q.get("rev") !== MODEL_REVISION)
    routeMessage =
      "This link uses another model revision. Settings loaded in the current model; trajectories may differ.";
  else if (q.has("experiment") && namedMode < 0)
    routeMessage = "Unknown experiment; opened the default model.";
  else if (q.has("mode"))
    routeMessage = `Legacy settings loaded in ${MODEL_REVISION}; model behavior may differ from the original.`;
  setStatus(routeMessage);
  accumulator = 0;
  render();
}
el<HTMLSelectElement>("mode").onchange = (e) => {
  mode = Number((e.target as HTMLSelectElement).value);
  restart();
  syncParameters();
  presetButtons();
  setStatus("Model changed. Restarted with the same seed.");
};
el("play").onclick = () => {
  advanceToken++;
  if (sim.completed) restart();
  paused = !paused;
  accumulator = 0;
  playback();
};
el("step").onclick = () => {
  advanceToken++;
  paused = true;
  sim.step();
  notebook.sample(sim, true);
  notebook.chart();
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
function interactAtCursor() {
  if (sim.mound) return;
  const action =
    current.id === "fireflies"
      ? "Reset nearby phases at"
      : current.id === "physarum"
        ? "Moved destination to the node nearest"
        : current.id === "sheep"
          ? "Moved goal near"
          : current.id === "termites"
            ? "Moved signal source near"
            : current.id === "ants" && mode === 1
              ? "Moved food near"
              : current.id === "bacteria"
                ? "Seeded a colony near"
                : ["starlings", "orcas"].includes(current.id)
                  ? "Placed disturbance at"
                  : null;
  if (!action) return;
  sim.interact(cursor.x, cursor.y);
  const location = sim.flock?.target ?? cursor;
  const position = `(${Math.round(location.x)}, ${Math.round(location.y)})`;
  const description = `${action} ${position}`;
  notebook.sample(sim, true);
  notebook.event(sim.ticks, description);
  render();
  metrics();
  setStatus(description + ".");
}
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
    interactAtCursor();
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
    interactAtCursor();
  } else if (
    ["ArrowLeft", "ArrowRight", "ArrowUp", "ArrowDown"].includes(e.key)
  ) {
    if (sim.mound) return;
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
  if (location.hash === "#tree") {
    el<HTMLDetailsElement>("tree-panel").open = true;
    el("tree-panel").scrollIntoView({ block: "start" });
    return;
  }
  load();
  el<HTMLDetailsElement>("tree-panel").open = false;
  el("experiment").focus({ preventScroll: true });
  window.scrollTo({ top: 0 });
});
el<HTMLDetailsElement>("tree-panel").open =
  !location.hash || location.hash === "#tree";
el("tree-panel").addEventListener("toggle", () => {
  if (el<HTMLDetailsElement>("tree-panel").open) {
    paused = true;
    accumulator = 0;
    if (sim) playback();
    void showPreviews(el("tree-panel"));
  }
});
document.querySelector<HTMLAnchorElement>(".wordmark")!.onclick = (e) => {
  e.preventDefault();
  el<HTMLDetailsElement>("tree-panel").open = true;
  window.scrollTo({ top: 0 });
  el("tree-panel")
    .querySelector<HTMLElement>("summary")!
    .focus({ preventScroll: true });
};
document
  .querySelector('nav[aria-label="Species"]')!
  .addEventListener("click", (e) => {
    const link = (e.target as Element).closest<HTMLAnchorElement>(
      "[data-species]",
    );
    if (link && link.hash === location.hash) {
      e.preventDefault();
      el<HTMLDetailsElement>("tree-panel").open = false;
      el("experiment").focus({ preventScroll: true });
      window.scrollTo({ top: 0 });
    }
  });
new ResizeObserver(() => {
  const r = canvas.getBoundingClientRect(),
    dpr = Math.min(devicePixelRatio || 1, 2);
  canvasCssWidth = Math.max(1, r.width);
  canvas.width = Math.round(r.width * dpr);
  canvas.height = Math.round(r.height * dpr);
  if (sim) render();
}).observe(canvas);
document.addEventListener("visibilitychange", () => {
  last = 0;
  accumulator = 0;
});
const notebook = new Notebook(el("notebook"), (settings: Settings) => {
  const q = new URLSearchParams({
    v: "2",
    rev: MODEL_REVISION,
    experiment: experiments[settings.suite][settings.mode],
    seed: String(settings.seed),
  });
  for (const [k, v] of Object.entries(settings.parameters)) q.set(k, String(v));
  history.replaceState(null, "", `#${settings.suite}?${q}`);
  paused = true;
  load();
  el("experiment").scrollIntoView({ block: "start" });
  el("experiment").focus({ preventScroll: true });
  setStatus(
    settings.revision === MODEL_REVISION
      ? "Started with saved settings. Interventions and elapsed state are not restored."
      : `Started the saved ${settings.revision} settings in ${MODEL_REVISION}. The old measurements remain saved; trajectories may differ.`,
  );
});
el("save-run").addEventListener(
  "click",
  () => {
    notebook.sample(sim, true);
    notebook.chart();
  },
  true,
);
let advanceToken = 0;
el("advance").onclick = async () => {
  paused = true;
  playback();
  const token = ++advanceToken,
    model = sim,
    target = sim.ticks + 600;
  el<HTMLButtonElement>("advance").disabled = true;
  let lastProgress = 0;
  while (
    model === sim &&
    token === advanceToken &&
    sim.ticks < target &&
    !sim.completed
  ) {
    const start = performance.now();
    do {
      sim.step();
      notebook.sample(sim);
    } while (
      performance.now() - start < 12 &&
      sim.ticks < target &&
      !sim.completed
    );
    render();
    metrics();
    notebook.chart();
    if (performance.now() - lastProgress > 250) {
      setStatus(`Advancing: ${sim.ticks} / ${target} steps`);
      lastProgress = performance.now();
    }
    await new Promise((resolve) => setTimeout(resolve, 0));
  }
  if (model === sim && token === advanceToken) {
    paused = true;
    notebook.sample(sim, true);
    notebook.chart();
    playback();
    setStatus(`Paused at step ${sim.ticks}.`);
  }
  el<HTMLButtonElement>("advance").disabled = false;
};
function updateTree() {
  const focusedSuite = (document.activeElement as HTMLElement | null)?.dataset
    .species;
  const query = el<HTMLInputElement>("branch-search").value.trim();
  const result = treeView(current.id, query);
  const lineage = query ? treeView(current.id).ancestry : result.ancestry;
  el("selected-branch").textContent = [...lineage.slice(1), current.name].join(
    " / ",
  );
  document.querySelector<HTMLElement>('nav[aria-label="Species"]')!.innerHTML =
    result.markup;
  if (el<HTMLDetailsElement>("tree-panel").open)
    void showPreviews(el("tree-panel"));
  if (focusedSuite) {
    document
      .querySelector<HTMLAnchorElement>(`[data-species="${focusedSuite}"]`)
      ?.focus({ preventScroll: true });
  }
  el("search-status").textContent = query
    ? result.count
      ? `${result.count} matching ${result.count === 1 ? "branch" : "branches"}`
      : "No match. Try an organism or an idea like growth."
    : "";
}
el<HTMLInputElement>("branch-search").oninput = updateTree;

load();
function frame(time: number) {
  const dt = last ? Math.min((time - last) / 1000, 0.1) : 0;
  last = time;
  if (!paused && !document.hidden && !sim.completed) {
    accumulator += dt * speed;
    let steps = 0;
    const frameStart = performance.now();
    while (
      accumulator >= 1 / 60 &&
      steps < 12 &&
      performance.now() - frameStart < 12
    ) {
      sim.step();
      notebook.sample(sim);
      accumulator -= 1 / 60;
      steps++;
    }
    if (steps === 12) accumulator = 0;
    render();
    if (time - metricTime > 220) {
      metrics();
      notebook.chart();
      metricTime = time;
    }
    if (sim.completed) {
      paused = true;
      notebook.sample(sim, true);
      notebook.chart();
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
