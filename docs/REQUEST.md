# Learn With Me — LKG Digital Notebook Companion

## 1. Objective

Create a new standalone educational web application called **Learn With Me**, by extracting and redesigning the existing **Write With Me** module from AGS Learning Companion.

**Source repository — read-only:**
https://github.com/somanathghalimath/ags-learning-companion

**Destination repository:**
https://github.com/somanathghalimath/learn-with-me

The objective is to redesign the application's visual presentation, navigation hierarchy and curriculum coverage while preserving its established handwriting demonstration methodology.

**This is a digital teaching companion for a child practicing handwriting in a physical notebook. It is not an on-screen handwriting practice or tracing application.**

The device demonstrates how to write. The child watches, listens and follows the demonstration in their physical workbook.

## 2. Understand the existing implementation

Before making any changes, thoroughly inspect the source repository, particularly the `alphabet-writing-guide` directory.

Important source files include:

- `alphabet-writing-guide/index.html`
- `alphabet-writing-guide/app.js`
- `alphabet-writing-guide/styles.css`
- `alphabet-writing-guide/letters.js`
- `alphabet-writing-guide/kannada.js`
- `alphabet-writing-guide/kannada-vyanjana.js`
- `alphabet-writing-guide/kannada-notebook.js`
- `alphabet-writing-guide/README.md`
- `alphabet-writing-guide/review/`
- `alphabet-writing-guide/tools/`
- `picture-reading/speech.js`

The existing implementation already contains substantial research, carefully constructed handwriting paths, notebook placement rules and regression tests.

Understand these implementations before designing the new application.

### Existing functionality to preserve

The current application uses a 400 × 400 SVG coordinate system, with separate layers for notebook ruling, faint character guides, animated ink, the green starting point and the moving pencil.

The demonstration:

1. Presents the character on the appropriate notebook ruling.
2. Displays its faint handwriting guide.
3. Announces the character.
4. Shows the stroke starting point.
5. Animates a pencil following the prescribed handwriting path.
6. Reveals the ink as the pencil moves.
7. Demonstrates subsequent strokes in their correct sequence.
8. Leaves the completed character visible for reference.

Preserve this teaching methodology.

The existing animation state machine, stroke geometry, speed controls, speech integration and notebook alignment must be treated as established functionality, not discarded during the redesign.

The source repository must remain unchanged.

## 3. Application navigation

Implement the following hierarchy exactly:

```
Learn With Me
└── LKG
    ├── English
    │   ├── Capital Letters
    │   ├── Small Letters
    │   └── Combination
    ├── Maths
    │   ├── Numbers (1–50)
    │   └── Numerals (One–Ten)
    └── Kannada
        ├── Swaras
        └── Vyanjanas
```

### Home page

- Application title: **Learn With Me**
- Display a prominent LKG notebook tile.
- Clicking LKG opens the subject selection page.
- Do not introduce additional grades at this stage.
- Keep the architecture extensible for future grades.

### LKG subject selection

Display three notebook-style tiles:

- English — ABC
- Maths — 123
- Kannada — ಅ ಆ ಇ

All three tiles must use the same visual design, colour palette, dimensions, typography and decorative treatment.

Differentiate them through their titles and representative characters, not through different background colours or visual themes.

### English subject page

Display three tiles:

- Capital Letters
- Small Letters
- Combination

### Maths subject page

Display two tiles:

- Numbers (1–50)
- Numerals (One–Ten)

### Kannada subject page

Display two tiles:

- Swaras — ಸ್ವರಗಳು
- Vyanjanas — ವ್ಯಂಜನಗಳು

Selecting an exercise category opens its handwriting demonstration screen.

Provide clear, consistent back and home navigation throughout the application.

Replace the existing practice-set dropdown as the primary navigation mechanism with this structured hierarchy.

## 4. Visual design direction

### Central metaphor: A child's school notebook

The entire application should feel like a thoughtfully illustrated collection of school notebooks, designed for a five-year-old child.

The visual language must be consistent from the home page through subject selection, exercise selection and handwriting demonstrations.

It must not resemble a corporate dashboard, generic Material Design application, conventional educational portal or colourful mobile game.

### Unified visual identity

Use a single cohesive design system throughout the application:

- Warm ivory or off-white paper backgrounds.
- Subtle paper textures.
- Muted, harmonious colours.
- Natural pencil and ink tones.
- Gentle paper-like shadows.
- Hand-drawn illustrations and decorative doodles.
- Notebook bindings, page edges and paper tabs where appropriate.
- Handwritten-style English headings.
- Clear, readable Kannada typography.
- Generous whitespace.

Choose one consistent accent palette and apply it throughout the application.

**Do not assign separate colours to English, Maths and Kannada.**

**Do not give individual tiles different background colours.**

