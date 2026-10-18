# Product brief

## Purpose

Tree of Life is an explorable collection of biological ideas expressed as interactive experiments. A visitor should be able to choose an organism or group, change a rule, observe an outcome, and understand both the mechanism being illustrated and where the model stops explaining the biology.

Working audience assumption: curious visitors who can engage without coding or specialist mathematics, with optional mathematical depth for readers who want it. Jerry has not specified a course level or formal curriculum. Keep the first explanation accessible; do not assume either a children's product or a research workstation.

## Requirements from the brief

| ID  | Requirement                                                                                  | Planning location                   |
| --- | -------------------------------------------------------------------------------------------- | ----------------------------------- |
| P1  | Organize bio-inspired simulations into an explorable phylogenetic tree                       | Navigation below; `ARCHITECTURE.md` |
| P2  | Interactive, tunable suites for the ten initial subject areas                                | `suites/README.md`                  |
| P3  | Explain problem, theory, motivation, algorithm and lesson using research                     | `research/README.md`                |
| P4  | Explore control/collective behavior and growth/morphogenesis, not just one generic animation | Suite dossiers                      |
| P5  | Give particular attention to 3D coral and the plant mechanics ideas                          | Coral, vine and leaf dossiers       |
| P6  | Brainstorm new simulations and species through research                                      | Research opportunity queue          |
| P7  | Refine project memory and structure before implementation in depth                           | `MEMORY.md`, `ROADMAP.md`           |

Jerry subsequently authorized autonomous construction of the entire site, including additional researched suites and features. Atlas 2 implements all initial subject areas at an explicitly educational level; neither that instruction nor this release asserts scientific reproduction or calibration. The brief does not prescribe an experiment count, control count, framework or dataset.

## Experience structure

The central loop is **explore → ask → predict → manipulate → compare → explain**.

1. **Explore the tree.** Choose a named taxon or a clearly labeled group/growth form. The tree should convey relationships, not an evolutionary ladder. Do not imply branch-length dates without data.
2. **Enter a suite.** Present its biological question, why it is interesting and what the experiment represents. Make maturity/approximation level visible without overwhelming the introduction.
3. **Choose an experiment.** Give each experiment a question and an observable contrast. A preset is a controlled starting condition, not automatically a different simulation.
4. **Run and intervene.** Tune meaningful parameters with units or explicitly dimensionless scales. Explain which changes apply immediately, restart the model, or invalidate a comparison.
5. **Compare.** Reuse an initial condition and vary one factor; show the measurement that answers the question. The implemented notebook overlays compatible observation histories and exports their records.
6. **Understand.** Offer progressive explanation: plain-language rules, an optional model/equation view, limitations, and source-linked evidence.

A suite is a coherent set of experiments about a mechanism. There is no fixed experiment count: one rigorous experiment is more valuable than several cosmetically different presets.

## Shared concepts

Cross-links connect related ideas without conflating their biology:

- Local interaction and collective coordination: starlings, sheep, orcas.
- Environmental memory and collective construction: ants, termites.
- Transport, resources and pattern formation: bacteria, coral, termites.
- Growth, geometry and feedback: vines, leaves.
- Distributed sensing and control: the tentative C. elegans direction.

These are editorial themes, not a substitute for taxonomy or evidence that the same algorithm explains every organism.

## Content and visual direction

Jerry explicitly requested distinctive design and human language in his writing
style, with an independent critic feedback loop. The current direction uses a real
cladogram, aligned organism links and a selected ancestry route, with a shared
experiment surface. Specific questions and interventions replace slogans. Copy
uses the direct, informal tone of his messages without fabricated personal stories.
See [design review](DESIGN_REVIEW.md) for decisions, critique and verification.

Prioritize keyboard operation, readable explanations, reduced-motion behavior, touch input and mobile navigation. A nonvisual visitor should be able to understand the question, adjust parameters and read meaningful outputs even when the rendered geometry is not available to them.

## Explicit boundaries

- No claim of faithfully reproducing a paper until its equations, numerical procedure and comparison conditions have been reviewed and documented.
- No biological calibration without an identified dataset, provenance, permitted use and evaluation method.
- No inference of intelligence, causal neural roles or hunting success from a visually suggestive animation alone.
- No backend, accounts, analytics, cloud saves or real-time multiplayer in the baseline plan.
- No commitment to cover every species before a coherent subset can become a release candidate.
- No parent deployment, data licensing choice or domain change in this planning task.

## What a mature first release means

A release candidate is a deliberately selected set of suites that meet the roadmap gates, accompanied by an honest distinction between mature experiments, exploratory prototypes and future ideas. The first subset should be chosen after the first research/model dossier reveals the real cost of depth. Do not use the current ten-item count as a release gate.
