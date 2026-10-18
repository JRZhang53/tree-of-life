# Current handoff

## Resume here

Read `AGENTS.md`, [project memory](MEMORY.md), the [documentation map](docs/README.md), and the [roadmap](docs/ROADMAP.md).

Jerry's latest instruction is to work autonomously on project memory and structure before deeper implementation. This pass establishes that foundation and preserves the existing app. The proposed next substantive task is **R1: a research-backed starling dossier**. Do not resume with ten simultaneous simulation upgrades or an automatic portfolio release.

## What exists

- Prototype commit `cf7a7b9f40dff479895f7bf2c78564eb10eaa14a`: ten branches, nineteen modes, common interactive controls, research pointers and simplified models.
- Prototype software checks and browser coverage are recorded in [VERIFICATION.md](VERIFICATION.md). They do not establish reproduction of the referenced research or biological calibration.
- Durable memory now separates user intent, agent assumptions, existing behavior and open decisions.
- [Product structure](docs/PRODUCT.md), [architecture plan](docs/ARCHITECTURE.md), [decision register](docs/DECISIONS.md), [research method/source ledger](docs/research/README.md), and [ten suite dossiers](docs/suites/README.md) define the preparation and implementation sequence.
- No suite has cleared the research/specification gate. Dossiers are deliberately explicit about missing evidence.
- No runtime refactor, new numerical model, dataset, service or UI change was made by the planning pass.

Planning-pass verification: all 48 local Markdown links across 23 documents
resolve; all ten dossier files include explicit research blockers. `git diff
--check` and `npm run verify` pass (33 model tests plus the deployment-contract
test). Runtime source, tests, dependencies and build configuration are unchanged.

## Working contract

Use the standalone Tree of Life checkout. Preserve static hosting at `/fun/tree-of-life/` and `npm run verify` producing `dist/index.html`.

Development: `http://127.0.0.1:5173/fun/tree-of-life/` via `npm run dev`.
Production build preview: `http://127.0.0.1:4173/fun/tree-of-life/` via `npm run preview`.

Before deeper implementation, the relevant dossier must specify its model, evidence, experiment and validation plan. Evidence gates are quality requirements, not automatic requests for user permission. Routine choices remain autonomous and must be recorded with their rationale.

## Integration state

The portfolio originally pinned scaffold commit `7836c768ad149965f5707329f66521ce9070cc5d`. The current parent pin has not been inspected during this planning pass and must not be guessed. The portfolio agent owns its child pin, Projects listing and domain release.

The previous recommendation to advance the parent to the broad prototype is superseded by the planning-first direction. **This handoff does not request deployment or a parent pin update.** Future release candidates must pass the roadmap gates and identify an exact verified child commit.
