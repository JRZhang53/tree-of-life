# Tree of Life

This is a separate application repository owned by Jerry Zhang. The initial
commit establishes tooling and a hosting contract, not the product design.

## Product scope

Jerry supplied a brief for an explorable phylogenetic collection of interactive,
tunable bio-inspired simulations. It requests sheep herding, orca hunting,
ant optimization and colonies, termite mound growth, coral morphogenesis,
twining vines, long-leaf differential growth, starling flocking, bacterial
cellular automata and C. elegans coordination. Research explanations and
brainstorming future species are part of the scope. See `DESIGN.md` for the
first implementation criteria and `HANDOFF.md` for status.

The current models are educational reductions. Preserve their explicit
limitations, source attribution and reproducible seeds. Do not present them as
validated biological predictions or faithful reproductions of the cited papers.
Keep geometry sketches (leaves/vines) distinguishable from mechanical solvers.
No measured dataset, backend or project license has been selected.

## Development and ownership

- Use npm, commit the lockfile, and use Node 24 (`.node-version`).
- This starts with Vite and TypeScript; add a UI framework if the actual product
  warrants it. Preserve the build contract when changing the stack.
- Run `npm run verify` before handoff. Add meaningful behavior tests as features
  arrive, and inspect affected UI in the browser at desktop and mobile sizes.
- Use the installed `frontend-design` skill for UI direction and
  `make-interfaces-feel-better` for polish. Load each SKILL.md before use.
  Other installed design/interview/architecture skills are optional and should
  be invoked deliberately. Do not run all skills on every change.
- Work inside this repository. Do not edit the portfolio or its submodule copy.
  The portfolio contains unrelated local work and private material. In
  particular, do not read or copy its `fun-ideas/` directory.
- Source is public. Keep credentials and private data out of Git and browser
  bundles; Vite environment variables are not a place for secrets.

## Hosting contract

- Production path: `https://jerrybzhang.com/fun/tree-of-life/`.
- `npm ci` installs; `npm run verify` checks and builds; `dist/index.html` is the
  entry. All runtime assets must work under `/fun/tree-of-life/`.
- Use `import.meta.env.BASE_URL` for runtime public assets and data fetches.
- GitHub Pages is static. Use hash routing or generate real HTML route files
  if navigation needs multiple views. History fallback is not available.
- The portfolio checks out a pinned commit as `apps/tree-of-life`, verifies it,
  and copies only its compiled `dist/` into `dist/fun/tree-of-life/`.
- This repo's CI verifies only. Do not enable independent Pages publishing,
  create a CNAME, change DNS, or deploy to the portfolio from this repo.
- A push here does not update the live domain. Report the ready commit SHA so
  the portfolio agent can update the submodule pointer and verify the combined
  site. Publishing the portfolio is a separate release step.
- If browser storage is needed, prefix keys with `tree-of-life:`. Any future
  service worker must remain scoped to `/fun/tree-of-life/`.
- If the agreed product requires secrets, persistent server storage, or a
  backend, explain the hosting change needed before adding infrastructure.
