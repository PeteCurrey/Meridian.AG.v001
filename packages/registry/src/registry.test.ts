import test from "node:test";
import assert from "node:assert/strict";
import { SourceRegistry } from "./index.ts";
import { Pillar } from "../../core/src/source.ts";

test("SourceRegistry loads all ~18 Wave 1 sources", () => {
  const registry = new SourceRegistry();
  const allSources = registry.listAll();

  assert.ok(allSources.length >= 18, `Expected at least 18 sources, got ${allSources.length}`);
  
  const worldSources = registry.listByPillar(Pillar.WORLD);
  assert.ok(worldSources.length > 0);
  assert.equal(registry.getSource("fred")?.name, "Federal Reserve Economic Data (FRED)");
});
