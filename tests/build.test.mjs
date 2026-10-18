import assert from "node:assert/strict";
import { existsSync, readFileSync } from "node:fs";
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
