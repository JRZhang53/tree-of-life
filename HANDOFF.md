# Implementation handoff

## Current implementation

The initial scaffold has been replaced with a static, self-contained field atlas containing ten branches and nineteen model modes. Jerry supplied the requested product brief; implementation criteria and visual direction are recorded in `DESIGN.md`.

All suites include interactive parameters, experiment presets, source links and explicit model limitations. Common controls support pause/run, single-step, reset, speed, seeded experiments and shareable starting settings. The three-dimensional coral, vine and leaf views can be rotated with pointer, keyboard or slider.

Architecture remains Vite and TypeScript with Canvas 2D and native HTML controls. The 3D views use projected 3D coordinates; they do not require WebGL. No backend, external runtime dataset, remote media, tracking, persistence or domain changes were added.

## Scientific boundaries

These are research-inspired educational models, not reproductions of published experiments. Model reductions are visible in every suite:

- Herding uses a simplified collect/drive controller, flock-center attraction and an absorbing goal zone. Arrived sheep leave the interaction pool; retargeting reactivates them.
- Orca coordination is prescribed. No predation success, depth or tail-slap mechanics are simulated.
- Ant tour optimization is an ant-system teaching variant; it is not full Ant Colony System. Foraging is a separate heuristic.
- Termite field and particle modes have different source representations and are only qualitatively comparable. Heat, airflow and porous-mound feedback remain future work.
- Coral includes a 3D diffusion-limited aggregate and a separate periodic Gray–Scott field mapped onto a sphere. It does not solve chemistry on a spherical mesh.
- Leaves and vines are growth-geometry sketches, not energy-minimizing mechanical solvers.
- C. elegans is a segment-oscillator analogy motivated by proprioceptive coupling, not the neural connectome or validated locomotion mechanics.

Research citations are maintained alongside each experiment in `src/catalog.ts`. Sources were consulted through their published abstracts, author explanations and accessible papers; some publisher full-text pages were inaccessible. The app does not claim a full systematic literature review.

## Verification and release

Run `npm run verify` before handing off a commit. It includes deterministic model tests as well as the existing subpath contract check. Browser verification details are recorded in `VERIFICATION.md`.

Development: `http://127.0.0.1:5173/fun/tree-of-life/`.
Production build preview: `http://127.0.0.1:4173/fun/tree-of-life/`.

The parent integration originally pinned scaffold commit `7836c768ad149965f5707329f66521ce9070cc5d`. The portfolio maintainer must advance the child pointer to the new verified commit, verify the combined site, and handle its Projects listing and deployment. This implementation does not change the portfolio, its submodule checkout or the domain. No independent Pages publishing was configured.

## Next opportunities

The About dialog includes sourced proposals for slime-mold network adaptation and pulse-coupled firefly synchronization. Deeper future work could replace geometric plant sketches with elastic solvers, couple termite construction to advection, or add calibrated scientific datasets after the data source and license are chosen. These are future directions, not completed features.
