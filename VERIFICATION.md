# Prototype verification record

This records the exploratory implementation at `cf7a7b9`. Its software and
interface verdict does not establish scientific model validity or release
readiness. The current planning-first direction and further evidence gates are
in [the roadmap](docs/ROADMAP.md). No runtime changes were made in that planning pass.

Scope: ten species suites and nineteen model modes in the child repository. Native TypeScript, Canvas 2D and plain CSS. Review mode: full. No portfolio deployment or parent verification was performed by this implementation agent.

## Automated checks

`npm run verify` passes:

- TypeScript strict checks.
- 33 model tests covering deterministic replay for all 19 modes; finite state at parameter extremes; conservative, nonnegative diffusion; effects of flocking parameters; collect/drive strategy differences; full sheep delivery and retargeting; valid improving ant tours; food delivery and pheromone trails; nutrient-limited colony growth; both termite representations; 3D coral growth and flow response; chemical parameter response; vine convergence and caps; worm coupling interruption; and zero-curvature leaf geometry.
- Production Vite build.
- The original deployment-contract test: entry assets exist under `/fun/tree-of-life/`, with no CNAME.

Long-run spot checks with seed 42 confirmed stable models, food delivery and visibly different trajectories. After the goal-zone fix, three tested sheep seeds (42, 1, 123) each reached 45/45 under both strategies by 4,000 steps. This is a regression check on an illustrative controller, not biological validation or proof that one strategy is universally better.

## Browser checks

Used the Codex browser on the actual local app:

- Selected every species and every model mode. All 19 modes advanced to step 1 after a reset and returned to step 0 on reset while paused.
- Verified coral mode-dependent enablement and camera-slider response; visually inspected aggregation and chemical-surface rendering, twining vines and leaf geometry.
- Changed the seed, copied a link, and restored a different seed through the URL. Verified parameter restoration and copy feedback.
- Opened and closed the About dialog with Escape.
- Expanded the mobile tree, selected bacteria and verified the tree collapsed. Keyboard arrows plus Enter seeded a second colony and produced status feedback.
- Inspected 1440×1000 desktop, 768×1024 tablet, 390×844 mobile, and 320×740 narrow-phone layouts. No document overflow at the tested tablet and narrow-phone sizes after repairs.
- Observed no browser warnings or errors during the model-mode pass.

## Interface-polish review

| Category    | Evidence inspected                                                                        | Result                                                                      |
| ----------- | ----------------------------------------------------------------------------------------- | --------------------------------------------------------------------------- |
| Typography  | Desktop/mobile screenshots, research paragraphs, labels and numerical readouts            | Increased secondary-copy contrast and research text size; tabular metrics   |
| Surfaces    | Habitat, control panel, branching navigation, mobile playback row, dialog                 | Fixed narrow-screen overflow and tree reachability; larger touch targets    |
| Animations  | Running/paused models, step/reset, disabled controls; CSS transitions                     | No staged interface animations; simulation pause and reduced-motion startup |
| Icons       | Species navigator and heading SVGs                                                        | Shared stroke styling and currentColor; text labels accompany icons         |
| Performance | One requestAnimationFrame loop, fixed update budget, capped populations, browser warnings | Background updates suspended, DPR capped at 2, geometry bounded             |

| Severity | Location                         | Before                                                           | After                                                             | Why                                         |
| -------- | -------------------------------- | ---------------------------------------------------------------- | ----------------------------------------------------------------- | ------------------------------------------- |
| Medium   | `src/style.css`, tree navigator  | Deep branches fell below the viewport                            | Sticky sidebar with an independently scrollable tree              | Keeps navigation reachable                  |
| High     | `src/main.ts`, habitat           | Pointer-only spatial edits                                       | Arrow-key cursor and Enter, plus camera slider and arrow rotation | Equivalent keyboard access                  |
| Medium   | `src/style.css`, phone playback  | Speed select clipped at 320 pixels                               | Wrapping playback row; single-column controls on narrow phones    | Prevents hidden controls                    |
| Medium   | `src/main.ts`, seed entry        | Seed could remain unapplied until change/blur                    | Valid input immediately restarts and updates the URL              | Visible input matches the actual experiment |
| Medium   | `src/style.css`, secondary text  | Small, pale notes                                                | Darker secondary text and larger model explanations               | Improves readability                        |
| Low      | `src/style.css`, mobile controls | Several targets were 31–40 pixels high                           | Mobile button and slider targets are at least 44 pixels high      | Easier touch input                          |
| Medium   | `src/main.ts`, skip link         | Hash route handler interpreted the skip destination as a species | Dedicated focus/scroll behavior without route mutation            | Preserves the current experiment            |

Considered and rejected: animated tree entrances (distraction during repeated navigation); WebGL/3D framework dependency (the bounded geometry projects adequately with Canvas 2D); photographic species cards (would obscure the live models and tree structure).

Verdict: **Approve for the reviewed scope.** Not verified: real mobile hardware, Safari/Firefox, screen-reader software and reduced-motion browser emulation. Reduced-motion startup and CSS behavior were inspected in source. There are no staged entrance/exit animations requiring a 10%-speed replay; continuous simulation playback was checked with pause and single-step. This review is not a claim of full WCAG conformance, physical-model validation or a performance benchmark.

Production preview smoke test: loaded `/fun/tree-of-life/#coral` from `npm run preview` on port 4173, confirmed the built app title, 3D growth and 4× playback, and observed no browser warnings/errors.