Tiles should feel like matching notebooks from the same stationery collection.

The subject-specific notebook ruling colours described below are educational requirements and are exempt from this restriction.

Avoid neon colours, glassmorphism, heavy gradients, excessive shadows and distracting animations.

The aesthetic should be playful but calm, warm but uncluttered, and genuinely reminiscent of physical school stationery.

## 5. Handwriting demonstration screen

This is the most important screen in the application.

The existing handwriting demonstration should be visually reimagined as an open school notebook page.

The animated handwriting itself must remain the dominant element.

### Preserve the existing demonstration model

- Display one target exercise at a time.
- Render the faint character guide using the established stroke geometry.
- Animate the pencil along the original SVG paths.
- Reveal the ink directly beneath the moving pencil.
- Preserve stroke order and direction.
- Preserve starting-point indicators.
- Preserve pen-lift cues and inter-stroke pauses.
- Preserve the completed character after the demonstration.
- Preserve existing character announcements.

The child should be able to watch the demonstration and reproduce the same movements in a physical notebook.

Do not introduce touch-based tracing, drawing canvases, handwriting recognition, stroke validation, accuracy scores or automatic assessment.

### Playback controls

Retain the existing functionality:

- Play.
- Pause.
- Replay.
- Hear.
- Slow, Normal and Fast demonstration speeds.
- Previous character.
- Next character.
- Current exercise name.
- Current exercise position within its category.

Redesign the controls to match the notebook aesthetic.

Use large, intuitive controls with minimal visual clutter.

Replay must restart the demonstration using the original stroke sequence.

Pause must preserve the current animation position.

Hear must repeat the pronunciation without restarting the animation.

Changing the current exercise must automatically begin its demonstration, consistent with the existing application.

Do not automatically advance to the next character after completion. Leave the completed character visible so that the child can continue practicing in their workbook.

### Layout principles

- Give the handwriting demonstration maximum practical screen space.
- Avoid oversized headers or decorative elements that reduce the writing area.
- Keep navigation and playback controls easily accessible.
- Ensure the pencil, starting dot, faint guide and completed ink remain clearly visible.
- Preserve stroke proportions when resizing the demonstration.
- Make the notebook page and handwriting canvas feel like one unified surface.

## 6. Notebook ruling and handwriting geometry

The physical notebook conventions are fundamental educational requirements, not decorative styling.

### English — four-line handwriting notebook

Preserve the existing red-blue-blue-red ruling convention.

The existing SVG coordinates are:

- Upper red line: y = 70.
- Upper blue line: y = 160.
- Lower blue line: y = 250.
- Lower red line: y = 340.

Retain the precisely established relationships between the handwriting paths and notebook lines:

- Capitals extend from the upper red line to the lower blue baseline.
- Ordinary lowercase letter bodies sit between the two blue lines.
- Ascenders extend into the upper band.
- Descenders extend into the lower band.
- Existing exceptions and letter-specific placements remain intact.

Do not recreate the English alphabet from a handwriting font.

Do not modify the existing 52 letter paths merely to accommodate the redesigned visual layout.

### Kannada — traditional double-ruled notebook

Preserve the existing Kannada paired-line placement implementation in `kannada-notebook.js`.

The existing notebook body guides are positioned at y = 145 and y = 250 in the 400 × 400 coordinate system.

Each Kannada character has individually established body anchors and placement rules.

Preserve:

- The 15 swaras and marks.
- The 34 basic vyanjanas.
- The original centreline vector geometry.
- Per-character body placement.
- Upper and lower extensions beyond the body guides.
- Relative mark positions.
- Uniform scaling and translation.
- Starting-point holds.
- Constant path-distance pencil motion.
- Explicit pen-lift cues.

Do not replace these paths with Kannada font outlines or apply generic character centering that overrides the researched notebook placement.

Retain the source documentation, attribution and review material associated with the Kannada implementation.

### Maths — square-ruled notebook

Introduce a traditional square-ruled mathematics notebook surface.

The existing number paths currently use an unruled canvas. Adapt their placement to the new square-grid notebook while preserving their actual handwriting shapes and stroke sequences.

For multi-digit numbers:

- Give each digit its own appropriate writing space.
- Maintain consistent digit height and baseline.
- Preserve natural spacing.
- Demonstrate digits sequentially from left to right.

For written number names, use the English four-line notebook instead of square ruling, because these exercises teach alphabetic handwriting.

## 7. Curriculum

### English: Capital Letters

Provide all 26 uppercase letters, A through Z.

Reuse the existing uppercase handwriting definitions without modifying the stroke geometry or sequence.

### English: Small Letters

Provide all 26 lowercase letters, a through z.

Reuse the existing lowercase handwriting definitions without modifying the stroke geometry or sequence.

