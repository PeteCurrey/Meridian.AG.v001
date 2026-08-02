import { NextResponse } from "next/server";
import { supabaseSelect } from "@/lib/supabase";

interface Signal {
  id: string;
  signal_type: string;
  canonical_metric_key: string;
  pillar: string;
  severity: string;
  confidence: number;
  primary_source_id: string;
  secondary_source_id: string | null;
  delta_value: number | null;
  z_score: number | null;
  divergence_pct: number | null;
  overrun_seconds: number | null;
  narrative_summary: string;
  linked_entity_id: string | null;
  touches_thesis_falsification: boolean;
  salience_score: number;
  status: string;
  detected_at: string;
}

const fallbackSignals: Signal[] = [
  {
    id: "sig-001",
    signal_type: "DISAGREEMENT",
    canonical_metric_key: "MACRO_US_GDP",
    pillar: "WORLD",
    severity: "CRITICAL",
    confidence: 95,
    primary_source_id: "atlanta_fed_gdpnow",
    secondary_source_id: "fred",
    delta_value: 120,
    z_score: null,
    divergence_pct: 18.5,
    overrun_seconds: null,
    narrative_summary: "Cross-Source Disagreement: GDPNow (2.7%) vs FRED Historical (2.2%) — 18.50% divergence on MACRO_US_GDP",
    linked_entity_id: "e-apex-tech-001",
    touches_thesis_falsification: true,
    salience_score: 290.0,
    status: "UNREAD",
    detected_at: new Date().toISOString()
  },
  {
    id: "sig-002",
    signal_type: "ANOMALY",
    canonical_metric_key: "CRYPTO_BTC_PRICE_USD",
    pillar: "MARKETS",
    severity: "ALERT",
    confidence: 90,
    primary_source_id: "coingecko",
    secondary_source_id: null,
    delta_value: 4500,
    z_score: 3.42,
    divergence_pct: null,
    overrun_seconds: null,
    narrative_summary: "Statistical Outlier: coingecko:CRYPTO_BTC_PRICE_USD recorded $95,000 (3.42σ outside historical range)",
    linked_entity_id: null,
    touches_thesis_falsification: false,
    salience_score: 165.0,
    status: "UNREAD",
    detected_at: new Date().toISOString()
  },
  {
    id: "sig-003",
    signal_type: "ABSENCE",
    canonical_metric_key: "TWELVE_DATA_FEED_ABSENCE",
    pillar: "MARKETS",
    severity: "WARN",
    confidence: 100,
    primary_source_id: "twelve_data",
    secondary_source_id: null,
    delta_value: null,
    z_score: null,
    divergence_pct: null,
    overrun_seconds: 420,
    narrative_summary: "SLA Overrun: Source 'twelve_data' failed to emit within 300s SLA (overrun by 420s)",
    linked_entity_id: null,
    touches_thesis_falsification: false,
    salience_score: 90.0,
    status: "UNREAD",
    detected_at: new Date().toISOString()
  },
  {
    id: "sig-004",
    signal_type: "DISAGREEMENT",
    canonical_metric_key: "FED_RATE_CUT_PROBABILITY",
    pillar: "ALTERNATIVES",
    severity: "CRITICAL",
    confidence: 98,
    primary_source_id: "polymarket",
    secondary_source_id: "kalshi",
    delta_value: null,
    z_score: null,
    divergence_pct: 29.41,
    overrun_seconds: null,
    narrative_summary: "Cross-Source Divergence: polymarket (68%) vs kalshi (48%) — 29.41% spread on FED_RATE_CUT_PROBABILITY",
    linked_entity_id: null,
    touches_thesis_falsification: true,
    salience_score: 310.0,
    status: "UNREAD",
    detected_at: new Date().toISOString()
  }
];

export async function GET() {
  const dbSignals = await supabaseSelect<Signal>("signals", "*", 50);
  const signalList = (dbSignals && dbSignals.length > 0) ? dbSignals : fallbackSignals;

  return NextResponse.json({
    timestamp: new Date().toISOString(),
    total_signals: signalList.length,
    signals: signalList,
    persisted: !!(dbSignals && dbSignals.length > 0)
  });
}
