# Validation record

Validation uses real SVG geometry in headless Google Chrome, not font metrics or snapshot-only assertions. Run `npm ci && npm test` to reproduce. The suite mounts the application under `/learn-with-me/` to exercise GitHub Pages asset paths.

## Coverage

| Check | Coverage |
| --- | --- |
| Retained-source checksums | The 5 unchanged path/placement/speech files match `source-manifest.json` |
| English notebook | All 52 letters; actual cap/body/descender bounds; exact y=70/160/250/340 rules and colours; pencil/guide correspondence; ordered solid completion |
| Kannada animation | All 49 characters × 3 speeds = 147 demonstrations; 800 ms holds; linear distance motion; explicit lifts; source stroke sequences; pause/resume/replay |
| Kannada notebook | All 49 anatomical placements; uniform transformations and pen widths; body guides and extensions; no clipping; review/lesson parity |
| Speech | All 187 exercises; complete numbers and words; female en-IN/kn-IN preference; language fallback; cancellation; Hear; Play/Replay; first gesture; unsupported browsers |
| Composition | All 26 pairs + 50 numbers + 10 words = 86 exercises; component ordering, exact source-curve correspondence, unchanged English y coordinates, uniform digit normalization, bounds, lifts and pencil repositioning |
| Navigation | Home → LKG → each subject → all 7 categories; Back/Home; history; malformed route fallback; direct exercise routes and index |
| Playback | Previous/Next boundaries; automatic demonstration on selection; no automatic progression; pause retaining ink and pencil; restart and replay; speed changes preserving fractional progress |
| Deployment | Local scripts, icons, styles and fonts resolve under `/learn-with-me/`; framework-free static build |

The original four checks were copied from Write With Me and adapted for the new routes and character selection. Their English and Kannada geometric assertions remain in place; the old unruled-number expectations now assert square-grid ruling. The original speech check now covers all seven categories. New behavior is checked in `check-curriculum.cjs`.

## Browser and visual inspection

Full-page screenshots cover **360 × 800**, **768 × 1024**, **1024 × 768**, and **1440 × 1000**. Each viewport includes home, subjects and each subject's categories, plus these 23 representative completed demonstrations:

- A, Q; a, b, g, y.
- Aa, Gg, Qq.
- 1, 10, 27, 50.
- One, Three, Seven, Eight.
- Kannada ಅ, ಈ, ಔ; ಕ, ಞ, ಳ.

The suite checks undistorted SVG aspect ratios and absence of document overflow. There are 112 full-page screenshots plus 23 tablet SVG detail captures in ignored `artifacts/`. The completed paths and notebook surfaces were visually reviewed alongside the common notebook tile treatment. The pencil is checked against the actual point on each animated path, and original Kannada joins and guide/ink widths are verified numerically.

On phones, wider words fit through uniform page scaling. On tablets they retain a larger writing height; page width grows for words without changing individual letter proportions. The source's English and Kannada rule positions remain exact SVG coordinates at every size.

## Limits

- Speech synthesis is mocked for repeatable voice-request tests. Actual audible pronunciation and voice availability require device listening checks.
- Viewport testing uses desktop Chromium; physical touch hardware, iOS Safari and Android device audio were not tested.
- Kannada research retains its original reconstruction caveats and has not been independently teacher certified. See the retained research notes.
- Offline use is possible with local files, but no service worker/offline installer is provided. Hosting requires only static files; learning sessions use no external assets or services.