### English: Combination

Provide all 26 uppercase and lowercase pairs:

Aa, Bb, Cc, Dd, continuing through Zz.

Present both characters together on a shared four-line notebook page.

The demonstration must:

1. Announce the character pair.
2. Write the uppercase letter.
3. Lift and reposition the pencil.
4. Write the lowercase letter.
5. Leave the completed pair visible together.

Build the combinations by composing the existing uppercase and lowercase stroke definitions.

Both letters must retain their correct relationships to the same notebook ruling.

Do not independently redraw the characters.

### Maths: Numbers (1–50)

Expand the existing numbers curriculum to cover every integer from 1 through 50.

The existing implementation covers numbers 1 through 10.

Extract reusable digit-level handwriting definitions where appropriate and compose multi-digit numbers using those definitions.

Ensure all ten digits, including zero, have correct handwriting paths.

For example, the demonstration for 27 must write 2 first, lift the pencil, then write 7.

The spoken announcement must pronounce the complete number, such as “Twenty-seven”, rather than speaking the individual digits.

Replace the existing hardcoded 1–10 speech mapping with a number pronunciation implementation supporting the entire required range.

### Maths: Numerals (One–Ten)

This category teaches the written English names of numbers:

One, Two, Three, Four, Five, Six, Seven, Eight, Nine, Ten.

Use the existing uppercase and lowercase letter definitions to compose each word.

Display the complete word on a shared four-line handwriting notebook.

Animate the pencil writing each letter in sequence from left to right, preserving all individual strokes and pen lifts.

Preserve correct:

- Capitalization.
- Letter spacing.
- Baseline alignment.
- Relative letter heights.
- Ascenders and descenders.

Use a sufficiently wide SVG viewport or notebook surface for longer words such as Three, Seven and Eight.

Do not horizontally compress individual letters merely to fit them into the original square canvas.

Announce the complete word.

### Kannada: Swaras

Reuse the existing 15 swara and mark definitions from `kannada.js`, maintaining their established curriculum ordering and notebook placement.

### Kannada: Vyanjanas

Reuse the existing 34 basic consonant definitions from `kannada-vyanjana.js`, maintaining their established curriculum ordering and notebook placement.

Do not alter the researched Kannada handwriting convention as part of this redesign.

## 8. Character selection

Retain sequential previous and next navigation within every exercise category.

Also provide a simple notebook-style index for directly selecting a particular character, number or word.

This index should allow a parent or child to jump directly to the exercise they are practicing in their physical school workbook.

For Numbers 1–50, arrange the index in manageable rows or groups.

For Kannada, maintain the existing traditional character ordering.

The index should not dominate or reduce the available demonstration space.

Do not introduce progression locks, completion requirements or scoring.

## 9. Audio and speech

Reuse the existing shared speech implementation from `picture-reading/speech.js`, adapting it into a self-contained module in the destination repository.

Preserve:

- Indian English (`en-IN`) voice preferences.
- Kannada (`kn-IN`) voice preferences.
- Existing speech rate and pitch.
- Existing female voice preferences.
- Pronunciation on exercise changes.
- Pronunciation on Play and Replay.
- Independent pronunciation through Hear.
- Cancellation of previous speech when a new announcement begins.
- Speech cancellation on Pause.
- Browser gesture requirements for initial audio playback.

Extend the speech functionality to support:

- Uppercase and lowercase combinations.
- Numbers from 1 to 50.
- Written number names from One to Ten.

For Kannada, preserve the existing language-specific voice selection. Do not force Kannada text through an English-only voice.

Maintain graceful degradation when speech synthesis or an appropriate voice is unavailable.

Do not introduce external speech APIs or unnecessary audio-generation dependencies.

## 10. Technical architecture

Retain the existing lightweight, framework-free approach unless a specific technical requirement makes a change necessary.

The new application should remain a static web application that can run locally and be hosted using GitHub Pages.

Organize the implementation around:

- Application navigation.
- Shared notebook visual design system.
- Curriculum definitions.
- Reusable handwriting path library.
- Character and word composition utilities.
- Notebook ruling and layout logic.
- SVG handwriting demonstration engine.
- Speech and pronunciation utilities.
- Automated regression tests.

Use one shared demonstration engine across all seven exercise categories.

Extend the existing engine to support multiple characters on a shared notebook page rather than implementing separate animation engines for combinations, numbers and words.

For composed exercises, use coordinate transformations that preserve handwriting geometry, relative proportions, stroke sequencing and notebook alignment.

Keep all application dependencies self-contained within the destination repository.

The deployed application must not fetch scripts, styles or handwriting definitions from the original AGS Learning Companion repository.

Ensure all asset paths work under the GitHub Pages `/learn-with-me/` deployment subpath.

