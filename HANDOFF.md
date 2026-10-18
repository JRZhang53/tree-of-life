# Implementation handoff

Jerry wants Tree of Life developed by a separate agent in this separate public
GitHub repository: https://github.com/JRZhang53/tree-of-life.

## What is ready

- Standalone Vite/TypeScript scaffold with npm lockfile and Node 24.
- Development port 5173, preview port 4173, and production base
  `/fun/tree-of-life/`.
- Type checks, production build, asset-path contract test, and GitHub CI.
- Portfolio integration via a pinned submodule and compiled-output copy.
  The integration is prepared locally; no portfolio deployment was performed
  during setup.

## Your first turn

1. Confirm you are in the Tree of Life working repo, then read `AGENTS.md` and
   `README.md`. Inspect the scaffold and run `npm run verify`.
2. Ask Jerry for a concise brief: what should a user see and do; what content
   or data powers it; and what makes the first version complete? Establish
   visual references and any performance or device constraints as needed.
3. Record the agreed scope, choose the smallest suitable architecture, and
   implement it using the installed design skills. Do not treat the placeholder
   as an approved visual direction or assume what "Tree of Life" means.
4. Verify behavior, responsiveness, accessibility basics, and all asset/data
   paths under the production base. Replace the scaffold's `noindex` metadata
   only when there is an actual release-ready product.
5. Report the verified commit SHA and any portfolio integration needs to Jerry.
   Do not edit or publish the parent portfolio as part of this assignment.

The product work belongs here; the portfolio agent owns the parent build,
submodule pointer, project listing, and domain release. No dataset, license,
external service, or product scope has been selected on Jerry's behalf.
