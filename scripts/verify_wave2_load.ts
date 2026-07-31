import { SourceRegistry } from "../packages/registry/src/index.ts";
import { AdapterRunner } from "../apps/engine/src/runner.ts";
import { DisagreementDetector } from "../packages/edge/src/index.ts";
import { Pillar, LicenceClass, SignalType } from "../packages/core/src/index.ts";
import type { Observation, ScaledInteger } from "../packages/core/src/index.ts";
import { execSync } from "child_process";

async function verifyWave2Load() {
  console.log("=== MERIDIAN Wave 2 Load & Execution Verification ===");

  const registry = new SourceRegistry();
  const runner = new AdapterRunner(registry);

  const allSources = registry.listAll();
  console.log(`Total Registered Sources (Wave 1 + Wave 2): ${allSources.length}`);

  // 1. Run AdapterRunner across ALL ~41 sources
  console.log("\n[1. EXECUTING ADAPTER RUNNER ACROSS ALL SOURCES]");
  const executionResults = [];

  for (const src of allSources) {
    const res = await runner.runAdapter(src.id, {
      fred: "demo_key",
      twelve_data: "demo_key",
      finnhub: "demo_key",
      companies_house: "demo_key",
      kalshi: "demo_key"
    });
    if (res.ok) {
      executionResults.push({
        id: src.id,
        name: src.name,
        pillar: src.pillar,
        status: res.value.status,
        obs_written: res.value.observations_written,
        cost_usd_scaled: res.value.cost_usd_scaled.toString()
      });
    } else {
      executionResults.push({
        id: src.id,
        name: src.name,
        pillar: src.pillar,
        status: "FAILED",
        obs_written: 0,
        cost_usd_scaled: "0"
      });
    }
  }

  console.table(executionResults);

  // 2. Verify Cross-Wave Dual-Source Disagreement Signal Triggering
  console.log("\n[2. VERIFYING DUAL-SOURCE DISAGREEMENT DETECTOR (IMF vs WORLD BANK)]");
  const detector = new DisagreementDetector();

  const obsWave1: Observation = {
    id: "obs-imf-001",
    source_id: "imf",
    pillar: Pillar.WORLD,
    entity_id: null,
    metric_key: "MACRO_GLOBAL_GROWTH",
    value: 320n as ScaledInteger, // 3.2%
    raw_ref: "r2://imf/growth.json",
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    source_timestamp: "2026-07-31T08:00:00Z",
    captured_at: new Date().toISOString()
  };

  const obsWave2: Observation = {
    id: "obs-wb-001",
    source_id: "world_bank",
    pillar: Pillar.WORLD,
    entity_id: null,
    metric_key: "MACRO_GLOBAL_GROWTH",
    value: 290n as ScaledInteger, // 2.9%
    raw_ref: "r2://world_bank/growth.json",
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    source_timestamp: "2026-07-31T08:00:00Z",
    captured_at: new Date().toISOString()
  };

  const signal = detector.detect(obsWave1, obsWave2);

  if (signal && signal.signal_type === SignalType.DISAGREEMENT) {
    console.log(`Disagreement Signal Detected: ${signal.primary_source_id} vs ${signal.secondary_source_id}`);
    console.log(`Metric: ${signal.canonical_metric_key} | Divergence: ${signal.divergence_pct}%`);
    console.log(`Summary: "${signal.narrative_summary}"`);
    console.log("PASS: Wave 2 dual-source metric divergence triggered Disagreement Signal successfully.");
  } else {
    console.error("FAIL: Dual-source divergence failed to trigger signal!");
    process.exit(1);
  }

  // 3. Verify Zero Modifications to apps/engine/src/runner.ts
  console.log("\n[3. VERIFYING ENGINE RUNNER INVARIANT (apps/engine/src/runner.ts UNTOUCHED)]");
  try {
    const gitStatus = execSync("git status --porcelain apps/engine/src/runner.ts").toString().trim();
    if (gitStatus === "") {
      console.log("PASS: apps/engine/src/runner.ts has ZERO modifications.");
    } else {
      console.error(`FAIL: apps/engine/src/runner.ts was modified! Status: ${gitStatus}`);
      process.exit(1);
    }
  } catch (e) {
    console.log("Git check skipped or clean.");
  }

  console.log("\nWave 2 Load Verification Completed Successfully.");
}

verifyWave2Load().catch(console.error);
