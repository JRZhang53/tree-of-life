# What could grow here next?

Research pass: 2026-10-18, after the atlas-3 deployment. Jerry asked for new
bio-inspired simulations in the direction established by the Mahadevan review.
These are candidate experiments, not implemented modes or completed Gate A
dossiers. The ordering is an agent recommendation, not a new user requirement.

The selection rule is simple: a visitor should change a biological or physical
rule and see the consequence. A new organism needs a new question, not just a
different drawing of an existing swarm, oscillator or chemical texture.

## Recommended order

| Order | Organism / question | What it adds | Estimated browser cost | Source readiness |
| --- | --- | --- | --- | --- |
| 1 | Venus flytrap: when does a leaf snap? | Instability and competing energy minima | Low for a two-curvature reduction | Main paper and reduced energy inspected; dynamics specification open |
| 2 | Plant shoot: where does the next leaf go? | Sequential placement and emergent spiral order | Low to medium | Original model pages visually inspected; nondimensionalization and cutoffs open |
| 3 | Dictyostelium: how does a chemical pulse organize a crowd? | Excitable signaling coupled to moving cells | Medium | Main text/figure methods inspected; supplementary parameter audit open |
| 4 | Pine cone: how does dead tissue move? | Humidity-driven bilayer mechanics | Low for equilibrium; medium for transport | Bilayer and wetting equations inspected |
| 5 | Choanoflagellates: when does a colony become three-dimensional? | Growth, packing and extracellular material | Medium for a bounded colony | Main model/figure inspected; supplementary mechanics open |
| 6 | Zebrafish: can a damaged stripe repair itself? | Pigment-cell interactions on a growing domain | Medium | Abstract and author bibliography screened; full recipe still open |
| 7 | Chlamydomonas: why do two flagella keep time? | Motion feeding back through fluid forces | Medium to high | Main paper inspected; coupling coefficients and supplement open |
| 8 | Cup fungi: can spores make their own wind? | Collective transport with two-way fluid coupling | High | Main paper inspected; numerical supplement and feasibility open |

These costs are estimates, not benchmarks. Existing rod/sheet convergence work
stays on the roadmap. New species should not hide unresolved numerical issues.

## 1. Venus flytrap — make the snap earn its place

