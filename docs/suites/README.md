# Suite dossiers

This index preserves the original research outlines. Current implemented educational models, evidence, equations and checks are specified in [Atlas 2](../research/ATLAS_2.md). The table below is the historical prototype inventory, useful for understanding which deeper questions remain.

| Suite / stable ID       | Existing prototype                    | Main unresolved issue                                         | Dossier                   |
| ----------------------- | ------------------------------------- | ------------------------------------------------------------- | ------------------------- |
| Starlings / `starlings` | Local boids                           | Generic emergence versus starling-specific interaction rules  | [Starlings](starlings.md) |
| Sheep / `sheep`         | Collect/drive heuristic               | Source fidelity, controller observability and fair objectives | [Sheep](sheep.md)         |
| Orcas / `orcas`         | Prescribed pursuit/encirclement       | Supported tactic and meaningful success measure               | [Orcas](orcas.md)         |
| Ants / `ants`           | Graph optimizer and spatial heuristic | Algorithm variant, baselines and separate foraging evidence   | [Ants](ants.md)           |
| Termites / `termites`   | Field/particle deposition             | Matched transport comparison and construction feedback        | [Termites](termites.md)   |
| Coral / `coral`         | 3D DLA and mapped chemical surface    | Biological mechanism, domain and dimensionality               | [Coral](coral.md)         |
| Vines / `vines`         | Radial feedback curve                 | Kinematics versus torsion/contact mechanics                   | [Vines](vines.md)         |
| Long leaves / `leaves`  | Parametric ribbon                     | Growth-to-shape mechanics and validation                      | [Leaves](leaves.md)       |
| Bacteria / `bacteria`   | Nutrient/occupancy automaton          | State interpretation, resource budgets and update rules       | [Bacteria](bacteria.md)   |
| C. elegans / `worms`    | Phase-coupling analogy                | The actual control question and model semantics               | [C. elegans](worms.md)    |

## Dossier completion protocol

Keep the stable ID when reorganizing application code so old links can be mapped. A new organism/group does not automatically need a new solver, and a shared solver does not prove shared biology.

During deeper research, expand the outline with:

1. A source/claim table using the [research method](../research/README.md).
2. A fully specified chosen model: state, parameters with units and ranges, initial and boundary conditions, update equations/rules, numerical method and termination.
3. An experiment table: question, baseline, intervention, prediction, measurement and fair comparison.
4. Separate numerical, behavioral and empirical evaluation plans.
5. Alternatives, omissions, computational needs and reuse permissions.
6. An explicit [Gate A](../ROADMAP.md) decision with evidence, date and author/revision.

Only then move its status to `Specified`. Preserve superseded assumptions in the decision history rather than quietly changing the experiment's meaning.

The original starling-first task was completed by choosing an explicit metric/topological educational comparison. Future depth work should update these dossiers alongside the current implementation specification.

## Atlas 2 additions and current specifications

The [Atlas 2 specification](../research/ATLAS_2.md) now describes all implemented reductions. New suites: [fireflies](fireflies.md) and [Physarum](physarum.md). Original dossier checklists preserve deeper research ambitions.
