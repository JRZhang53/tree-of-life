# Humanization pass, 18 October 2026

Jerry requested a distinctive, less generic design and direct copy in his writing
style, with an independent critic. His messages support an informal, direct tone;
they are not enough to establish a complete personal writing style. Do not invent
first-person experiences or opinions. The public portfolio could not be retrieved.

## Plan before implementation

The memorable device is the branching index: a visible ancestry path connects the
selected organism to the rest of the collection. The experiment is one continuous
working surface, with controls in its margin. The question and a concrete suggested
intervention replace the promotional tagline. Research reads as a short explanation
with an adjacent limitation, rather than a row of identical feature cards.

Palette: white `#ffffff`, ink `#24253b`, blue `#3846a3`, pale periwinkle
`#eff0fa`, rule `#d7d9e6`, secondary ink `#5a5d72`. The simulation's biological
colors remain useful encodings. Typography: Trebuchet MS with system sans fallback;
large, compact organism names, normal sentence-case questions and readable body
text. No decorative monospace labels, synthetic handwriting or paper texture.

```
Tree of Life                        Jerry Zhang / About
branching index     organism + scientific name | question
                    canvas                    | controls
                    measurements + a concrete experiment to try
                    comparison graph          | saved observations
                    model explanation         | limits + sources
```

Review against defaults: a botanical serif and green cards would repeat the old
theme. A faux laboratory notebook with taped scraps would just replace one template
with another. This plan removes both. Borders indicate ancestry, chart axes and
control groups; they do not enclose every paragraph. The question, model and
intervention differ by organism. A shared instrument layout remains useful for
learning the controls. The tree carries the visual identity; the rest stays quiet.

## External reference

