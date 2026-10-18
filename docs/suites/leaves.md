# Long leaves and differential growth

Status: prototype exists; geometric sketch only; Gate A not met.

## Question and intended lesson

How can incompatible preferred growth produce curvature, curling or edge undulations in a thin leaf-like structure?

## Existing prototype

A parametric ribbon ramps a control into curvature and sinusoidal edge displacement. It does not minimize elastic energy or derive shape from a growth metric. The plantain-lily example in the brief has not been selected as a calibrated species model.

## Candidate experiment sequence

1. Establish a minimal ribbon/sheet model that distinguishes prescribed growth from the resulting shape.
2. Compare uniform growth with edge-biased or across-thickness growth, only as supported by the chosen formulation.
3. Explore geometry/material effects without calling arbitrary display controls physical stiffness.

## Research and model decisions

Read S10, distinguish its experiments, theory and numerics, and select the smallest model that captures the intended incompatibility.
Specify dimensionality, growth field/metric, deformation variables, energy or equilibrium equations, material parameters, boundary constraints, numerical minimization/time dynamics and initial perturbations. Decide what is measured versus dimensionless.
Do not assume a 3D-rendered ribbon is already a mechanical simulation.

## Planned measurements and checks

Curvature, edge wavelength/amplitude and, if computed, elastic energy or equilibrium residual. Check zero mismatch, uniform compatible growth and symmetry/constraint cases. Test mesh/step sensitivity, local minima and dependency on initialization. Use the zero-curvature prototype regression as a software guard, not mechanical validation.

## Gate A blockers

- [ ] Select a sourced growth-to-shape formulation.
- [ ] Define growth, material and boundary parameters independently.
- [ ] Establish a benchmark and convergence criterion.
- [ ] Decide whether species-specific claims/data are needed at all.

## Structural needs

Growth prescription, mechanical solution and mesh rendering must be distinct. Reuse vine utilities only where dimensions and equations actually match.
