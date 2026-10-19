import katex from "katex";

const escape = (text: string) =>
  text.replace(
    /[&<>"']/g,
    (c) =>
      ({
        "&": "&amp;",
        "<": "&lt;",
        ">": "&gt;",
        '"': "&quot;",
        "'": "&#39;",
      })[c]!,
  );

const cache = new Map<string, string>();

/** Authored prose uses \(inline\) and \[display\] math, never raw HTML. */
export function mathProse(source: string): string {
  const cached = cache.get(source);
  if (cached) return cached;
  let paragraph = "",
    html = "",
    cursor = 0;
  const flush = () => {
    if (paragraph.trim()) html += `<p>${paragraph.trim()}</p>`;
    paragraph = "";
  };
  for (const match of source.matchAll(
    /\\\(([\s\S]*?)\\\)|\\\[([\s\S]*?)\\\]/g,
  )) {
    paragraph += escape(source.slice(cursor, match.index));
    const display = match[2] !== undefined;
    const math = katex.renderToString(match[2] ?? match[1], {
      displayMode: display,
      output: "htmlAndMathml",
      throwOnError: true,
      strict: "error",
      trust: false,
      maxExpand: 1000,
    });
    if (display) {
      flush();
      // The scroll region keeps large expressions reachable at narrow widths/zoom.
      html += `<div class="math-display" role="group" aria-label="Equation" tabindex="0">${math}</div>`;
    } else paragraph += math;
    cursor = match.index! + match[0].length;
  }
  paragraph += escape(source.slice(cursor));
  flush();
  cache.set(source, html);
  return html;
}
