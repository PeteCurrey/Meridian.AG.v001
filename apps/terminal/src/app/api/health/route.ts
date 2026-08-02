import { NextResponse } from "next/server";
import { SourceRegistry } from "@meridian/registry";
import { AdapterRunner } from "@meridian/engine";

const globalRegistry = new SourceRegistry();
const globalRunner = new AdapterRunner(globalRegistry);

let initialized = false;

async function prewarmHealthState() {
  if (!initialized) {
    initialized = true;

    const envKeys: Record<string, string> = {
      fred: process.env.FRED_API_KEY || "",
      twelve_data: process.env.TWELVE_DATA_API_KEY || "",
      finnhub: process.env.FINNHUB_API_KEY || "",
      eia: process.env.EIA_API_KEY || "",
      sec_edgar: process.env.SEC_EDGAR_USER_AGENT || "MERIDIAN petecurrey@googlemail.com",
      usaspending: "NONE_REQUIRED",
      kalshi: process.env.KALSHI_API_KEY || "",
      gdelt: "NONE_REQUIRED",
      us_treasury_fiscal: "NONE_REQUIRED",
      ny_fed: "NONE_REQUIRED",
      atlanta_fed_gdpnow: "NONE_REQUIRED",
      cleveland_fed_nowcast: "NONE_REQUIRED",
      coingecko: process.env.COINGECKO_API_KEY || "",
      defillama: "NONE_REQUIRED",
      polymarket: "NONE_REQUIRED"
    };

    const runList = ["fred", "twelve_data", "finnhub", "sec_edgar", "usaspending", "kalshi", "gdelt", "coingecko", "defillama", "polymarket"];
    for (const src of runList) {
      try {
        await globalRunner.runAdapter(src, envKeys);
      } catch (err) {
        console.error(`Adapter run error for ${src}:`, err);
      }
    }
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
      sla_seconds: source.sla_seconds,
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
    healthy_count: combinedBoard.filter(s => s.status === "HEALTHY").length,
    sources: combinedBoard
  });
}

