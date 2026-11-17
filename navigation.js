"use strict";
(() => {
  const $ = (selector) => document.querySelector(selector);
  let route = [],
    routing = false;
  const samples = {
    uppercase: "ABC",
    lowercase: "abc",
    combination: "Aa",
    numbers: "1 2 3",
    numerals: "One",
    kannadaSwaras: "ಅ ಆ ಇ",
    kannadaVyanjanas: "ಕ ಖ ಗ",
  };
  const descriptions = {
    uppercase: "26 capital letters",
    lowercase: "26 small letters",
    combination: "26 letter pairs",
    numbers: "50 numbers",
    numerals: "10 number names",
    kannadaSwaras: "15 swaras & marks",
    kannadaVyanjanas: "34 consonants",
  };
  function href(parts) {
    return "#/" + parts.join("/");
  }
  function tile(title, sample, description, parts, subtitle = "") {
    const a = document.createElement("a");
    a.className = "notebook-tile";
    a.href = href(parts);
    const binding = document.createElement("span");
    binding.className = "tile-binding";
    binding.setAttribute("aria-hidden", "true");
    const characters = document.createElement("span");
    characters.className = "tile-sample";
    characters.textContent = sample;
    characters.setAttribute("aria-hidden", "true");
    const name = document.createElement("h2");
    name.textContent = title;
    const sub = document.createElement("span");
    sub.className = "tile-subtitle";
    sub.textContent = subtitle;
    if (subtitle) sub.lang = "kn";
    const desc = document.createElement("p");
    desc.textContent = description;
    const open = document.createElement("span");
    open.className = "tile-open";
    open.textContent = "Open notebook  ↗";
    a.append(binding, characters, name, sub);
    if (description) a.append(desc);
    a.append(open);
    if (parts.length === 1) {
      a.setAttribute("aria-label", "Open LKG notebook");
      const illustration = document.createElement("img");
      illustration.src = "assets/learning-doodle.svg";
      illustration.alt = "";
      illustration.className = "home-illustration";
      a.append(illustration);
    }
    return a;
  }
  function renderParentLink() {
    const parent = route[2]
      ? { title: CURRICULUM.subjects[route[1]].title, parts: route.slice(0, 2) }
      : route[1]
        ? { title: "LKG", parts: ["lkg"] }
        : { title: "Home", parts: [] };
    const link = $("#backLink");
    link.hidden = !route.length;
    link.href = href(parent.parts);
    link.textContent = `← ${parent.title}`;
    link.setAttribute("aria-label", `Back to ${parent.title}`);
  }
  function renderIndex() {
    const set = getActiveSet();
    $("#indexHint").textContent =
      `${set.characters.length} ${set.itemLabel.toLowerCase()}s`;
    $("#indexList").replaceChildren(
      ...set.characters.map((c, index) => {
        const button = document.createElement("button");
        button.type = "button";
        button.textContent = c.name;
        button.setAttribute("aria-label", `Show ${c.name}`);
        button.setAttribute(
          "aria-pressed",
          String(index === state.letterIndex),
        );
        if (set.speechLang) button.lang = set.speechLang;
        button.addEventListener("click", () => {
          selectExercise(index);
        });
        return button;
      }),
    );
  }
  function selectExercise(index) {
    state.letterIndex = index;
    renderLetter();
    beginLetter();
    announceCurrentLetter();
  }
  function syncExercise() {
    if (!route[2] || routing) return;
    const parts = [...route.slice(0, 3), String(state.letterIndex)];
    history.replaceState(null, "", href(parts));
    [...$("#indexList").children].forEach((button, i) =>
      button.setAttribute("aria-pressed", String(i === state.letterIndex)),
    );
  }
  function showLesson(key, index, render = true) {
    $("#selectionPage").hidden = true;
    $("#lessonPage").hidden = false;
    const set = LETTER_LIBRARY[key];
    $("#categoryTitle").textContent = set.label;
    state.activeSetKey = key;
    state.letterIndex = index;
    if (render) {
      renderLetter();
      beginLetter();
      announceCurrentLetter();
    }
    renderIndex();
  }
  function renderRoute() {
    routing = true;
    const parts = location.hash.replace(/^#\/?/, "").split("/").filter(Boolean);
    const valid =
      !parts.length ||
      (parts[0] === "lkg" &&
        parts.length <= 4 &&
        (!parts[1] || CURRICULUM.subjects[parts[1]]) &&
        (!parts[2] || CURRICULUM.subjects[parts[1]]?.sets.includes(parts[2])) &&
        (!parts[3] ||
          (/^\d+$/.test(parts[3]) &&
            Number(parts[3]) < LETTER_LIBRARY[parts[2]]?.characters.length)));
    route = valid ? parts : [];
    if (!valid) history.replaceState(null, "", "#/");
    stopAnimation();
    pictureSpeech.cancel();
    hasAnnouncedLetter = false;
    document.body.classList.toggle("in-lesson", Boolean(route[2]));
    document.body.classList.toggle("is-home", !route.length);
    if (route[2]) {
      showLesson(route[2], Number(route[3] || 0));
    } else {
      $("#selectionPage").hidden = false;
      $("#lessonPage").hidden = true;
      const shelf = $("#notebookShelf");
      shelf.replaceChildren();
      if (!route.length) {
        $("#pageTitle").textContent = "Learn With Me";
        shelf.append(tile("LKG", "Aa  123", "", ["lkg"]));
      } else if (!route[1]) {
        $("#pageTitle").textContent = "LKG";
        for (const [key, s] of Object.entries(CURRICULUM.subjects))
          shelf.append(tile(s.title, s.sample, "", ["lkg", key]));
      } else {
        const subject = CURRICULUM.subjects[route[1]];
        $("#pageTitle").textContent = subject.title;
        for (const key of subject.sets) {
          const set = LETTER_LIBRARY[key];
          shelf.append(
            tile(
              set.label,
              samples[key],
              descriptions[key],
              [...route.slice(0, 2), key],
              set.subtitle,
            ),
          );
        }
      }
    }
    renderParentLink();
    document.title = route.length
      ? (route[2]
          ? LETTER_LIBRARY[route[2]].label
          : route[1]
            ? CURRICULUM.subjects[route[1]].title
            : "LKG") + " · Learn With Me"
      : "Learn With Me";
    routing = false;
    if (route[2]) syncExercise();
  }
  window.addEventListener("hashchange", () => {
    renderRoute();
    $("#main").focus({ preventScroll: true });
    window.scrollTo(0, 0);
  });
  window.addEventListener("exercisechange", syncExercise);
  window.addEventListener("categorychange", () => {
    if (routing) return;
    const set = getActiveSet();
    route = ["lkg", set.subject, state.activeSetKey];
    history.replaceState(null, "", href(route));
    document.body.classList.add("in-lesson");
    document.body.classList.remove("is-home");
    document.title = set.label + " · Learn With Me";
    routing = true;
    showLesson(state.activeSetKey, state.letterIndex, false);
    renderParentLink();
    routing = false;
    syncExercise();
  });
  window.addEventListener("pagehide", () => {
    stopAnimation();
    pictureSpeech.cancel();
  });
  document.addEventListener("visibilitychange", () => {
    if (document.hidden) pause();
  });
  renderRoute();
})();
