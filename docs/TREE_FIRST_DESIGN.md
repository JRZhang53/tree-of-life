# Tree-first design revision

## Math typesetting

Jerry requested beautiful LaTeX/math rendering on 2026-10-18. Keep the existing
ice/teal palette and body typography; use KaTeX's mathematical fonts for equations.
Display math is left-aligned with the explanation, with generous vertical space.
Split long energies into named terms and define symbols in nearby prose. Avoid
decorative equation numbers, panels or a separate visual theme for mathematics.

`src/presentation/math.ts` renders authored prose using `\(inline\)` and
`\[display\]` delimiters. Use `String.raw` in TypeScript content. It escapes prose,
rejects invalid formulas, disables trusted HTML/URL commands, caches results and
emits both HTML and MathML. Tests parse every mode's equation/scale/comparison
content, so new formulas must pass strict parsing before release. Notebook notes
remain plain user text; this is not a general HTML or Markdown renderer.

KaTeX 0.19.0 and its fonts are bundled locally. The MIT notice is shipped at
`public/licenses/KaTeX.txt`. Vite owns hashed font URLs under the portfolio base
path; no CDN or third-party font request is needed. The checked app bundle is
approximately 126 kB compressed JavaScript; only used fonts load in the browser.
Formula rendering occurs when notes change, not per animation frame.

At narrow widths, equation regions can scroll horizontally and receive keyboard
focus. Do not shrink mathematical type until it becomes unreadable. Retain
MathML and the visible symbol explanations; a complete screen-reader audit is
still a separate check. Open equation notes remain open when model controls change.

## Brief and correction

Jerry rejected the previous design as still looking strongly AI-generated and
asked for a more unique design with an autonomous goal. That feedback supersedes
the earlier critic's approval. The prior pass made individual components clearer
but kept a generic sidebar/title/panel/form composition.

## Plan before implementation

The tree becomes a broad collection of actual simulation specimens. Open a
terminal branch to work with its model on a large, uncluttered surface. A compact
selected lineage connects the collection to the experiment when the tree folds
away. Playback and parameters sit beneath the model, not in a right-hand form.

```
Tree of Life                                      Jerry Zhang / About
Browse the tree                         selected organism / ancestry

 [colony] [vine] [leaf] [network] ... [flock] [sheep] [orcas]
      \     /        \                  /        /
       branching relationships, actual model previews
                         Life

                        selected branch
Organism name                        scientific name / model status
                  large live simulation
Run / Step / Reset                         live measurements
model choice + presets | parameters across a shallow shelf
one specific experiment to try

model explanation / limitations / sources
comparison notebook
```

Direct hash links open the same experiment composition with the tree folded.
Phones get a vertical tree of specimen rows and the same full-width experiment;
the page scrolls normally, without a nested sidebar scroll. Previews are static,
seeded model output and are identified as such, not photographs or observations.

Palette: ice `#e5f0f2`, white `#ffffff`, deep teal ink `#183f42`, oxide
`#b34622`, muted ink `#52696b`, branch `#abc8c8`. Model colors retain their
existing measurement/organism roles. Typography: Verdana for readable compact
controls/body; Georgia italic for the project wordmark and scientific names;
Arial Black for organism names. Headings are names, not promotional slogans.

The memorable feature is the model-filled tree. Avoid a second decorative idea:
no fake paper, handwriting, specimen numbers, ornamental icons or stock imagery.
Asymmetry comes from the actual branching topology and model shapes. Native
controls and ordinary paragraphs keep the rest of the page straightforward.

## Alternatives and review before building

The independent critic proposed a tree-first collection and a full-screen
instrument with an alternate map. Choose the tree-first collection because it
expresses the original organizing idea. A purely full-screen instrument could
be repurposed for any simulation site. A new palette on the old shell would not
resolve the rejected composition. This revision replaces the shell hierarchy.

