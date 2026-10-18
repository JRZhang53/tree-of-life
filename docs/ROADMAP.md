# Roadmap

Current phase: **M0 — project memory and structure**. The prototype is preserved. No suite has yet cleared the research/specification gate.

This is a dependency-driven plan, not a delivery-date promise. Work on one bounded question at a time. Autonomy means resolving ordinary research and design choices with evidence, not skipping the gates or implementing the whole catalogue in parallel.

## Phases and exit evidence

| Phase | Work                                                                                                                                 | Exit evidence                                                                                            | State                           |
| ----- | ------------------------------------------------------------------------------------------------------------------------------------ | -------------------------------------------------------------------------------------------------------- | ------------------------------- |
| M0    | Preserve the brief; distinguish requirements from assumptions; inventory prototype gaps; establish memory, dossiers and architecture | All ten subjects mapped; source ledger, decision register, next task and ownership rules documented      | Completed by this planning pass |
| R1    | Research and specify a starling experiment                                                                                           | Full dossier meeting Gate A, with a concrete comparison and defined measurements                         | Next proposed task; not started |
| F1    | Extract the minimum shared runtime and one suite module                                                                              | Preserve baseline behavior and legacy links; pure model/render separation; no speculative engine rewrite | After R1                        |
| I1    | Implement and evaluate the first specified experiment                                                                                | Gates B and C; explanatory content agrees with actual code                                               | After F1                        |
| R2/I2 | Research and develop sheep herding as a companion control suite                                                                      | Fair collect/drive comparison, seed ensemble and explicit goal-zone assumptions                          | After the first complete slice  |
| S1    | Select a first release subset and its maturity labels                                                                                | Scope justified by demonstrated research/model cost; no implied completion of remaining suites           | After I1/I2 evidence            |
| E1    | Expand through distinct model families                                                                                               | Each added suite clears the same gates; reuse justified kernels, not unverified biological rules         | Deferred                        |
| L1    | Prepare a release candidate                                                                                                          | Gate D, commit-specific verification and integration instructions                                        | Deferred; no deployment in M0   |

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

## Next task card: R1

**Objective:** turn [the starling dossier](suites/starlings.md) into the first implementation-ready model specification.

**Inputs:** P1–P4 in the product brief, S01 in the source ledger, the current starling implementation and its tests.

**Work:** read the relevant primary source; decide whether the first experiment teaches generic boids or a starling-specific interaction hypothesis; specify neighbor selection, steering, boundary effects, parameter meanings and alignment/dispersion metrics; design a same-initial-condition comparison and a multi-seed evaluation. Record unsupported claims rather than adding them to the UI.

**Deliverables:** completed dossier, source/claim entries, explicit model choice, experiment table, test plan and minimal architectural needs. Update the roadmap and decision register.

**Exclusions:** no new species, UI redesign, framework migration, deeper simulation implementation or release. Those are later tasks after Gate A. R1 is a next-work proposal, not a claim it was completed in the memory pass.

## Proposed expansion order

1. Starlings → sheep: establish local-interaction and controller comparisons.
2. Ants: establish optimization metrics and separate graph/spatial experiments.
3. Bacteria → termites: establish field coupling, numerical checks and representation comparisons.
4. Coral: choose and develop the scientifically supported 3D mechanism; do not treat this as a generic sphere-rendering task.
5. Vines → leaves: select mechanical representations before writing deeper solvers.
6. Orcas and C. elegans: resolve the behavioral/control question before increasing fidelity. Their placement reflects current specification uncertainty, not lower importance.

Reorder when a dossier reveals a simpler or more compelling path. Do not delay all plant/coral research until every preceding implementation is finished; targeted reading can inform architecture without becoming a second implementation stream.
