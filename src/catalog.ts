import { additions } from "./content/additions.ts";
import { addDepth } from "./content/depth.ts";
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
  modes?: number[];
  restart?: boolean;
  key: string;
  label: string;
  min: number;
  max: number;
  step: number;
  value: number;
  hint: string;
}
export interface Species {
  defaultMode?: number;
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
    title:
      "Nearby birds, or the nearest seven? Change who counts as a neighbor and watch the flock hold together or pull apart.",
    question: "Which neighbors should a bird follow?",
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
      "Each bird tries to do three things: avoid collisions, match its neighbors’ direction and stay near them. You choose how much each rule matters. One model looks within a fixed distance; the other follows the nearest seven birds. Speed limits and a soft boundary keep them on screen.",
    lesson:
      "Watch the alignment score as well as the flock’s shape. A score near 1 means the birds are heading the same way. They can stay close together without agreeing on a direction.",
    limitation:
      "These are two-dimensional boids with illustrative steering forces. The seven-neighbor idea comes from field observations, but the simulation hasn’t been fitted to real starlings or checked against measured 3D flight paths.",
    experiment:
      "Turn alignment down to zero, but leave cohesion high. Do the birds still form a group? Reset, then try seven neighbors with the same settings.",
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
    title:
      "The dog has two jobs. Collect sheep that wander off, then get behind the flock and drive it toward the circle.",
    question: "Go after the stray, or push the whole flock?",
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
      "The dog checks how spread out the flock is. It either goes after a distant sheep or moves behind the group to drive it toward the goal. Sheep move toward one another and away from the dog. Once inside the goal, they stop taking part. Move the goal and they become active again.",
    lesson:
      "Watch how many sheep reach the circle. A dog can move quickly and still do a poor job if it keeps scattering the flock.",
    limitation:
      "The collect/drive idea comes from shepherding research. Here it uses simplified steering and an open circular goal, with no fences or terrain. The setup doesn’t reproduce the paper’s experiments.",
    experiment:
      "Try “Drive only”, then lower flock cohesion. Reset and switch to “Collect & drive”. Does going back for the strays help? Keep the seed the same.",
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
    title:
      "Four orcas can surround the school or chase fish individually. The fish react to whichever predators come close.",
    question: "Does circling the fish keep the school together?",
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
      "Fish steer with their neighbors, move toward the school’s center and avoid orcas. In one model, the four orcas head toward rotating positions around the school. In the other, each pursues a fish. School spread is the average distance of the fish from their center.",
    lesson:
      "A smaller spread means a tighter school. It says nothing about feeding success here: the model has no captures.",
    limitation:
      "The circling behavior is prescribed, inspired by observations of carousel feeding. The orcas don’t learn it. Tail slaps, captures, prey depletion, depth and energy costs are all left out.",
    experiment:
      "Switch between encirclement and pursuit. Turn up predator avoidance. Do the fish bunch up, or does the school break into pieces?",
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
    title:
      "A short route leaves a stronger trail. That helps the next ant, but it can also make the colony repeat an early choice.",
    question: "How much should an ant trust an old trail?",
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
      "In route mode, ants visit eight sites, choosing each stop using distance and pheromone. Shorter tours leave more pheromone; old trails evaporate. Foraging mode is a separate experiment: ants wander across a grid, find food and leave a trail on the way home.",
    lesson:
      "Reinforcement makes a route more likely to be used again. Evaporation lets old choices lose their grip. Watch what happens when one of those effects becomes too strong.",
    limitation:
      "Route mode uses a small version of the ant-system idea for teaching; it doesn’t implement the full Ant Colony System algorithm. Foraging uses a separate heuristic. Neither model represents a particular ant species.",
    experiment:
      "Set trail influence to zero. After a few hundred steps, compare with a run that uses pheromone. The highlighted route is the best found so far; it may not be the shortest possible route.",
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
    title:
      "The same spreading signal can be represented as a field or as random walkers. The construction rule has to work with what it receives.",
    question: "Does a smooth signal build the same mound as a noisy one?",
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
      "A source at the nest releases a signal. In field mode, a grid stores its expected concentration. In particle mode, weighted random walkers estimate the same process. Both add one unit per step and use matching diffusion, survival and reflecting-boundary rules. The mound adds material at exposed sites where the signal passes a threshold.",
    lesson:
      "The field shows expected concentration. Particles give a noisy estimate of it, so a construction threshold can produce different edges even when transport matches.",
    limitation:
      "This is a 2D analogy for signal-guided construction. The cited mound model also involves heat, advection and air moving through porous walls; none of those is calculated here. The two transport descriptions match in expectation, but particle noise can change which sites cross the building threshold. Particle resampling keeps memory use bounded.",
    experiment:
      "Compare field and particle modes from the same seed. Raise the building threshold until growth stalls, then lower it. Look at the edge where new material appears.",
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
    title:
      "Try particles sticking to a colony, then switch to chemical patterns on a surface or inside a volume. These are three separate models.",
    question: "What makes a growing shape branch?",
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
      "Particles arriving from outside tend to reach exposed tips. Chemical patterns grow for a different reason: reactions and diffusion amplify small differences. Similar-looking shapes don’t necessarily have the same explanation.",
    limitation:
      "The aggregate demonstrates diffusion-limited growth without coral physiology. Surface chemistry runs on a flat periodic grid wrapped onto a sphere, so it doesn’t solve diffusion on a sphere. Volume chemistry does evolve a 3D grid. Neither chemical model establishes how a particular coral grows.",
    experiment:
      "Start two aggregates from the same seed, with low and high flow. Then try volume chemistry and rotate the result. Give the chemical models a few hundred steps before comparing them.",
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
    title:
      "Here, contact pulls the growing tip toward a pole. Turn that feedback off and the tip keeps searching in a wider orbit.",
    question: "What changes when a growing vine finds a support?",
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
      "The tip rises as it turns. With contact feedback, its distance from the pole gradually approaches the pole’s radius. Without feedback, it follows a wider orbit. Each old tip position stays in place, leaving a three-dimensional stem behind.",
    lesson:
      "Change the support while the vine grows. The tip responds, but the old stem stays where it was. You’re seeing the history of a growth rule, not a stem settling under forces.",
    limitation:
      "This draws a growing stem using a feedback rule. It doesn’t calculate elastic forces, torsion, friction or whether the stem could actually hold itself up. The twining-mechanics paper motivates the question, rather than supplying a solver reproduced here.",
    experiment:
      "Widen the support while the tip is growing. Watch the new section adjust while the old coils stay put. Then reset and compare with free growth.",
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
    title:
      "A flat leaf can’t always stay flat. Compare two shape sketches with a sheet that relaxes stretching and bending energy.",
    question: "Where does the extra length go when an edge grows faster?",
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
      "Ripple and curl modes draw a ribbon whose shape depends on the growth mismatch. That mismatch ramps up over 600 steps. Elastic sheet mode instead grows spring rest lengths more at the edges, then relaxes stretching and bending energy. Its base stays clamped. Changing width restarts the mesh.",
    lesson:
      "More length at the edge has to fit somewhere. Rotate the leaf to see the difference between ripples at the margin and a curl along the whole blade. Use the elastic sheet to explore a mechanical response; the first two modes draw prescribed shapes.",
    limitation:
      "Ripple and curl modes prescribe a shape; their smoothing control isn’t a measured stiffness. Elastic sheet mode uses discrete spring and bending energies, rather than the paper’s continuum plate solver. It has no self-contact. None of the modes is calibrated to a plant species. The leaf models are deterministic, so the seed has no effect.",
    experiment:
      "Start with zero differential growth, then increase it. Rotate the leaf rather than judging it from one angle. Switch to the elastic sheet and compare the shape it settles into.",
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
    title:
      "Cells consume a nutrient that spreads through a grid. A cell can divide only when there’s food and an empty space next to it.",
    question: "What happens when the middle of a colony runs out of food?",
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
      "Each occupied grid site consumes nutrient and gets a chance to divide into an empty neighboring site. Nutrient diffuses between sites. Every update reads the previous generation, so the order of the cells doesn’t decide the result. Rich medium adds nutrient throughout the grid too.",
    lesson:
      "The edge has access to fresh food while the crowded interior can run short. Keep an eye on both occupied sites and average nutrient; a large colony needn’t be well fed.",
    limitation:
      "The grid stands in for a colony. It leaves out individual cell mechanics, metabolism beyond nutrient consumption, death and mutation. No particular bacterial species is represented.",
    experiment:
      "Try fast growth with slow diffusion. Then switch to replenished medium. Add a second colony by clicking the grid and watch what happens between them.",
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
    title:
      "Compare a chain of oscillators with a chain that just passes bending signals along. Cutting the middle means something different in each.",
    question: "If one link stops passing a bend, what happens to the tail?",
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
      "Oscillator mode gives each segment its own rhythm. The driven head pulls the slower segments into a traveling wave with a preferred phase lag. Bend-feedback mode works differently: only the head is driven, and each passive segment responds to the one ahead. Each cut mode removes one connection halfway down the body, at segment 12.",
    lesson:
      "Watch the body on either side of the cut. The oscillator model gives each segment its own rhythm. The bend relay only moves when it receives input from the segment ahead. That distinction matters when the connection breaks.",
    limitation:
      "Wen and colleagues studied how bending signals pass along the worm. The bend relay here is a qualitative reduction of that idea; independent segment oscillators are a separate analogy. Neither model reconstructs the connectome, simulates muscles and contact forces, or predicts crawling speed.",
    experiment:
      "Try the cut in each model. Do the segments behind it keep oscillating, drift out of phase or relax? Reset with the same settings before comparing.",
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
const coralSuite = species.find((s) => s.id === "coral")!;
coralSuite.presets.push({
  name: "Chemistry in 3D",
  mode: 2,
  values: { flow: 0.15, feed: 0.025, kill: 0.055 },
});
addDepth(species);
export const byId = (id: string) =>
  species.find((s) => s.id === id) ?? species[0];
export const defaults = (s: Species): Parameters =>
  Object.fromEntries(s.controls.map((c) => [c.key, c.value]));
