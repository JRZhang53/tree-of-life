# Coral and morphogenesis

Status: prototype exists; dossier outline only; Gate A not met. 3D is a substantive user interest, not merely a display preference.

## Question and intended lesson

How can environmental transport or local reactions influence coral-like form, and which mechanism is actually supported for the selected example?

## Existing prototype

A three-dimensional lattice diffusion-limited aggregate and a separate flat periodic Gray–Scott grid mapped onto a sphere. The spherical display does not solve spherical reaction–diffusion, and the two modes do not form one coupled coral-growth model.

## Candidate experiment sequence

1. Review S07 and S08 to decide whether the first deeper experiment concerns transport-limited growth, chemical pattern formation, or a supported coupling.
2. For the selected mechanism, compare a clearly defined environmental or chemical intervention on shared initial geometry.
3. Add alternate mechanisms as separately explained experiments rather than labeling every branching pattern coral.

## Research and model decisions

Extract the actual growth and transport rules from S07; determine how its biological interpretation differs from simple DLA. Read S08 as a chemical-pattern reference, not proof of coral physiology.
Choose a physical domain: volume, growing surface or fixed surface. Specify fields, flux/growth coupling, flow, boundaries, discretization, mesh/lattice updates and dimensionless or physical scales.
Preserve the distinction between orbitable 3D geometry and a model whose physics is three-dimensional.

## Planned measurements and checks

Transport mass balance, reaction bounds/stability, timestep/resolution sensitivity and geometry limits. Select morphology measures such as branch spacing, occupied volume or exposure only after defining them for the representation. Compare no-flow/no-growth or homogeneous-field limiting cases. Evaluate lattice-direction bias and growth caps. Any comparison to a published morphology must state the source conditions and discrepancies.

## Gate A blockers

- [ ] Select the biological question and mechanism.
- [ ] Choose and justify the model domain and dimensionality.
- [ ] Specify growth/chemistry coupling, boundaries and numerical scheme.
- [ ] Define a tractable baseline, validation target and rendering needs.

## Structural needs

Separate chemistry/transport, growth topology and rendering. A future 3D library is a possible implementation decision after the domain is chosen, not an assumed prerequisite.
