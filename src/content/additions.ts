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
    title: "A meadow finds its rhythm.",
    question: "When do separate clocks begin to agree?",
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
        name: "Find a rhythm",
        mode: 0,
        values: { coupling: 1.2, diversity: 0.2, range: 150 },
      },
      {
        name: "Independent clocks",
        mode: 0,
        values: { coupling: 0, diversity: 0.2, range: 150 },
      },
      {
        name: "Local conversations",
        mode: 1,
        values: { coupling: 1.2, diversity: 0.2, range: 150 },
      },
    ],
    algorithm:
      "Each of 96 stationary oscillators has a seeded intrinsic frequency. Its phase advances with a sinusoidal pull toward neighboring phases. Global mode connects every pair; local mode connects only nearby insects. Glow smoothly tracks phase.",
    lesson:
      "Synchrony is the length of the mean unit phase vector: 0 means phases cancel, 1 means they agree. A shared frequency need not imply identical phases.",
    limitation:
      "A continuous Kuramoto phase model, not a measured firefly flash-response model or the pulse-coupled Mirollo–Strogatz model. Positions and light propagation are fixed; time units are illustrative.",
    experiment:
      "Keep seed and diversity fixed. Save an uncoupled run, then restart with coupling 1.2 and compare synchrony after 600 steps. Try local coupling and disturb one patch.",
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
    title: "A network remembers its traffic.",
    question: "Can local reinforcement discover an efficient route?",
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
      "A pressure solve conserves unit flow between two food sites on a seeded graph. Each tube conducts in proportion to conductance divided by length. Flow reinforces conductance while decay removes it. A small conductance floor retains possible routes after the destination moves.",
    lesson:
      "Thicker lines mean greater conductance. Tube investment sums conductance times length; lower investment alone does not establish a biologically optimal network.",
    limitation:
      "An adaptive resistor-network reduction inspired by Physarum research. The graph is prescribed; there is no spatial exploration, biomass, or pulsatile cytoplasm. A numerical floor prevents disconnection. Only two food terminals are modeled.",
    experiment:
      "Compare adaptation to the fixed network at the same seed. Increase the flow exponent to favor concentrated routes; move the destination and observe recovery through retained thin links.",
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
