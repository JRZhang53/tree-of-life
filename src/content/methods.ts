import type { SpeciesId } from "../catalog.ts";
export const methods: Record<
  SpeciesId,
  { equation: string; scale: string; compare: string; related: SpeciesId[] }
> = {
  starlings: {
    equation:
      "Steering = separation + alignment + attraction + boundary response + small seeded noise. Seven-neighbor mode changes the interaction network; it leaves the force coefficients unchanged.",
    scale:
      "150 birds in 900 × 560 habitat units. Distance radius 85 u; avoidance radius 22 u. Updates use the previous flock state. Directional agreement ranges from 0 to 1.",
    compare:
      "Same seed, same coefficients, same step count. Change only the neighbor model. Boundary encounters can strongly affect the result.",
    related: ["sheep", "orcas", "fireflies"],
  },
  sheep: {
    equation:
      "Collect if the farthest active sheep is over 110 u from the flock center; otherwise drive toward the goal. The dog aims 65 u behind the chosen sheep or flock.",
    scale:
      "45 sheep, one dog. Sheep inside the 70 u goal radius stop and leave the active flock. Moving the goal reactivates them. These goal rules are an atlas choice.",
    compare:
      "Keep seed, avoidance and dog pace fixed. Compare controllers after 600-step increments; neither strategy is guaranteed to win for every setting.",
    related: ["starlings", "orcas"],
  },
  orcas: {
    equation:
      "Four controllers either follow rotating positions around the school center or pursue selected fish. Fish combine neighbor steering, school attraction and predator avoidance.",
    scale:
      "150 fish, four predators in 2D. The encirclement radius is 135 u. No fish are removed; school spread measures compression rather than feeding success.",
    compare:
      "Keep fish and predator initialization fixed. Compare school spread and recovery after placing a disturbance.",
    related: ["sheep", "starlings"],
  },
  ants: {
    equation:
      "Route probability ∝ pheromone^influence × inverse distance², mixed with random exploration. Completed routes reinforce their edges; evaporation removes old information.",
    scale:
      "Eight route sites; 12 candidate tours every six steps. The separate foraging model has 100 agents, local trail sensors and an inexhaustible food source.",
    compare:
      "Compare route length after equal numbers of tours. In foraging, move food after a trail forms and watch the delivery count and old trail decay.",
    related: ["physarum", "termites"],
  },
  termites: {
    equation:
      "Field: survive, diffuse to four adjacent sites, then add a unit point source. Particles use the same transition probabilities; their weighted density estimates the field.",
    scale:
      "90 × 56 reflecting grid. Each neighbor transition has probability D; signal survival is 1 − decay. 24 new walkers represent one source unit per step. Weighted resampling bounds memory.",
    compare:
      "Compare the same source and transport settings across seeds. The concentration matches in expectation; a threshold and random deposition amplify local sampling differences.",
    related: ["bacteria", "coral"],
  },
  coral: {
    equation:
      "Chemistry: ∂A/∂t = Dₐ∇²A − AB² + f(1−A); ∂B/∂t = Dᵦ∇²B + AB² − (f+k)B. Aggregation is a separate random-walker attachment model.",
    scale:
      "Surface: 90 × 56 periodic grid, six updates per tick. Volume: 22³ periodic sites, Dₐ=0.16, Dᵦ=0.08, three Euler updates of dt=0.5 per tick. Volume rendering shows the B>0.12 boundary.",
    compare:
      "Compare chemical settings at equal model steps within the same dimensional mode. Surface and volume means do not have matching spatial scales. A vanished visible surface can mean chemistry fell below the display threshold.",
    related: ["termites", "bacteria", "leaves"],
  },
  vines: {
    equation:
      "The tip rises and rotates. Contact mode relaxes its radial coordinate toward support radius + 5 u; free mode retains a wide searching orbit. Old stem positions stay fixed.",
    scale:
      "A 3D growth-control sketch capped at 1,000 samples. It illustrates feedback and history, without calculating elastic forces, torsional stress, friction or stability.",
    compare:
      "Change support size midway through growth, then compare the new tip path with the older stem. The sketch can leave old tissue inside a resized support; it is not a collision solver.",
    related: ["leaves", "worms"],
  },
  leaves: {
    equation:
      "Elastic sheet: E = ½Σ(length−grown rest length)² + B/2 Σ|xₐ−2xᵦ+x𝒸|². Rest lengths grow most near the side edges. Small gradient-descent steps relax this energy.",
    scale:
      "33 × 9 vertices; one end clamped. Edge strain ramps to 0.18 × growth over 600 ticks. B=0.25 × smoothing. Twelve relaxation steps of 0.04 per tick. The first two modes prescribe shape directly.",
    compare:
      "Use Elastic sheet, keep width and smoothing fixed, then vary growth. Growth adds energy; after the growth ramp, relaxation reduces it. Width changes rebuild the mesh. No self-contact is enforced.",
    related: ["vines", "coral"],
  },
  bacteria: {
    equation:
      "Each occupied site consumes nutrient and can divide into an empty neighbor with probability growth × local nutrient. Division consumes additional nutrient; diffusion and supply replenish it.",
    scale:
      "90 × 56 lattice; one centered inoculation. Boundary-fed mode supplies perimeter cells; rich medium also replenishes the interior. Sites do not die, and species-specific metabolism is absent.",
    compare:
      "Hold seed and growth fixed and vary diffusion or supply independently. A larger occupied area is not necessarily a healthier population.",
    related: ["termites", "coral"],
  },
  worms: {
    equation:
      "Bend relay: dbᵢ/dt = 8 × coupling × (bᵢ₋₁−bᵢ), driven by a sinusoidal head. A cut replaces the input to segment 12 with zero. Oscillator modes instead entrain autonomous phases.",
    scale:
      "24 segments; Euler dt=1/60. Bend relays begin straight. The displayed body has no fluid or substrate mechanics, and its amplitude control changes the visualization only.",
    compare:
      "Compare intact and cut relays with identical head frequency. Downstream bending disappears after a cut in the passive model; autonomous oscillators can continue moving. This distinction matters for interpreting the paper.",
    related: ["fireflies", "vines"],
  },
  fireflies: {
    equation:
      "dθᵢ/dt = ωᵢ + K/|Nᵢ| Σ sin(θⱼ−θᵢ). Intrinsic frequencies are 2 plus a seeded offset in [−diversity, +diversity].",
    scale:
      "96 stationary oscillators; Euler dt=1/60 in model time. Global mode uses all other oscillators; local mode uses the radius control. This is continuous coupling, not discrete flash pulses.",
    compare:
      "Change only coupling, reset, and advance 600 steps. Overlay a saved baseline. Repeat with another seed to distinguish an example from a robust effect.",
    related: ["worms", "starlings"],
  },
  physarum: {
    equation:
      "Qᵢⱼ = Dᵢⱼ(pᵢ−pⱼ)/Lᵢⱼ. Conserve unit flow at the terminals. dD/dt = adaptation × (|Q|^exponent − decay × D).",
    scale:
      "35 nodes on a seeded grid with diagonal links. Pressure is solved on each update. Conductance uses Euler dt=0.03 every four ticks and is bounded below at 0.002 to permit rerouting.",
    compare:
      "Compare the adaptive and fixed graphs from the same seed. Tube investment is not an optimality certificate. Move the destination and check whether the new route recovers.",
    related: ["ants", "fireflies"],
  },
};
