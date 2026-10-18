# Tree of Life — integration handoff

## Current deployment: atlas-3

Seven new experiments correct the mechanism gaps in the Mahadevan review:
planar/spatial supported rods, free/held-midrib sheets, objective-based shepherding,
and rebuilding/fixed exterior mounds. The atlas now has 35 modes. Previous
experiment identifiers and atlas-2 notebook measurements are preserved; old
records can be exported and are excluded from cross-revision comparisons.
The model specification and evidence are in `docs/research/ATLAS_3.md`.

`npm run verify` passes: 78 model/research/UI-contract tests plus the production
path check. Child `0a9b149f0ccda0f883a4147d5eb26cac2bb24975` was deployed on
2026-10-18 through portfolio `ce558b5339047a799c1a38c0389c6513dd823d0c`.
[GitHub Pages run 39153581406](https://github.com/JRZhang53/jerrybzhang.com/actions/runs/39153581406)
succeeded after combined verification: Astro checks, 11 parent tests, child
verification/build and five generated-site integration tests.
Live HTML serves `index-GSWzco8V.js` and `index-Bc_sPiBp.css`, matching the build.
A live 600-step rebuilding-mound run reached 348 cavity cells with odor budget
error `1.3e-14`; screenshot is local under `.artifacts/atlas3-live.png`.
No dependency, hosting, private course material or external asset was introduced.

## New research, after deployment

[Eight candidate suites](docs/research/NEXT_SUITES.md) now have primary-source
entry points, review status, proposed interactions, comparisons and open gates.
Recommended order starts with flytrap snap-through, phyllotaxis and Dictyostelium.
This follow-up is documentation only. Keep the parent pinned to the tested runtime
above; a documentation commit does not require a second release.

## Previous deployment and history


The educational atlas is implemented at model revision **atlas-2**: 12 branches, 28 experiments, research/method notes, branch search, fixed-step runs, local observation notebook, compatible-baseline plots and CSV/JSON exports. Jerry authorized this autonomous build after the memory pass at `dee9c42`.

Child `7152541836ddc78a3279aef728312f81ad53b916` was deployed on 2026-10-18
through portfolio commit `fa8d735f3aa04302611a2018f8bebbed7e3c45da` at Jerry's
explicit request. GitHub Pages run `39134685032` succeeded; live entry HTML,
Projects link and a 600-step Physarum run were verified.

Jerry subsequently requested a Mahadevan research/publication review and allowed
schoolwork consultation. The [research direction review](docs/research/MAHADEVAN_DIRECTION.md)
and roadmap now define proposed depth work. This documentation pass changes no
runtime code or deployed numerical model. Private course audit notes are local
under ignored `.artifacts/`; do not publish them.

The latest revision follows Jerry's rejection of the first humanization pass.
The sidebar is gone. A broad foldout tree shows actual seeded model specimens;
each branch opens a full-width simulation with its controls below. Direct links
retain the selected lineage and branch junction. Long scene captions now use HTML
and short object labels maintain phone-readable size. The revised critic loop and
verification are in [tree-first design](docs/TREE_FIRST_DESIGN.md). Numerical model
revision remains `atlas-2`.

The subsequent [comparison pass](docs/COMPARISON_REVIEW.md) adds exact shared-step
values, starting-setting differences and readable intervention histories. It
also fixes paused-value refresh, malformed record handling and filtered-tree
navigation. The critic's final correctness finding was fixed and browser-checked.

## Resume and review

1. `AGENTS.md` and `MEMORY.md`: user intent and ownership rules.
2. [Implemented models](docs/research/ATLAS_2.md): equations, source sections, educational reductions, comparisons and limits.
3. [Release checks](docs/RELEASE_CHECKS.md): numerical, browser, accessibility and performance evidence.
4. `docs/ROADMAP.md`: completed scope and future depth work.

The original dossiers preserve a larger research agenda. This release is not empirical calibration or a faithful reproduction of every paper. In particular, vines remain a declared feedback/geometry sketch; two leaf modes remain sketches alongside the elastic-sheet experiment; C. elegans has oscillator and passive bend-relay analogies, not a connectome; termite transport omits porous airflow; coral chemistry does not establish a biological coral-growth mechanism.

## Verification and hosting

`npm ci` passed for the base atlas; dependencies are unchanged. `npm run verify`
passes on Node 24. The atlas-2 suite contained 58 model/research/navigation tests plus a
production-path test. The base atlas browser review covered all 28 modes; the
humanization revision rechecked all 12 branches, responsive layouts and affected
interactions. No runtime dependencies, external data or copied assets were added.
Notebook storage remains local; download records are observations rather than
resumable state.

The parent integration remains: pin this standalone repo under `apps/tree-of-life`, run its verification, and copy **only `dist/`** to `dist/fun/tree-of-life/`. The app retains the `/fun/tree-of-life/` base path and hash routing. There is no independent Pages workflow or CNAME. The last verified parent pin is `0a9b149`. A push to this child does not deploy the domain.
