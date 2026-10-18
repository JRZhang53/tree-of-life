# Termites and mound morphogenesis

Status: prototype exists; dossier outline only; Gate A not met.

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
