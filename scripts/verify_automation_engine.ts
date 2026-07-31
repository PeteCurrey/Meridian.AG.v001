import { AutomationEngine } from "../apps/scheduler/src/automation_engine.ts";
import { SourceRegistry } from "../packages/registry/src/index.ts";
import { AdapterRunner } from "../apps/engine/src/runner.ts";

async function verifyAutomationEngine() {
  console.log("=== MERIDIAN Background Automation Engine Verification ===");

  const registry = new SourceRegistry();
  const runner = new AdapterRunner(registry);
  const engine = new AutomationEngine(registry, runner);

  const apiKeys: Record<string, string> = {
    fred: "demo_key",
    us_treasury_fiscal: "public_key",
    ny_fed: "public_key",
    atlanta_fed_gdpnow: "public_key",
    cleveland_fed_nowcast: "public_key",
    gdelt: "public_key",
    eia: "demo_key",
    twelve_data: "demo_key",
    finnhub: "demo_key",
    cftc_cot: "public_key",
    fca_short_positions: "public_key",
    coingecko: "demo_key",
    defillama: "public_key",
    sec_edgar: "demo_key",
    nasdaq_ipo_calendar: "public_key",
    companies_house: "demo_key",
    usaspending: "demo_key",
    gleif: "public_key",
    opencorporates: "demo_key",
    kalshi: "demo_key",
    polymarket: "public_key",
    manifold: "public_key"
  };

  // 1. Run Full Ingestion Pass over Wave 1 Sources
  console.log("\n[1. RUNNING FULL PASS OF ALL WAVE 1 SOURCES]");
  const passResult = await engine.runFullWave1IngestionPass(apiKeys);

  // 2. Run Edge Detection Pass
  await engine.runEdgeDetectionPass();

  // 3. Run Daily Brief Generation Pass
  await engine.runDailyBriefPass();

  console.log("\n[PRODUCED AUDIT LOG ENTRIES]");
  console.log("--------------------------------------------------------------------------------");
  const auditLogs = engine.getAuditLog().map(l => ({
    job_name: l.job_name,
    trigger: l.trigger_type,
    status: l.status,
    duration_ms: `${l.duration_ms}ms`,
    rows_processed: l.rows_processed,
    cost_usd_scaled: l.cost_usd_scaled.toString(),
    timestamp: l.timestamp
  }));
  console.table(auditLogs);

  // 4. Activate Kill Switch and Trigger Scheduled Job
  console.log("\n[2. ACTIVATING EMERGENCY KILL SWITCH & TRIGGERING SCHEDULED JOB]");
  engine.setKillSwitch(true);

  const rejectedPass = await engine.runFullWave1IngestionPass(apiKeys);

  if (!rejectedPass.ok) {
    console.log("Rejection Error Message:", rejectedPass.error.message);
    console.log("PASS: Scheduled job triggered while Kill Switch active was REJECTED immediately.");
  } else {
    console.error("FAIL: Scheduled job ran despite active Kill Switch!");
    process.exit(1);
  }

  // 5. Test Tier 1 Guard failing closed on external action
  console.log("\n[3. VERIFYING TIER 1 GUARD FAILS CLOSED ON EXTERNAL ACTION]");
  const tradeResult = await engine.executeTradeAction();
  if (!tradeResult.ok) {
    console.log("Tier Guard Error Message:", tradeResult.error.message);
    console.log("PASS: External trade action attempted under Tier 1 FAILED CLOSED as required.");
  } else {
    console.error("FAIL: External trade action succeeded under Tier 1!");
    process.exit(1);
  }

  console.log("\nAutomation Engine Verification Completed Successfully.");
}

verifyAutomationEngine().catch(console.error);
