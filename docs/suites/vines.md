# Twining vines and active growth

Current release: implemented educational experiment(s). See [Atlas 2 specification](../research/ATLAS_2.md) for current equations, source review, tests and limitations. The outline below preserves the original deeper research agenda; its unchecked items are not a description of current UI functionality.

Status: prototype exists; geometric sketch only; Gate A not met.

## Question and intended lesson

How do growth, intrinsic shape and contact with a support combine to produce climbing? Distinguish a prescribed helix from a mechanically generated configuration.

## Existing prototype

A rising and turning tip relaxes radially toward a cylindrical support. Past positions form a stem. This shows a contact-feedback idea but does not solve elastic forces, torsion, friction or stability.

## Candidate experiment sequence

1. Select a minimal growth/contact model and establish its no-contact baseline.
2. Vary support geometry and feedback/growth parameters.
3. Explore attachment or stability only if the model actually computes the required forces and constraints.

## Research and model decisions

Read S09 and determine which mechanism can be implemented meaningfully in a static browser. Compare a kinematic growth model with an elastic-rod formulation; label the former accurately if chosen.
Specify centerline/frame variables, growth law, intrinsic curvature/torsion if present, contact constraint, support geometry, force/energy assumptions, damping and integration. Do not label an angular animation parameter as measured torsional feedback.

## Planned measurements and checks

Geometric outputs may include pitch, contact extent and tip position. Force, strain energy or stability metrics require an actual mechanics model. Check straight/free growth, no-contact and simple known-curvature cases; prevent material interpenetration if claiming contact mechanics. Check timestep/spatial-discretization convergence and energy/residual behavior appropriate to the selected solver.

## Gate A blockers

- [ ] Read the relevant mechanics and identify the chosen approximation.
- [ ] Specify growth versus elastic response and contact handling.
- [ ] Define a benchmark and a falsifiable comparison.
- [ ] Choose geometry resolution and computational limits.

## Structural needs

Growth history, rod/curve state, contact handling and camera are separate. Do not generalize a mechanics engine until this experiment requires one.
