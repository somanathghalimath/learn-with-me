# Notebook corrections — 17 November 2026

## One complete number in one square

The parent explicitly requested that each **complete number**, including all two-digit values **10–50**, fit inside a single square. This supersedes the original brief's digit-space layout.

Research distinguished that requested early-years copybook layout from later column arithmetic. [Purley CE Primary's published handwriting/presentation policy, page 9](https://www.purleyprimaryschool.co.uk/attachments/download.asp?file=1113&type=pdf) specifies larger squares for Foundation and one digit per square for KS1/KS2. [Kiwi Primary's maths presentation guidance](https://www.kiwi.wilts.sch.uk/attachments/download.asp?file=226&type=pdf) likewise illustrates separate digit squares. Those sources do **not** establish the parent's one-whole-number-per-square layout as a universal standard; the app deliberately follows the parent's workbook convention.

The old implementation drew fine 80-unit graph-paper rules through 240-unit-high digits. This was unsuitable as a formation cell. The revised surface draws only the four edges of one 320 × 320 teaching square, from (40,40) to (360,360), in a 400 × 400 SVG. Every full number sits within those edges with ink-width clearance. All digits use a shared uniform scale, measured natural widths, clear spacing and a common baseline. Two-digit numbers remain left-to-right sequences with a pen lift between digits. No vertical rule divides a number.

Regression checks exercise all 50 values, verify the complete ink bounds are inside the same square and check all four edges. Existing digit curves and stroke order remain unchanged under uniform scale/translation.

## ಢ identity correction

The [CIIL–NCERT Kannada Primer](https://ciil.gov.in/primers/Kannada_Primer.pdf), **PDF page 47 / printed page 30**, shows ಢ with an inner right loop and a separate lower mark. PDF page 52 / printed page 35 shows ಧ without that inner loop. The [JNU Kannada Language Chair alphabet](https://kannadakalike.org/grammar/kannada-alphabet) separately identifies ಢ as retroflex and ಧ as dental.

The previously retained [`Kannada-alphabet-dhha.gif`](https://commons.wikimedia.org/wiki/File:Kannada-alphabet-dhha.gif) was downloaded and all 42 frames inspected. Its finished shape has no inner right loop. Its file page also labels the character ಧ. The earlier source note's assertion that it depicted ಢ was incorrect.

The corrected ಢ reuses the existing looped body, head stroke/curl and lower mark reconstructed from [`Kannada-alphabet-dda.gif`](https://commons.wikimedia.org/wiki/File:Kannada-alphabet-dda.gif), whose finished structure matches the primer's ಢ. The first movement includes the inner loop; the head is the second movement; the lower mark is the third. This uses existing centreline movements rather than generating an outline from a font. The reference image, source-frame ranges, construction JSON, generator and per-character notebook body anchors are updated together. The old `ddha.png` remains as historical provenance. Other characters are outside this targeted correction and retain their existing paths.

Both the lesson and review page use the corrected data. Tests specifically require the inner-loop movement and separate lower mark and still verify constant-distance animation, holds, guide/ink identity, pen lifts, paired-line placement and absence of clipping. This correction does not claim independent Kannada-teacher certification of the full library.
