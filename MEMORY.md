# Project memory

Last reconciled: 2026-10-18. Read this after `AGENTS.md` when resuming work.

## Current direction

Jerry also requires beautifully rendered math throughout the site. Model notes
now use KaTeX with local fonts, accessible MathML, inline symbols and aligned
display equations. Author new formulas with the shared `mathProse` renderer and
check them at phone widths; do not return to plaintext pseudo-LaTeX. See the
[typesetting standard](docs/TREE_FIRST_DESIGN.md#math-typesetting).

Jerry's latest request was to deploy and autonomously research new bio-inspired
simulations. Atlas 3 is now live: child `0a9b149`, portfolio `ce558b5`, successful
Pages run `39153581406`. The [new-suite research queue](docs/research/NEXT_SUITES.md)
records eight candidates, source access, proposed controls and verification gates.
Recommended first additions: flytrap snap-through, phyllotaxis, then Dictyostelium
chemical signaling. This is a research recommendation; none is implemented yet.
Keep the existing convergence work alongside this expansion.

Jerry asked to implement the corrections identified in the Mahadevan review.
Model revision **atlas-3** now adds seven experiments: planar/spatial supported
filaments, free/held-midrib growing sheets, objective-based shepherding, and
rebuilding/fixed exterior mounds. These open by default on their respective
branches; previous modes remain reachable by stable identifiers. See
[Atlas 3](docs/research/ATLAS_3.md) for equations, evidence and limits.
The review is source context; these independently specified reductions are not
paper reproductions. The high-spread shepherd controller can fail to approach
the target; mesh-dependent shapes are not converged scientific predictions.
Underground termite floors/ramps, pole contact/torsion and empirical calibration
remain outside this revision. Private schoolwork remains local.

Jerry's standing design direction is to humanize the whole site: distinctive aesthetics and
layout, useful language in his direct, informal tone, and a critic feedback loop.
He rejected the first humanization pass as still looking extremely AI-generated,
despite the critic's approval, and requested a more unique design and an autonomous
goal. The new tree-first revision replaces the sidebar with a broad foldout
collection of actual model previews, a selected-branch junction and full-width
simulation with controls below. See [tree-first design](docs/TREE_FIRST_DESIGN.md).
The previous [design review](docs/DESIGN_REVIEW.md) is historical. Avoid slogans, interchangeable cards and
fake personal anecdotes. His messages establish a tone preference, not a complete
writing-style sample; do not claim exact voice matching. Preserve the scientific
qualifications when simplifying prose.

The notebook now compares exact shared steps, shows starting-setting differences
and readable intervention logs, and preserves focus during live updates. See
[comparison review](docs/COMPARISON_REVIEW.md) for behavior and verification.

Jerry authorized autonomous development of the entire site once memory and structure were prepared, including online research, additional features and new simulation suites. The planning pass is complete at `dee9c42`; implementation is now authorized. Preserve the research gates and explicit distinctions between educational reductions and calibrated biology.

The app at `cf7a7b9f40dff479895f7bf2c78564eb10eaa14a` is an exploratory prototype. Preserve it as a runnable reference while the project is specified. Its palette, layout, algorithms, nineteen modes and derived acceptance criteria were agent choices, not separately approved product requirements. The current candidate builds on that baseline; see `docs/research/ATLAS_2.md` for implemented models and `docs/RELEASE_CHECKS.md` for verification. Portfolio deployment remains separate.

## User intent, preserved

- A compilation of bio-inspired simulations organized into an explorable phylogenetic tree.
- Each species should support an interactive, tunable simulation **suite**, with a consistent theme.
- Research published papers and other resources to understand the problem, theory, motivation, algorithm and lesson.
- Brainstorm additional simulations and species as part of research.
- Initial subjects: sheep herding and control strategies; orca social hunting of fish schools; ant optimization and colonies; termite mound morphogenesis with field/particle perspectives; coral chemical morphogenesis, especially 3D; climbing vines and torsional feedback; long-leaf differential growth and curvature; starling flocking; bacterial cellular automata; and tentative C. elegans neural/control ideas.
- The vine, leaf and worm ideas are research directions, not permission to claim that a simple animation reproduces their mechanisms.

The original brief was supplied as a local text file in the portfolio's private ideas area. Its content has already been distilled here. Do not copy that private file into this public repo or browse neighboring private material.

## Durable constraints

- Work only in the standalone `tree-of-life` checkout. The portfolio agent owns its checkout, child pin, Projects listing and release.
- Static delivery at `/fun/tree-of-life/`; `npm ci`, `npm run verify`, `dist/index.html` remain the contract.
- npm / Node 24. Current implementation: Vite, TypeScript, native HTML and Canvas 2D, including projected 3D geometry.
- No backend, data service, measured dataset, project license or independent deployment has been selected.
- Distinguish observed biology, the cited mathematical model, our approximation and our rendered result.
- A seed alone is not a permanent reproduction identifier: model revision, parameters, initial conditions, interventions and numerical settings also matter.

## Established facts versus pending choices

| Item                                                                          | Status                                                                |
| ----------------------------------------------------------------------------- | --------------------------------------------------------------------- |
| Ten initial subject areas and research-led exploration                        | User brief                                                            |
| Memory first, then autonomous full build including researched additions       | Latest user instructions; planning completed at `dee9c42`             |
| Static hosting and separate portfolio ownership                               | Existing project contract                                             |
| Current twelve-branch / 35-mode educational atlas                             | Implemented; assumptions in `docs/research/ATLAS_2.md` and `ATLAS_3.md`       |
| 33 model tests, build and CI passing at prototype commit                      | Software verification only; see `VERIFICATION.md`                     |
| Exact audience, scientific depth and suite size                               | Working assumptions in `docs/PRODUCT.md`                              |
| Distinctive design and human, direct copy with critic feedback                | Latest user request; current direction in `docs/TREE_FIRST_DESIGN.md`; prior design rejected |
| First depth pass: filaments, optimized shepherding, sheets and mounds         | Implemented educational reductions; further convergence work remains; see `docs/ROADMAP.md` |
| Mechanical plant solvers, connectome data, spherical chemistry, WebGL/workers | Possible later choices; not commitments                               |

## Where to find things

- [Documentation map](docs/README.md): which document owns which information.
- [Product brief](docs/PRODUCT.md): experience, requirements and non-goals.
- [Roadmap](docs/ROADMAP.md): phases, readiness gates and next bounded task.
- [Architecture](docs/ARCHITECTURE.md): current code, proposed boundaries and migration sequence.
- [Research method and source ledger](docs/research/README.md): how evidence becomes a model specification.
- [New-suite research queue](docs/research/NEXT_SUITES.md): ranked mechanisms, source status and implementation gates.
- [Species dossiers](docs/suites/README.md): all ten subjects, gaps and planned validation.
- [Decisions](docs/DECISIONS.md): provenance and status of consequential choices.
- `DESIGN.md`, `VERIFICATION.md`: historical prototype design and verification records.

## Next resume

1. Read `AGENTS.md`, this file and `docs/ROADMAP.md`.
2. Check Git status; preserve unrelated or user-authored changes.
3. Preserve the reviewed design principles while choosing further work from the roadmap and suite specifications.
4. Work autonomously within the brief. Resolve routine choices with recorded reasoning; a research gate requires evidence, not a ritual permission request.
5. When scope or direction changes, reconcile this memory and the affected decision/dossier. Never silently promote an assumption into a user decision.

## Continuity

- 2026-10-18: at Jerry's explicit deployment request, atlas-3 child `0a9b149`
  replaced the earlier atlas-2 pin through portfolio `ce558b5`. Combined
  verification and GitHub Pages passed; live assets and a 600-step mound run
  were checked. The subsequent candidate research changes documentation only.
- `7836c7`: standalone tooling and hosting contract.
- `cf7a7b9`: broad exploratory prototype; local verification and GitHub CI passed. No parent deployment was performed.
- `atlas-2`: complete educational atlas with notebook, new suites, numerical checks and responsive browser QA. Some experiments intentionally remain declared reductions/sketches; see the specification.
- `dee9c42`: memory and structure completed. Latest user steering then authorized the full autonomous build, additional features and researched suites.

Keep this file compact. Detailed research belongs in the relevant dossier; test output belongs in verification records; tasks belong in the roadmap. Update facts in place instead of appending an unbounded chat log.
