# Roadmap

Current phase: **deployed first atlas (`atlas-2`), research-led depth revision**.
Child `7152541` was deployed through portfolio `fa8d735` on 2026-10-18 at Jerry's
request. Jerry then requested a review of Mahadevan's research and permitted
consulting his schoolwork. See [research direction](research/MAHADEVAN_DIRECTION.md).
Planning at `dee9c42` was followed by authorization for autonomous development.

## Completed scope

- Memory, source ledger, product structure and documented model boundaries.
- All ten requested subjects plus fireflies and Physarum; 28 experiments.
- Research-driven corrections: topological flock neighborhoods, matched termite transport, passive bend relay, elastic sheet and volume chemistry.
- Branch search, stable versioned links, fixed-step experiment execution, measurement histories, saved baselines, local notebook and exports.
- Numerical/behavior checks and responsive browser verification; see [release checks](RELEASE_CHECKS.md).
- Humanization revision requested by Jerry: topology-driven navigation, a coherent
  experiment surface, rewritten copy and two revision rounds with an independent
  critic. See [design review](DESIGN_REVIEW.md).
- Exact shared-step notebook comparisons, starting-setting differences, readable
  intervention logs and paused refresh; see [comparison review](COMPARISON_REVIEW.md).
- Tree-first redesign after Jerry rejected the first humanization pass: actual
  model specimens in a broad foldout tree, full-width experiments, controls below
  and phone-readable annotations. See [tree-first design](TREE_FIRST_DESIGN.md).

The [implemented specification](research/ATLAS_2.md) is authoritative for current educational reductions. Original suite dossiers retain deeper ambitions. Their future-research checklists must not be confused with claims that the site reproduces a paper. Full biological calibration, continuum plant mechanics, full mound physics and neural reconstruction remain outside this educational release.

## Next work after the research review

The new reference review supersedes the earlier generic prioritization. Proposed
order: supported-filament mechanics, optimization-based shepherding, leaf
growth-to-shape comparisons, exterior mound feedback, then interior nest
architecture and matched deterministic/stochastic chemistry. Finish each source
and model specification before implementing it; do not call the current sketches
complete realizations of these mechanisms.

First bounded task: specify and benchmark a planar growing filament on an elastic
substrate against Michaels et al. (2019), with explicit boundary conditions,
energy derivatives, dimensionless groups and solver tolerances. Only then add
three-dimensional geometry and growth feedback as declared extensions. Preserve
the distinction between a supported filament, a climbing stem and a tendril.

The source review and gap map are complete. Gate A remains open for these new
models. Existing software checks do not transfer automatically to new mechanics.
Real mobile/Safari/screen-reader audits remain useful alongside this work.

## Gate A — ready to implement in depth

A suite dossier must contain:

- A single concrete question and intended learner insight.
- Primary source access/review status, claim mapping, and exact sections/equations/figures used when available.
- The chosen model and why it answers this question; alternatives and known omissions.
- State variables, parameters, units/scales, initial/boundary conditions, update rules, integration method and stopping conditions.
- A baseline, intervention, prediction, metric definition and fair comparison protocol.
- A numerical verification plan separate from behavioral and empirical validation.
- Rendering/input needs, an initial complexity estimate, and any data/code/asset reuse constraints.
- Unresolved items that could change the selected model clearly identified. Do not mark the gate complete if one of those is still unresolved.

An abstract may establish relevance; it cannot establish an uninspected numerical recipe. If full text is inaccessible, find an accessible author/preprint copy or choose a clearly labeled reduction whose specification can be independently established. Document the limitation rather than invent details.

## Gate B — model implemented and checked

- Equations/rules in the dossier match the model code and actual timestep convention.
- Conservation, bounds, symmetries, limiting cases or other applicable invariants hold.
- Numerical resolution/timestep sensitivity is checked where relevant.
- Stochastic experiments use a declared seed set and report variability, not one favorable run.
- Failure cases and interventions are intentional; outcomes are not forced merely to match a narrative.
- Reproduction settings include the model revision and initialization; old shared links have a defined migration/fallback.
- Tests target behavior and invariants, not a duplicate of the implementation.

## Gate C — educational experiment complete

- A visitor can explain the question, make a prediction, change a factor and interpret the measurement.
- Controls expose meaningful choices, with clear ranges, units, restart semantics and disabled states.
- The renderer accurately communicates state; camera, color and animation do not imply measurements the model does not compute.
- Keyboard, reduced motion, mobile interaction, focus, empty/completed states and nonvisual summaries work.
- Observed biology, model assumptions and implementation shortcuts are distinguishable.
- Relevant sources support the actual explanation; scientific uncertainty remains visible.

## Gate D — release candidate

- Selected suite statuses are honest; unvalidated prototypes are labeled or excluded from the mature release view.
- `npm ci` and `npm run verify` pass on the candidate commit; browser coverage and device/performance limits are recorded.
- Production asset/data paths work under `/fun/tree-of-life/`, including direct hash links.
- Data, code and asset permissions are checked for anything introduced.
- The portfolio maintainer receives the exact child SHA and integration needs. A child push is not a domain release.

## Evidence-gate interpretation for this release

Gate A is met for the explicitly specified reductions, not for every mechanism mentioned in the original research brainstorm. Gate B has numerical and behavioral checks with documented limits; no empirical validation is asserted. Gate C has browser/keyboard/responsive checks with hardware coverage limits recorded. Gate D uses the verified child commit and leaves the parent release to its maintainer.
