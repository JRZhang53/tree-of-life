import type { Species, Control } from "../catalog.ts";
const c = (
  key: string,
  label: string,
  min: number,
  max: number,
  step: number,
  value: number,
  hint: string,
): Control => ({ key, label, min, max, step, value, hint });
export const additions: Species[] = [
  {
    id: "fireflies",
    name: "Fireflies",
    latin: "Lampyridae",
    family: "Beetles",
    color: "#a38630",
    title:
      "Each dot has its own rhythm. Let all of them interact, or limit each one to its neighbors, and see whether the glows line up.",
    question: "How much coupling gets the glows to line up?",
    modes: ["Global coupling", "Local coupling"],
    controls: [
      c(
        "coupling",
        "Coupling strength",
        0,
        4,
        0.1,
        1.2,
        "Pull each phase toward neighboring phases.",
      ),
      c(
        "diversity",
        "Clock diversity",
        0,
        1,
        0.05,
        0.2,
        "Half-width of intrinsic frequencies, in radians per model time.",
      ),
      c(
        "range",
        "Neighbor radius",
        30,
        400,
        10,
        150,
        "Local mode only, in habitat units.",
      ),
    ],
    presets: [
      {
        name: "Coupled clocks",
        mode: 0,
        values: { coupling: 1.2, diversity: 0.2, range: 150 },
      },
      {
        name: "Independent clocks",
        mode: 0,
        values: { coupling: 0, diversity: 0.2, range: 150 },
      },
      {
        name: "Nearby clocks",
        mode: 1,
        values: { coupling: 1.2, diversity: 0.2, range: 150 },
      },
    ],
    algorithm:
      "There are 96 stationary clocks, each with a slightly different natural frequency. Their phases pull on one another through a sine function. Global coupling connects every pair; local coupling only connects nearby dots. The glow follows each clock’s phase smoothly.",
    lesson:
      "Synchrony near 1 means the phases line up. Near 0, they largely cancel each other out. Clocks can run at the same speed without reaching the same phase, so frequency alone doesn’t tell the whole story.",
    limitation:
      "This uses a continuous Kuramoto phase model. Real flashes and responses to light aren’t measured here. It also differs from the pulse-coupled Mirollo–Strogatz model linked below. Positions stay fixed, light propagation isn’t simulated and the time units are illustrative.",
    experiment:
      "Set coupling to zero and save the run after 600 steps. Reset, set coupling to 1.2 and compare at the same step. Keep the seed and clock diversity fixed.",
    interaction:
      "Tap to reset phases within 100 habitat units. Glow changes smoothly.",
    sources: [
      {
        title: "Strogatz (2000) · Kuramoto equations and the order parameter",
        url: "https://web.mit.edu/~jadbabai/www/ESE680/Strogatz_Kuramoto.pdf",
      },
      {
        title: "Mirollo & Strogatz (1990) · A different, pulse-coupled model",
        url: "https://doi.org/10.1137/0150098",
      },
    ],
  },
  {
    id: "physarum",
    name: "Slime molds",
    latin: "Physarum polycephalum",
    family: "Amoebozoa",
    color: "#a08235",
    title:
      "Flow reinforces the tubes it uses. The rest shrink. Move the food and see whether the network can find another route.",
    question: "Which tubes survive when flow makes them stronger?",
    modes: ["Adaptive tubes", "Fixed tubes"],
    controls: [
      c(
        "reinforcement",
        "Flow exponent",
        0.5,
        2,
        0.05,
        1,
        "Nonlinearity of conductance reinforcement by absolute flow.",
      ),
      c(
        "decay",
        "Tube decay",
        0.2,
        2,
        0.05,
        1,
        "Rate at which unused conductance is removed.",
      ),
      c(
        "adaptation",
        "Adaptation rate",
        0.1,
        2,
        0.1,
        1,
        "Speed of conductance changes.",
      ),
    ],
    presets: [
      {
        name: "Find a route",
        mode: 0,
        values: { reinforcement: 1, decay: 1, adaptation: 1 },
      },
      {
        name: "Keep alternatives",
        mode: 0,
        values: { reinforcement: 0.6, decay: 1, adaptation: 1 },
      },
      {
        name: "Frozen network",
        mode: 1,
        values: { reinforcement: 1, decay: 1, adaptation: 1 },
      },
    ],
    algorithm:
      "A pressure calculation sends one unit of flow between two food sites. A tube carries more flow when its conductance is larger or its length is shorter. Flow increases conductance while decay reduces it. Even a nearly unused tube keeps a tiny conductance, so moving the food doesn’t leave it disconnected.",
    lesson:
      "A thicker line means higher conductance. Tube investment adds up conductance times length. A low value means less investment in this model; it doesn’t prove the network is biologically optimal.",
    limitation:
      "The tubes form a prescribed resistor network. They don’t explore space, carry biomass or reproduce pulsating cytoplasm. A small numerical conductance prevents complete disconnection, and there are only two food terminals. The model borrows an adaptation rule from Physarum research, not the whole organism.",
    experiment:
      "Increase the flow exponent and watch which routes fade. Move the destination to another node. Can the remaining thin links recover? Compare with the fixed-tube model.",
    interaction:
      "Tap a node to move the destination food site. The source stays on the left.",
    sources: [
      {
        title:
          "Tero, Kobayashi & Nakagaki (2007) · Adaptive transport networks",
        url: "https://eprints.lib.hokudai.ac.jp/repo/huscap/all/28041/",
      },
      {
        title: "Tero et al. (2010) · Biologically inspired network design",
        url: "https://doi.org/10.1126/science.1177894",
      },
    ],
  },
];
