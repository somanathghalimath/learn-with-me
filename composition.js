"use strict";
/* Only absolute M/L/C coordinate pairs occur in the source centreline library.
 * English composition uses translation alone, so y=70/160/250/340 never moves.
 * A larger viewBox makes room for words; no letter is horizontally compressed. */
window.HANDWRITING = (() => {
  function transform(stroke, scale = 1, dx = 0, dy = 0) {
    if (/[^MLC\d.\s-]/.test(stroke.d))
      throw new Error("Unsupported path command");
    let axis = 0;
    return {
      ...stroke,
      d: stroke.d.replace(/-?\d+(?:\.\d+)?/g, (n) =>
        String(Number((Number(n) * scale + (axis++ % 2 ? dy : dx)).toFixed(5))),
      ),
      ...(stroke.strokeWidth
        ? { strokeWidth: stroke.strokeWidth * scale }
        : {}),
    };
  }
  function bounds(character) {
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.style.cssText = "position:absolute;width:0;height:0;overflow:hidden";
    document.body.append(svg);
    const boxes = character.strokes.map((stroke) => {
      const p = document.createElementNS(svg.namespaceURI, "path");
      p.setAttribute("d", stroke.d);
      svg.append(p);
      return p.getBBox();
    });
    const left = Math.min(...boxes.map((b) => b.x));
    const top = Math.min(...boxes.map((b) => b.y));
    const right = Math.max(...boxes.map((b) => b.x + b.width));
    const bottom = Math.max(...boxes.map((b) => b.y + b.height));
    svg.remove();
    return {
      left,
      right,
      top,
      bottom,
      width: right - left,
      height: bottom - top,
    };
  }
  function compose(text, lookup) {
    const letters = [...text].map((c) => lookup[c]);
    const boxes = letters.map(bounds);
    const gap = 38,
      margin = 70;
    const contentWidth =
      boxes.reduce((sum, b) => sum + b.width, 0) + gap * (letters.length - 1);
    const viewportWidth = Math.max(400, contentWidth + margin * 2);
    let cursor = (viewportWidth - contentWidth) / 2;
    const strokes = [],
      components = [];
    letters.forEach((letter, index) => {
      const dx = cursor - boxes[index].left;
      components.push({
        name: letter.name,
        dx,
        scale: 1,
        dy: 0,
        firstStroke: strokes.length,
        strokeCount: letter.strokes.length,
      });
      letter.strokes.forEach((s, j) =>
        strokes.push({
          ...transform(s, 1, dx),
          characterIndex: index,
          characterName: letter.name,
          beginsCharacter: j === 0,
        }),
      );
      cursor += boxes[index].width + gap;
    });
    return {
      name: text,
      announcement: text,
      strokes,
      viewportWidth,
      components,
    };
  }
  return { transform, bounds, compose };
})();
