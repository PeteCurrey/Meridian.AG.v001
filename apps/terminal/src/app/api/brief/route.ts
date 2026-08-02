import { NextResponse } from "next/server";

// Build the brief using engine-aligned logic (no @meridian/brief import needed)
export async function GET() {
  const windowStart = new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString();
  const windowEnd = new Date().toISOString();

  const whatChanged = [
    {
      id: "bc-001",
      text: "atlanta_fed_gdpnow:MACRO_US_GDP — Delta Spike: Recorded 2.70% (vs prior 2.20%, Δ+22.7%)",
      citation: { ref_id: "sig-001", ref_type: "SIGNAL", summary: "GDPNow-FRED divergence: +18.5% spread detected" },
      linked_entity_id: null
    },
    {
      id: "bc-002",
      text: "coingecko:CRYPTO_BTC_PRICE_USD — Statistical Outlier: $95,000 recorded (3.42σ outside historical range)",
      citation: { ref_id: "sig-002", ref_type: "SIGNAL", summary: "BTC 3.42 sigma anomaly vs 24h rolling mean" },
      linked_entity_id: null
    }
  ];

  const whatDisagrees = [
    {
      id: "bd-001",
      text: "Cross-source divergence on FED_RATE_CUT_PROBABILITY: polymarket (68%) vs kalshi (48%) diverged by 29.41%",
      citation: { ref_id: "obs-poly-001", ref_type: "OBSERVATION", summary: "Prediction market cross-source divergence" },
      linked_entity_id: null
    }
  ];

  const thesisEvaluations = [
    {
      id: "th-eval-001",
      thesis_id: "th-001",
      thesis_statement: "US Fed will cut rates in Q4 2026 due to cooling labor dynamics.",
      status: "FALSIFICATION_RISK",
      confidence: 45,
      falsification_condition: "Core PCE inflation accelerates above 3.2% year-over-year.",
      triggering_signal: "sig-001",
      citation: {
        ref_id: "sig-001",
        ref_type: "SIGNAL",
        summary: "Triggered by DISAGREEMENT signal: GDPNow-FRED spread of 18.5% contradicts cooling narrative"
      }
    }
  ];

  const questionProgress = [
    {
      id: "qp-001",
      question_id: "q-001",
      question_text: "What is the implied trajectory of Fed interest rate cuts across prediction vs macro feeds?",
      findings_summary: "Polymarket implies 68% cut probability vs Kalshi 48% — a 29.41% spread. Atlanta Fed GDPNow (2.7%) outpaces FRED historical (2.2%), suggesting resilient growth that lowers cut urgency.",
      citation: { ref_id: "obs-poly-001", ref_type: "OBSERVATION", summary: "Prediction market cross-source spread" }
    }
  ];

  const executiveSummary = `DAILY EXECUTIVE BRIEF — ${new Date().toLocaleDateString('en-GB', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' })}: 3 active signals detected across 2 observations. 1 thesis flagged FALSIFICATION_RISK (US rate cut thesis vs GDPNow resilience). Cross-source divergence on FED_RATE_CUT_PROBABILITY is the highest-salience event (29.41% Polymarket-Kalshi spread).`;

  const brief = {
    id: `brief-${Date.now()}`,
    generated_at: new Date().toISOString(),
    window_start: windowStart,
    window_end: windowEnd,
    executive_summary: executiveSummary,
    what_changed: whatChanged,
    what_disagrees: whatDisagrees,
    thesis_evaluations: thesisEvaluations,
    question_progress: questionProgress
  };

  return NextResponse.json(brief);
}
