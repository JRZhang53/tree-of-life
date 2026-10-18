# Sheep and shepherding

Current release: implemented educational experiment(s). See [Atlas 2 specification](../research/ATLAS_2.md) for current equations, source review, tests and limitations. The outline below preserves the original deeper research agenda; its unchecked items are not a description of current UI functionality.

Historical planning dossier (before the Atlas 2 implementation). Proposed follow-on to starlings.

## Question and intended lesson

When should a shepherd collect scattered agents versus drive a cohesive group? Teach state-dependent feedback and how a controller's success depends on its environment and objective.

## Existing prototype

A heuristic dog selects a collecting or driving target. Sheep combine local steering, global flock-center attraction and avoidance. Entering the circular goal removes sheep from the interaction pool; moving the goal reactivates them. Tests establish software completion for selected seeds, not correspondence with a paper or an optimal controller.

## Candidate experiment sequence

1. Collect/drive versus drive-only under identical initial conditions and effort limits.
2. Change flock cohesion or disturbances and compare success distributions.
3. Compare a point destination, absorbing zone and a physical pen only after choosing appropriate models; these objectives are not interchangeable.

## Research and model decisions

Read S02's full methods, shepherd geometry, neighbor definitions and evaluation criteria. Mark every deviation from that model.
Define sheep/dog speed and turning constraints, collection threshold, target/pen rules, collision handling and stopping conditions. Decide whether global center information is available to the controller and animals, and explain the observability assumption.
Do not share starling steering merely because the renderer also uses moving agents.

## Planned measurements and checks

Completion fraction, completion time with censoring for failed runs, controller path length/effort, flock spread and failure classification. Compare a seed ensemble without tuning one strategy only on its test seeds. Test target relocation, empty/all-arrived populations, boundary traps, unreachable targets and zero/large cohesion. Goal handling must not create artificial jams or hide failure by teleporting agents.

## Gate A blockers

- [ ] Extract S02's exact strategy and interaction rules.
- [ ] Declare the objective and fair strategy-comparison budget.
- [ ] Specify boundaries, information access and arrival semantics.
- [ ] Establish benchmark scenarios beyond the currently passing seeds.

## Structural needs

Keep the animal dynamics, shepherd controller and evaluation objective separate so controller comparisons do not silently change the environment.
