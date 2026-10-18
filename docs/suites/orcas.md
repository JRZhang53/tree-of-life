# Orcas and cooperative hunting

Current release: implemented educational experiment(s). See [Atlas 2 specification](../research/ATLAS_2.md) for current equations, source review, tests and limitations. The outline below preserves the original deeper research agenda; its unchecked items are not a description of current UI functionality.

Historical planning dossier (before the Atlas 2 implementation). Behavioral question needs refinement before implementation in depth.

## Question and intended lesson

Which aspects of coordinated predator movement change prey-school geometry, and when can geometry plausibly relate to feeding opportunity? The second part requires evidence beyond a tight-looking school.

## Existing prototype

Four prescribed predators encircle or directly pursue a flocking fish school. Fish also have a global center attraction. There is no depth, capture, prey depletion, tail-slap mechanics, learning or energetic cost. School spread is a geometric metric only.

## Candidate experiment sequence

1. Isolate prescribed encirclement versus uncoordinated pursuit as an explicitly geometric model.
2. Introduce communication/coordination limits if the behavioral sources support a useful abstraction.
3. Add a feeding/capture mechanism only after specifying and sourcing what constitutes an opportunity or success.

## Research and model decisions

Read the relevant contribution in S03 and S04. Separate observation of a tactic from a mathematical model of it. Select the predator/prey context rather than implying all orcas hunt alike.
Specify what the predators know, whether roles emerge or are assigned, prey sensing and dynamics, dimensionality, boundaries and what coordination costs. Find an appropriate modeling source; the observational pointers alone do not specify a solver.

## Planned measurements and checks

School dispersion, fragmentation, predator path/effort and spacing. Capture/feeding metrics remain excluded until a capture model is justified. Use matched initial schools and budget across strategies. Check predator-free behavior, rotation/translation sensitivity, boundary artifacts and whether global attraction alone creates the apparent benefit.

## Gate A blockers

- [ ] Choose a specific tactic and supported biological context.
- [ ] Identify the mathematical model or fully specify an educational reduction.
- [ ] Declare information access, assigned roles and the prey response.
- [ ] Choose measurements that do not overclaim feeding success.

## Structural needs

Predator policy, prey dynamics and evaluation must be separate modules within this suite. Similarity to boids is a possible computational reuse, not biological validation.
