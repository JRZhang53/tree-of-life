# C. elegans and distributed control

Current release: implemented educational experiment(s). See [Atlas 2 specification](../research/ATLAS_2.md) for current equations, source review, tests and limitations. The outline below preserves the original deeper research agenda; its unchecked items are not a description of current UI functionality.

Status: prototype exists; analogy only; Gate A not met. The original brief explicitly left this direction tentative.

## Question and intended lesson

Which local feedback mechanism can coordinate body motion, and what does interrupting that feedback reveal in the chosen model? Neural interpretability, locomotion mechanics and robotics transfer are different possible questions, not one promised feature set.

## Existing prototype

A driven head phase entrains slower segment oscillators; one coupling can be removed. A wavy body visualizes the phases. There is no connectome, neural physiology, force-based body model or prediction of crawling speed.

## Candidate experiment sequence

1. Review S12 and choose whether the first experiment is a clearly labeled local-feedback analogy or a reduction of its locomotion mechanism.
2. Compare intact and interrupted coupling with a precisely defined intervention.
3. Consider connectome-based or embodied-control experiments only after selecting a separate question, model and data source.

## Research and model decisions

Identify what S12 establishes experimentally and what a model must represent to test the selected hypothesis. Do not equate an oscillator link cut with a biological lesion.
Specify whether state variables represent neural activity, phase, curvature, muscle activation or mechanical coordinates. Define coupling direction/range, sensing, actuation, environmental loading, body constraints and time scales where relevant.
If connectome data become necessary, record version, mapping, provenance and reuse terms before importing them.

## Planned measurements and checks

For an oscillator analogy, phase lag, locking and perturbation propagation are valid; locomotion speed is not. A mechanical model needs displacement, force/contact and energetic checks appropriate to its formulation. Test decoupled/identical-unit limits and distinguish imposed waves from emergent coordination. Match intervention claims to what the state actually represents.

## Gate A blockers

- [ ] Select one bounded control question and model fidelity.
- [ ] Extract relevant evidence from S12 and map claims precisely.
- [ ] Define the state/intervention semantics and valid measurements.
- [ ] Decide whether biological data or mechanics are needed.

## Structural needs

Keep neural/controller state, body dynamics and visualization separate if later introduced. Do not build a connectome loader merely to make the existing analogy appear more biological.
