# Bacterial colonies and cellular automata

Status: prototype exists; dossier outline only; Gate A not met.

## Question and intended lesson

How does coupling local reproduction to resource transport change colony development?

## Existing prototype

A coarse occupancy lattice consumes a diffusing nutrient and divides probabilistically into neighboring sites. A richer mode replenishes the habitat. It omits mechanics, metabolism, death, mutations and species-specific behavior.

## Candidate experiment sequence

1. Compare resource-limited growth with replenishment under a defined nutrient budget.
2. Vary transport relative to division and measure geometry and resource depletion.
3. Add competition or multiple inoculations only after the single-colony interpretation is established.

## Research and model decisions

Read S11 and extract the actual cell/field coupling, stability treatment and biological interpretation. Choose whether cells represent individuals or coarse occupied regions.
Specify occupancy, nutrient concentration, uptake/division rules, update ordering, stochastic rates, boundaries, replenishment and model time. Distinguish a probability per update from a rate per unit time.
Avoid implying all bacterial colonies share one automaton rule or equating occupied sites directly to biomass without a mapping.

## Planned measurements and checks

Occupied area, growth rate, nutrient inventory/flux and a precisely defined morphology measure. Track source/uptake balance; investigate update-order bias, saturation, resource-free and division-free limits. Check grid/timestep effects and seed variation. Empirical colony comparison requires a particular organism, medium and data source.

## Gate A blockers

- [ ] Choose the source model and interpretation of a lattice site.
- [ ] Specify coupled resource/division updates and boundary budgets.
- [ ] Define model time, rate conversion and numerical stability.
- [ ] Establish valid observables and an evaluation protocol.

## Structural needs

Cell update and resource solver should be independently testable with explicit coupling/order. A diffusion kernel may be shared with termites only with explicit source and boundary policies.
