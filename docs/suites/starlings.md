# Starlings

Current release: implemented educational experiment(s). See [Atlas 2 specification](../research/ATLAS_2.md) for current equations, source review, tests and limitations. The outline below preserves the original deeper research agenda; its unchecked items are not a description of current UI functionality.

Historical planning dossier (before the Atlas 2 implementation). Priority: first research task (R1).

## Question and intended lesson

How do local interaction rules produce coherent group motion, and how does the definition of a neighbor change the outcome? A visitor should distinguish remaining near a group from moving in a shared direction.

## Existing prototype

Two-dimensional local separation/alignment/cohesion, distance-based neighbors, bounded speed, soft boundaries and a point disturbance. Presets change weights. This is generic boids with a starling label, not a calibrated starling model.

## Candidate experiment sequence

1. Establish a clearly labeled generic-boids baseline; remove one interaction while preserving initialization.
2. Compare candidate neighbor rules only after obtaining relevant starling-specific evidence.
3. Introduce a localized disturbance and measure response/recovery using a defined criterion.

## Research and model decisions

Start with S01 in the [source ledger](../research/README.md). Read the technical method, distinguish steering conventions from ours, and locate primary support for any starling-specific claims.
Specify positions, velocities, interaction graph, perception range, boundary conditions, noise, speed convention and timestep. Choose whether the question concerns generic emergence or starling biology before naming the model.
Decide which boundary effects should be excluded from measurements and how group fragmentation is defined.

## Planned measurements and checks

Define polarization as a normalized heading statistic, and separately define spatial dispersion and connected components. Compare trajectories from shared initial conditions across a declared seed ensemble. Check finite/bounded state, permutation effects, zero-interaction cases, neighborhood-edge cases and timestep sensitivity. Avoid treating high polarization alone as flock health or biological realism.

## Gate A blockers

- [ ] Inspect the primary model details and record exact source locations.
- [ ] Select the first experiment and its neighbor/boundary rules.
- [ ] Define units, update procedure, metrics and comparison protocol.
- [ ] Specify the educational reduction and any unsupported biological claims.

## Structural needs

This should be the first extracted suite: typed agent state, explicit neighborhood kernel, separate metrics and renderer. Do not build a generic animal-controller hierarchy from this one case.
