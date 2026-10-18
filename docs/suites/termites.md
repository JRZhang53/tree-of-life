# Termites and mound morphogenesis

Current release: implemented educational experiment(s). See [Atlas 2 specification](../research/ATLAS_2.md) for current equations, source review, tests and limitations. The outline below preserves the original deeper research agenda; its unchecked items are not a description of current UI functionality.

Historical planning dossier (before the Atlas 2 implementation).

2026-10-18 direction: distinguish Ocko et al. (2019) exterior mound/thermal-flow
feedback from Heyde et al. (2021) interior floors and ramps. Neither is reproduced
by the current uncoupled transport/deposition example. See [source review](../research/MAHADEVAN_DIRECTION.md).

## Question and intended lesson

How can a locally sensed environmental signal couple collective construction to a changing structure? A secondary numerical question is how field and particle representations of transport compare.

## Existing prototype

Threshold deposition on a 2D lattice. The field mode maintains a Gaussian source region; the particle mode emits walkers from a point. Sources and amplitudes are not matched. Neither mode includes the full heat/advection/porous-airflow feedback of S06. Comparing their pictures is not a quantitative solver comparison.

## Candidate experiment sequence

1. Transport-only benchmark: match source, boundaries, diffusion and decay in field and particle descriptions.
2. Couple a selected signal to deposition and test feedback.
3. Add environmental physics or three-dimensional morphology only after the relevant terms and costs are specified.

## Research and model decisions

Read S06 and identify the minimum coupled mechanism that answers the chosen question. Distinguish a Gaussian kernel/solution from the Laplacian operator; do not frame them as competing physical laws.
Choose source geometry/rate, domain, boundaries, particle-to-concentration normalization, deposition/removal law and how material changes transport. Decide whether the goal is representation comparison or mound biology; the former alone does not establish the latter.

## Planned measurements and checks

Transport concentration error, mass balance including sources/sinks, variance versus particle count and resolution sensitivity. For construction, deposited mass, occupied geometry and a defined porosity measure only if the representation supports it. Include no-source, no-diffusion, no-decay, no-construction and relocated-source cases. Separate convergence of a numerical solver from agreement with mound observations.

## Gate A blockers

- [ ] Extract the source's coupled fields and boundary assumptions.
- [ ] Specify a matched transport benchmark.
- [ ] Select the construction feedback and morphology representation.
- [ ] Declare which biological mechanisms remain omitted.

## Structural needs

Field solver, particle transport and construction rules must be independently testable. Avoid a universal shared grid size or periodic boundary default.
