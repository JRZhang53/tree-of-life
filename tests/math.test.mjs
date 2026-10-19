import assert from "node:assert/strict";
import { test } from "node:test";
import { methods } from "../src/content/methods.ts";
import { depthNote } from "../src/content/depth.ts";
import { experiments } from "../src/content/taxonomy.ts";
import { mathProse } from "../src/presentation/math.ts";

test("all authored model math parses strictly and exposes accessible MathML", () => {
  let equations = 0;
  for (const [id, modes] of Object.entries(experiments)) {
    for (let mode = 0; mode < modes.length; mode++) {
      const note = depthNote(id, mode) ?? methods[id];
      for (const key of ["equation", "scale", "compare"]) {
        const html = mathProse(note[key]);
        assert.doesNotMatch(html, /katex-error/);
        if (/\\[([]/.test(note[key])) {
          equations++;
          assert.match(html, /<math[\s>]/);
          assert.match(html, /aria-hidden="true"/);
        }
        assert.doesNotMatch(html, /<p>\s*<div/);
      }
    }
  }
  assert.ok(
    equations >= 20,
    "exercise inline math and display math across modes",
  );
});

test("math prose preserves surrounding text, separates displays, and escapes HTML", () => {
  const html = mathProse(
    String.raw`First \(x_i\). \[\frac{a}{b}\] Last <script>alert(1)</script>.`,
  );
  assert.match(html, /^<p>First /);
  assert.match(html, /<\/p><div class="math-display"/);
  assert.match(html, /tabindex="0"/);
  assert.match(html, /<p>Last &lt;script&gt;/);
  assert.doesNotMatch(html, /<script>/);
  assert.throws(() => mathProse(String.raw`\[\notARealMathCommand{x}\]`));
});
