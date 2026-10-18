# Project memory

Last reconciled: 2026-10-18. Read this after `AGENTS.md` when resuming work.

## Current direction

Jerry's latest instruction is to work autonomously on project memory and structure **before** deeper research and implementation of everything. The current workstream is planning and research preparation. Do not interpret the existence of ten working branches as completion of the requested project.

The app at `cf7a7b9f40dff479895f7bf2c78564eb10eaa14a` is an exploratory prototype. Preserve it as a runnable reference while the project is specified. Its palette, layout, algorithms, nineteen modes and derived acceptance criteria were agent choices, not separately approved product requirements. The prior release suggestion is superseded: this planning pass does not recommend advancing the portfolio pin.

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

| Item                                                                          | Status                                                       |
| ----------------------------------------------------------------------------- | ------------------------------------------------------------ |
| Ten initial subject areas and research-led exploration                        | User brief                                                   |
| Memory and structure before implementation in depth                           | Latest user instruction                                      |
| Static hosting and separate portfolio ownership                               | Existing project contract                                    |
| Current ten-branch / nineteen-mode app                                        | Implemented prototype; not a maturity target                 |
| 33 model tests, build and CI passing at prototype commit                      | Software verification only; see `VERIFICATION.md`            |
| Exact audience, scientific depth, suite size and visual direction             | Unconfirmed; working assumptions in `docs/PRODUCT.md`        |
| Start research with starlings, then sheep                                     | Provisional agent sequencing; rationale in `docs/ROADMAP.md` |
| Mechanical plant solvers, connectome data, spherical chemistry, WebGL/workers | Possible later choices; not commitments                      |

## Where to find things

- [Documentation map](docs/README.md): which document owns which information.
- [Product brief](docs/PRODUCT.md): experience, requirements and non-goals.
- [Roadmap](docs/ROADMAP.md): phases, readiness gates and next bounded task.
- [Architecture](docs/ARCHITECTURE.md): current code, proposed boundaries and migration sequence.
- [Research method and source ledger](docs/research/README.md): how evidence becomes a model specification.
- [Species dossiers](docs/suites/README.md): all ten subjects, gaps and planned validation.
- [Decisions](docs/DECISIONS.md): provenance and status of consequential choices.
- `DESIGN.md`, `VERIFICATION.md`: historical prototype design and verification records.

## Next resume

1. Read `AGENTS.md`, this file and `docs/ROADMAP.md`.
2. Check Git status; preserve unrelated or user-authored changes.
3. The next proposed substantive task is **R1: a research-backed starling dossier**, not new UI or ten simultaneous upgrades.
4. Work autonomously within the brief. Resolve routine choices with recorded reasoning; a research gate requires evidence, not a ritual permission request.
5. When scope or direction changes, reconcile this memory and the affected decision/dossier. Never silently promote an assumption into a user decision.

## Continuity

- `7836c7`: standalone tooling and hosting contract.
- `cf7a7b9`: broad exploratory prototype; local verification and GitHub CI passed. No parent deployment was performed.
- Latest user steering: organize durable memory and structure first. This supersedes treating the broad prototype as release-complete.

Keep this file compact. Detailed research belongs in the relevant dossier; test output belongs in verification records; tasks belong in the roadmap. Update facts in place instead of appending an unbounded chat log.
