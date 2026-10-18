# First implementation

Jerry's supplied brief defines an interactive collection of bio-inspired simulation suites arranged in a phylogenetic tree. Initial subjects: sheep, orcas, ants, termites, coral, vines, long leaves, starlings, bacteria, and C. elegans. Research and new-species brainstorming are part of the task.

## Acceptance criteria

- All ten subjects have working, distinct educational models, adjustable parameters and at least two experiment presets or model variants.
- A simplified, explicitly incomplete phylogenetic navigator connects the subjects. Branch lengths do not encode evolutionary time.
- Each suite explains its question, algorithm, takeaway, limitations and primary research sources.
- Pause, single-step, reproducible reset, new seed, speed and hash links work; keyboard controls and mobile layouts are usable.
- Coral includes an orbitable three-dimensional growth view and a reaction–diffusion experiment. Ants include route optimization and foraging. Termites compare a field with random-walk particles.
- No backend or external runtime data; static production paths and `npm run verify` remain intact. Do not deploy the portfolio.

These are implementation acceptance criteria derived from the brief, not a claim of separate user sign-off. All models are educational reductions, not reproductions or validated biological forecasts.

## Design plan

Palette: mist #edf2ed, ink #233c35, forest #31684f, water #477f91, ochre #a67b30, paper #ffffff. Georgia for the atlas title and species headings; Segoe UI for controls and explanatory text. Left-aligned content, comfortable paragraph measure, compact tabular metrics.

Layout: a persistent branching navigator beside an expansive habitat; a small control panel sits alongside the habitat, and research notes sit below. On narrow screens the tree becomes a collapsible full-width navigator above the experiment.

    Tree of Life                         About this atlas
    ┌ branches ┐  species / question
    │          │  ┌ living habitat ─────────┐ ┌ controls ┐
    │ species  │  │ canvas                 │ │ presets  │
    │          │  └ playback / metrics ────┘ └ sliders ─┘
    └──────────┘  model / experiments / research

Review: a generic card gallery would hide the phylogenetic structure; replaced it with a nested tree and connecting branch lines. The canvas is the signature element; no decorative stock imagery, hero statistics, animated entrances or card grid. Use a pale habitat so agents and geometry remain legible, with species-specific color accents. Avoid presenting branch layout as a complete scientific phylogeny.
