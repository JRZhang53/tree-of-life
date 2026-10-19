import assert from "node:assert/strict";
import { existsSync, readFileSync, readdirSync } from "node:fs";
import { resolve, sep } from "node:path";
import { test } from "node:test";

test("built entry uses the domain subpath and all entry assets exist", () => {
  const root = resolve("dist");
  const html = readFileSync(resolve(root, "index.html"), "utf8");
  const assets = [...html.matchAll(/(?:src|href)="([^"]+)"/g)]
    .map((match) => match[1])
    .filter((url) => !/^(https?:|#|data:)/.test(url));
  assert.ok(assets.length > 0, "expected compiled assets");
  for (const asset of assets) {
    assert.ok(
      asset.startsWith("/fun/tree-of-life/"),
      `incorrect base: ${asset}`,
    );
    const path = resolve(root, asset.slice("/fun/tree-of-life/".length));
    assert.ok(path.startsWith(root + sep));
    assert.ok(existsSync(path), `missing asset: ${asset}`);
  }
  assert.equal(
    existsSync(resolve(root, "CNAME")),
    false,
    "the portfolio owns the domain",
  );
});

test("math fonts ship locally under the production base path", () => {
  const root = resolve("dist");
  const css = readdirSync(resolve(root, "assets"))
    .filter((file) => file.endsWith(".css"))
    .map((file) => readFileSync(resolve(root, "assets", file), "utf8"))
    .join("\n");
  const fonts = [...css.matchAll(/url\(([^)]+)\)/g)]
    .map((m) => m[1].replace(/["']/g, ""))
    .filter((url) => /KaTeX.*\.(woff2?|ttf)$/.test(url));
  assert.ok(fonts.length > 0, "expected bundled math fonts");
  for (const font of fonts) {
    assert.ok(font.startsWith("/fun/tree-of-life/assets/"), font);
    assert.ok(
      existsSync(resolve(root, font.slice("/fun/tree-of-life/".length))),
      font,
    );
  }
});
