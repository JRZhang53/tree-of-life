# Atlas 2 release checks

Scope: the educational atlas described in [Atlas 2](research/ATLAS_2.md). This record does not imply empirical calibration or complete reproduction of the linked papers.

The interface evidence below records the original atlas candidate. The later
humanization revision replaces that visual design; its current checks and critic
review are in [design review](DESIGN_REVIEW.md). The test suite now has 54
model/research/navigation tests plus the production-path test.

## Software and numerical checks

- Clean `npm ci` on the Windows host, Node 24.19.0 supplied by the repository; npm reported no known dependency vulnerabilities.
- `npm run verify`: TypeScript, 53 model/research tests, production build and one build-path test passed.
- All 28 modes have deterministic seeded state checks, finite state and parameter-bound checks, including newly separated model state.
- New behavior checks: multiseed synchronization and no-coupling invariance; time refinement; analytic pressure circuit and flow conservation; adaptive versus fixed investment and retargeting; matched field/particle mass and 30-seed concentration comparison; elastic relaxation and zero-growth limit; 3D chemical equilibrium and timestep refinement; passive bend propagation/cut; bounded nearest-neighbor equivalence and dilation invariance; malformed notebook storage and record round-trip.
- The earlier sheep delivery, ant tour/delivery, bacterial resources, coral aggregation, vine feedback and oscillator-cut regressions remain passing.
- Asset paths work beneath `/fun/tree-of-life/`; no independent hosting or CNAME was introduced. Production assets approximately 88 kB JS / 18 kB CSS before compression (33 / 5 kB compressed), no runtime third-party requests.

## Browser checks

Codex in-app browser on the Windows host, development and production builds:

- Selected all 12 branches and all 28 modes using real controls; step/reset reached the expected state without browser errors.
- Fixed +600 steps, save observation, compatible-baseline overlay, note entry, persistence across reload, and starting-settings restoration.
- Actual CSV and JSON downloads were read back and contained revision, suite, seed, measurements and original parameters as appropriate. CSV is a measurement table; JSON is the full observation record.
- Branch search returns matching leaves and removes empty ancestors. Mobile navigation collapses after selection.
- Desktop, 768 × 1024 tablet, 390 × 844 mobile, and 320 × 740 narrow mobile: no horizontal overflow. Notebook controls wrap and the plot fits the viewport.
- Keyboard canvas input, camera input, copy-link round trip, legacy numeric mode mapping and Escape dismissal of About.
- Camera and controls were inspected on the elastic leaf and volume chemistry. The leaf's peak deflection grew from approximately 0.64 u at 600 ticks to 9.09 u at 1,200 ticks while energy fell from 130.98 to 96.95 after growth stopped; this is a model example, not an empirical measurement.

Limits: no real touch-device, Safari, Firefox, screen-reader or reduced-motion OS emulation audit. Reduced motion uses the existing paused-start implementation, checked in source. Numerical tests are not spatial-convergence evidence for the leaf mesh or chemical volume. No frame-rate guarantee is made for low-power devices.

## Performance sample

Node 24.19.0 on the same Windows development host, seed 42, default parameters, 60 warm-up steps then 180 measured steps; pure model update only, excluding browser rendering. This is a local diagnostic, not a cross-device benchmark.

| Model                    | p50 update | p95 update |
| ------------------------ | ---------: | ---------: |
| Seven-neighbor starlings |    0.29 ms |    0.56 ms |
| Elastic sheet            |    3.62 ms |    4.86 ms |
| 3D chemical volume       |    0.91 ms |    1.58 ms |

Nearest-neighbor selection initially spent about 7.22 ms at p95 sorting repeated Euclidean distances. Bounded insertion with squared distances reduced that to 0.56 ms while preserving exact neighbor ordering in a regression test. Normal playback caps both accumulated work and time spent stepping per frame. Fixed-step batches yield between approximately 12 ms work chunks and can be canceled by model changes or playback controls.

## Interface review

| Area               | Evidence and change                                                                                                                                               | Verdict                                                                       |
| ------------------ | ----------------------------------------------------------------------------------------------------------------------------------------------------------------- | ----------------------------------------------------------------------------- |
| Typography         | Retained botanical Georgia headings and Segoe UI controls; removed unnecessary uppercase styling from the new notebook label. Numeric values use tabular figures. | Consistent and readable in tested layouts.                                    |
| Surfaces           | Retained mist/forest field-atlas palette; notebook uses a single shared paper surface and fine plot grid, not another collection of cards.                        | The habitat remains the dominant element.                                     |
| Motion             | Smooth firefly glow; no decorative entrance animation; existing reduced-motion paused start. Fixed-step batches yield and report progress at a limited rate.      | Purposeful; OS motion audit remains a coverage limit.                         |
| Icons and controls | New native SVG branch marks follow the same stroke vocabulary. Canvas has keyboard equivalents; native selects and labeled sliders remain.                        | Consistent; no external icon assets.                                          |
| Performance        | Bounded populations, fixed lattice/mesh sizes, sampled/capped notebook history, bounded neighbor selection and no new runtime package.                            | Suitable on the tested host; physical-mobile measurements remain future work. |

Considered and rejected: a framework rewrite, WebGL migration without a measured need, mandatory accounts, cloud notebooks, continuous flashy pulses and unsupported biological-success scores. The selected changes support the actual explore/compare/explain workflow.

## Release boundary

The child repository can be integrated by its verified commit. The portfolio pin and live domain were not changed. Read `HANDOFF.md` for the release identity and integration contract.
