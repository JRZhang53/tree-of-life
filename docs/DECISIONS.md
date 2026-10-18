# Decision register

User instructions take precedence over this register. Record the origin of each decision; a provisional implementation choice is not user approval.

| ID  | Decision                                                                            | Status / provenance                             | Rationale and consequence                                                                                        |
| --- | ----------------------------------------------------------------------------------- | ----------------------------------------------- | ---------------------------------------------------------------------------------------------------------------- |
| D01 | Keep a separate child repository and static `/fun/tree-of-life/` hosting contract   | Established project contract                    | Portfolio owns the pinned integration and release; child changes do not publish the domain                       |
| D02 | Organize interactive bio-inspired suites by a tree of life                          | User brief                                      | Taxonomy and experiment content are first-class concerns                                                         |
| D03 | Research the problem, model, motivation and lesson, and brainstorm additions        | User brief                                      | A citation appended after coding is insufficient preparation                                                     |
| D04 | Treat `cf7a7b9` as an exploratory prototype                                         | Current interpretation of latest user steering  | Preserve useful code, but do not call all requested mechanisms complete                                          |
| D05 | Establish memory and structure before deeper implementation                         | Latest direct user instruction                  | This pass edits project documentation, not simulation features                                                   |
| D06 | Use Markdown in this repository for project memory                                  | Agent working decision                          | Versioned, reviewable, available to future agents; no dependence on another service                              |
| D07 | Research starlings first, then sheep as a control-focused companion                 | Agent provisional sequencing                    | Bounded starting point to establish the dossier and experiment standard; not a scientific ranking of species     |
| D08 | Prefer per-suite models and renderers over extending the shared species switch      | Agent proposed architecture                     | Current all-purpose state makes unrelated assumptions easy to share accidentally; extract one proven slice first |
| D09 | Keep Vite/TypeScript and static deployment while specifications develop             | Agent working decision within existing contract | There is no demonstrated need for a framework migration or backend yet                                           |
| D10 | Select a mature release subset after the first dossier/model cycle                  | Agent provisional release strategy              | Prevent breadth from replacing scientific and educational depth                                                  |
| D11 | Field-atlas palette, Canvas projection, nineteen modes and three controls per suite | Historical prototype choices; not binding       | Revisit when model requirements and usability justify a change                                                   |
| D12 | Prior suggestion to advance the portfolio pin immediately                           | Superseded by planning-first steering           | No release request or integration action follows from this planning pass                                         |

The table above records planning-era decisions. D13–D17 below reconcile their current implementation status; D05/D10/D12 no longer constrain work to a planning-only pass.

## Decisions intentionally left open

| Question                                                                     | How to resolve it                                                                                    | Does it block this planning pass?                                       |
| ---------------------------------------------------------------------------- | ---------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------- |
| Exact audience and mathematical depth                                        | Start with progressive disclosure; revise from Jerry's feedback and trial explanations               | No                                                                      |
| Faithful paper reproduction versus explanatory reduction for each experiment | Select and defend in the individual dossier                                                          | No; blocks implementing that experiment in depth                        |
| Which coral mechanism becomes the first substantive 3D experiment?           | Compare source support, numerical cost and learning value in the coral dossier                       | No                                                                      |
| Mechanical representation for vines and leaves                               | Review candidate mechanics models before selecting a solver                                          | No                                                                      |
| What C. elegans question is actually being answered?                         | Contrast proprioceptive control with connectome-based hypotheses; avoid an omnibus neural simulation | No                                                                      |
| Dataset, biological calibration and reuse license                            | Identify a concrete need and permitted source first                                                  | No                                                                      |
| WebGL, a 3D library or worker execution                                      | Measure requirements on the first demanding model; use a bounded spike if necessary                  | No                                                                      |
| Project license                                                              | Jerry chooses a license if/when desired; do not infer one from the public repo                       | No for original planning/code; relevant to reuse/distribution decisions |

For a new decision, add its status, evidence, alternatives, consequences and what would cause reconsideration. If a decision is reversed, mark it superseded and link the replacement instead of silently rewriting history.

## Implementation decisions after the memory pass

- **D13 — autonomous full build (user instruction):** supersedes D05's planning-only phase and D12's no-release recommendation. Memory was completed first; subsequent research and implementation were expressly authorized.
- **D14 — broad educational release (agent scope decision):** supersedes the provisional subset-only strategy D10. Include all requested subjects with explicit maturity/limitations; do not misrepresent sketches as mechanics or software checks as empirical validation.
- **D15 — original numerical reductions:** continuous Kuramoto coupling, a grounded adaptive graph, discrete leaf energy, passive bend relays and periodic 3D chemistry. Their equations and differences from papers are recorded in `research/ATLAS_2.md`.
- **D16 — observation notebook:** local-only persistence, maximum 12 records, sampled histories, CSV/JSON export. No account, replay claim or backend. Stable experiment IDs and `atlas-2` revision accompany settings.
- **D17 — incremental modules:** new model families are separated while the older dispatcher remains an adapter. A framework/WebGL migration would add cost without a demonstrated requirement at the chosen bounded scales.
- **D18 — humanization (user direction, agent implementation):** Jerry requested a
  distinctive design and language in his own style, with critic feedback. Replace
  the inherited botanical dashboard with a topology-driven cladogram and one
  shared experiment surface. Concrete questions and instructions replace slogans.
  His messages support a direct, informal tone; exact personal voice matching is
  not established. Preserve model qualifications. Two revision rounds addressed
  the critic's findings; [design review](DESIGN_REVIEW.md) records the evidence.
- **D19 — descriptive run comparisons (agent choice within autonomous scope):**
  Compare the latest exact recorded step shared by compatible runs, without
  interpolation. Keep starting settings and later interventions separate; flag
  events after the displayed step. A difference is not a causal result. Preserve
  the local observation-record format and model revision. The
  [comparison review](COMPARISON_REVIEW.md) records behavior and critic feedback.
