# Architecture plan

Status: proposed structure for staged development. No source directories have been moved and no new runtime abstraction has been implemented by this planning pass.

## Current system

| File                    | Current responsibility                               | Pressure point                                                                                                      |
| ----------------------- | ---------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------- |
| `src/catalog.ts`        | Species, controls, presets, copy and citations       | Content and model parameter assumptions share a loose `Record<string, number>`                                      |
| `src/models.ts`         | One `Simulation` class for every subject             | All modes share state slots, grid dimensions and species switches; unrelated biology is easy to couple accidentally |
| `src/render.ts`         | Drawing and projected 3D views for all subjects      | Render-specific choices and species logic accumulate in one dispatcher                                              |
| `src/main.ts`           | Tree, icons, DOM, routing, controls, playback, input | Taxonomy and interaction are intertwined with markup and lifecycle                                                  |
| `src/style.css`         | Atlas and responsive presentation                    | Preserve useful visual work; avoid redesign during model extraction                                                 |
| `tests/models.test.mjs` | Model invariants and selected outcomes               | Good regression baseline; not evidence of paper reproduction or empirical calibration                               |

The existing pure seeded state and separate rendering are useful. Preserve those properties. The numerical clock is currently an illustrative fixed tick; different models perform different internal updates per tick. Do not relabel those ticks as common physical seconds.

## Proposed layout

Create modules only as an extracted vertical slice needs them. This tree is a destination map, not a request for empty scaffolding.

```text
src/
  app/                  # lifecycle, routing, navigation and shell
  content/
    taxonomy.ts         # explicit parent/child relationships and label kinds
    sources.ts          # stable source IDs and bibliographic metadata
    registry.ts         # suite metadata and loaders
  core/
    contracts.ts        # small interfaces justified by the first suite
    random.ts           # seeded RNG and initialization policy
    clock.ts            # fixed-step playback; model timestep stays explicit
    experiment.ts       # settings, interventions and reproduction descriptors
  numerics/             # only verified kernels genuinely shared by models
  presentation/         # common controls, metrics, camera and accessibility helpers
  suites/
    starlings/
      definition.ts     # modes, parameters, experiments and evidence links
      model.ts          # state and update rules; no DOM/canvas
      renderer.ts       # state to pixels; never advances the model
      metrics.ts        # named, documented observables
    ...                 # one folder per extracted suite, added incrementally
tests/
  core/
  suites/
  integration/
  build.test.mjs
docs/
  research/
  suites/
```

## Boundaries

**Suite definition:** stable suite and experiment IDs, maturity status, model revision, source IDs, control metadata and limitations. Distinguish the taxon identifier from the experiment identifier: a group can have several models, and one mechanism can appear in several groups.

**Model:** owns typed state, initialization, numerical parameters, update rules, interventions and completion/failure reasons. It depends on numerical utilities and explicit inputs, never DOM state, canvas size or wall-clock time. It may use mutable arrays when appropriate; immutability is not a requirement.

**Renderer:** consumes model state and camera/display options. Zoom, orbit, resize and repaint cannot change model state or consume its random stream. Meshes, fields and particles should retain their dimension/unit semantics regardless of screen projection.

**Experiment controller:** manages run/pause/step, parameter changes and their application policy, initial-condition reuse and metrics sampling. It knows whether a parameter is live, requires reinitialization, is purely visual, or is inapplicable to the current experiment. Avoid one universal parameter bag with silent unused keys.

**Metrics:** define formulas, aggregation windows, units and valid conditions. A convenient visual statistic is not automatically a biological success measure. Keep model metrics separate from UI performance diagnostics.

**Content:** explanations and references map to model revisions and experiments. Taxonomy is an explicit data structure with a separately reviewed source; it is not inferred from module names or equation families. Label groups and growth forms honestly.

**Shared numerics:** share RNG, vector operations or a verified diffusion kernel where useful. Do not assume the same steering controller, boundaries, source term or timestep explains sheep, fish and birds simply because all draw particles.

## Reproduction and routes

- Keep static hash routing. Existing `#species?mode=<number>&seed=...` links must continue to resolve through an explicit legacy mapping.
- Use stable string experiment IDs for future routes rather than positional mode indices. Store a settings schema version and a model revision when new reproduction features are introduced.
- Distinguish **starting-settings link** from **replay** and **state snapshot**. The current link is only starting settings; it omits interventions, elapsed time, camera and speed.
- A future replay descriptor needs initial conditions, seed/RNG version, parameter schedule, intervention order, timestep, boundary rules and model revision. Decide float tolerance and platform guarantees; do not promise bitwise cross-browser identity without evidence.
- Unknown or obsolete settings should produce a visible explanation and safe fallback, not silently change the scientific meaning of a link.
- No browser storage is necessary to establish this structure. If added later, namespace keys with `tree-of-life:`.

## Execution and rendering decisions

Retain the existing stack until a specified experiment proves a need to change it. Canvas 2D remains a baseline for bounded 2D and projected-3D scenes. WebGL, a mesh library or worker execution require a concrete rendering/compute need and a measured experiment, not a catalogue-wide migration in advance.

Initial performance planning should state the agent/grid/mesh size, algorithmic cost, update rate and expected device class. Measure p95 update/render costs and responsiveness on declared hardware before setting release budgets. The existing 12-step/frame work cap, DPR cap and population limits are prototype safeguards, not validated budgets for deeper models.

## Migration sequence

1. Freeze the current commit as a behavioral reference; retain its tests and hash mappings.
2. Finish the first suite's research/model specification.
3. Extract its model, renderer and metrics behind the smallest useful interfaces. Keep an adapter for unextracted prototype suites.
4. Prove that extraction alone preserves defined behavior. Then make scientifically motivated model changes as separate, explained revisions.
5. Extract shared state parsing, parameter policies and playback only where the slice needs them.
6. Add a second distinct model family before generalizing an interface. Avoid inheritance hierarchies centered on one all-purpose particle state.
7. Migrate other suites one at a time after their research gates. Remove the old dispatcher only when no suite depends on it.

The target is a coherent project with separately explainable experiments, not a generic simulation engine or plugin framework.
