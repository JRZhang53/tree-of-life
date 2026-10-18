# Tree of Life

An interactive atlas of bio-inspired systems. Follow a simplified tree of life into simulation suites, change local rules, and explore how collective behavior and growth emerge.

**Current release: educational atlas, model revision `atlas-2`.** Twelve branches and 28 experiments cover the original brief plus firefly synchronization and slime-mold networks. Start with [project memory](MEMORY.md), the [documentation map](docs/README.md), and the [implemented model specification](docs/research/ATLAS_2.md).

## Explore

| Branch        | Experiments                                                           |
| ------------- | --------------------------------------------------------------------- |
| Starlings     | Distance neighborhoods and seven nearest neighbors                    |
| Sheep         | Collect-and-drive versus direct driving                               |
| Orcas         | Prescribed encirclement versus pursuit of a fish school               |
| Ants          | Route optimization and spatial foraging                               |
| Termites      | Matched field/particle signal transport and threshold deposition      |
| Coral         | 3D aggregation, mapped surface chemistry and true 3D volume chemistry |
| Twining vines | Growth with and without radial feedback                               |
| Long leaves   | Two shape sketches and a growing elastic sheet                        |
| Bacteria      | Nutrient-coupled growth in boundary-fed and replenished media         |
| C. elegans    | Oscillator analogy and passive bend feedback, each intact or cut      |
| Fireflies     | Global and local phase synchronization                                |
| Slime molds   | Adaptive and fixed transport networks                                 |

Every branch includes a question, tunable presets, a live habitat, a defined observable, an experiment prompt, numerical assumptions, limitations and research links. The field notebook saves observations locally, overlays compatible runs and exports CSV or a full JSON record. Branch search and related-mechanism links connect the collection.

These are **educational reductions, not calibrated biological predictions**. The vine and two leaf modes remain labeled geometric sketches. The elastic leaf uses a discrete energy, not a continuum plate reproduction; the worm is not a connectome. Arbitrary coordinates are labeled `u`. The tree includes selected groups and growth forms with no evolutionary-time scale.

## Develop

Use npm and Node 24 (`.node-version`). A project-local Node dependency supplies the runtime to npm scripts on Windows.

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/fun/tree-of-life/`.

```sh
npm run verify
npm run preview
```

Preview serves the built app at `http://127.0.0.1:4173/fun/tree-of-life/`.

`verify` runs TypeScript checks, deterministic model and behavior tests, the production build, and the deployment-path contract test. `npm test` runs the model tests alone. No runtime UI framework, remote fonts, API keys or external datasets are required. Prettier is available for source formatting.

## Controls and reproducibility

- Choose a branch in the tree; on mobile, expand **Explore the tree**.
- Presets and model changes restart from the same seed. Sliders update the active model; elastic-sheet width rebuilds its mesh. Inapplicable controls are disabled.
- Pause, advance one model step or exactly 600 more steps, restart a seed, choose a new seed, or change playback speed.
- Copy an experiment link to preserve the branch, mode, seed and parameters. It does not serialize elapsed state, speed, camera angle or habitat edits.
- Focus the habitat: Space toggles playback; arrow keys position an interaction cursor and Enter applies it. In 3D views arrows rotate the camera. The view-angle slider also works with a keyboard.
- Reduced-motion preferences start the simulation paused. Background tabs stop advancing. Each experiment has one fixed-step loop and bounded populations/geometry.
- Leaf geometry has no stochastic component, so its seed controls are disabled. Its sketches grow to their selected mismatch over 600 steps; the elastic sheet continues relaxing afterward. Coral aggregation and vine growth have explicit resource caps and stop at their limits.

## Code map

- `src/catalog.ts`: controls, presets, explanatory text and research citations.
- `src/models.ts`: pure, seeded simulation state and numerical updates.
- `src/render.ts`: Canvas 2D rendering and projection of 3D geometry.
- `src/main.ts`: accessible HTML interface, hash settings, input and playback.
- `src/style.css`: responsive field-atlas layout.
- `tests/models.test.mjs`: numerical invariants, replay, meaningful parameter effects and regression cases.
- `tests/build.test.mjs`: production asset-path checks.

The notebook persists up to 12 records in localStorage under `tree-of-life:notebook:v2`. No tracking, service worker, backend or runtime network dependency is used. The project license remains undecided; source availability alone is not a license grant. No external source code, figures or datasets were copied into this implementation. New model families live in `src/suites/`; taxonomy/method content in `src/content/`; random generation, observables and record validation in `src/core/`; notebook UI in `src/presentation/`. The original `Simulation` dispatcher remains an adapter for older suites. See [architecture](docs/ARCHITECTURE.md).

## Hosting and release

The portfolio `JRZhang53/jerrybzhang.com` owns deployment and the custom domain. It consumes a pinned revision of this repo and copies **only `dist/`** into `/fun/tree-of-life/`. Hash routing works without a history fallback. Runtime public files must use `import.meta.env.BASE_URL` if added later.

Do not create a second Pages deployment, CNAME or DNS configuration. The educational atlas candidate has a [verification record](docs/RELEASE_CHECKS.md). Integrate the exact verified child commit listed in `HANDOFF.md` through a separate portfolio release. Pushing this repo does not update the live domain. See `AGENTS.md` for ownership constraints.
