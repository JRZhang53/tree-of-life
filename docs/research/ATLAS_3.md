# Atlas 3 — mechanisms before shapes

Status: implemented and checked, 2026-10-18. These are independent educational
reductions, not reproductions of the papers. Source review and links live in
[MAHADEVAN_DIRECTION.md](MAHADEVAN_DIRECTION.md). No course code, figures or data
are used. Existing experiment identifiers remain valid; new experiments append.

## Supported filament

Question: where does a growing, tethered rod put its excess length? Inspired by
the energy competition in Michaels et al. (2019), including its supplement.
Use dimensionless arc length L=12, 41 vertices, h=L/40. Let d_i be segment length,
g_i its accumulated growth, and q_i the displacement from its straight anchor.

E = Σ S/(2h)[d_i−h(1+g_i)]² + B/(2h³)Σ|r_i−2r_(i+1)+r_(i+2)|²
+ h/2 Σ[K(q_x²+q_z²)+G q_y²].

S=20, G=0.025; B and K are controls. First two and last two nodes are clamped.
The planar version fixes z=0; the spatial extension permits z displacement.
Seeded small perturbations break symmetry. Growth is ramped for 600 steps;
optional feedback reduces its local increment by 1/(1+feedback×|elastic strain|).
This feedback law is our extension. There is no imposed helix, pole contact,
friction or torsion. Second differences are a small-curvature bending reduction.
Each step relaxes the explicit energy with analytic gradients and backtracking.
Report energy, residual and peak transverse displacement; never call a finite
iteration count equilibrium. Compare identical seeds/growth with changed K.
Checks: gradient finite differences, energy descent at fixed growth, clamps,
planarity, zero-growth relaxation, growth response and mesh sensitivity.

## Leaf sheet

Question: what happens when a leaf's margins acquire more rest length than its
center? Liang & Mahadevan (2009), main text and discrete-sheet supplement, motivate
the stretching/bending competition. Our rectangular triangulation has 25×11
vertices, length 12 and adjustable width. Longitudinal growth is
ε(y)=β|2y/W|¹⁰, ramped over 600 steps. An edge's rest length is
sqrt(dx²+dy²(1+ε)²); thus growth acts along the leaf, not across it.
E_stretch = 1/2 Σ(length−rest)²; E_bend = B Σ(1−n_left·n_right),
where n are consistently oriented unit triangle normals. B scales with the
square of the thickness control. This is a discrete sheet, not the paper's FvK
solver or a calibrated thickness mapping. Free edges in both modes; the second
mode holds the original midrib positions fixed. Seeded tiny height noise,
analytic energy derivatives and backtracking relaxation. No prescribed waves.
Report stretching, bending and force residual; compare equal-step runs, then
continue relaxation. Width changes restart. Checks: finite-difference gradients,
rigid-motion invariance, zero-growth flat state, fixed-growth descent, boundary
constraints and resolution sensitivity. No promise of a particular phase map.

## Shepherding

Question: can a dog obtain different paths by changing its objective? Based on
the agent model and sampled-direction optimization in Ranganathan et al.,
arXiv:2211.04352 v3, equations 1–2 and agent-model methods. Forty-five agents
have local heading alignment, weak centroid attraction, pairwise exponential
repulsion and exponential dog avoidance. The dog samples 32 headings at constant
speed, predicts one Euler step for every candidate, and minimizes
w_target |centroid−target| + w_spread (mean |r_i−centroid|⁴)^(1/4)
+ w_behind |dog−centroid+range×unit(centroid→target)|.
Use an open plane with a fitted camera. No absorbing goal, collect/drive switch,
collision wall, or assigned strategy label. The familiar 2D pen is a display
frame only. Record distance, fourth-moment spread and objective components.
Controls expose cost weights, speed and avoidance length. Compare same seed
and cost weights except the intervention. Checks: selected candidate is minimal,
speed is fixed, labels never control behavior, no absorption, deterministic replay
and direction-sampling sensitivity. This is greedy control, not global optimality.

## Exterior termite mound

Question: does rebuilding the wall change the cue that drives rebuilding?
Ocko, Heyde & Mahadevan (2019), equations 1–3 and model overview, motivate a
temperature→airflow→odor→wall feedback loop. Use a 2D Cartesian cross-section,
not their axisymmetric solver. A 40×28 lattice represents air inside a mound;
the exterior boundary temperature oscillates with a 160-step period. Interior
heat diffuses. Buoyancy drives Darcy face flux; a pressure projection enforces
closed-wall incompressibility. Odor has a floor source, conservative upwind
advection, diffusion, and wall leakage to an exterior zero-concentration sink.
Explicit transport uses dt=0.1 and bounded face speeds; positivity/CFL checks
must cover control extremes. Every full thermal cycle, cycle-mean boundary odor
above the threshold expands an adjacent wall voxel; below threshold can remove
a boundary air voxel. A fixed-wall mode disables only construction. Changes
alter the domain used by subsequent heat, pressure and odor solves.
Report area, thermal phase, flux divergence and odor budget error. This is an
exterior cavity/envelope experiment; occupied volume is not deposited dirt mass.
No underground floors, ramps or individual workers are inferred. Those require
the separate Heyde et al. (2021) dirt/worker/pheromone model and remain future work.
Checks: fixed wall invariant, changing wall feeds back into transport, pressure
residual, positive concentrations, conservative internal fluxes and budget closure.

