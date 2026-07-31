import { BriefEngine } from "../packages/brief/src/index.ts";
import { Pillar, LicenceClass, SignalType, SignalSeverity, SignalStatus } from "../packages/core/src/index.ts";
import type { Signal, Observation, BookThesis, BookQuestion, ScaledInteger } from "../packages/core/src/index.ts";

async function verifyBriefGeneration() {
  console.log("=== MERIDIAN Daily Brief Generation & Provenance Graph Verification ===");

  const briefEngine = new BriefEngine();

  // 1. Mock 24h Observation Stream
  const observations: Observation[] = [
    {
      id: "obs-gdp-001",
      source_id: "fred",
      pillar: Pillar.WORLD,
      entity_id: null,
      metric_key: "FRED_GDP",
      value: 2850000n as ScaledInteger,
      raw_ref: "r2://fred/gdp.json",
      licence_class: LicenceClass.PUBLIC_DOMAIN,
      source_timestamp: "2026-07-31T08:00:00Z",
      captured_at: new Date().toISOString()
    },
    {
      id: "obs-poly-001",
      source_id: "polymarket",
      pillar: Pillar.ALTERNATIVES,
      entity_id: "e-apex-tech-001",
      metric_key: "FED_RATE_CUT_PROBABILITY",
      value: 68n as ScaledInteger,
      raw_ref: "r2://poly/cuts.json",
      licence_class: LicenceClass.COMMERCIAL_FREE,
      source_timestamp: "2026-07-31T09:00:00Z",
      captured_at: new Date().toISOString()
    }
  ];

  // 2. Mock 24h Signals
  const signals: Signal[] = [
    {
      id: "sig-disag-001",
      signal_type: SignalType.DISAGREEMENT,
      canonical_metric_key: "FED_RATE_CUT_PROBABILITY",
      pillar: Pillar.ALTERNATIVES,
      severity: SignalSeverity.CRITICAL,
      confidence: 95,
      primary_source_id: "polymarket",
      secondary_source_id: "kalshi",
      delta_value: 20,
      z_score: null,
      divergence_pct: 29.41,
      overrun_seconds: null,
      narrative_summary: "Cross-Source Disagreement: Polymarket (68%) vs Kalshi (48%) diverged by 29.41%",
      linked_entity_id: "e-apex-tech-001",
      touches_thesis_falsification: true,
      salience_score: 310.0,
      status: SignalStatus.UNREAD,
      detected_at: new Date().toISOString()
    },
    {
      id: "sig-ano-001",
      signal_type: SignalType.ANOMALY,
      canonical_metric_key: "CRYPTO_BTC_PRICE_USD",
      pillar: Pillar.MARKETS,
      severity: SignalSeverity.ALERT,
      confidence: 90,
      primary_source_id: "coingecko",
      secondary_source_id: null,
      delta_value: 4500,
      z_score: 4.0,
      divergence_pct: null,
      overrun_seconds: null,
      narrative_summary: "Statistical Outlier: coingecko:CRYPTO_BTC_PRICE_USD recorded $95,000 (4.00 sigma outside range)",
      linked_entity_id: null,
      touches_thesis_falsification: false,
      salience_score: 180.0,
      status: SignalStatus.UNREAD,
      detected_at: new Date().toISOString()
    }
  ];

  // 3. Mock The Book Context (Theses & Questions)
  const theses: BookThesis[] = [
    {
      id: "th-fed-001",
      text: "US Fed will cut rates in Q4 2026 due to cooling labor dynamics.",
      linked_entity_ids: ["e-apex-tech-001"],
      falsification_condition: "Prediction market divergence > 25% or Core PCE > 3.2%",
      review_date: "2026-10-01",
      confidence: 75,
      created_at: "2026-07-01T00:00:00Z"
    }
  ];

  const questions: BookQuestion[] = [
    {
      id: "q-fed-001",
      question_text: "What is the implied trajectory of Fed interest rate cuts across prediction vs macro feeds?",
      category: "MACRO_POLICY",
      cadence: "WEEKLY",
      active: true
    }
  ];

  // Generate Daily Brief
  const brief = briefEngine.generateBrief(
    "2026-07-30T10:00:00Z",
    "2026-07-31T10:00:00Z",
    signals,
    observations,
    theses,
    questions
  );

  console.log("\n================================================================================");
  console.log(`EXECUTIVE SUMMARY: ${brief.executive_summary}`);
  console.log("================================================================================\n");

  console.log("--- SECTION 1: WHAT CHANGED ---");
  for (const item of brief.what_changed) {
    console.log(`- ${item.text}`);
    console.log(`  [CITATION PROVENANCE]: ${item.citation.ref_type} ID: ${item.citation.ref_id}`);
  }

  console.log("\n--- SECTION 2: WHAT DISAGREES ---");
  for (const item of brief.what_disagrees) {
    console.log(`- ${item.text}`);
    console.log(`  [CITATION PROVENANCE]: ${item.citation.ref_type} ID: ${item.citation.ref_id}`);
  }

  console.log("\n--- SECTION 3: THESIS STATUS ---");
  for (const th of brief.thesis_evaluations) {
    console.log(`- THESIS: "${th.thesis_statement}"`);
    console.log(`  STATUS: [${th.status}] | Confidence: ${th.confidence}%`);
    console.log(`  FALSIFICATION CONDITION: ${th.falsification_condition}`);
    console.log(`  [CITATION PROVENANCE]: ${th.citation.ref_type} ID: ${th.citation.ref_id} (${th.citation.summary})`);
  }

  console.log("\n--- SECTION 4: STANDING QUESTION PROGRESS ---");
  for (const q of brief.question_progress) {
    console.log(`- QUESTION: "${q.question_text}"`);
    console.log(`  FINDING: ${q.findings_summary}`);
    console.log(`  [CITATION PROVENANCE]: ${q.citation.ref_type} ID: ${q.citation.ref_id}`);
  }

  // 4. Assert Citation Provenance Invariant
  const allCitations = [
    ...brief.what_changed.map(i => i.citation),
    ...brief.what_disagrees.map(i => i.citation),
    ...brief.thesis_evaluations.map(i => i.citation),
    ...brief.question_progress.map(i => i.citation)
  ];

  const uncitedCount = allCitations.filter(c => !c.ref_id || c.ref_id.trim().length === 0).length;

  if (uncitedCount === 0) {
    console.log("\nPASS: 100% of statements in The Brief carry valid observation_id or signal_id citation references.");
  } else {
    console.error(`\nFAIL: Found ${uncitedCount} uncited statements in The Brief!`);
    process.exit(1);
  }

  // 5. Assert Thesis Falsification Risk Triggering Evidence
  const riskThesis = brief.thesis_evaluations.find(t => t.status === "FALSIFICATION_RISK");
  if (riskThesis && riskThesis.triggering_signal) {
    console.log("\nPASS: Thesis successfully flagged as 'FALSIFICATION_RISK' with triggering signal:");
    console.log(`  Triggering Signal ID: ${riskThesis.triggering_signal.id}`);
    console.log(`  Signal Type: ${riskThesis.triggering_signal.signal_type}`);
    console.log(`  Divergence: ${riskThesis.triggering_signal.divergence_pct}%`);
  } else {
    console.error("\nFAIL: Thesis was not properly flagged with FALSIFICATION_RISK!");
    process.exit(1);
  }
}

verifyBriefGeneration().catch(console.error);