[Complexity Explorables](https://www.complexity-explorables.org/about/) is a useful
reference for letting one interactive system carry an explanation with few words.
No prose, assets or implementation were copied. This is design interpretation,
not an AI-origin test. The critic will inspect the whole composition before
evaluating small details this time.

## Acceptance checks

- No persistent navigation sidebar or boxed canvas/right-hand form.
- Tree and model output dominate a thumbnail screenshot, including direct links.
- Recognizable composition without relying on brand or color alone.
- All models, keyboard controls, comparisons and limitations remain usable.
- Desktop and narrow phone review; no horizontal page overflow.
- Independent critic review and relevant software checks before handoff.

## Implementation and critic loop

The first structural review acknowledged a genuine departure but found the model
previews too small. The revision fits the full foreground into each specimen view,
including targets and food sites, while omitting tiny annotation text. A caption
identifies cropped previews and their seed/step. Models are not changed to create
more attractive states; the firefly preview is dark because of its phase.

The critic approved the whole composition after reviewing the revised desktop
collection, folded experiment and phone views. It then found phone canvas labels
too small. Long captions were moved to HTML; object labels now render at least
12 CSS pixels and clamp within the canvas. A final screenshot review confirmed
that fix. These are design judgments, not a guarantee of Jerry's approval or proof
of human authorship. The critic did not independently run the interaction checks.

Previews are generated once per tab from default mode/settings, seed 42 and 600
fixed steps, cached in memory, and computed in batches that yield after roughly
6 ms of model work. They are not twelve continuously running models. A drawing
state is shown until each image is ready. Browsing the tree pauses the active run.
The seed, revision, save/export and hosting contracts are unchanged.

## Full interface review

Scope: collection, direct-linked experiment, control shelf, scene captions,
research, notebook and About. Vite/TypeScript, native HTML, plain CSS, Canvas 2D.
No new dependency, downloaded font, stock art or runtime network request.

| Category | Evidence inspected | Result |
| --- | --- | --- |
| Typography | Desktop/phone screenshots, render and CSS source | Compact name headings; readable HTML captions; minimum-size object labels; tabular values. |
| Surfaces | Expanded collection, folded experiment, control shelf, notebook | Sidebar removed; full-width simulation; branch junction; no repeated organism cards. |
| Animations | CSS, tree-toggle and playback code, real UI actions | Only short control feedback and preview hover displacement. Reduced-motion overrides retained. No 10% animation-panel audit. |
| Icons/diagrams | Both tree projections, selected paths and keyboard states | Real topology; one accessible link per organism; no decorative icon set. |
| Performance | Preview source and live browsing | Deferred, bounded, cached specimens; yielding batches; no continuous multi-model gallery. No new hardware benchmark. |

| Severity | Location | Before | After | Why |
| --- | --- | --- | --- | --- |
| MEDIUM | `src/presentation/shell.ts`, `src/style.css` | Sidebar/title/tinted-panel/form template | Tree collection, selected branch, model and horizontal shelf | Structure follows the phylogenetic collection. |
| MEDIUM | `src/presentation/tree.ts`, `src/presentation/previews.ts` | Names in a narrow sidebar; first revision had tiny previews | Model specimens fit their foreground; wide and vertical topologies | Organisms supply the visual identity and usable selection targets. |
| MEDIUM | `src/main.ts`, `src/presentation/shell.ts` | Repeated invitation and teaching headings | Compact collection count; organism-specific research question | Copy serves navigation and the model rather than decorating each section. |
| HIGH | `src/render.ts`, `src/main.ts` | Canvas captions shrank with the scene | HTML captions; short labels at minimum 12 CSS pixels | Phone users can read the model encodings and object labels. |
| LOW | `src/main.ts`, `src/style.css` | Simulation kept advancing while browsing | Tree opening pauses it; loading state for specimen generation | Avoid unintended elapsed state and unexplained empty previews. |

Considered and rejected: another palette-only pass; fake notebook texture; a
full-screen instrument that hides the collection's organizing idea; brightening
the firefly thumbnail by changing its state; twelve continuously animated previews.

## Verification and limits

- `npm run verify`: TypeScript, 58 model/research/navigation checks, production
  build and one subpath build test. Model-search coverage was added to the existing
  tree test. No simulation equation, numerical parameter or model revision changed.
- All 12 branches selected and stepped on desktop at 1280 × 900. All 28 modes
  selected and stepped at 320 × 740, with no horizontal page overflow.
- Collection and folded experiment inspected at 390 × 844. Long baseline options
  and open comparison details fit at 320 pixels. Phone labels inspected on
  Physarum and ants; relevant captions in other modes checked in source and UI.
- Search matching and empty result, model-name search, selected-lineage retention,
  selection/collapse, same-branch return, keyboard camera rotation, canvas Enter,
  About/Escape and focus restoration checked through real controls.
- Firefly comparison at step 600 showed equal default runs. A paused phase reset
  changed synchrony to 0.8327; saving immediately captured that measurement and
  step. The QA record was removed; pre-existing records were preserved.
- No browser warning/error logs during the final mode and interaction checks.
- Independent critic approved the composition and confirmed its phone annotation
  finding resolved. Screenshots are local review artifacts, not copied assets.

Not verified: physical touch devices, Safari, Firefox, screen-reader software,
OS reduced-motion emulation, low-power frame-rate guarantees or new scientific
calibration. Earlier numerical limitations remain applicable. No parent release
or portfolio pin change was made.
