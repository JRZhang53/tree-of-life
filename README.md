# Tree of Life

Independent side-project repository for Jerry Zhang. This is a development
scaffold; the product brief and implementation are still to be defined.

## Develop

Use Node 24 (see `.node-version`).

```sh
npm ci
npm run dev
```

Open `http://127.0.0.1:5173/fun/tree-of-life/`. Port 5173 is reserved for this
app so the portfolio can continue running on 4321. A project-local Node 24
dependency supplies the runtime for npm scripts on Jerry's Windows machine.

```sh
npm run verify
npm run preview
```

Preview is at `http://127.0.0.1:4173/fun/tree-of-life/`.

## Hosting

The portfolio repository `JRZhang53/jerrybzhang.com` owns the custom domain and
deployment. It consumes a pinned revision of this repository as a Git submodule
and assembles its compiled output at `/fun/tree-of-life/`. Do not set up a second
Pages site or add a CNAME here. See `AGENTS.md` for paths, routing, and ownership.

To release an implementation, verify and push its commit here, then give the
portfolio maintainer that SHA. The portfolio must update its pointer, verify
the combined build, and publish it. Child pushes alone never deploy the domain.

The starting stack is intentionally minimal: Vite, TypeScript, and a static
placeholder. The implementation agent can choose a framework once the product
brief justifies one. See `HANDOFF.md` for the starting task.
