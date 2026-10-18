# Research method and source ledger

The current mechanism pass is specified and evaluated in [Atlas 3](ATLAS_3.md),
following the [Mahadevan source review](MAHADEVAN_DIRECTION.md). It adds explicit
rod/sheet energies, sampled-objective shepherding and exterior-mound feedback.
The checks are for these independently declared reductions; no completed paper
reproduction or empirical validation is asserted.

## Evidence levels

This ledger consolidates references already encountered during the prototype pass. **No source has a completed reproduction audit.** The prior pass used author explanations, abstracts, search excerpts and accessible paper material with uneven coverage. A link being present in the UI does not mean the full method was read or reproduced.

Use these evidence states going forward:

1. **Located:** bibliographic pointer found; relevance not yet established.
2. **Screened:** abstract/overview supports relevance; model details still unverified.
3. **Read for question:** relevant full sections inspected; record locations and limitations.
4. **Specified:** extracted rules/equations, units, boundaries and numerical procedure are sufficient for the declared experiment.
5. **Compared:** implementation evaluated against a declared source result or other validation target, with discrepancies documented.

An experiment can deliberately implement an educational reduction rather than a paper reproduction. It still needs a complete independent specification and an honest description of the relationship to its sources.

## Workflow for one suite

1. Narrow the biological/engineering question before searching broadly.
2. Find the primary observation or theory and the actual model/method paper. Use secondary resources for orientation, not as substitutes for technical evidence.
3. Record exact access status. If a page only exposes an abstract, do not cite it as evidence for an uninspected equation or numerical method.
4. Extract the model into the suite dossier: state, scales, equations/rules, boundaries, parameters, initialization, integration, stopping conditions and outputs.
5. Separate source-defined elements from our reductions. Explain the effect of each omission on interpretation.
6. Design an experiment that can contradict the expected story, not just illustrate it. Define baseline, intervention, measurement and comparison conditions.
7. Design numerical verification, behavioral evaluation and any empirical validation as separate activities.
8. Check permissions before copying code, figures, data or assets. A paper citation does not grant those permissions. Original implementation from a described method does not require copying its text or figures.
9. Update the claim table, source status, decision register and readiness gate. Then implement only the specified experiment.

## Claim record

Add a table to the relevant dossier when reading in depth:

| Claim ID      | Claim shown to the user       | Source and exact location           | Evidence type                     | Our model relationship         | Confidence / limitation |
| ------------- | ----------------------------- | ----------------------------------- | --------------------------------- | ------------------------------ | ----------------------- |
| `<suite>-C01` | One narrowly worded statement | Source ID + section/equation/figure | Observation / theory / simulation | Reproduced / reduced / analogy | What remains uncertain  |

Do not fill this table from memory with invented page numbers. Link numerical tests separately from biological evidence.

## Existing source register

Entries are **screened during the prototype pass; relevant full-method review pending**, except where explicitly described below. The IDs are stable planning identifiers; migration into application content is future work.

