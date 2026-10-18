# Run comparison review

2026-10-18. A bounded follow-up to Jerry's request to keep improving the site
autonomously. This extends the notebook while preserving the reviewed
[design direction](DESIGN_REVIEW.md). Numerical model revision remains `atlas-2`.

## Behavior

- Compare compatible runs at their latest exact shared recorded step. Do not
  interpolate or subtract unmatched endpoints. Compatibility requires the same
  suite, revision, observable and unit; model and seed changes remain explicit.
- Show current, saved and current-minus-saved values. Step-zero-only overlap has
  its own notice. Later interventions are flagged as unable to explain an earlier
  displayed difference. This is a descriptive comparison, not causal attribution.
- Keep starting settings separate from changes during each run. A disclosure
  holds the settings table and bounded intervention logs. Control labels and
  actual habitat actions replace internal parameter keys and generic input logs.
- Saved records show mode, seed, endpoint and note. Compare selects a baseline
  without resetting the simulation. Start with settings still restarts at zero;
  records are observations, not resumable simulation snapshots.
- Saving captures the current step, including paused interactions and off-cadence
  steps during playback. Live mutations refresh the sampled value before drawing
  the comparison. Same-step mutations replace that step's latest observation.
- Reject null, duplicate or unordered stored samples without dropping neighboring
  valid records. Existing storage format and 12-record limit are unchanged.
- Guard navigation when a related link opens a branch hidden by the active search.

## Verification

`npm run verify`: TypeScript, 58 model/research/navigation tests, production build
and one production-path test. New comparison tests cover irregular and trimmed
histories, missing shared steps, compatibility, setting differences, binary
rounding noise, small/negative/zero values and malformed records.

In-app browser on Windows, development build:

- Fireflies at step 600: coupled 0.9959 versus uncoupled 0.0443, difference +0.9516.
  These are reproducible model examples, not biological measurements.
- Paused phase reset updates current synchrony immediately to 0.8327; saved value
  stays unchanged. Paused leaf growth updates applied mismatch from 0.8 to 0.85
  immediately. Elastic width restarts at zero and clears an incompatible baseline.
- Step-zero overlap, unequal endpoints, later-event caveat, restore settings,
  baseline removal, branch/mode changes and local save status checked.
- Saving after an interaction captured the new value at step 600; saving while
  playing captured step 17, rather than the previous 30-step sampling boundary.
- Open disclosure and focused note field survive running chart refreshes.
- Filtered tree followed by a hidden related branch opens without an exception.
- Desktop 1280 × 900, mobile 390 × 844 and 320 × 740 inspected. A long baseline
  option exposed grid intrinsic-width overflow; allowing grid children to shrink
  corrected it. Both phone widths then had no horizontal page overflow.
- No browser warning/error logs during the final interaction checks. QA-created
  records removed; pre-existing saved records preserved.

Limits: no new real-device, Safari, Firefox or screen-reader audit. Prior model
and performance limits in [release checks](RELEASE_CHECKS.md) still apply.

## Independent critic and design review

The critic reviewed source and supplied desktop/phone screenshots, not an
independent browser session. It approved the restrained readout and disclosure,
specific copy and honest comparison semantics. It identified stale paused
measurements caused by rendering before sampling; the update order was corrected
and verified with firefly interactions and leaf sliders as recorded above.

| Area | Decision and evidence |
| --- | --- |
| Typography | Existing type retained; tabular values and readable small labels. |
| Surfaces | One readout below the plot, fine rules, no added dashboard cards. |
| Motion | No new animation. Chart refresh does not rebuild disclosure or focus. |
| Controls | Native select/disclosure; Compare moves focus to its result; local status distinguishes Save and Remove. |
| Performance | Existing 1,200-sample/500-event caps; context rebuild only on user changes, not every chart refresh. |

No empirical validation, exact voice imitation or proof of human authorship is
claimed. No runtime dependencies, external assets or hosting changes were added.
