# Learn With Me

A calm digital school notebook for LKG. The device demonstrates handwriting; the child watches, listens and writes in a **physical notebook**. No tracing, accounts, scores, tracking or backend.

[Open Learn With Me](https://somanathghalimath.github.io/learn-with-me/)

## Run locally

No installation or build is needed to use the application:

```sh
python3 -m http.server 8765
```

Open `http://localhost:8765/`. All scripts, fonts, styles, icons and character definitions are local. Hash-based navigation also works under `/learn-with-me/` and with direct exercise links. Opening `index.html` directly works in browsers permitting local scripts, but HTTP is recommended.

## Learning notebooks

Home → LKG → subject → exercise category:

| Subject | Category | Exercises | Ruling |
| --- | --- | --- | --- |
| English | Capital Letters | A–Z (26) | Red–blue–blue–red |
| English | Small Letters | a–z (26) | Red–blue–blue–red |
| English | Combination | Aa–Zz (26) | Red–blue–blue–red |
| Maths | Numbers (1–50) | 1–50 (50) | Square grid |
| Maths | Numerals (One–Ten) | One–Ten (10) | Red–blue–blue–red |
| Kannada | Swaras — ಸ್ವರಗಳು | 15 swaras and marks | Paired body guides |
| Kannada | Vyanjanas — ವ್ಯಂಜನಗಳು | 34 consonants | Paired body guides |

**187 exercises** share one demonstration engine. Each category has Previous/Next, a collapsible direct index, accessible Play/Pause/Replay/Hear icons, and Slow/Normal/Fast speeds. Changing exercises starts the demonstration. Completion leaves the ink visible without advancing. Pause retains the current position; Hear repeats only the announcement.

Number-name exercises spell the word before saying it: “O, N, E. One.” This applies to One through Ten on selection, Play, Replay and Hear.

## Architecture and preserved behavior

- `letters.js`: unchanged source English and original number paths; original library metadata.
- `kannada.js`, `kannada-vyanjana.js`, `kannada-notebook.js`: researched Kannada paths and anatomical placement transforms. ಢ now uses the looped body and separate lower mark checked against the CIIL–NCERT primer; its provenance and anchors are updated. Other Kannada characters retain their source geometry.
- `composition.js`: reusable SVG path transforms, measured path bounds and word/pair composition.
- `curriculum.js`: all seven categories, complete number names, digit extraction, grade and subject definitions.
- `app.js`: adapted original requestAnimationFrame state machine (`ready`, `drawing`, `preparing`, `paused`, `complete`). Guide, ink, start dot and moving pencil share the same path geometry. Stroke timing, easing, Kannada length-based linear movement, 800 ms holds and pen-lift sequences are retained.
- `navigation.js`: hash routes, notebook shelf, a named parent link, Home and direct exercise index. A route such as `#/lkg/english/combination/6` opens Gg. Exercise indices in routes are zero based.
- `speech.js`: unchanged shared browser speech helper with Indian English and Kannada voice preferences, female voice preference, rate 0.85, pitch 1, cancellation and language fallback. Announcements wait for a user gesture.
- `styles.css`, `assets/`: shared ivory-paper and sage stationery design, bundled fonts and SVG doodles.
- `review/`: retained original Kannada research, source images, construction records and interactive gallery.
- `tools/`: adapted original regression checks and additional curriculum/browser checks. Python source reconstruction utilities are retained as historical research tools, not runtime dependencies. `refine-kannada.py` requires the original repository history and optional scientific packages; the application and regression suite do not run it.

### Composition and notebook alignment

English singles retain their original **400 × 400** geometry. Rules stay at **y = 70, 160, 250, 340**. Pairs and words compose those same path definitions using horizontal translation alone. The SVG grows wider with measured character widths and a consistent gap. Every original y coordinate, stroke order, descender and ascender is preserved. Each new character begins with a pen lift and repositioning cue. The complete word fits uniformly into narrower screens; individual letters are never compressed.

Kannada retains the source **y = 145, 250** guides and the individual body anchors in `kannada-notebook.js`. Its per-character scale/translation, extension marks and pen widths are preserved. The corrected ಢ uses updated anchors for its looped body.

Digits 1–9 come from the original number definitions; zero comes from the second stroke of the original 10. Each digit is uniformly normalized to actual bounds **y = 80..320**, preserving aspect ratio, shapes and stroke order. All numbers, including 10–50, fit entirely within one large square (x/y = 40..360). A common uniform digit scale, measured widths and a clear gap preserve digit proportions and a shared baseline. There are no rules between or through the digits. The engine writes left to right and announces the whole number (for example, Twenty-seven).

### Extending content

Add a new stroke definition to the path library only when a researched shape is required. Each uninterrupted pen-down movement is one `{d, prompt}` stroke. English composition accepts the existing uppercase/lowercase lookup; number names and pair definitions are data in `curriculum.js`. Add navigation categories to a subject's `sets` array; future grades can be added to `CURRICULUM.grades` with corresponding route support. Current navigation exposes only LKG. Kannada additions require per-character placements and provenance as well as vectors. Update counts and geometry regressions when expanding a curriculum.

## Validation

Development only: Node 22+, Python 3, and Google Chrome at `/usr/bin/google-chrome`.

```sh
npm ci
npm test
```

`npm test` starts and stops its own HTTP server under `/learn-with-me/`, then runs:

- `check-notebook.cjs`: all 52 English letters, actual curve extrema, caps/bodies/tails, ruling, pencil alignment and completion.
- `check-kannada.cjs`: all 49 Kannada characters at three speeds, holds, lifts, solid completion, joins and reference galleries.
- `check-kannada-notebook.cjs`: all 49 placements, original curve/width preservation, anatomical extensions, bounds and review parity.
- `check-letter-speech.cjs`: all 187 exercises, requested complete announcements, voice preferences, cancellation, gesture gate and unsupported browsers using mocked speech.
- `check-curriculum.cjs`: all navigation routes, all 86 composed exercises, preserved source geometry, baseline and stroke order, digit scaling, index, real playback controls, pause/speed continuity, history, asset resolution and responsive screenshots.

Set `CHROME_PATH` to another Chromium executable. For Playwright's browser:

```sh
npx playwright install --with-deps chromium
CHROME_PATH="$(node -e "process.stdout.write(require('playwright').chromium.executablePath())")" npm test
```

For an already running server, set `SITE_URL` to the application root including any deployment subpath. Browser screenshots are written to ignored `artifacts/`; CI uploads them as a workflow artifact. [Validation notes](docs/VALIDATION.md) describe the exercised viewports and known limits.

## GitHub Pages

The workflow `.github/workflows/pages.yml` runs all checks, packages only the standalone static site, then deploys via GitHub Actions. In repository **Settings → Pages → Build and deployment**, choose **GitHub Actions**. Pushes to `main` deploy after verification; pull requests run checks without deploying. No bundler or external application assets are required.

## Limitations and attribution

Actual voice availability, accent and audible pronunciation depend on the device. With no matching voice, the browser receives the requested language without an explicit English-only voice for Kannada; some devices may remain silent. Speech mocks verify requests, not audio quality. Touch layouts are checked in Chromium viewports; physical tablets and Safari require device testing. Words appear smaller on narrow phones because the complete wider page scales uniformly to fit. Kannada follows the documented source convention and is not independently teacher certified.

[Attribution](ATTRIBUTION.md) · [License](LICENSE.md) · [Original module documentation](docs/ORIGINAL-README.md) · [Requested scope](docs/REQUEST.md)

The home page removes decorative headings and explanatory copy while retaining the app identity, the “Made for little hands and big discoveries” phrase, and an illustrated LKG notebook tile with its functional title and action. [Number-square research and Kannada correction](review/NOTEBOOK-CORRECTIONS.md) documents the requested convention and source checks.
