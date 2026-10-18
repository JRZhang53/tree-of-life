# Atlas 2: implemented educational experiments

This is the current model specification and research delta for `atlas-2`. The original dossiers below retain the larger research ambitions; their unchecked items are future fidelity work, not claims that the current reductions implement those mechanisms. No model is calibrated to biological data. Original implementation, diagrams and synthetic initial conditions only; external papers are linked, not redistributed.

## Decisions and evidence

Jerry authorized the whole autonomous build after the memory pass at `dee9c42`, including researched additions. The release includes all ten requested subjects plus fireflies and Physarum. It deliberately distinguishes dynamical models, control analogies and shape sketches. The target audience is a curious visitor who can optionally open equations and numerical assumptions.

| Source reviewed                                                                                                                  | Exact material used                                                         | Consequence for the implementation                                                                                                                                        |
| -------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| [Reynolds, author overview](https://www.red3d.com/cwr/boids/)                                                                    | Three local steering behaviors                                              | Retain generic boids as the distance-neighbor baseline.                                                                                                                   |
| [Ballerini et al. 2008](https://pmc.ncbi.nlm.nih.gov/articles/PMC2234121/)                                                       | Results, Fig. 3 and density comparison                                      | Add seven-nearest-neighbor steering. The field study motivates the comparison, not our coefficients or 2D geometry.                                                       |
| [Strömbom et al. 2014](https://api.repository.cam.ac.uk/server/api/core/bitstreams/1cc02818-9d26-43a8-8d08-d137c9a7754e/content) | Model description and Fig. 1, p. 2; Fig. 3 ensemble evaluation              | Collect/drive controller remains an explicit reduction, with different goal absorption, thresholds and agent forces. Do not imply reproduction of success rates.          |
| [Ocko et al. 2019](https://softmath.seas.harvard.edu/wp-content/uploads/2019/10/2019-03.pdf)                                     | Mathematical model, Fig. 2 and Eq. 4                                        | Separate diffusion representation from full mound morphogenesis. Match field/particle transport; omit thermal/porous-flow feedback explicitly.                            |
| [Pearson 1993](https://www.staff.science.uu.nl/~frank011/Classes/complexity/Literature/Pearson.pdf)                              | Gray–Scott reaction equations and periodic finite-difference method, p. 189 | Add a 3D extension with declared grid, coefficients and timestep. It is not the paper's 2D parameter survey or a coral mechanism claim.                                   |
| [Liang & Mahadevan 2009](https://softmath.seas.harvard.edu/wp-content/uploads/2019/10/2009-16.pdf)                               | Theory, Eqs. 1–5 and edge-biased longitudinal growth, pp. 22050–22051       | Separate prescribed geometry from growth-driven elastic relaxation. Choose a smaller discrete energy instead of claiming to solve the paper's plate equations.            |
| [Wen et al. 2012](https://dash.harvard.edu/server/api/core/bitstreams/7312037d-1885-6bd4-e053-0100007fdf3b/content)              | Summary and Results: bending requires the anterior neighbor                 | Add passive bend relays. Correct the implication that autonomous posterior oscillators are the paper's mechanism.                                                         |
| [Strogatz 2000](https://web.mit.edu/~jadbabai/www/ESE680/Strogatz_Kuramoto.pdf)                                                  | Sections 3.1–3.2, Eqs. 3.1–3.2                                              | Continuous phase coupling and mean phase-vector magnitude. Neighbor normalization is by N−1 globally and degree locally, a declared finite-network choice.                |
| [Tero et al. 2007](https://eprints.lib.hokudai.ac.jp/repo/huscap/all/28041/JTB244-4.pdf)                                         | Section 3, pressure/flow relation and adaptive conductivity                 | Prescribed graph, unit terminal flow, power-law reinforcement; keep a small conductance floor for interactive rerouting. No maze data or physiological parameters reused. |
| [Physarum genome paper](https://pmc.ncbi.nlm.nih.gov/articles/PMC4758236/)                                                       | Introduction and phylogenetic context                                       | Place slime molds in Amoebozoa, not fungi.                                                                                                                                |

For ants, vines and orcas, the original source ledger remains relevant. Author/institution records and accessible abstracts were screened again; several direct full-text requests failed. The implementation is independently specified below and does not claim to reproduce inaccessible details. In particular, the vine remains a control/geometry sketch. The [orca observational paper](https://www.freemorgan.org/wp-content/uploads/2012/10/simila__ugarte_1993_orca_feeding_norway.pdf) supports the topic of cooperative herding; our encirclement controller is prescribed. The [ant-system author record](https://iridia.ulb.ac.be/~mdorigo/ACO/publications.html) supplies the algorithmic lineage; the spatial forager is a separate atlas model. [Gerlee & Anderson](https://arxiv.org/html/0705.1081) motivates coupling discrete growth and nutrient fields, without making our lattice rule its reproduction.

## Shared experimental contract

- Seeds initialize synthetic states using Mulberry32. Drawing and camera changes consume no model randomness.
- Every mode has a stable string experiment ID. New links carry `v=2`, `rev=atlas-2`, experiment, seed and parameters. Numeric legacy modes load through the fixed ordinal mapping and display a revision warning. Unknown branches/experiments fall back visibly.
- Sliders apply live except elastic-sheet width, which reconstructs the mesh. Presets, seed changes and model changes reset the run. Camera/speed do not change model equations. Inapplicable controls are disabled.
- A fixed-step clock drives each model. A model step is not a common physical time across suites. Run, pause, step and +600 steps use the same update path. Background tabs suspend normal playback. Reduced-motion users start paused.
- Notebook samples one defined observable every 30 model steps, plus explicit save/step endpoints. It retains the initial sample and the latest 1,199 observations; long-run histories therefore become sparse in their oldest region. Each record stores original settings, an intervention log (up to 500 entries), observations and a note. It is not a state checkpoint or machine replay file. At most 12 records persist locally, under a prefixed key; exports require no network.
- Compare within the same observable and suite; the chart may overlay different modes when their measurement definition agrees. Equal seeds alone do not imply identical initial conditions across different model families. Use equal steps and one changed factor within a declared comparison.

## Rules, scales and questions

The browser's “Equations, scales & fair comparisons” content is maintained in `src/content/methods.ts`; observable formulas are in `src/core/observables.ts`.

### Starlings

Question: how does neighbor selection affect directional agreement? 150 agents begin within a disk of radius 180 u. Metric mode uses radius 85 u; topological mode selects seven nearest agents, with ties resolved by array order. Both use the same cohesion/alignment coefficients and short-range separation at 22 u, seeded noise and soft walls followed by bounded motion. All agent updates use the preceding state. O(N²k) bounded nearest-neighbor selection, with k=7, is sufficient at this population; no empirical trajectory fit is claimed. Compare alignment magnitude and visible cohesion across seeds 1, 42 and 123 at 600/1,200 steps. Neither mode is required to dominate.

### Sheep and orcas

Sheep: 45 agents, one dog, collect beyond 110 u from active-flock centroid, aim 65 u behind chosen point; goal radius 70 u absorbs sheep. Retargeting reactivates those outside the new goal. This removes goal congestion deliberately. Compare controller, pace and avoidance one at a time; metric is count inside the goal. Existing tests cover delivery and retargeting, not biological success probability.

Orcas: 150 fish, four prescribed controllers. Encircle at radius 135 u with a rotating phase, or pursue selected fish. The school includes a global center attraction in addition to neighbor steering and predator avoidance. There is no capture, prey depletion, learned coordination or hydrodynamics. Mean radial distance from the centroid measures school spread, not prey profitability. Same-seed comparisons can reveal compression without claiming optimal hunting.

### Ants

Eight seeded sites; 12 candidate tours each six ticks. Transition weights are pheromone^influence × (200/distance)² with a uniform-exploration mixture. Each generation evaporates trails with a 0.02 floor, and tours deposit 150/length symmetrically. Best route is retained, but not forced optimal. Complexity is small at eight sites.

The separate spatial model has 100 foragers, three forward sensors, bounded movement, an inexhaustible target and return deposits. It includes goal knowledge near food and homing while carrying. Best closed-tour length and cumulative delivery are different observables and cannot be overlaid. Test valid tours, monotonic best length, positive deliveries and trail persistence/decay.

### Termites

Question: when do a field and random walkers represent the same transport? A reflecting 90 × 56 grid injects one signal unit at a point per tick after transport. Old signal survives with probability 1−decay, then moves to each cardinal neighbor with probability D or stays with probability 1−4D. Field evolution is this exact expectation. Particle mode emits 24 walkers of weight 1/24; above 12,000 walkers, systematic weighted resampling produces 8,000 equal-weight particles with identical total mass. Decay remains stochastic. The RNG also drives deposition, so morphological differences include both transport noise and subsequent random decisions.

Every four steps an empty site adjacent to material deposits with probability 0.14 if concentration exceeds the threshold. Construction does not alter transport. Thus this is a transport-and-threshold analogy, not a closed mound/airflow feedback model. Tests compare no-decay mass and 30-seed concentration RMSE on a smaller reflecting grid. Changing the source preserves deposited material. Grid/particle memory are bounded; a zero-decay source can increase total signal mass without increasing particle count indefinitely.

### Coral

Aggregation: six-neighbor 3D lattice, 32 walkers with up to 18 proposals per tick, flow-biased +x transitions, attachment beside occupied voxels, respawn outside the growing envelope and a 1,800-site cap. This is transport-limited aggregation, not coral physiology.

Chemical surface: periodic 90 × 56 Gray–Scott grid, six updates per tick, diffusion coefficients 0.19/0.095 and concentration clamps. The sphere is a display mapping and not a spherical differential operator.

Chemical volume: 22³ periodic lattice, spacing 1, diffusion coefficients 0.16/0.08, Euler dt=0.5, three substeps per tick. A central radius-four seed has A=0.5 and B=0.25 plus small seeded noise, surrounded by A=1/B=0. Display exposed voxels with B>0.12 using depth sorting. The numerical state is genuinely 3D; the projection is approximate Canvas rendering. Tests cover homogeneous equilibrium, finite/bounded state and dt refinement. The small domain is an interactive example, not spatially converged morphology.

### Vines

This intentionally remains an explicit geometry/control sketch: tip height increases 0.4 u per tick; angular position is tick × 0.035 × twist; contact mode relaxes radius toward support radius + 5 with rate 0.012 × response. Free growth relaxes radius to 80. Old samples remain fixed; cap at 1,000. Radius, pitch and wrapping are observable geometries, not stresses. Resizing the support can intersect historical stem samples. Full elasticity/friction/attachment stability remains a different research project. Preserve this distinction in both UI and handoff.

### Leaves

Two legacy geometric illustrations remain labeled sketches. The new elastic sheet is a 33 × 9 rectangular mesh with axial and diagonal springs and second-difference bending triples. Rest lengths grow according to `1 + strain × edge^4 × longitudinal_fraction`, with strain ramping to `0.18 × growth` over 600 ticks. Stretching energy is ½Σ(length−rest)²; bending energy is `0.25 × smoothing / 2` times squared second differences. The first row is clamped. A deterministic 0.03 u perturbation breaks exact planar symmetry. Twelve gradient steps of size 0.04 run each tick, including after growth ends. Width reconstructs the mesh.

Tests cover the nearly planar no-growth case, increasing deflection, finite state and decreasing energy after the ramp stops. The discrete energy is internally testable; it is not a converged finite-element approximation of the paper's continuum equations. Mesh anisotropy, end clamping, local minima and absent self-contact limit interpretation. Seed is disabled because initialization is deterministic. Large wrinkles may take substantially more than 600 ticks to develop.

### Bacteria

90 × 56 lattice, one centered inoculation, nutrient initially 0.7. Diffusion precedes nutrient consumption (0.008 per occupied site) and stochastic division with probability growth × nutrient. Division takes 0.03 nutrient at the daughter site and requires nutrient >0.03. Occupancy is updated from the previous generation; nutrient consumption is sequential within a step. Boundary-fed mode maintains perimeter supply; rich medium additionally relaxes each site toward supply at rate 0.015. This is an explicit resource-coupled cellular automaton, without death, mutation or cellular mechanics. Tests cover growth, consumption and medium effects.

### C. elegans

The old phase chain is retained as an oscillator analogy. New bend-feedback modes use 24 scalar bend values, initialized zero. Head input is sin(2π frequency × ticks/60). Posterior dynamics are `db_i/dt = 8 coupling (b_(i−1)−b_i)`, Euler dt=1/60, synchronous previous-state updates. Cutting replaces segment 12's input by zero. Output amplitude affects display only. The maximum update fraction is 32/60, so each passive update is a convex combination and remains bounded. Tests establish transmission, identical upstream behavior and silent downstream bends after a cut. No connectome or body mechanics is claimed.

### Fireflies

96 stationary seeded nodes and initial phases. Frequencies are 2 plus uniform seeded offsets scaled by diversity. Euler dt=1/60 integrates sinusoidal coupling divided by neighbor count. Global mode uses all others; local mode uses a metric radius. A habitat intervention resets phases within 100 u. Mean phase-vector magnitude is synchrony. Glow is smooth; it is not a discrete flash event. Tests across seeds 1/42/123 compare coupled and uncoupled outcomes, zero-diversity invariance and timestep refinement. Local disconnected clusters can remain globally incoherent. The Mirollo–Strogatz pulse model is linked as a different approach, not presented as implemented.

### Physarum

35 seeded spatial nodes on a 7 × 5 grid, including adjacent diagonals. Lengths are Euclidean distance /100. All conductances start at 0.35. Ground sink pressure and solve the graph Laplacian with pivoted elimination for unit source/sink flow. `Q=D Δp/L`; Euler dt=0.03 updates conductance by `adaptation × (|Q|^reinforcement − decay D)`, bounded to [0.002,5]. Update every four display ticks. Fixed-tube mode holds conductance constant; tapping moves the sink to the nearest non-source node. Re-solve after adaptation so displayed flow corresponds to current conductances.

Metric: Σ D L, a dimensionless investment proxy. Flow residual checks Kirchhoff balance. Tests include an analytic circuit, unchanged fixed networks, multiseed investment reduction and retargeting. The dense solve is O(35³), bounded and small. The floor intentionally retains alternatives; it prevents claiming exact shortest-path pruning.

## What completion means here

All requested subject areas are explorable, tunable and documented, with consistent navigation, keyboard inputs, observations, comparisons and exports. The educational atlas is complete at that scope. Scientific reproduction, empirical calibration, a mechanical twining solver, real worm neural networks, full mound airflow and a publication-quality continuum leaf solver are not implemented and must never be implied by the release wording. These are explicitly retained as future research directions rather than hidden placeholders.
