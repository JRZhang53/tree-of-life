# Research direction after the first deployment

Follow-up: Jerry authorized the fixes after this review. The resulting first
implementation is [Atlas 3](ATLAS_3.md). This document preserves the source audit
and the gaps as they stood before that implementation.


Reviewed 2026-10-18. Jerry explicitly asked for Mahadevan's research website and
publications to inform what the simulations should mean, and permitted consulting
his schoolwork. This is a source review and proposed development direction, not a
claim that new models have already been implemented.

## Interpretation of the request

The next revision should let a visitor investigate how a mechanism produces a
shape or behavior. Controls should correspond to growth, material response,
transport, sensing or a control objective. A simulation should expose competing
effects, transitions, failures and measurable consequences. A convincing visual
alone does not satisfy that aim.

This interpretation is supported by the group's emphasis on specific quantitative
questions in [morphogenesis](https://softmath.seas.harvard.edu/research/morphogenesis-and-development/),
[physiology](https://softmath.seas.harvard.edu/research/physiology/) and
[collective behavior](https://softmath.seas.harvard.edu/research/collective-behavior/).
It is an agent inference from Jerry's references, not approval of every paper or
numerical method below. Preserve the current tree-first interface while giving
the experiments more substance.

The private course material was read for context. Its files, code, figures and
personal paths are not included here or in the published application. Detailed
local review notes are ignored by Git. Public sources below independently support
the proposed research directions.

## Paper-to-experiment map

### Supported filaments: growth, localization and feedback

[Michaels et al. (2019), Geometric localization in supported elastic struts](https://softmath.seas.harvard.edu/wp-content/uploads/2019/10/2019-14.pdf).
Read for question: discrete-model formulation and Fig. 2; continuum discussion
and Fig. 4 inspected in the author PDF. No reproduction run performed.

The paper studies a growing elastic filament attached to a substrate that can
resist extension and shear. It connects distributed and localized deformation
to mechanics, growth and boundary constraints. It supplies a much stronger
starting point for the plant suite than an imposed spiral.

Proposed sequence: reproduce a planar supported-filament benchmark, then add a
separately specified spatial extension and stress-sensitive growth. Plot energy
components, curvature, strain and localization together with the filament.
Growth feedback and three-dimensional motion must be identified as extensions;
the paper's baseline does not establish those results for our implementation.

Current gap: `Atlas 2` vines append positions on a prescribed helix and relax the
radius. They compute no elastic equilibrium. First establish consistent units,
end constraints, energy derivatives, solver convergence and a no-growth baseline.
Distinguish centerline torsion from material twist and substrate shear.

### Leaves: growth incompatibility and buckling

[Liang & Mahadevan (2009), The shape of a long leaf](https://softmath.seas.harvard.edu/wp-content/uploads/2019/10/2009-16.pdf).
Read for question: Eqs. 1–5, growth prescription, stability discussion, numerical
simulation section and Figs. 3–4; Fig. 4 visually inspected.

Excess longitudinal growth varies across the leaf width. Mechanical relaxation
produces flat, saddle and rippled states; thickness, width, growth and constraints
matter. The paper includes both plate theory and a discrete numerical model.

Proposed experiment: vary edge growth and width/thickness, relax the sheet, then
measure curvature and edge wavelength. Build a small measured morphology map;
show unresolved or nonconverged points instead of painting expected regions.

Current gap: there is already an elastic-sheet mode, but its spring/triple energy,
clamped base and coarse mesh are a declared reduction. Establish how its discrete
energy, constraints and mesh relate to the chosen benchmark before claiming the
paper's phase boundaries. Keep the two geometric sketches distinct.

### Tendrils are a separate mechanical question

[Gerbode et al. (2012), How the cucumber tendril coils and overwinds](https://softmath.seas.harvard.edu/wp-content/uploads/2019/10/2012-18.pdf).
Read for question: coiling/overwinding discussion and Fig. 2–3 captions. The full
supplementary solver recipe has not been audited.

Differential contraction and the competition between bending and twisting
stiffness help explain coiling, handedness reversals and the surprising addition
of turns during extension. A future experiment could pull a mechanically relaxed
tendril and plot force against extension and turn count.

This is distinct from a twining stem locating and gripping a support, and from a
filament tethered to a substrate. Do not merge the three mechanisms under one
generic twist slider. Contact, friction and attachment require their own source
and model selection.

### Sheep: strategies emerging from an objective

[Ranganathan et al., Emergent Strategies for Shepherding a Flock, arXiv v3 (2024)](https://arxiv.org/html/2211.04352v3).
Read for question: agent-based framework, Eqs. 1–2, low-order model, Fig. 2,
phase-space sampling and code-availability statement. Earlier v2 has different
notation/title; use v3 for the next specification.

The shepherd optimizes transport, cohesion and positioning. Mustering, droving
and driving from inside the flock emerge as relative speed and herd size change.
These outcomes should be discovered by running the controller, rather than
selected as hard-coded trajectories.

Proposed experiment: retain collect/drive as an explicitly different baseline;
add a sampled-action optimizer and expose objective weights and speed/size
ratios. Measure target distance, spread, losses and shepherd effort across seeds.
Later compare individual agents with the reduced herd model.

Gate still open: audit supplementary initialization, candidate-action prediction,
noise and timestep conventions, and settle success criteria without the current
absorbing-goal rule. The paper identifies an author code repository, but no code
has been copied or reproduction/licensing audit completed.

### Termites: two distinct scales of construction

[Ocko, Heyde & Mahadevan (2019), Morphogenesis of termite mounds](https://softmath.seas.harvard.edu/wp-content/uploads/2019/10/2019-03.pdf).
Read for question: mathematical model, Eqs. 1–6 and Fig. 2. Author PDF retrieved
and its equation page visually inspected after web extraction failed.

This is an exterior mound-shape model: temperature drives porous airflow, flow
transports an odor cue, and construction changes the boundary that determines
the next flow. The formulation uses axisymmetric domains and separates daily
forcing from slow construction. A meaningful next experiment compares coupled
transport/construction with a frozen-geometry baseline, exposing temperature,
flow and cue fields along with mound shape.

Current gap: the field/walker comparison transports a cue on an unchanged grid.
Deposits do not modify transport, and no temperature or pressure is solved.
It answers a transport-representation question, not this feedback question.
Implement pressure residual, mass/flux accounting and domain-update checks
before comparing morphologies.

[Heyde et al. (2021), Self-organized biotectonics of termite nests](https://pmc.ncbi.nlm.nih.gov/articles/PMC7865135/).
Read for question: minimal-model section, Eqs. 1–3, Fig. 3 and ramp-formation
discussion. Supplementary implementation remains unaudited.

This is an interior architecture model. Material density, workers carrying or
not carrying dirt, and deposited pheromone evolve together. Accessibility and
construction feed back on one another; gravity supplies a vertical direction.
It addresses floors and connecting ramps, including helicoidal ramps, rather
than exterior mound silhouettes. A future 3D cutaway could expose these fields
and measure floor spacing/connectivity. Keep its assumptions separate from the
2019 model: the underground setting does not use the same thermal-advection
mechanism. This is a later experiment, not a second rendering of the current grid.

## Other branches and unresolved matches

- Chemistry: develop a controlled deterministic/stochastic comparison, with
  matched kinetics, physical time, boundaries and initialization. State whether
  diffusion is deterministic, stochastic or hybrid. A displayed 3D concentration
  volume is not by itself a growing coral skeleton. Select a coral-specific
  growth/transport source before claiming that connection.
- Worms: the group's physiology page points toward coupled body mechanics,
  proprioception and environment. Audit the relevant species-specific paper
  before replacing the current passive bend relay; a larval crawling model must
  not silently become a C. elegans model.
- Ants: the group's publication index includes the 2026 preprint
  [Stigmergic optimal transport](https://softmath.seas.harvard.edu/publications/).
  Its abstract was screened as a possible route-choice/heterogeneous-terrain
  extension. It is not yet an implementation specification.
- No exact Mahadevan match was established in this pass for the requested orca
  hunting or coral chemical-growth mechanisms. Preserve these open questions.

## Development order and acceptance criteria

Agent-proposed order, based on closeness to the clarified intent and available
evidence: supported-filament mechanics first; optimization-based shepherding;
leaf growth/shape comparisons; exterior mound feedback; then interior nest
architecture and matched stochastic chemistry.

For each, finish Gate A in the suite dossier before coding in depth. Establish a
small benchmark with declared boundaries and dimensionless parameters, then
compare discretizations/timesteps and initial conditions. Render diagnostics
alongside shape. Record failed convergence and excluded regimes. Add parameter
sweeps only once individual runs are trustworthy. Do not treat a source review,
a matching silhouette or passing finite-state tests as model reproduction.

The deployed `atlas-2` remains an accessible first release. Its breadth does not
close these mechanism-level requirements. This review changes the development
direction and memory only; it does not change the live models or their revision.
