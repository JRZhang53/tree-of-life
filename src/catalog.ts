import { additions } from "./content/additions.ts";
export type SpeciesId =
  | "starlings"
  | "sheep"
  | "orcas"
  | "ants"
  | "termites"
  | "coral"
  | "vines"
  | "leaves"
  | "bacteria"
  | "worms"
  | "fireflies"
  | "physarum";
export type Parameters = Record<string, number>;
export interface Control {
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  hint: string;
}
export interface Species {
  id: SpeciesId;
  name: string;
  latin: string;
  family: string;
  title: string;
  question: string;
  color: string;
  modes: string[];
  controls: Control[];
  presets: { name: string; mode: number; values: Parameters }[];
  algorithm: string;
  lesson: string;
  limitation: string;
  experiment: string;
  interaction: string;
  sources: { title: string; url: string }[];
}
const c = (
  key: string,
  label: string,
  min: number,
  max: number,
  step: number,
  value: number,
  hint: string,
): Control => ({ key, label, min, max, step, value, hint });
export const species: Species[] = [
  {
    id: "starlings",
    name: "Starlings",
    latin: "Sturnus vulgaris",
    family: "Birds",
    title: "A thousand wings. No conductor.",
    question: "How does a flock find a shared direction?",
    color: "#477282",
    modes: ["Distance neighbors", "Seven nearest neighbors"],
    controls: [
      c(
        "alignment",
        "Alignment",
        0,
        2,
        0.05,
        1,
        "Match the direction of nearby birds.",
      ),
      c(
        "cohesion",
        "Cohesion",
        0,
        2,
        0.05,
        0.65,
        "Steer toward the local flock center.",
      ),
      c(
        "separation",
        "Separation",
        0,
        2,
        0.05,
        1.1,
        "Leave room between neighbors.",
      ),
    ],
    presets: [
      {
        name: "Murmuration",
        mode: 0,
        values: { alignment: 1, cohesion: 0.65, separation: 1.1 },
      },
      {
        name: "Independent flight",
        mode: 0,
        values: { alignment: 0, cohesion: 0, separation: 1.2 },
      },
    ],
    algorithm:
      "Each bird sums three local steering signals: avoid close neighbors, align with nearby velocities, and approach their center. A speed limit and soft habitat boundaries keep the flock in view.",
    lesson:
      "Coordinated motion can emerge from local rules without a leader. The alignment score measures how similarly the birds are moving, from 0 to 1.",
    limitation:
      "A two-dimensional Reynolds-style boids model, not a calibrated starling model. The seven-neighbor mode is motivated by field observations, but uses illustrative 2D steering forces. It does not reproduce measured 3D trajectories.",
    experiment:
      "Compare the two presets from the same seed. Then turn alignment down while keeping cohesion high: staying together and flying together are different things.",
    interaction:
      "Tap the habitat to place a disturbance. Clear it to let the flock settle.",
    sources: [
      {
        title:
          "Ballerini et al. (2008) · Topological interaction in starling flocks",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC2234121/",
      },
      {
        title: "Reynolds (1987) · Flocks, herds and schools",
        url: "https://www.red3d.com/cwr/boids/",
      },
    ],
  },
  {
    id: "sheep",
    name: "Sheep",
    latin: "Ovis aries",
    family: "Mammals",
    title: "One dog. Many moving decisions.",
    question: "When should a shepherd collect, and when should it drive?",
    color: "#8b763f",
    modes: ["Collect & drive", "Drive only"],
    controls: [
      c(
        "cohesion",
        "Flock cohesion",
        0,
        2,
        0.05,
        0.8,
        "How strongly sheep seek their neighbors.",
      ),
      c(
        "fear",
        "Dog avoidance",
        0.2,
        2,
        0.05,
        1,
        "Strength of the response to the dog.",
      ),
      c(
        "pace",
        "Dog pace",
        0.4,
        2,
        0.05,
        1.1,
        "Dog speed relative to the sheep.",
      ),
    ],
    presets: [
      {
        name: "Gather then guide",
        mode: 0,
        values: { cohesion: 0.8, fear: 1, pace: 1.1 },
      },
      {
        name: "Always drive",
        mode: 1,
        values: { cohesion: 0.8, fear: 1, pace: 1.1 },
      },
    ],
    algorithm:
      "The dog collects distant sheep or drives from behind the active flock’s center. Sheep combine neighbor steering, attraction to the flock center and dog avoidance. Sheep entering the goal stop and leave the interaction pool; moving the goal makes them active again.",
    lesson:
      "A controller can switch between simple rules based on the state of the group. Compare how many sheep reach the goal rather than how fast the dog moves.",
    limitation:
      "Inspired by the collect/drive heuristic, with simplified steering and a circular target instead of fences or terrain. It does not reproduce the paper’s experimental conditions.",
    experiment:
      "Run both strategies from the same seed. Lower cohesion to make collection more important; an excessively fast dog can scatter the flock.",
    interaction:
      "Tap the habitat to move the goal. The outlined circle marks the destination.",
    sources: [
      {
        title: "Strömbom et al. (2014) · Solving the shepherding problem",
        url: "https://doi.org/10.1098/rsif.2014.0719",
      },
    ],
  },
  {
    id: "orcas",
    name: "Orcas",
    latin: "Orcinus orca",
    family: "Mammals",
    title: "The hunt is a group effort.",
    question: "Can coordinated movement compress a school of fish?",
    color: "#357f91",
    modes: ["Encircle", "Direct pursuit"],
    controls: [
      c(
        "cohesion",
        "School cohesion",
        0,
        2,
        0.05,
        1,
        "How tightly the fish group together.",
      ),
      c(
        "fear",
        "Predator avoidance",
        0.2,
        2,
        0.05,
        1,
        "How strongly fish turn away.",
      ),
      c(
        "pace",
        "Pod pace",
        0.3,
        2,
        0.05,
        0.9,
        "How quickly the predators move.",
      ),
    ],
    presets: [
      {
        name: "Carousel",
        mode: 0,
        values: { cohesion: 1, fear: 1, pace: 0.9 },
      },
      { name: "Pursuit", mode: 1, values: { cohesion: 1, fear: 1, pace: 0.9 } },
    ],
    algorithm:
      "Fish combine local flocking, attraction to the school center and predator avoidance. Four orcas either approach rotating positions around the school or pursue individual fish. School spread measures the mean distance from its center.",
    lesson:
      "Coordination changes the shape of a moving group. A tight school is a geometric outcome here, not a measure of feeding success.",
    limitation:
      "A schematic inspired by carousel feeding observations. No tail slaps, captures, prey depletion, depth, learning or energetics are modeled; pod coordination is prescribed.",
    experiment:
      "Compare encirclement with direct pursuit. Increase predator avoidance and watch whether the school compresses or fragments.",
    interaction: "Tap the habitat to place a disturbance in the school.",
    sources: [
      {
        title:
          "Ugarte & Similä · Underwater observations of cooperatively feeding killer whales",
        url: "https://www.europeancetaceansociety.eu/sites/default/files/Proceeding%20No%207.pdf",
      },
      {
        title:
          "Feeding characteristics and prey profitability in herring-feeding killer whales",
        url: "https://research-repository.st-andrews.ac.uk/handle/10023/27318",
      },
    ],
  },
  {
    id: "ants",
    name: "Ants",
    latin: "Formicidae",
    family: "Insects",
    title: "A trail becomes a memory.",
    question: "How can a colony discover a short route?",
    color: "#9a6549",
    modes: ["Route optimization", "Foraging trails"],
    controls: [
      c(
        "evaporation",
        "Evaporation",
        0.01,
        0.3,
        0.01,
        0.08,
        "How quickly old pheromone information fades.",
      ),
      c(
        "influence",
        "Trail influence",
        0,
        3,
        0.1,
        1.3,
        "How strongly an ant favors pheromone.",
      ),
      c(
        "exploration",
        "Exploration",
        0,
        1,
        0.05,
        0.2,
        "Chance of ignoring the preferred direction.",
      ),
    ],
    presets: [
      {
        name: "Find a route",
        mode: 0,
        values: { evaporation: 0.08, influence: 1.3, exploration: 0.2 },
      },
      {
        name: "Follow the food",
        mode: 1,
        values: { evaporation: 0.04, influence: 2, exploration: 0.15 },
      },
    ],
    algorithm:
      "In route mode, virtual ants construct tours through eight sites using pheromone and inverse distance. Short tours deposit more pheromone; trails evaporate. In foraging mode, wandering ants sense a local pheromone grid, find food and reinforce the path home.",
    lesson:
      "Positive feedback can amplify useful choices, while evaporation and exploration keep the colony from relying only on old information.",
    limitation:
      "Route mode is a small ant-system teaching implementation, not the full Ant Colony System algorithm. Foraging is a separate heuristic; it does not model a particular ant species.",
    experiment:
      "Set trail influence to zero to remove collective memory. Compare convergence, then increase evaporation. The highlighted tour is the shortest found so far, not a proven optimum.",
    interaction:
      "In foraging mode, tap to move the food source. In route mode, sites stay fixed for fair comparisons.",
    sources: [
      {
        title:
          "Dorigo & Gambardella (1997) · Ant colonies for the travelling salesman problem",
        url: "https://doi.org/10.1016/S0303-2647(97)01708-5",
      },
    ],
  },
  {
    id: "termites",
    name: "Termites",
    latin: "Blattodea · termites",
    family: "Insects",
    title: "Build from a shared signal.",
    question: "What changes when a diffusing signal is a field or particles?",
    color: "#a67b30",
    modes: ["Diffusion field", "Random-walk particles"],
    controls: [
      c(
        "diffusion",
        "Diffusion",
        0.05,
        0.24,
        0.01,
        0.18,
        "Spread the signal through neighboring cells.",
      ),
      c(
        "threshold",
        "Build threshold",
        0.05,
        0.8,
        0.05,
        0.25,
        "Signal level needed to place material.",
      ),
      c(
        "decay",
        "Signal decay",
        0,
        0.08,
        0.005,
        0.01,
        "Remove signal over time.",
      ),
    ],
    presets: [
      {
        name: "Continuous field",
        mode: 0,
        values: { diffusion: 0.18, threshold: 0.25, decay: 0.01 },
      },
      {
        name: "Discrete particles",
        mode: 1,
        values: { diffusion: 0.18, threshold: 0.25, decay: 0.01 },
      },
    ],
    algorithm:
      "A nest emits a signal. Both representations inject one unit per step at the same point, use reflecting boundaries and the same survival and diffusion probabilities. The field evolves expected concentration; weighted random walkers estimate it with sampling noise. Exposed neighbors of the mound gain material above a signal threshold.",
    lesson:
      "A smooth diffusion field and a noisy random walk are two descriptions of transport. A Gaussian is a diffusion solution; “Gaussian versus Laplacian” is not a division between competing physical laws.",
    limitation:
      "A two-dimensional signal-and-deposition analogy. Unlike the cited mound model, this demo omits heat, advection and porous airflow feedback. Transport kernels and source strengths match in expectation; particle noise and thresholded deposition can still produce different construction. Weighted resampling bounds particle memory.",
    experiment:
      "Compare the noisy particle boundary with the smooth field. Raise the threshold until building stalls, then lower it to restart deposition.",
    interaction:
      "Tap to move the signal source. The existing material remains in place.",
    sources: [
      {
        title: "Ocko et al. (2019) · Morphogenesis of termite mounds",
        url: "https://doi.org/10.1073/pnas.1818759116",
      },
    ],
  },
  {
    id: "coral",
    name: "Coral",
    latin: "Anthozoa",
    family: "Cnidarians",
    title: "Let the environment draw the form.",
    question: "How do transport and local reactions produce patterns?",
    color: "#b66f73",
    modes: ["3D aggregation", "Chemical surface", "3D chemical volume"],
    controls: [
      c(
        "flow",
        "Directional flow",
        0,
        1,
        0.05,
        0.15,
        "Bias the incoming random walkers in aggregation mode.",
      ),
      c(
        "feed",
        "Chemical feed",
        0.01,
        0.08,
        0.001,
        0.035,
        "Replenish chemical A in either chemical experiment.",
      ),
      c(
        "kill",
        "Chemical removal",
        0.045,
        0.075,
        0.001,
        0.062,
        "Remove chemical B in either chemical experiment.",
      ),
    ],
    presets: [
      {
        name: "Branching colony",
        mode: 0,
        values: { flow: 0.15, feed: 0.035, kill: 0.062 },
      },
      {
        name: "Spots & divisions",
        mode: 1,
        values: { flow: 0.15, feed: 0.035, kill: 0.062 },
      },
      {
        name: "Winding patterns",
        mode: 1,
        values: { flow: 0.15, feed: 0.022, kill: 0.051 },
      },
    ],
    algorithm:
      "Aggregation mode sends random walkers through three-dimensional space and attaches them when they touch the colony. Surface chemistry evolves Gray–Scott reactions on a flat periodic grid displayed on a sphere. Volume chemistry uses a true 22 × 22 × 22 periodic lattice with six-neighbor diffusion; exposed high-concentration voxels are drawn.",
    lesson:
      "Transport can favor exposed growth sites. Reaction and diffusion can also amplify small spatial differences into patterns; these are two distinct mechanisms to explore.",
    limitation:
      "The aggregate is a diffusion-limited growth analogy, not a coral physiology model. The chemical sphere maps a flat periodic simulation onto a sphere; it is not a spherical PDE solver. The separate volume mode is a 3D chemical system, not evidence for a specific coral growth mechanism.",
    experiment:
      "Compare colonies from the same seed at low and high flow. Switch to chemical surface and compare the presets after several hundred steps.",
    interaction:
      "Drag to rotate the 3D view, or use the view-angle slider. Chemical controls apply to both chemical experiments; flow applies only to aggregation.",
    sources: [
      {
        title:
          "Kaandorp et al. (1996) · Nutrient diffusion, flow and coral morphology",
        url: "https://doi.org/10.1103/PhysRevLett.77.2328",
      },
      {
        title: "Pearson (1993) · Complex patterns in a simple system",
        url: "https://doi.org/10.1126/science.261.5118.189",
      },
    ],
  },
  {
    id: "vines",
    name: "Twining vines",
    latin: "Climbing angiosperms",
    family: "Flowering plants",
    title: "A growing tip finds its way.",
    question: "How can contact redirect active growth?",
    color: "#4d8051",
    modes: ["Contact feedback", "Free growth"],
    controls: [
      c(
        "twist",
        "Twining rate",
        0,
        2,
        0.05,
        0.85,
        "Angular growth around the support.",
      ),
      c(
        "response",
        "Contact response",
        0,
        2,
        0.05,
        1,
        "How strongly the stem approaches the support.",
      ),
      c(
        "radius",
        "Support radius",
        15,
        70,
        1,
        32,
        "Change the width of the support.",
      ),
    ],
    presets: [
      {
        name: "Climb the support",
        mode: 0,
        values: { twist: 0.85, response: 1, radius: 32 },
      },
      {
        name: "Without feedback",
        mode: 1,
        values: { twist: 0.85, response: 0, radius: 32 },
      },
    ],
    algorithm:
      "The growing tip rises and turns. In contact mode its radial position relaxes toward the support radius; without feedback, it keeps a wide searching orbit. Past tip positions form a three-dimensional stem.",
    lesson:
      "A local feedback rule can couple growth to the environment. Geometry changes the resulting pitch and wrapping even with the same growth rule.",
    limitation:
      "A kinematic feedback sketch inspired by twining mechanics, not an elastic rod or force solver. Torsion, friction and structural stability are not calculated.",
    experiment:
      "Compare contact feedback and free growth. Increase support radius during growth to see the tip adapt while older stem sections retain their history.",
    interaction:
      "Drag to rotate the stem, or use the view-angle slider. Reset clears growth.",
    sources: [
      {
        title:
          "Goriely & Neukirch (2006) · Mechanics of climbing and attachment in twining plants",
        url: "https://doi.org/10.1103/PhysRevLett.97.184302",
      },
    ],
  },
  {
    id: "leaves",
    name: "Long leaves",
    latin: "Long-leaf growth forms",
    family: "Flowering plants",
    title: "Unequal growth bends the surface.",
    question: "What happens when a leaf edge outgrows its center?",
    color: "#53874e",
    modes: ["Rippling sketch", "Curling sketch", "Elastic sheet"],
    controls: [
      c(
        "growth",
        "Differential growth",
        0,
        2,
        0.05,
        0.8,
        "Increase the displayed growth mismatch.",
      ),
      c(
        "stiffness",
        "Shape smoothing",
        0.2,
        2,
        0.05,
        1,
        "Controls ripple frequency in the sketch and bending cost in the elastic sheet.",
      ),
      c("width", "Leaf width", 20, 95, 1, 55, "Widen the lamina."),
    ],
    presets: [
      {
        name: "Ruffled margin",
        mode: 0,
        values: { growth: 1.2, stiffness: 0.7, width: 65 },
      },
      {
        name: "Curled blade",
        mode: 1,
        values: { growth: 0.8, stiffness: 1.3, width: 45 },
      },
    ],
    algorithm:
      "A parametric ribbon turns a growth-mismatch control into curvature and edge-wave amplitude. Mismatch ramps from zero to the chosen value over 600 model steps. Edge ripples grow toward the margin; the curling mode bends the blade along its length.",
    lesson:
      "A flat sheet cannot always accommodate different preferred lengths without bending. This shape sketch makes that geometric incompatibility visible.",
    limitation:
      "An illustrative surface family, not an energy-minimizing elasticity simulation. “Shape smoothing” is a geometric control, not a measured stiffness. It is not calibrated to plantain lily or another species. The geometry is deterministic and does not use a random seed.",
    experiment:
      "Start at zero differential growth, then increase it. Rotate the surface to distinguish curling along the blade from rippling at its edges.",
    interaction:
      "Drag to rotate the leaf, or use the view-angle slider. Run to grow the mismatch; reset to a flat leaf. Smoothing controls ripple geometry in the first mode and bending cost in elastic mode. Width changes restart the elastic mesh.",
    sources: [
      {
        title: "Liang & Mahadevan (2009) · The shape of a long leaf",
        url: "https://doi.org/10.1073/pnas.0911954106",
      },
    ],
  },
  {
    id: "bacteria",
    name: "Bacteria",
    latin: "Bacteria · domain",
    family: "Bacteria",
    title: "A colony grows into its resources.",
    question: "How does local food availability shape a colony?",
    color: "#8c709e",
    modes: ["Nutrient-limited growth", "Replenished medium"],
    controls: [
      c(
        "diffusion",
        "Nutrient diffusion",
        0.02,
        0.24,
        0.01,
        0.14,
        "Move nutrients between neighboring cells.",
      ),
      c(
        "growth",
        "Division chance",
        0.01,
        0.5,
        0.01,
        0.12,
        "Probability of division when food is available.",
      ),
      c(
        "supply",
        "Boundary supply",
        0.1,
        1,
        0.05,
        0.7,
        "Nutrient concentration maintained at the boundary.",
      ),
    ],
    presets: [
      {
        name: "Limited resources",
        mode: 0,
        values: { diffusion: 0.08, growth: 0.22, supply: 0.5 },
      },
      {
        name: "Rich medium",
        mode: 1,
        values: { diffusion: 0.2, growth: 0.15, supply: 1 },
      },
    ],
    algorithm:
      "Occupied lattice sites consume a diffusing nutrient and probabilistically divide into empty neighboring sites. Updates use the previous generation. Rich medium also replenishes nutrients throughout the habitat.",
    lesson:
      "Local reproduction depends on access to resources. A dense interior can run short of food while the exposed edge keeps expanding.",
    limitation:
      "A coarse cellular automaton inspired by nutrient-coupled colony models. No individual cell mechanics, metabolism, death, mutation or particular bacterial species is represented.",
    experiment:
      "Compare a fast-dividing colony with slow nutrient diffusion to one in replenished medium. Track occupied sites and average nutrient separately.",
    interaction:
      "Tap the habitat to seed another colony. Reset returns to the original inoculation.",
    sources: [
      {
        title:
          "Gerlee & Anderson (2007) · A hybrid cellular automaton model of cell colony growth",
        url: "https://arxiv.org/abs/0705.1081",
      },
    ],
  },
  {
    id: "worms",
    name: "C. elegans",
    latin: "Caenorhabditis elegans",
    family: "Nematodes",
    title: "A wave passed down the body.",
    question: "Can local feedback carry a coordinated movement?",
    color: "#9b758e",
    modes: [
      "Oscillator analogy",
      "Oscillator cut",
      "Bend feedback",
      "Bend relay cut",
    ],
    controls: [
      c(
        "coupling",
        "Local coupling",
        0,
        4,
        0.1,
        2,
        "Strength of phase coupling between body segments.",
      ),
      c(
        "frequency",
        "Head rhythm",
        0.2,
        2,
        0.05,
        0.8,
        "Oscillation frequency in model cycles per second.",
      ),
      c(
        "amplitude",
        "Bend amplitude",
        0,
        1,
        0.05,
        0.65,
        "Maximum displayed bend.",
      ),
    ],
    presets: [
      {
        name: "Pass the wave",
        mode: 0,
        values: { coupling: 2, frequency: 0.8, amplitude: 0.65 },
      },
      {
        name: "Break the chain",
        mode: 1,
        values: { coupling: 2, frequency: 0.8, amplitude: 0.65 },
      },
    ],
    algorithm:
      "A driven head oscillator entrains a chain of slower segment oscillators with a preferred phase lag. The displayed body bends according to these phases. Broken feedback removes one coupling halfway down the chain.",
    lesson:
      "Coordination can depend on a chain of local interactions. Disrupt one link and compare motion upstream and downstream.",
    limitation:
      "A phase-oscillator analogy motivated by proprioceptive coupling research. This is not the worm connectome, a neural-network reconstruction or a biomechanical locomotion model; it does not predict crawling speed.",
    experiment:
      "Break the feedback and watch the downstream phase drift. Increase coupling to see how it changes coordination in the intact chain.",
    interaction:
      "Change coupling while the model runs. Colored segment nodes show the local oscillation state.",
    sources: [
      {
        title:
          "Wen et al. (2012) · Proprioceptive coupling drives C. elegans locomotion",
        url: "https://pmc.ncbi.nlm.nih.gov/articles/PMC3508473/",
      },
    ],
  },
];
species.push(...additions);
const starling = species.find((s) => s.id === "starlings")!;
starling.presets.push({
  name: "Seven neighbors",
  mode: 1,
  values: { alignment: 1, cohesion: 0.65, separation: 1.1 },
});
const leafSuite = species.find((s) => s.id === "leaves")!;
leafSuite.presets.push({
  name: "Growing elastic sheet",
  mode: 2,
  values: { growth: 1.2, stiffness: 0.6, width: 55 },
});
leafSuite.algorithm +=
  " Elastic sheet mode grows spring rest lengths toward the edges, then relaxes stretching and bending energy. Its base is clamped; width changes restart the mesh.";
