import type { Species, Control, SpeciesId } from "../catalog.ts";
export interface DepthNote {
  algorithm: string;
  lesson: string;
  limitation: string;
  equation: string;
  scale: string;
  compare: string;
  interaction: string;
}
export function depthNote(id: SpeciesId, mode: number): DepthNote | undefined {
  if (id === "vines" && mode >= 2)
    return {
      algorithm:
        "Give a tethered stem more length while keeping its ends in place. It has to stretch, bend, or pull against its supports. The curve you see comes from lowering those three energy costs.",
      lesson:
        "Try weak and strong tethers with the same seed. Watch where the extra length goes. Growth stops at step 600; after that, the rod keeps relaxing.",
      limitation:
        "This is a supported elastic filament, not a complete climbing vine. It has no pole contact, slipping, torsion or tendril anatomy. The spatial mode adds a third displacement direction; it does not impose a spiral. Stress feedback is an exploratory growth law.",
      equation:
        "E = Σ S(d−h[1+g])²/(2h) + BΣ|Δ²r|²/(2h³) + hΣ[K(x²+z²)+Gqᵧ²]/2. Local growth increments are divided by 1 + feedback × |elastic strain|.",
      scale:
        "Length 12; 41 vertices; S=20 and G=0.025. Two nodes at each end are clamped. Planar mode fixes z=0. Each model step takes 24 energy-descent iterations with backtracking. Force residual measures unfinished relaxation.",
      compare:
        "Save at 600 steps, then change only tether stiffness. Compare peak sideways displacement. Continue both runs beyond 600 to check whether the shapes are still relaxing.",
      interaction: "Rotate the view to inspect the rod and its tethers.",
    };
  if (id === "leaves" && mode >= 3)
    return {
      algorithm:
        "The margins gain length faster than the middle. A triangle mesh can stretch to accommodate that mismatch, or bend out of the plane. Thin sheets pay less for bending.",
      lesson:
        "Compare a free sheet with a held midrib, or change thickness while keeping growth fixed. Waves and curvature come from the mechanics. No wave shape is supplied to the solver.",
      limitation:
        "This is a coarse discrete sheet, not a reproduction of the paper’s phase diagram. There is no self-contact or measured leaf tissue. Free sheets can rotate and settle into different local minima. Step 600 ends the growth ramp, not necessarily the relaxation.",
      equation:
        "Longitudinal growth ε=β|2x/W|¹⁰. Edge rest length = √(dx² + dy²[1+ε]²). Stretching energy = ½Σ(length−rest)²; bending energy = BΣ(1−n₁·n₂), with B=0.015 × thickness².",
      scale:
        "25 × 11 vertices; length 12. All perimeter edges are free. Held-midrib mode fixes the center column. Each step takes 14 backtracked energy-descent iterations. Width rebuilds the mesh and restarts the run.",
      compare:
        "Use the same seed, width, growth and step count. Change thickness or the midrib constraint. Compare stretching and bending energy as well as the visible shape; the residual tells you whether relaxation is unfinished.",
      interaction: "Rotate the sheet. Changing its width starts a new mesh.",
    };
  if (id === "sheep" && mode === 2)
    return {
      algorithm:
        "At each step, the dog tries 32 directions in a one-step prediction. It chooses the move with the lowest cost: distance to the target, flock spread, and distance from a point behind the flock.",
      lesson:
        "The dog is never told to collect or drive. Change what it values and follow the trail it leaves. With a high spread weight, it can keep circling a compact flock without reaching the target. Lowering that weight gets the center closer, but may scatter the sheep.",
      limitation:
        "This is a greedy controller on an open plane, with simplified sheep interactions. It is not a globally optimal policy or an exact reproduction of the paper. Sheep keep moving at the target. The view zooms out when needed.",
      equation:
        "Cost = wₜ|centroid−target| + wₛ(mean |sheep−centroid|⁴)¼ + wᵦ|dog−centroid+range × target direction|. Local heading alignment, centroid attraction and exponential repulsion move the sheep.",
      scale:
        "45 sheep. Local alignment radius 60 u; sheep repulsion length 9 u. One Euler prediction per candidate, 32 evenly spaced dog directions. Dog speed is fixed; there is no absorbing goal or wall force.",
      compare:
        "Save a baseline, then lower the spread weight with the same seed. Compare target distance, spread and the dog’s path at the same step. A smaller distance alone does not mean the flock stayed together.",
      interaction:
        "Click to move the target. Rust marks the dog’s path; green marks the flock center.",
    };
  if (id === "termites" && mode >= 2)
    return {
      algorithm:
        "Outside temperature cycles between warm and cool. Heat inside the mound drives airflow; that flow carries an odor from the nest. Once per cycle, the wall responds to the average odor nearby. Its new shape changes the next transport solve.",
      lesson:
        "Compare rebuilding with a fixed wall. They start with the same cavity and transport rules. Any later difference comes from letting construction feed back into the environment.",
      limitation:
        "This is a 2D exterior-mound cross-section, not the paper’s axisymmetric calculation. It tracks a cavity envelope, not individual termites or dirt mass. Underground floors and ramps belong to a separate construction model and are not simulated here.",
      equation:
        "Heat diffuses from a sinusoidal boundary. Darcy face flow = buoyancy × temperature − pressure gradient, projected toward zero divergence. Odor uses conservative upwind transport, diffusion, a floor source and wall leakage. Cycle-mean odor controls wall movement.",
      scale:
        "40 × 28 cells; dt=0.1; thermal period 160 steps. Pressure uses 120 relaxation sweeps. A wall moves at most one cell vertically per cycle; the envelope remains a height profile. Colors show odor; arrows show flow. The inset shows heat.",
      compare:
        "Keep all controls fixed and compare rebuilding with the fixed-wall baseline after several full 160-step cycles. Area measures cavity cells. Flux divergence and odor budget error expose numerical error.",
      interaction:
        "Use the thermal and wall controls below. The nest source stays at the floor.",
    };
}
const control = (
  key: string,
  label: string,
  min: number,
  max: number,
  step: number,
  value: number,
  hint: string,
  modes: number[],
  restart = false,
): Control => ({ key, label, min, max, step, value, hint, modes, restart });
export function addDepth(species: Species[]) {
  const vines = species.find((s) => s.id === "vines")!;
  vines.controls.forEach((c) => (c.modes = [0, 1]));
  vines.modes.push("Supported rod · planar", "Supported rod · spatial");
  vines.defaultMode = 2;
  vines.controls.push(
    control(
      "extension",
      "Added rest length",
      0,
      0.7,
      0.01,
      0.35,
      "Fractional growth over 600 steps. Changing this restarts the rod.",
      [2, 3],
      true,
    ),
    control(
      "bending",
      "Bending stiffness B",
      0.01,
      0.3,
      0.01,
      0.05,
      "Higher values resist sharp bends.",
      [2, 3],
    ),
    control(
      "tether",
      "Tether stiffness K",
      0.01,
      1,
      0.01,
      0.12,
      "Resistance to moving away from the straight substrate.",
      [2, 3],
    ),
    control(
      "feedback",
      "Stress feedback",
      0,
      20,
      0.5,
      0,
      "Slows growth where elastic strain is large. Changing this restarts the rod.",
      [2, 3],
      true,
    ),
  );
  vines.presets.unshift(
    {
      name: "Loose tethers",
      mode: 2,
      values: { extension: 0.35, bending: 0.05, tether: 0.03, feedback: 0 },
    },
    {
      name: "Tight tethers",
      mode: 2,
      values: { extension: 0.35, bending: 0.05, tether: 0.6, feedback: 0 },
    },
  );
  vines.title =
    "What does a stem do with length it can’t fit? Let it grow against elastic tethers and watch it buckle.";
  vines.question = "Where does the extra length go?";
  vines.sources.push({
    title: "Michaels et al. · Supported elastic struts (2019)",
    url: "https://softmath.seas.harvard.edu/wp-content/uploads/2019/10/2019-14.pdf",
  });
  const leaves = species.find((s) => s.id === "leaves")!;
  leaves.controls.forEach((c) => (c.modes = [0, 1, 2]));
  leaves.modes.push("Growing sheet · free", "Growing sheet · held midrib");
  leaves.defaultMode = 3;
  leaves.controls.push(
    control(
      "marginGrowth",
      "Margin growth",
      0,
      0.7,
      0.01,
      0.4,
      "Extra longitudinal rest length at the edges.",
      [3, 4],
    ),
    control(
      "thickness",
      "Relative thickness",
      0.2,
      3,
      0.1,
      0.6,
      "Bending cost grows with thickness squared.",
      [3, 4],
    ),
    control(
      "sheetWidth",
      "Sheet width",
      2,
      7,
      0.1,
      4,
      "Length stays 12. Changing width restarts the mesh.",
      [3, 4],
      true,
    ),
  );
  leaves.presets.unshift(
    {
      name: "Thin, free edges",
      mode: 3,
      values: { marginGrowth: 0.4, thickness: 0.6, sheetWidth: 4 },
    },
    {
      name: "Hold the midrib",
      mode: 4,
      values: { marginGrowth: 0.4, thickness: 0.6, sheetWidth: 4 },
    },
    {
      name: "Thicker sheet",
      mode: 3,
      values: { marginGrowth: 0.4, thickness: 2.5, sheetWidth: 4 },
    },
  );
  leaves.title =
    "Give the margins more length than the middle. The sheet has to find somewhere to put it.";
  const sheep = species.find((s) => s.id === "sheep")!;
  sheep.controls.forEach((c) => (c.modes = [0, 1]));
  sheep.modes.push("Choose by cost");
  sheep.defaultMode = 2;
  sheep.controls.push(
    control(
      "targetWeight",
      "Target weight",
      0,
      5,
      0.1,
      1,
      "How much the dog values getting the center closer.",
      [2],
    ),
    control(
      "spreadWeight",
      "Spread weight",
      0,
      20,
      0.5,
      10,
      "How much it values keeping outlying sheep close.",
      [2],
    ),
    control(
      "behindWeight",
      "Behind-flock weight",
      0,
      0.2,
      0.005,
      0.01,
      "A small preference for a position behind the flock.",
      [2],
    ),
    control(
      "dogSpeed",
      "Dog speed",
      1,
      5,
      0.1,
      2.8,
      "Distance per step; speed stays constant.",
      [2],
    ),
    control(
      "dogRange",
      "Avoidance length",
      30,
      150,
      5,
      75,
      "How far the dog’s influence reaches.",
      [2],
    ),
  );
  sheep.presets.unshift(
    {
      name: "Keep them together",
      mode: 2,
      values: {
        targetWeight: 1,
        spreadWeight: 10,
        behindWeight: 0.01,
        dogSpeed: 2.8,
        dogRange: 75,
      },
    },
    {
      name: "Distance comes first",
      mode: 2,
      values: {
        targetWeight: 1,
        spreadWeight: 0.5,
        behindWeight: 0.01,
        dogSpeed: 2.8,
        dogRange: 75,
      },
    },
  );
  sheep.title =
    "Give the dog an objective, then watch the route it chooses. Getting there and keeping everyone together aren’t always the same move.";
  sheep.sources.push({
    title:
      "Ranganathan et al. · Emergent strategies for shepherding a flock (2024)",
    url: "https://arxiv.org/html/2211.04352v3",
  });
  const termites = species.find((s) => s.id === "termites")!;
  termites.controls.forEach((c) => (c.modes = [0, 1]));
  termites.modes.push("Mound · rebuilding", "Mound · fixed wall");
  termites.defaultMode = 2;
  termites.controls.push(
    control(
      "thermal",
      "Temperature swing",
      0,
      2,
      0.1,
      1,
      "Outside temperature changes over a 160-step cycle.",
      [2, 3],
    ),
    control(
      "buoyancy",
      "Thermal flow strength",
      0,
      2,
      0.1,
      1,
      "Couples temperature differences to internal airflow.",
      [2, 3],
    ),
    control(
      "wallThreshold",
      "Wall cue threshold",
      0.0001,
      0.01,
      0.0001,
      0.001,
      "Cycle-average odor needed to expand a wall column.",
      [2],
    ),
  );
  termites.presets.unshift(
    {
      name: "Let the wall move",
      mode: 2,
      values: { thermal: 1, buoyancy: 1, wallThreshold: 0.001 },
    },
    {
      name: "Freeze the wall",
      mode: 3,
      values: { thermal: 1, buoyancy: 1, wallThreshold: 0.001 },
    },
  );
  termites.title =
    "Build a wall, change the air inside it, then build again. Follow the loop from heat to odor to mound shape.";
  termites.sources.push({
    title: "Ocko, Heyde & Mahadevan · Morphogenesis of termite mounds (2019)",
    url: "https://softmath.seas.harvard.edu/wp-content/uploads/2019/10/2019-03.pdf",
  });
}
