import test from "node:test";
import assert from "node:assert/strict";
import { SourceRegistry } from "../../../packages/registry/src/index.ts";
import { AdapterRunner } from "./runner.ts";
import { IdempotentBackfillEngine } from "../../scheduler/src/backfill.ts";
import { SourceHealthStatus } from "../../../packages/core/src/index.ts";

test("AdapterRunner runs all 5 real adapters + 6th GDELT adapter successfully", async () => {
  const registry = new SourceRegistry();
  const runner = new AdapterRunner(registry);

  const apiKeys = {
    fred: "MOCK_FRED_KEY",
    twelve_data: "MOCK_TWELVE_KEY",
    sec_edgar: "NONE",
    usaspending: "NONE",
    kalshi: "MOCK_KALSHI_KEY",
    gdelt: "NONE"
  };

  const sourcesToTest = ["fred", "twelve_data", "sec_edgar", "usaspending", "kalshi", "gdelt"];

  for (const srcId of sourcesToTest) {
    const res = await runner.runAdapter(srcId, apiKeys);
    assert.equal(res.ok, true);
    if (res.ok) {
      assert.equal(res.value.status, SourceHealthStatus.HEALTHY);
      assert.ok(res.value.observations_written > 0);
      assert.ok(res.value.raw_ref?.startsWith("r2://payloads/"));
    }
  }
});

test("Missing API key produces NOT_CONNECTED state; restoring key recovers state", async () => {
  const registry = new SourceRegistry();
  const runner = new AdapterRunner(registry);

  // 1. Missing API Key for FRED
  const run1 = await runner.runAdapter("fred", {});
  assert.equal(run1.ok, true);
  if (run1.ok) {
    assert.equal(run1.value.status, SourceHealthStatus.NOT_CONNECTED);
    assert.equal(run1.value.observations_written, 0);
  }

  // Verify Health Board Status
  const health1 = runner.getSourceHealth("fred");
  assert.equal(health1?.status, SourceHealthStatus.NOT_CONNECTED);

  // 2. Restore API Key
  const run2 = await runner.runAdapter("fred", { fred: "RESTORED_KEY" });
  assert.equal(run2.ok, true);
  if (run2.ok) {
    assert.equal(run2.value.status, SourceHealthStatus.HEALTHY);
    assert.ok(run2.value.observations_written > 0);
  }

  const health2 = runner.getSourceHealth("fred");
  assert.equal(health2?.status, SourceHealthStatus.HEALTHY);
});

test("Idempotent backfill replaying same window twice produces 0 extra rows", async () => {
  const registry = new SourceRegistry();
  const runner = new AdapterRunner(registry);
  const backfillEngine = new IdempotentBackfillEngine(registry, runner);

  const window = { start_iso: "2026-07-01T00:00:00Z", end_iso: "2026-07-02T00:00:00Z" };
  const keys = { fred: "MOCK_KEY" };

  // First run
  const pass1 = await backfillEngine.executeBackfill("fred", window, keys);
  assert.equal(pass1.ok, true);
  if (pass1.ok) {
    assert.equal(pass1.value.inserted_count, 1);
    assert.equal(pass1.value.duplicates_skipped, 0);
  }

  // Second run (identical window)
  const pass2 = await backfillEngine.executeBackfill("fred", window, keys);
  assert.equal(pass2.ok, true);
  if (pass2.ok) {
    assert.equal(pass2.value.inserted_count, 0);
    assert.equal(pass2.value.duplicates_skipped, 1);
  }

  // Total DB count remains unchanged
  assert.equal(backfillEngine.getStoredObservationCount(), 1);
});