## Shared contract

New modules own their state. Canvas shows their actual vertices/fields/paths.
New controls have mode visibility and explicit restart semantics. Old sketches
remain labeled and old notebook records must not be silently discarded. Revision
atlas-3 isolates new records from earlier numerical trajectories. Software checks
do not constitute biological validation or exact paper reproduction.

## Numerical evidence and limits

`npm run verify` passed on Node 24.19.0: 78 model/research tests and one production
asset-path test. New tests cover analytic rod compression energy at 21/41/81 nodes,
rod and sheet finite-difference gradients (absolute tolerance 2e-6), fixed-growth
energy descent, clamps, planarity, rigid sheet rotations/translations, feedback,
sampled objective minimization, constant dog speed, replay, field positivity,
odor budget closure, construction feedback and notebook revision preservation.
The existing parameter-extreme checks include the new modes.

Resolution probes use seed 42 and default parameters. They are diagnostics,
not a convergence claim. Rods: 1,200 steps (growth ends at 600). Sheets: 900 steps.
The initialization samples different tiny perturbations on different meshes.

| Model / resolution | Energy | Peak displacement | Force residual |
| --- | ---: | ---: | ---: |
| Rod, 31 nodes | 1.79325 | 1.33511 | 0.01055 |
| Rod, 41 nodes | 1.61841 | 1.05240 | 0.03320 |
| Rod, 61 nodes | 1.49959 | 1.09260 | 0.06348 |
| Sheet, 17 × 9 | 0.16560 | 0.94455 | 0.00114 |
| Sheet, 25 × 11 | 0.16801 | 0.73628 | 0.00077 |
| Sheet, 33 × 15 | 0.17968 | 0.64450 | 0.00202 |

These shapes are visibly mesh-dependent and some rod residuals remain appreciable.
The current descent scheme is for exploring energy competition, not measuring a
converged buckling threshold, wavelength or phase boundary. Refinement, better
equilibration and controlled perturbations are the next mechanical depth work.
The leaf triangle-normal energy has correct rigid-motion invariance but the
rectangular triangulation retains directional bias. No self-contact is resolved.

Mound fixed-wall timestep probe at t=32: dt=0.1 gives odor mass 3.83998512;
dt=0.05 gives 3.83998419. Concentration RMS difference over the cavity is
1.37735e-5. This checks time sensitivity for this case, not spatial convergence.
At temperature/flow control maxima, the tested 320-step history stays nonnegative,
odor budget error is below 1e-10, and maximum face-flux divergence is below 0.002.
Wall construction uses cycle-mean cue; after a geometry edit the pressure/flux
diagnostic describes the most recent transport solve, and new face arrows wait
until the next solve. With zero thermal forcing, flow is exactly zero.

The shepherding failure is intentional evidence, not a hidden success rule. At
900 steps, default spread weight 10 versus weight 0.5 gives:

| Seed | Distance, w=10 | Spread, w=10 | Distance, w=0.5 | Spread, w=0.5 |
| --- | ---: | ---: | ---: | ---: |
| 1 | 542.2 | 74.6 | 41.1 | 239.0 |
| 7 | 471.9 | 74.6 | 103.5 | 242.2 |
| 42 | 438.9 | 74.6 | 55.6 | 253.8 |

Thus a compact flock can fail to approach the goal, while getting its centroid
near the target can hide a scattered flock. The controller is greedy and we do
not label the trajectories as validated paper regimes. Doubling heading samples
from 32 to 64 is checked for finite behavior and a bounded distance difference
at 200 steps, not trajectory convergence.

## Compatibility and scope

The new experiments append to existing mode indices. All seven new modes are
seed-replay checked. Default branch entry selects the new mechanism; an explicit
old experiment identifier selects the old mode. Atlas-2 notebook records retain
their revision, measurements, notes and export control. Starting one uses the
current code with a visible notice; cross-revision overlays are rejected.

No paper code, assets, course files, datasets or dependencies were copied. Only
public source links are added to the app. Interior termite floors and ramps,
vine pole contact/torsion, quantitative phase diagrams and biological validation
remain outside this implemented scope.