Preserve applicable CC BY-SA 4.0 attribution and licensing for adapted Kannada path data and derivative material. Retain the associated research documentation and provenance.

## 11. Device and layout support

Prioritize tablets as the primary learning companion, while maintaining compatibility with desktop and mobile browsers.

Support:

- Tablet landscape orientation.
- Tablet portrait orientation.
- Desktop displays.
- Mobile displays.
- Touch-based navigation and playback controls.
- Mouse-based navigation and playback controls.

Because the child practices in a physical notebook, touchscreen interaction is limited to navigation and demonstration controls.

Ensure that the demonstration remains readable when the tablet is placed on a desk beside a physical notebook.

The application should also be comfortable to use in landscape orientation, especially for multi-character and word demonstrations.

Maintain accurate notebook ruling and handwriting proportions across viewport sizes.

## 12. Scope boundaries

Do not migrate unrelated AGS Learning Companion modules, including quizzes, drawing activities, picture reading or arithmetic games.

Do not introduce:

- On-screen handwriting practice.
- Touch-based character tracing.
- Handwriting recognition.
- Stroke accuracy validation.
- User accounts.
- Progress tracking.
- Scoring systems.
- Leaderboards.
- Rewards or gamification.
- Mandatory learning paths.
- Parent dashboards.
- Backend services.
- AI-generated educational content.

The goal is a polished, focused digital notebook companion that demonstrates correct handwriting while the child practices independently in a physical workbook.

## 13. Implementation approach

Execute the work in the following phases:

1. Inspect both repositories and understand the existing source implementation.
2. Identify the exact dependencies required by the Write With Me module.
3. Establish the new application structure and unified notebook design system.
4. Implement the requested navigation hierarchy.
5. Integrate the existing handwriting animation engine and character libraries.
6. Preserve English and Kannada notebook placement functionality.
7. Extend the engine for character pairs, multi-digit numbers and complete words.
8. Implement all seven exercise categories.
9. Integrate and extend speech functionality.
10. Adapt and execute the existing regression tests.
11. Validate responsive layouts and visual quality.
12. Verify deployment compatibility and document the new application.

Do not stop after creating a design proposal, implementation plan or mockup.

Implement the complete working application in the destination repository.

## 14. Validation and acceptance criteria

Reuse and adapt the existing automated checks:

- `check-notebook.cjs`
- `check-kannada.cjs`
- `check-kannada-notebook.cjs`
- `check-letter-speech.cjs`

Existing English and Kannada demonstrations must retain their behaviour and educational accuracy after the redesign.

Add tests for:

- The complete navigation hierarchy.
- All 26 uppercase letters.
- All 26 lowercase letters.
- All 26 uppercase/lowercase combinations.
- Every number from 1 through 50.
- All ten written number names.
- All 15 Kannada swaras and marks.
- All 34 Kannada consonants.
- Composed character positioning.
- Shared notebook baseline alignment.
- Multi-character stroke ordering.
- Pencil repositioning between characters.
- Pronunciation of complete numbers and words.
- Playback controls.
- Character selection.
- Responsive layout behaviour.
- GitHub Pages asset resolution.

Visually inspect representative demonstrations, including:

- A and Q.
- a, b, g and y.
- Aa, Gg and Qq.
- 1, 10, 27 and 50.
- One, Three, Seven and Eight.
- Simple and complex Kannada swaras.
- Simple and complex Kannada vyanjanas.

Verify that:

- The pencil accurately follows the displayed guide.
- The guide and completed ink share identical geometry.
- Existing notebook alignment is preserved.
- Composed letters retain their individual proportions.
- No characters are clipped.
- Playback and speech remain synchronized appropriately.
- Completed exercises remain visible.
- All tiles and pages share a consistent visual identity.

Use browser screenshots to inspect the home page, subject selection, exercise selection and representative demonstration screens at tablet and desktop viewport sizes.

## 15. Deliverables

The destination repository must contain:

- Complete working application source code.
- Unified notebook-inspired visual design.
- All seven exercise categories.
- Existing and newly composed handwriting path data.
- Shared handwriting demonstration engine.
- Notebook ruling and placement implementations.
- Speech utilities.
- Responsive styling.
- Regression tests.
- Required attribution and research documentation.
- GitHub Pages-compatible deployment configuration.
- README with local execution, architecture and deployment instructions.

At completion, summarize:

- What was preserved from the original implementation.
- What was redesigned.
- How multi-character composition works.
- How notebook alignment is preserved.
- How curriculum content can be extended.
- Tests performed and their results.
- Any known limitations.

**The final application must feel like a beautifully designed digital school notebook that teaches a child how to write in their real school notebook.**

**Preserve the educational precision of the existing implementation. Redesign the experience around it.**