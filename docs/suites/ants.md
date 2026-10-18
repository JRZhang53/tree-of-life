# Ants: optimization and colony behavior

Status: prototype exists; dossier outline only; Gate A not met.

## Question and intended lesson

How do reinforcement, evaporation and exploration create collective search, and what differs between an optimization algorithm inspired by ants and actual spatial colony behavior?

## Existing prototype

A small graph tour optimizer uses pheromone and distance. A separate spatial foraging heuristic deposits a grid trail while returning to a nest. S05 supports the optimization direction; it does not validate the foraging rules. The optimizer is not the full Ant Colony System algorithm.

## Candidate experiment sequence

1. Graph optimization: compare pheromone reinforcement with a declared random/heuristic baseline on the same graph.
2. Exploration versus premature concentration: measure convergence and variability.
3. Spatial foraging: food relocation and trail decay, after reviewing independent behavioral/model sources.

## Research and model decisions

Read S05, choose the algorithm variant explicitly, and record transition/deposition/evaporation rules and parameter meanings. Determine whether the first instance is small enough for an exact optimum.
Find primary sources for spatial sensing and pheromone behavior rather than extending the graph citation.
Keep graph-tour optimization and spatial foraging as separate experiments with separate state and metrics.

## Planned measurements and checks

For graph experiments: best/median tour length, gap to an independently established optimum or lower bound, search budget, variance and edge-use concentration. Check valid tours, symmetric versus directed edges, disconnected/degenerate inputs and retained best-so-far results.
For foraging: discovery latency, delivery rate, path length and adaptation after relocation. Check pheromone decay, unavailable food and inventory assumptions. Equal wall-clock runtime is not automatically an equal algorithmic search budget.

## Gate A blockers

- [ ] Select and specify the optimizer variant from its source.
- [ ] Establish independent baselines and budget accounting.
- [ ] Source or explicitly defer deeper spatial foraging.
- [ ] Define whether food is finite and how delivery is counted.

## Structural needs

Separate graph state and spatial fields. Share experimental concepts where useful, not a common ant position/state interface forced onto both problems.
