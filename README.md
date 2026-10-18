# Tree of Life

An interactive atlas of bio-inspired systems. Follow a simplified tree of life into simulation suites, change local rules, and explore how collective behavior and growth emerge.

**Current phase: project memory and research structure.** The ten-branch app is an exploratory prototype. Jerry has directed planning and specification before deeper implementation; its existing modes and visual design are not final approved scope.

Start with [project memory](MEMORY.md), the [documentation map](docs/README.md), and the [roadmap](docs/ROADMAP.md). Each of the ten subjects has a [research dossier](docs/suites/README.md) distinguishing current shortcuts from the work needed for a substantive model. The proposed next task is starling research, not another broad feature pass.

## Existing prototype experiments

| Branch        | Models                                                                       |
| ------------- | ---------------------------------------------------------------------------- |
| Starlings     | Local flocking; coordinated and independent-flight presets                   |
| Sheep         | Collect-and-drive controller versus direct driving                           |
| Orcas         | Prescribed encirclement versus direct pursuit of a fish school               |
| Ants          | Pheromone-based route optimization and spatial foraging                      |
| Termites      | Signal-driven deposition with a diffusion field or random-walk particles     |
| Coral         | Orbitable 3D diffusion-limited aggregation and a Gray–Scott chemical surface |
| Twining vines | 3D growth with and without contact feedback                                  |
| Long leaves   | Animated edge rippling and ribbon curling                                    |
| Bacteria      | Nutrient-coupled cellular automata in limited and replenished media          |
| C. elegans    | Coupled body oscillators with intact or interrupted feedback                 |

Each branch includes model notes, an experiment prompt, limitations and primary research links. These are teaching models, **not calibrated biological predictions**. In particular, leaves and vines are geometric sketches rather than elastic solvers, and the worm model is not a connectome simulation. Units marked `u` are arbitrary model coordinates. The tree includes selected groups and growth forms, omits most taxa, and has no evolutionary-time scale.

The About dialog proposes slime-mold transport networks and firefly synchronization as future branches, with research references. These proposals are not implemented simulations.

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
- Presets and model changes restart from the same seed. Sliders update the active model. Inapplicable controls are disabled.
- Pause, advance one model step, replay a seed, choose a new seed, or change playback speed.
- Copy an experiment link to preserve the branch, mode, seed and parameters. It does not serialize elapsed state, speed, camera angle or habitat edits.
- Focus the habitat: Space toggles playback; arrow keys position an interaction cursor and Enter applies it. In 3D views arrows rotate the camera. The view-angle slider also works with a keyboard.
- Reduced-motion preferences start the simulation paused. Background tabs stop advancing. Each experiment has one fixed-step loop and bounded populations/geometry.
- Leaf geometry has no stochastic component, so its seed controls are disabled. It grows to its selected mismatch over 600 steps. Coral aggregation and vine growth have explicit resource caps and stop at their limits.

## Code map

- `src/catalog.ts`: controls, presets, explanatory text and research citations.
- `src/models.ts`: pure, seeded simulation state and numerical updates.
- `src/render.ts`: Canvas 2D rendering and projection of 3D geometry.
- `src/main.ts`: accessible HTML interface, hash settings, input and playback.
- `src/style.css`: responsive field-atlas layout.
- `tests/models.test.mjs`: numerical invariants, replay, meaningful parameter effects and regression cases.
- `tests/build.test.mjs`: production asset-path checks.

There is no persistence, tracking, service worker, backend or runtime network dependency. The project license remains undecided; source availability alone is not a license grant. No external source code, figures or datasets were copied into this implementation. Proposed module boundaries and a staged extraction plan are documented in [the architecture plan](docs/ARCHITECTURE.md); those changes have not been implemented.

## Hosting and release

The portfolio `JRZhang53/jerrybzhang.com` owns deployment and the custom domain. It consumes a pinned revision of this repo and copies **only `dist/`** into `/fun/tree-of-life/`. Hash routing works without a history fallback. Runtime public files must use `import.meta.env.BASE_URL` if added later.

Do not create a second Pages deployment, CNAME or DNS configuration. A future release requires a selected subset to meet the [release gate](docs/ROADMAP.md), followed by a verified child commit and a separate portfolio integration/release. The current planning pass does not request a parent pin update. Pushing this repo does not update the live domain. See `AGENTS.md` for ownership constraints.
