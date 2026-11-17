"use strict";
/* Extend curriculum here. Path libraries remain separate from navigation. */
window.CURRICULUM = (() => {
  const library = window.LETTER_LIBRARY;
  const lookup = Object.fromEntries(
    [...library.uppercase.characters, ...library.lowercase.characters].map(
      (c) => [c.name, c],
    ),
  );
  const words = [
    "One",
    "Two",
    "Three",
    "Four",
    "Five",
    "Six",
    "Seven",
    "Eight",
    "Nine",
    "Ten",
  ];
  const teens = [
    "Ten",
    "Eleven",
    "Twelve",
    "Thirteen",
    "Fourteen",
    "Fifteen",
    "Sixteen",
    "Seventeen",
    "Eighteen",
    "Nineteen",
  ];
  function numberName(n) {
    if (!Number.isInteger(n) || n < 1 || n > 50)
      throw new RangeError("Supported numbers: 1–50");
    if (n < 10) return words[n - 1];
    if (n < 20) return teens[n - 10];
    const tens = { 2: "Twenty", 3: "Thirty", 4: "Forty", 5: "Fifty" };
    return (
      tens[Math.floor(n / 10)] +
      (n % 10 ? "-" + words[(n % 10) - 1].toLowerCase() : "")
    );
  }
  // Zero is extracted from the original 10. The other digits reuse 1–9.
  // Uniform normalization aligns each digit's actual ink bounds to y=80..320;
  // it retains aspect ratio and each original movement sequence.
  const originals = library.numbers.characters;
  const rawDigits = Object.fromEntries(
    originals.slice(0, 9).map((c) => [c.name, c]),
  );
  rawDigits["0"] = { name: "0", strokes: [originals[9].strokes[1]] };
  const digits = Object.fromEntries(
    Object.entries(rawDigits).map(([name, c]) => {
      const b = HANDWRITING.bounds(c),
        scale = 240 / b.height;
      const dx = 200 - ((b.left + b.right) / 2) * scale,
        dy = 80 - b.top * scale;
      return [
        name,
        {
          ...c,
          strokes: c.strokes.map((s) =>
            HANDWRITING.transform(s, scale, dx, dy),
          ),
          normalization: { scale, dx, dy },
        },
      ];
    }),
  );
  // One complete number per large teaching square, including 10–50.
  // Use a common uniform digit scale across the category; no horizontal squeeze.
  const numberSquare = { x: 40, y: 40, size: 320 };
  const digitBoxes = Object.fromEntries(
    Object.entries(digits).map(([name, c]) => [name, HANDWRITING.bounds(c)]),
  );
  const gap = 24;
  const widestDigit = Math.max(
    ...Object.values(digitBoxes).map((b) => b.width),
  );
  const numberScale = Math.min(1, 272 / (widestDigit * 2 + gap));
  const numbers = Array.from({ length: 50 }, (_, i) => {
    const name = String(i + 1),
      strokes = [],
      components = [];
    const width =
      [...name].reduce((sum, digit) => sum + digitBoxes[digit].width, 0) +
      (name.length - 1) * gap;
    let cursor = 200 - (width * numberScale) / 2;
    const dy = 200 * (1 - numberScale);
    [...name].forEach((digit, index) => {
      const c = digits[digit],
        dx = cursor - digitBoxes[digit].left * numberScale;
      components.push({
        name: digit,
        dx,
        dy,
        scale: numberScale,
        firstStroke: strokes.length,
        strokeCount: c.strokes.length,
      });
      c.strokes.forEach((s, j) =>
        strokes.push({
          ...HANDWRITING.transform(s, numberScale, dx, dy),
          characterIndex: index,
          characterName: digit,
          beginsCharacter: j === 0,
        }),
      );
      cursor += (digitBoxes[digit].width + gap) * numberScale;
    });
    return {
      name,
      announcement: numberName(i + 1),
      strokes,
      components,
      viewportWidth: 400,
      numberSquare,
    };
  });
  Object.assign(library.uppercase, {
    label: "Capital Letters",
    headingLabel: "Capital",
    subject: "english",
  });
  Object.assign(library.lowercase, {
    label: "Small Letters",
    headingLabel: "Small",
    subject: "english",
  });
  library.combination = {
    label: "Combination",
    headingLabel: "Pair",
    itemLabel: "Pair",
    subject: "english",
    notebookGuides: true,
    characters: library.uppercase.characters.map((c) => {
      const pair = HANDWRITING.compose(c.name + c.name.toLowerCase(), lookup);
      pair.announcement = `Capital ${c.name}, small ${c.name}`;
      return pair;
    }),
  };
  Object.assign(library.numbers, {
    label: "Numbers (1–50)",
    subject: "maths",
    notebookGuides: "grid",
    characters: numbers,
  });
  library.numerals = {
    label: "Numerals (ONE–TEN)",
    headingLabel: "Word",
    itemLabel: "Word",
    subject: "maths",
    notebookGuides: true,
    characters: words.map((word) => {
      const name = word.toUpperCase();
      return {
        ...HANDWRITING.compose(name, lookup),
        announcement: [...name].join(", "),
        speechOptions: { followUp: name, pauseMs: 400 },
      };
    }),
  };
  Object.assign(library.kannadaSwaras, {
    label: "Swaras",
    subtitle: "ಸ್ವರಗಳು",
    subject: "kannada",
  });
  Object.assign(library.kannadaVyanjanas, {
    label: "Vyanjanas",
    subtitle: "ವ್ಯಂಜನಗಳು",
    subject: "kannada",
  });
  const subjects = {
    english: {
      title: "English",
      sample: "ABC",
      sets: ["uppercase", "lowercase", "combination"],
    },
    maths: {
      title: "Maths",
      sample: "123",
      sets: ["numbers", "numerals"],
    },
    kannada: {
      title: "Kannada",
      sample: "ಅ ಆ ಇ",
      sets: ["kannadaSwaras", "kannadaVyanjanas"],
    },
  };
  const grades = { lkg: { title: "LKG", subjects } };
  return { grades, subjects, numberName, digits, rawDigits, lookup };
})();
