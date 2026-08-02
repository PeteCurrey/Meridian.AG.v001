import { NextResponse } from "next/server";
import { SourceRegistry } from "@meridian/registry";
import { AdapterRunner } from "@meridian/engine";

// Singleton runner instance for API health board state
const globalRegistry = new SourceRegistry();
const globalRunner = new AdapterRunner(globalRegistry);

// Pre-warm real adapters with configured keys
const MOCK_API_KEYS = {
  fred: "MOCK_FRED_API_KEY",
  twelve_data: "MOCK_TWELVE_DATA_KEY",
  sec_edgar: "NONE_REQUIRED",
  usaspending: "NONE_REQUIRED",
  kalshi: "MOCK_KALSHI_KEY",
  gdelt: "NONE_REQUIRED"
};

let initialized = false;

async function prewarmHealthState() {
  if (!initialized) {
    initialized = true;
    await globalRunner.runAdapter("fred", MOCK_API_KEYS);
    await globalRunner.runAdapter("twelve_data", MOCK_API_KEYS);
    await globalRunner.runAdapter("sec_edgar", MOCK_API_KEYS);
    await globalRunner.runAdapter("usaspending", MOCK_API_KEYS);
    await globalRunner.runAdapter("kalshi", MOCK_API_KEYS);
    await globalRunner.runAdapter("gdelt", MOCK_API_KEYS);
  }
}

export async function GET() {
  await prewarmHealthState();

  const allSources = globalRegistry.listAll();
  const healthList = globalRunner.listAllSourceHealth();

  const combinedBoard = allSources.map(source => {
    const health = healthList.find(h => h.source_id === source.id);
    const status = health ? health.status : "NOT_CONNECTED";

    return {
      source_id: source.id,
      name: source.name,
      pillar: source.pillar,
      cadence: source.cadence,
      staleness_sla_seconds: source.sla_seconds,
      status: status,
      last_successful_fetch: health?.last_successful_fetch || null,
      error_rate_24h: health?.error_rate_24h || 0.0,
      rows_written_last_window: health?.rows_written_last_window || 0,
      quota_consumed_mtd: health?.quota_consumed_mtd || 0,
      cost_mtd_usd_scaled: (health?.cost_mtd_usd_scaled || 0n).toString(),
      last_checked_at: health?.last_checked_at || new Date().toISOString(),
      reason: status === "NOT_CONNECTED" ? "Missing API Key or Adapter Unbound" : null
    };
  });

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    total_sources: combinedBoard.length,
    sources: combinedBoard
  });
}
