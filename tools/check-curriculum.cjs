/* End-to-end curriculum, composition, navigation, playback and Pages contract. */
const { chromium } = require("playwright");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const base = (
  process.env.SITE_URL || "http://localhost:8765/learn-with-me"
).replace(/\/$/, "");
const artifacts = path.resolve(__dirname, "../artifacts");
fs.mkdirSync(artifacts, { recursive: true });
const manifest = require("../docs/source-manifest.json");
for (const [name, checksum] of Object.entries(manifest.unchangedFiles)) {
  const actual = require("node:crypto")
    .createHash("sha256")
    .update(fs.readFileSync(path.resolve(__dirname, "..", name)))
    .digest("hex");
  assert.equal(actual, checksum, `Preserved source file: ${name}`);
}
(async () => {
  const browser = await chromium.launch({
    executablePath: process.env.CHROME_PATH || "/usr/bin/google-chrome",
    args: ["--no-sandbox"],
  });
  try {
    const page = await browser.newPage({
        viewport: { width: 1280, height: 900 },
      }),
      errors = [],
      failures = [];
    page.on("pageerror", (e) => errors.push(e.message));
    page.on("response", (r) => {
      if (r.status() >= 400) failures.push(r.url());
    });
    await page.goto(base + "/");
    await page.evaluate(() => document.fonts.ready);
    // Complete hierarchy through actual links, including Back and Home.
    assert.equal(await page.locator(".notebook-tile").count(), 1);
    assert.equal(await page.locator(".notebook-tile h2").textContent(), "LKG");
    await page.locator(".notebook-tile").click();
    await page.waitForFunction(
      () => document.querySelectorAll(".notebook-tile").length === 3,
    );
    assert.deepEqual(
      await page.locator(".notebook-tile h2").allTextContents(),
      ["English", "Maths", "Kannada"],
    );
    const covers = await page
      .locator(".notebook-tile")
      .evaluateAll((tiles) =>
        tiles.map((t) => ({
          background: getComputedStyle(t).backgroundColor,
          width: t.offsetWidth,
          height: t.offsetHeight,
        })),
      );
    covers.forEach((c) => assert.deepEqual(c, covers[0]));
    for (const [subject, labels] of [
      ["english", ["Capital Letters", "Small Letters", "Combination"]],
      ["maths", ["Numbers (1–50)", "Numerals (One–Ten)"]],
      ["kannada", ["Swaras", "Vyanjanas"]],
    ]) {
      await page.locator(`a[href="#/lkg/${subject}"]`).click();
      await page.waitForFunction(
        () =>
          document.querySelector("#pageDescription").textContent ===
          "Choose a notebook and follow the pencil.",
      );
      assert.deepEqual(
        await page.locator(".notebook-tile h2").allTextContents(),
        labels,
      );
      for (let i = 0; i < labels.length; i++) {
        await page.locator(".notebook-tile").nth(i).click();
        await page.locator("#lessonPage").waitFor();
        assert.equal(
          await page.locator("#categoryTitle").textContent(),
          labels[i],
        );
        await page.locator("#backLink").click();
        await page.locator("#selectionPage").waitFor();
      }
      await page.locator("#backLink").click();
      await page.waitForFunction(
        () => document.querySelectorAll(".notebook-tile").length === 3,
      );
    }
    await page.locator(".home-button").click();
    await page.waitForFunction(
      () => document.querySelectorAll(".notebook-tile").length === 1,
    );
    await page.goto(base + "/#/lkg/english/combination/6");
    await page.locator("#lessonPage").waitFor();
    assert.equal(
      await page.locator("#letter-heading").textContent(),
      "Pair Gg",
    );
    const results = await page.evaluate(() => {
      const near = (a, b, msg, t = 0.08) => {
        if (Math.abs(a - b) > t) throw Error(`${msg}: ${a} vs ${b}`);
      };
      const ensure = (v, msg) => {
        if (!v) throw Error(msg);
      };
      const counts = {
        uppercase: 26,
        lowercase: 26,
        combination: 26,
        numbers: 50,
        numerals: 10,
        kannadaSwaras: 15,
        kannadaVyanjanas: 34,
      };
      for (const [key, count] of Object.entries(counts))
        ensure(LETTER_LIBRARY[key].characters.length === count, "Count " + key);
      ensure(
        LETTER_LIBRARY.numbers.characters.map((c) => c.name).join(",") ===
          Array.from({ length: 50 }, (_, i) => String(i + 1)).join(","),
        "Number coverage",
      );
      ensure(
        LETTER_LIBRARY.numerals.characters.map((c) => c.name).join(",") ===
          "One,Two,Three,Four,Five,Six,Seven,Eight,Nine,Ten",
        "Word coverage",
      );
      const numberWords = [
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
        "Eleven",
        "Twelve",
        "Thirteen",
        "Fourteen",
        "Fifteen",
        "Sixteen",
        "Seventeen",
        "Eighteen",
        "Nineteen",
        "Twenty",
        "Twenty-one",
        "Twenty-two",
        "Twenty-three",
        "Twenty-four",
        "Twenty-five",
        "Twenty-six",
        "Twenty-seven",
        "Twenty-eight",
        "Twenty-nine",
        "Thirty",
        "Thirty-one",
        "Thirty-two",
        "Thirty-three",
        "Thirty-four",
        "Thirty-five",
        "Thirty-six",
        "Thirty-seven",
        "Thirty-eight",
        "Thirty-nine",
        "Forty",
        "Forty-one",
        "Forty-two",
        "Forty-three",
        "Forty-four",
        "Forty-five",
        "Forty-six",
        "Forty-seven",
        "Forty-eight",
        "Forty-nine",
        "Fifty",
      ];
      numberWords.forEach((word, i) =>
        ensure(
          CURRICULUM.numberName(i + 1) === word,
          "Number pronunciation " + (i + 1),
        ),
      );
      let checked = 0;
      for (const key of ["combination", "numbers", "numerals"]) {
        changeSet(key);
        for (let i = 0; i < getCharacters().length; i++) {
          state.letterIndex = i;
          renderLetter();
          beginLetter();
          stopAnimation();
          const c = getCharacters()[i],
            ink = state.strokeElements,
            guide = [...elements.guideLayer.querySelectorAll("path")];
          const width = c.viewportWidth;
          let expectedStroke = 0;
          ensure(
            c.components.map((x) => x.name).join("") === c.name,
            "Left to right characters " + c.name,
          );
          for (const component of c.components) {
            const original =
              key === "numbers"
                ? CURRICULUM.digits[component.name]
                : CURRICULUM.lookup[component.name];
            ensure(
              component.firstStroke === expectedStroke,
              "Component order " + c.name,
            );
            near(component.scale, 1, "No composition scaling");
            near(component.dy, 0, "Shared baseline");
            for (
              let j = 0;
              j < original.strokes.length;
              j++, expectedStroke++
            ) {
              const p = ink[expectedStroke],
                s = c.strokes[expectedStroke];
              ensure(
                p.getAttribute("d") === guide[expectedStroke].getAttribute("d"),
                "Guide/ink geometry",
              );
              ensure(
                s.characterIndex === c.components.indexOf(component),
                "Stroke sequence",
              );
              const source = document.createElementNS(SVG_NS, "path");
              source.setAttribute("d", original.strokes[j].d);
              const length = source.getTotalLength(),
                after = p.getTotalLength();
              near(after, length, "Unchanged path length");
              for (const f of [0, 0.2, 0.5, 0.8, 1]) {
                const a = source.getPointAtLength(length * f),
                  b = p.getPointAtLength(after * f);
                near(b.x, a.x + component.dx, "Translated x");
                near(b.y, a.y, "Preserved y");
              }
              const box = p.getBBox();
              ensure(
                box.x >= 10 &&
                  box.y >= 20 &&
                  box.x + box.width <= width - 10 &&
                  box.y + box.height <= 380,
                "No clipping " + c.name,
              );
              ensure(state.strokeIndex === expectedStroke, "Engine order");
              if (state.phase === "preparing") {
                ensure(
                  !elements.pencilTip.classList.contains("visible"),
                  "Pencil lifted",
                );
                updatePreparing(state.phaseStartedAt + 1000);
                stopAnimation();
              }
              const duration = SPEEDS[elements.speedSelect.value].drawDuration;
              updateDrawing(state.phaseStartedAt + duration * 0.5);
              stopAnimation();
              const distance = after - Number(p.style.strokeDashoffset),
                point = p.getPointAtLength(distance),
                matrix = elements.pencilTip.transform.baseVal.getItem(0).matrix;
              near(matrix.e, point.x, "Pencil on path x");
              near(matrix.f, point.y, "Pencil on path y");
              pause();
              const snapshot = p.style.strokeDashoffset;
              ensure(state.phase === "paused", "Pause");
              ensure(
                p.style.strokeDashoffset === snapshot,
                "Preserve paused ink",
              );
              play();
              stopAnimation();
              updateDrawing(state.phaseStartedAt + duration + 1);
              stopAnimation();
              if (expectedStroke < c.strokes.length - 1) {
                ensure(state.phase === "preparing", "Pen lift between strokes");
                ensure(
                  elements.strokeInstruction.textContent.includes(
                    "Lift your pencil",
                  ),
                  "Lift cue",
                );
                const next = c.strokes[expectedStroke + 1];
                if (next.beginsCharacter) {
                  const nextPoint = ink[expectedStroke + 1].getPointAtLength(0);
                  near(
                    Number(elements.startDot.getAttribute("cx")),
                    nextPoint.x,
                    "Next character start x",
                  );
                  near(
                    Number(elements.startDot.getAttribute("cy")),
                    nextPoint.y,
                    "Next character start y",
                  );
                }
              }
            }
          }
          ensure(state.phase === "complete", "Completion " + c.name);
          ensure(state.letterIndex === i, "No auto advance");
          ensure(
            ink.every((p) => p.style.strokeDasharray === "none"),
            "Solid completed ink",
          );
          checked++;
        }
      }
      // Digit normalization preserves each original curve uniformly and aligns actual bounds.
      for (const [name, c] of Object.entries(CURRICULUM.digits)) {
        const source = CURRICULUM.rawDigits[name],
          n = c.normalization,
          b = HANDWRITING.bounds(c);
        near(b.top, 80, "Digit top");
        near(b.bottom, 320, "Digit baseline");
        c.strokes.forEach((s, j) => {
          const a = createPath(source.strokes[j].d),
            p = createPath(s.d);
          near(
            p.getTotalLength(),
            a.getTotalLength() * n.scale,
            "Uniform digit scale",
            0.15,
          );
        });
      }
      // Changing speed, including while paused, must retain drawing progress.
      Object.defineProperty(performance, "now", {value: () => 10000, configurable: true});
      changeSet("uppercase");
      stopAnimation();
      state.phaseStartedAt = performance.now() - 500;
      updateDrawing(performance.now());
      stopAnimation();
      const before = Number(state.strokeElements[0].style.strokeDashoffset);
      pause();
      elements.speedSelect.value = "fast";
      elements.speedSelect.dispatchEvent(new Event("change"));
      play();
      stopAnimation();
      updateDrawing(state.phaseStartedAt);
      near(
        Number(state.strokeElements[0].style.strokeDashoffset),
        before,
        "Speed continuity",
      );
      pause();
      delete performance.now;
      return { checked, counts };
    });
    assert.equal(results.checked, 86);
    // Character index and playback through real controls.
    await page.goto(base + "/#/lkg/maths/numbers/0");
    await page.locator("#lessonPage").waitFor();
    assert.equal(await page.locator("#previousButton").isDisabled(), true);
    await page.locator("#exerciseIndex summary").click();
    await page.getByRole("button", { name: "Show 27", exact: true }).click();
    assert.equal(
      await page.locator("#letter-heading").textContent(),
      "Number 27",
    );
    assert.ok(page.url().endsWith("/26"));
    assert.equal(
      await page
        .getByRole("button", { name: "Show 27", exact: true })
        .getAttribute("aria-pressed"),
      "true",
    );
    await page.locator("#pauseButton").click();
    const before = await page.evaluate(() => ({
      index: state.strokeIndex,
      offset: state.strokeElements.map((p) => p.style.strokeDashoffset),
      pencil: elements.pencilTip.getAttribute("transform"),
    }));
    await page.waitForTimeout(150);
    assert.deepEqual(
      await page.evaluate(() => ({
        index: state.strokeIndex,
        offset: state.strokeElements.map((p) => p.style.strokeDashoffset),
        pencil: elements.pencilTip.getAttribute("transform"),
      })),
      before,
    );
    await page.locator("#playButton").click();
    assert.equal(await page.evaluate(() => state.phase), "drawing");
    await page.locator("#replayButton").click();
    assert.equal(await page.evaluate(() => state.strokeIndex), 0);
    await page.getByRole("button", { name: "Show 50", exact: true }).click();
    assert.equal(await page.locator("#nextButton").isDisabled(), true);
    await page.locator("#exerciseIndex summary").click();
    // Screenshots and layout checks at mobile, both tablet orientations, desktop.
    const reps = [
      ["uppercase", "A"],
      ["uppercase", "Q"],
      ["lowercase", "a"],
      ["lowercase", "b"],
      ["lowercase", "g"],
      ["lowercase", "y"],
      ["combination", "Aa"],
      ["combination", "Gg"],
      ["combination", "Qq"],
      ["numbers", "1"],
      ["numbers", "10"],
      ["numbers", "27"],
      ["numbers", "50"],
      ["numerals", "One"],
      ["numerals", "Three"],
      ["numerals", "Seven"],
      ["numerals", "Eight"],
      ["kannadaSwaras", "ಅ"],
      ["kannadaSwaras", "ಈ"],
      ["kannadaSwaras", "ಔ"],
      ["kannadaVyanjanas", "ಕ"],
      ["kannadaVyanjanas", "ಞ"],
      ["kannadaVyanjanas", "ಳ"],
    ];
    for (const size of [
      { width: 360, height: 800 },
      { width: 768, height: 1024 },
      { width: 1024, height: 768 },
      { width: 1440, height: 1000 },
    ]) {
      await page.setViewportSize(size);
      for (const route of [
        "",
        "lkg",
        "lkg/english",
        "lkg/maths",
        "lkg/kannada",
      ]) {
        await page.goto(`${base}/#/${route}`);
        await page.locator("#selectionPage").waitFor();
        await page.evaluate(() => document.fonts.ready);
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
        );
        await page.screenshot({
          path: path.join(
            artifacts,
            `${size.width}-${route.replaceAll("/", "-") || "home"}.png`,
          ),
          fullPage: true,
        });
      }
      for (const [set, name] of reps) {
        await page.evaluate(
          ({ set, name }) => {
            changeSet(set);
            state.letterIndex = getCharacters().findIndex(
              (c) => c.name === name,
            );
            renderLetter();
            beginLetter();
            stopAnimation();
            // Finish through the actual engine to inspect the persistent completed form.
            for (
              let n = 0;
              n < getCharacters()[state.letterIndex].strokes.length;
              n++
            ) {
              if (state.phase === "preparing") {
                updatePreparing(state.phaseStartedAt + 1000);
                stopAnimation();
              }
              updateDrawing(state.phaseStartedAt + 100000);
              stopAnimation();
            }
          },
          { set, name },
        );
        assert.equal(
          await page.evaluate(
            () => document.documentElement.scrollWidth > innerWidth,
          ),
          false,
        );
        const ratio = await page.locator("#letterCanvas").evaluate((svg) => {
          const r = svg.getBoundingClientRect(),
            v = svg.viewBox.baseVal;
          return r.width / r.height / (v.width / v.height);
        });
        assert.ok(Math.abs(ratio - 1) < 0.005, "Undistorted SVG");
        assert.equal(await page.locator("#playButton").isEnabled(), true);
        const nameId = reps.findIndex((x) => x[0] === set && x[1] === name);
        await page.screenshot({
          path: path.join(
            artifacts,
            `${size.width}-exercise-${String(nameId).padStart(2, "0")}.png`,
          ),
          fullPage: true,
        });
        if (size.width === 1024)
          await page
            .locator("#letterCanvas")
            .screenshot({
              path: path.join(
                artifacts,
                `sample-${String(nameId).padStart(2, "0")}.png`,
              ),
            });
      }
    }
    // History, malformed links and unavailable audio remain usable.
    await page.goto(base + "/#/lkg");
    await page.getByRole("heading", { name: "English", exact: true }).click();
    await page.locator(".notebook-tile").first().waitFor();
    await page.goBack();
    await page.waitForFunction(
      () => document.querySelectorAll(".notebook-tile").length === 3,
    );
    await page.goto(base + "/#/lkg/maths/uppercase/200");
    await page.getByRole("heading", { name: "LKG", exact: true }).waitFor();
    assert.equal(new URL(page.url()).hash, "#/");
    // Every runtime asset is local and resolves under the deployment subpath.
    const assets = await page.evaluate(() =>
      [...document.querySelectorAll("script[src],link[href],img[src]")].map(
        (e) => e.src || e.href,
      ),
    );
    for (const url of assets) {
      assert.ok(url.startsWith(base + "/"), url);
      assert.ok((await page.request.get(url)).ok(), url);
    }
    for (const font of ["caveat.ttf", "kannada.ttf"])
      assert.ok((await page.request.get(base + "/assets/fonts/" + font)).ok());
    assert.deepEqual(errors, []);
    assert.deepEqual(failures, []);
    console.log(
      `PASS: ${results.checked} composed exercises; seven-category navigation; all 50 spoken numbers; uniform digits; baseline, pen lifts, pause and speed continuity; direct index; history; ${reps.length} representative exercises at four viewports; local Pages assets. Screenshots: artifacts/`,
    );
  } finally {
    await browser.close();
  }
})().catch((e) => {
  console.error(e);
  process.exitCode = 1;
});