**Source basis.** Forterre, Skotheim, Dumais & Mahadevan (2005),
[How the Venus flytrap snaps](https://softmath.seas.harvard.edu/wp-content/uploads/2019/10/2005-07.pdf),
especially the Methods reduced elastic energy and stability discussion. Their
two-curvature energy is

`U = (Kx - Kxn)^2 + (Ky - 1)^2 + alpha (Kx Ky - 1)^2`,

with `alpha = L^4 kappa^2 / h^2`. Changing natural curvature changes the energy
landscape. Geometry controls whether closure is gradual or involves instability.
The [2020 follow-up](https://doi.org/10.1073/pnas.2002707117) was abstract-screened
as a reminder that hydration and active tissue deformation matter too.

**Proposed suite.** Put a lobe beside its energy landscape. Slowly sweep the
driving curvature, then reverse it. Compare geometries with different alpha;
track curvature, energy, gradient norm and the smallest Hessian eigenvalue.
The snap must follow loss of stability, never an angle threshold or animation.

**First implementation boundary.** Two degrees of freedom and an illustrative
surface reconstructed from them. A chosen overdamped relaxation would be our
reduction, not a prediction of the paper's closure time. Trigger-hair counting,
electrical signaling and full hydraulic dynamics are separate questions.

**Before promotion.** Specify the drive protocol and initial equilibrium;
verify derivatives, stable-branch continuation, fixed-drive energy descent and
step-size sensitivity. Audit the source's curvature conventions before assigning
an anatomical interpretation or quoting a critical threshold.

## 2. Phyllotaxis — let the angle emerge

**Source basis.** Douady & Couder (1992),
[Phyllotaxis as a physical self-organized growth process](https://doi.org/10.1103/PhysRevLett.68.2098).
The [accessible scan](https://www.sccs.swarthmore.edu/users/08/bblonder/phys120/docs/douady.pdf),
pp. 2099–2100 and Figs. 3–4, was visually inspected. Existing primordia move
outward. A new one appears at the minimum of their repulsive potential around a
birth circle. Several potentials give related patterns; growth history and
parameters affect which branch appears. A golden angle is not universal input.

**Proposed suite.** Show the growing shoot end-on, with the potential around its
rim underneath. Add one primordium at a time or run continuously. Vary outward
growth relative to birth frequency, then compare the resulting divergence-angle
trace with a deliberately fixed-angle construction. Let visitors select a
primordium to follow its neighbors through growth.

**Before promotion.** Recover the paper's dimensionless parameter definition;
choose one potential, outer cutoff and seeded tie-break rule. Check angular
minimizer refinement, rotational invariance, radial advection and cutoff
sensitivity. Report transient and steady behavior separately. This physical
placement model does not explicitly simulate auxin transport or gene regulation.

## 3. Dictyostelium — follow a pulse without chasing its back

**Source basis.** De Palo, Yi & Endres (2017),
[A critical-like collective state leads to long-range cell communication in Dictyostelium discoideum aggregation](https://journals.plos.org/plosbiology/article?id=10.1371/journal.pbio.1002602).
The coarse-grained-model section, Fig. 1 and perturbation discussion were read.
Their moving agents sense summed cAMP profiles, pulse, and enter a refractory
state. This couples communication to aggregation. Directional secretion is a
model assumption to expose, not a universal requirement for aggregation.

**Proposed suite.** Begin with one cell and a passing chemical wave: does it
reverse after the crest passes? Then open the population experiment. Compare
relay enabled/disabled and different refractory periods at matched density and
seed. Show cell paths, firing state and signal concentration separately. Measure
directed displacement, cluster counts and pair correlations across several seeds.

**Before promotion.** Audit Supporting Information and parameter tables. Choose
either the source's analytical secretion profiles or an independently specified
grid-field reduction; never silently mix them. A grid version also needs diffusion
stability and mass-budget checks. Start with the single-cell wave benchmark.
This adds chemotaxis and excitability; it is not another Physarum tube network.

## 4. Pine cones — movement without muscles

**Source basis.** Reyssat & Mahadevan (2009),
[Hygromorphs: from pine cones to biomimetic bilayers](https://softmath.seas.harvard.edu/wp-content/uploads/2019/10/2009-05.pdf),
Sections 2–3, Eqs. 2.1–2.6 and the synthetic-strip wetting model. Differential
swelling of bonded layers changes curvature. Layer thicknesses and stiffnesses
matter; wetting and drying need not have identical kinetics.

**Proposed suite.** A single scale, magnified in cross-section, opens as humidity
falls. Compare equal-swelling layers with an active/passive pair. Vary thickness
and stiffness ratios; plot equilibrium curvature against humidity. A second,
explicitly biomimetic strip experiment could show a moving wetting front.

**Before promotion.** Implement the equilibrium law first. Check zero humidity
change, equal expansion and the equal-thickness/equal-modulus factor of 1.5.
Convert percent humidity consistently. Do not attach the synthetic paper-strip
wicking timescale to a pine cone and call it measured biological closure time.
Transport and hysteresis need separate specifications. This deserves a gymnosperm
branch rather than another leaf-growth preset.

## 5. Choanoflagellates — a rosette assembled by growth

**Source basis.** Larson et al. (2020),
[Biophysical principles of choanoflagellate self-organization](https://www.pnas.org/doi/full/10.1073/pnas.1909447117),
model description and Fig. 4. Cell geometry, basal extracellular matrix (ECM)
and their relative mechanical properties govern colony packing. The model uses
linked spheres for cells and secreted ECM particles. Colonies grow by division;
this is not aggregation of freely arriving cells.

**Proposed suite.** Follow a small Salpingoeca rosetta colony through divisions.
Change cell aspect ratio or ECM production and inspect when a flatter arrangement
becomes volumetric. Expose cell/ECM views, principal-axis ratios and overlap error.

**Before promotion.** Read supplementary force laws, division rules and growth
rates. Bound the initial experiment to 16–64 cells and benchmark particle counts.
Check force symmetry, volume bookkeeping and integration sensitivity. Do not
constrain cells onto a sphere to manufacture a rosette. Confirm the lineage
placement near animals without labeling choanoflagellates as animals.

## 6. Zebrafish — repair a pattern, not a texture

**Screened source.** Volkening & Sandstede (2015),
[Modelling stripe formation in zebrafish: an agent-based approach](https://doi.org/10.1098/rsif.2015.0812).
The abstract and [author bibliography](https://bjornsandstede.com/publications.html)
establish a relevant pigment-cell model. Full article retrieval was blocked in
this pass; the update rules and supplement remain unaudited.

**Proposed suite.** Erase a small patch of pigment cells and compare recovery
with an unperturbed run. Vary the interaction range and growth protocol; measure
stripe width, orientation and cell counts. Aim for a small, readable tissue patch
with individual cells, not a reaction–diffusion shader on a fish silhouette.

**Before promotion.** Obtain accessible full text, select the represented cell
types and transcribe birth/death/migration rules with units. Do not assume a
three-population model or promise genetic-mutant predictions. Define ablation
and domain-growth bookkeeping before designing presets.

## 7. Chlamydomonas — coordination through body rocking

**Source basis.** Geyer et al. (2013),
[Cell-body rocking is a dominant mechanism for flagellar synchronization in a swimming alga](https://cfaed.tu-dresden.de/files/user/bfriedrich/papers/geyer_friedrich_flagellar_synchronization_pnas_2013.pdf).
The main model links flagellar phases, hydrodynamic loading and body yaw.
The [direct-interaction study](https://pmc.ncbi.nlm.nih.gov/articles/PMC4113993/)
was screened as a counterpoint: body rocking is not the only possible route to
hydrodynamic synchronization.

**Proposed suite.** Knock one flagellum out of phase and compare a freely rocking
body with a rotationally clamped one. Plot phase difference beside yaw. A torsional
spring gives an intermediate intervention with an interpretable mechanical role.

**Before promotion.** Audit phase-dependent friction/coupling functions and their
calibration. Check zero coupling, reciprocal symmetry where applicable, and
timestep refinement. A generic sine-coupled oscillator with decorative flagella
would not answer this question. Proceed only after a bounded mechanical reduction
is justified and coefficients have an honest provenance.

## 8. Cup fungi — launch together and carry the air

**Source basis.** Roper et al. (2010),
[Dispersal of fungal spores on a cooperatively generated wind](https://pmc.ncbi.nlm.nih.gov/articles/PMC2955148/).
The main text connects synchronized ejection, entrained airflow and spore range;
timing perturbations distinguish participation from simply releasing into an
already moving flow. Numerical implementation details are in the unread supplement.

**Proposed suite.** Compare isolated launches, dispersed launch times and a
coordinated puff. Use the same number of spores and launch-energy budget. Show
air velocity, particle paths and the fraction passing a chosen height.

**Before promotion.** Run a separate browser feasibility study for coupled
particles and fluid. Check the isolated Stokes-drag limit, momentum exchange,
boundary fluxes and grid sensitivity. Particles following a scripted jet cannot
demonstrate that the spores generated it. This could introduce Fungi/Ascomycota,
but it is the highest-cost candidate and should wait for a defensible solver.

## How to turn this queue into working experiments

Start with the flytrap dossier: declare nondimensional units, initial stable
branch, drive schedule, solver tolerances and acceptance comparisons. Then do
phyllotaxis, followed by the Dictyostelium supplement audit. A failed feasibility
check is useful evidence; preserve it instead of forcing an attractive result.

Each suite should ship with a control experiment, a small set of useful controls,
a visible measurement and a source note that names our reduction. Preserve the
tree-first interface. Use a second view only when it exposes something the scene
cannot show, such as energy minima or a chemical pulse.

No source code, paper figures, datasets or private coursework were copied into
the application in this pass. Research links are not asset licenses. Audit terms
before reusing anything; prefer original renderings of independently implemented
equations. Audit taxonomy before adding new branches. Keep speculative suites
out of the live navigation until their source, numerical and interaction gates
are met.
