# Tree of Life — integration handoff

The educational atlas is implemented at model revision **atlas-2**: 12 branches, 28 experiments, research/method notes, branch search, fixed-step runs, local observation notebook, compatible-baseline plots and CSV/JSON exports. Jerry authorized this autonomous build after the memory pass at `dee9c42`.

The release candidate is the commit containing this handoff; obtain its exact identity with `git rev-parse HEAD` after checking out the candidate. The final chat response reports the pushed SHA. No portfolio checkout, pin, Projects listing or live-domain release was changed.

## Resume and review

1. `AGENTS.md` and `MEMORY.md`: user intent and ownership rules.
2. [Implemented models](docs/research/ATLAS_2.md): equations, source sections, educational reductions, comparisons and limits.
3. [Release checks](docs/RELEASE_CHECKS.md): numerical, browser, accessibility and performance evidence.
4. `docs/ROADMAP.md`: completed scope and future depth work.

The original dossiers preserve a larger research agenda. This release is not empirical calibration or a faithful reproduction of every paper. In particular, vines remain a declared feedback/geometry sketch; two leaf modes remain sketches alongside the elastic-sheet experiment; C. elegans has oscillator and passive bend-relay analogies, not a connectome; termite transport omits porous airflow; coral chemistry does not establish a biological coral-growth mechanism.

## Verification and hosting

`npm ci` and `npm run verify` pass on Node 24. The suite contains 53 model/research tests plus a production-path test. Browser testing covered all 28 modes and desktop/tablet/narrow-mobile layouts. No new runtime dependencies, external data or copied assets were introduced. Notebook storage is local and prefixed; download records are observations rather than resumable state.

The parent integration remains: pin this standalone repo under `apps/tree-of-life`, run its verification, and copy **only `dist/`** to `dist/fun/tree-of-life/`. The app retains the `/fun/tree-of-life/` base path and hash routing. There is no independent Pages workflow or CNAME. The current parent pin is unknown and was not inspected. A push to this child does not deploy the domain.