leafSuite.limitation +=
  " The elastic sheet uses a discrete spring and bending energy, not the paper's continuum plate solver. It has no self-contact or species calibration. The first two modes remain geometric illustrations.";
const wormSuite = species.find((s) => s.id === "worms")!;
wormSuite.presets.push(
  {
    name: "Pass the bend",
    mode: 2,
    values: { coupling: 2, frequency: 0.8, amplitude: 0.65 },
  },
  {
    name: "Cut bend feedback",
    mode: 3,
    values: { coupling: 2, frequency: 0.8, amplitude: 0.65 },
  },
);
wormSuite.algorithm +=
  " Bend-feedback mode uses a driven head and a chain of passive first-order bend relays. Posterior segments do not have their own oscillator; a cut removes the input to segment 12.";
wormSuite.limitation +=
  " Wen et al. support direct propagation of bending signals, not entrainment of independent posterior clocks. Bend feedback is a separate qualitative control reduction of that idea; the oscillator modes remain analogies.";
const coralSuite = species.find((s) => s.id === "coral")!;
coralSuite.presets.push({
  name: "Chemistry in 3D",
  mode: 2,
  values: { flow: 0.15, feed: 0.025, kill: 0.055 },
});
export const byId = (id: string) =>
  species.find((s) => s.id === id) ?? species[0];
export const defaults = (s: Species): Parameters =>
  Object.fromEntries(s.controls.map((c) => [c.key, c.value]));