[InterfaceKit's design audit](https://blog.interfacekit.io/what-makes-a-website-look-ai-generated)
argues that interchangeable structure and language matter more than any particular
color or font. This is an opinion-based design lens, not an AI-origin detector.
[Bartosz Ciechanowski's interactive explanations](https://ciechanow.ski/) provide
a useful example of instructions tied to an actual diagram. No assets or prose
were copied.

## Initial independent critique

The critic identified repeated slogans, botanical dashboard framing, a weak tree,
small instructions and symmetrical research sections. Preserve model limitations,
reproducible controls and the notebook. Review the revision for subject specificity,
useful language, composition, experiment clarity, scientific honesty and usability.

## Full interface review

Scope: all twelve suite introductions and explanations, shared navigation,
controls, notebook, research notes and About. Vite/TypeScript, native HTML/CSS and
Canvas; no framework, typeface package or external artwork added.

| Category       | Evidence                                                      | Result                                                                                                                                                                    |
| -------------- | ------------------------------------------------------------- | ------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| Typography     | Source; desktop, tablet and phone screenshots                 | Trebuchet family, stronger hierarchy, 12–16 px instructions, tabular measurements. Removed slogan layer.                                                                  |
| Surfaces       | Shared workbench, controls, notebook and research screenshots | One experiment surface; controls in its margin. Asymmetric explanation and sources.                                                                                       |
| Motion         | CSS and playback code, real UI actions                        | No decorative entrance animation. Only short button state transitions; reduced-motion overrides retained. No slow-motion animation-panel audit.                           |
| Icons/diagrams | SVG source and screenshots                                    | Removed repeated organism icons; original wordmark retained. Topology now generates a real cladogram.                                                                     |
| Performance    | Source and build output                                       | No new runtime dependencies or requests. Rebuild the small tree only on search/navigation. No new device benchmark; model performance evidence remains in release checks. |

| Severity | Location                                                                  | Before                                                                                       | After                                                                                                       | Why                                                                                                |
| -------- | ------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------------------------------------- | -------------------------------------------------------------------------------------------------- |
| MEDIUM   | `src/catalog.ts`, `src/content/additions.ts`, `src/presentation/shell.ts` | Poetic slogan on each branch; promotional About/footer                                       | Specific biological questions, useful introductions, direct explanations and limitations                    | Each sentence now explains this experiment. Personal anecdotes were not invented.                  |
| MEDIUM   | `src/presentation/tree.ts`, `src/main.ts`                                 | Deep file-browser indentation; full ancestor borders highlighted                             | Aligned terminals, explicit forks, exact selected edges, textual lineage and filtered topology              | The central tree concept now determines the navigation's form. Focus survives diagram replacement. |
| MEDIUM   | `src/style.css`, `src/presentation/shell.ts`                              | Separate rounded canvas and controls cards                                                   | One working surface with controls in its margin; seed/share disclosure                                      | Visual grouping follows the experiment, with less repeated chrome.                                 |
| MEDIUM   | `src/style.css`, `src/render.ts`                                          | Small gray-green instructions, mint gradient and dot texture                                 | Legible dark text, white/blue hierarchy, quiet flat habitat background                                      | The simulation and actionable controls carry attention.                                            |
| MEDIUM   | `src/main.ts`                                                             | Symmetrical generic research template; intervention buried below chart                       | Suggested intervention beside the result; explanatory text with limitations/source margin                   | The page order supports an actual experiment.                                                      |
| MEDIUM   | `src/main.ts`, `src/catalog.ts`                                           | Vines labeled educational model; leaf/worm descriptions accumulated mode-specific appendices | Vine explicitly labeled geometry sketch; coherent explanations of all modes                                 | Appearance must not imply a force solver or connectome reconstruction.                             |
| LOW      | `src/presentation/notebook.ts`, `index.html`                              | Chart slogan, vague prompt, plural bug, stale ten-suite metadata                             | Direct comparison instructions, actionable empty state, singular/plural handling, twelve-branch description | Labels and metadata describe the actual product.                                                   |
| LOW      | `src/main.ts`                                                             | Completion chart could stop at the last 30-step sample                                       | Force a final sample when normal playback completes                                                         | The plotted endpoint now agrees with the displayed completion step.                                |

## Critic feedback loop

The first review identified generic slogans, botanical dashboard framing, weak
tree identity and small captions. Revision one resolved the copy and surface
issues. The critic still found the composition insufficiently distinctive, and
noticed that the highlighted ancestor borders continued below the selected leaf.
Revision two replaced the file-like tree with the cladogram and resolved the copy
nits. The final critic verdict was **approve the design direction**, with no
remaining substantive visual/copy issue in the inspected surfaces.

Final rubric: subject specificity 4/5, authored language 4/5, composition 4/5,
experiment clarity 4/5, scientific honesty 5/5, usability 4/5. These are one
critic's judgments about specificity and craft, not an AI-authorship test or proof
of exact voice matching. The critic inspected source and four screenshots, not
live keyboard behavior or runtime performance.

Considered and rejected: fake handwriting/paper/tape; another ornamental image
layer; additional accent colors; rewriting every technical sentence into forced
casual speech. The actual diagram provides identity, and the models still need
precise explanations.

## Verification

- `npm run verify`: TypeScript, 54 model/research/navigation checks, production
  build and one production-path test. Added a meaningful navigation check for
  filtered lineage, empty results and recovery to the full tree.
- In-app browser: all twelve branches retain the correct active selection and
  model counts (28 total); no horizontal overflow or browser errors observed.
- Desktop default viewport, 820 × 1000 tablet, 390 × 844 phone and 320 × 740 narrow
  phone checked. Phone tree closes after selection; controls and notes remain
  readable. Search handles no-match, filtered ancestry and clearing.
- Keyboard camera rotation, inactive controls, seed restart, About/Escape and
  research-link focus checked. The research link scrolls without replacing the
  experiment hash. Native controls and local record formats are retained.
- Model code and model revision are unchanged. No fresh empirical, Safari,
  Firefox, real touch-device or screen-reader validation is claimed. Existing
  export and numerical evidence remains in the base atlas release record.

Final implementation verdict: ready for review and child-repository integration.
Portfolio pinning and deployment remain separately owned.