| ID  | Reference                                                                                                                                                                           | Intended use / current limit                                                                                          |
| --- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- | --------------------------------------------------------------------------------------------------------------------- |
| S01 | [Reynolds (1987), Flocks, herds and schools — author overview](https://www.red3d.com/cwr/boids/)                                                                                    | Author overview inspected for separation/alignment/cohesion. Technical paper and model-to-starling claims need review |
| S02 | [Strömbom et al. (2014), Solving the shepherding problem](https://doi.org/10.1098/rsif.2014.0719)                                                                                   | Collect/drive inspiration; exact neighbor rules, geometry and evaluation conditions not yet audited                   |
| S03 | [Ugarte & Similä, underwater observations of cooperative killer-whale feeding, ECS proceedings](https://www.europeancetaceansociety.eu/sites/default/files/Proceeding%20No%207.pdf) | Observational pointer; locate the exact contribution and inspect it before assigning detailed tactic claims           |
| S04 | [Feeding characteristics and prey profitability in herring-feeding killer whales](https://research-repository.st-andrews.ac.uk/handle/10023/27318)                                  | Observational context; full-method access/review pending                                                              |
| S05 | [Dorigo & Gambardella (1997), Ant colonies for the travelling salesman problem](<https://doi.org/10.1016/S0303-2647(97)01708-5>)                                                    | Graph optimization; does not by itself support the spatial foraging heuristic                                         |
| S06 | [Ocko, Heyde & Mahadevan (2019), Morphogenesis of termite mounds](https://doi.org/10.1073/pnas.1818759116)                                                                          | Environmental-physics/construction feedback; prototype omits key coupled fields                                       |
| S07 | [Kaandorp et al. (1996), Effect of nutrient diffusion and flow on coral morphology](https://doi.org/10.1103/PhysRevLett.77.2328)                                                    | Transport/growth candidate; derive the actual algorithm before calling our DLA a reproduction                         |
| S08 | [Pearson (1993), Complex patterns in a simple system](https://doi.org/10.1126/science.261.5118.189)                                                                                 | Reaction–diffusion patterns; not evidence for a particular coral's morphogenesis                                      |
| S09 | [Goriely & Neukirch (2006), Mechanics of climbing and attachment in twining plants](https://doi.org/10.1103/PhysRevLett.97.184302)                                                  | Mechanics candidate; current radial feedback is not the paper's rod model                                             |
| S10 | [Liang & Mahadevan (2009), The shape of a long leaf](https://doi.org/10.1073/pnas.0911954106)                                                                                       | Differential growth/elasticity candidate; current parametric ribbon does not minimize elastic energy                  |
| S11 | [Gerlee & Anderson (2007), Stability analysis of a hybrid cellular automaton model of cell colony growth](https://arxiv.org/abs/0705.1081)                                          | Nutrient-coupled growth; actual update rules and interpretation need extraction                                       |
| S12 | [Wen et al. (2012), Proprioceptive coupling within motor neurons drives C. elegans forward locomotion](https://pmc.ncbi.nlm.nih.gov/articles/PMC3508473/)                           | Local-feedback question; current phase chain is an analogy, not neural reconstruction                                 |
| S13 | [Tero et al. (2010), Rules for biologically inspired adaptive network design](https://doi.org/10.1126/science.1177894)                                                              | Network-design context; the implemented two-terminal model uses Tero et al. (2007), documented in Atlas 2             |
| S14 | [Mirollo & Strogatz (1990), Synchronization of pulse-coupled biological oscillators](https://doi.org/10.1137/0150098)                                                               | Future synchronization candidate; organism-specific interpretation and assumptions need review                        |

The original brief also links [Wikipedia's flocking overview](https://en.wikipedia.org/wiki/Flocking). Preserve it as an orientation resource; it does not replace S01 or a starling-specific primary source.

## Research gaps that matter across suites

- The current navigation hierarchy has no separately recorded taxonomy source. Audit it before presenting it as a research-backed tree, especially mixed species/group/growth-form labels and omitted branches.
- Spatial ant foraging needs its own behavioral/model sources; a TSP reference is insufficient.
- Starling-specific neighbor selection needs primary evidence distinct from generic computer-animation boids.
- Coral's chemical and transport mechanisms need an explicit selection; a reaction–diffusion pattern on a sphere is not a validated coral growth model.
- Plant mechanics needs a solver specification and benchmark; plausible curvature is not force balance.
- C. elegans needs a bounded question before any connectome/data or neural architecture choice.

## Opportunity queue

These are research candidates, not committed scope or claims of completed evaluation.

| Candidate                        | Experiment question                                                                          | Why it may add value                                     | Evidence/entry gate                                                            |
| -------------------------------- | -------------------------------------------------------------------------------------------- | -------------------------------------------------------- | ------------------------------------------------------------------------------ |
| Slime-mold adaptive networks     | How do transport cost, route efficiency and resilience trade off when food locations change? | Adds adaptive graph morphology rather than another swarm | Read S13, choose a specific flow/adaptation model and define comparison graphs |
| Firefly-inspired synchronization | Under which coupling and heterogeneity assumptions do oscillators synchronize?               | Adds collective timing rather than spatial aggregation   | Read S14 and obtain organism-specific evidence before biological claims        |

New candidates should add a distinct question, have inspectable primary support, offer meaningful interventions and fit the static compute envelope. Keep unreviewed ideas here instead of filling the tree with unsupported placeholders.

## Atlas 2 research update

See [the implementation specification](ATLAS_2.md) for sources read for concrete questions, exact sections, model choices and tests. This supersedes the original all-sources-screened status for the listed excerpts; it does not claim every full paper or supplementary dataset was reproduced.

## Mahadevan direction review — 2026-10-18

Jerry requested this review after deployment. [Paper-to-experiment mapping](MAHADEVAN_DIRECTION.md)
records the sections reviewed, current model gaps, proposed experiments and
remaining specification gates. It includes supported-strut mechanics, leaf
buckling, tendril overwinding, optimized shepherding and the two distinct termite
construction models. Private course references are retained only in local ignored
notes; no private source files, code or figures enter the public source ledger.
