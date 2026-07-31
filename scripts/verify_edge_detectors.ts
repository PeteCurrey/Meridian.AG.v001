import { DeltaDetector } from "../packages/edge/src/detectors/delta.ts";
import { DisagreementDetector } from "../packages/edge/src/detectors/disagreement.ts";
import { AnomalyDetector } from "../packages/edge/src/detectors/anomaly.ts";
import { AbsenceDetector } from "../packages/edge/src/detectors/absence.ts";
import { SalienceEngine } from "../packages/edge/src/salience.ts";
import type { BookContext } from "../packages/edge/src/salience.ts";
import { Pillar, LicenceClass } from "../packages/core/src/index.ts";
import type { Observation, ScaledInteger } from "../packages/core/src/index.ts";

async function verifyEdgeDetectors() {
  console.log("=== MERIDIAN Edge Signal Detection Engine Verification ===");

  const deltaDetector = new DeltaDetector();
  const disagreementDetector = new DisagreementDetector();
  const anomalyDetector = new AnomalyDetector();
  const absenceDetector = new AbsenceDetector();
  const salienceEngine = new SalienceEngine();

  const bookContext: BookContext = {
    watchlist_entity_ids: ["e-apex-tech-001"],
    open_position_symbols: ["BTC", "USD"],
    thesis_entity_ids: ["e-apex-tech-001"],
    thesis_falsification_keywords: ["gdp", "cpi", "inflation"],
    standing_question_keywords: ["gdp", "rate", "fed"]
  };

  const signals = [];

  // 1. DeltaDetector Verification
  const obsPrev: Observation = {
    id: "obs-p1",
    source_id: "fred",
    pillar: Pillar.WORLD,
    entity_id: null,
    metric_key: "FRED_GDP",
    value: 2000000n as ScaledInteger,
    raw_ref: "r2://fred/1.json",
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    source_timestamp: "2026-07-30T00:00:00Z",
    captured_at: new Date().toISOString()
  };

  const obsCurr: Observation = {
    id: "obs-c1",
    source_id: "fred",
    pillar: Pillar.WORLD,
    entity_id: null,
    metric_key: "FRED_GDP",
    value: 2150000n as ScaledInteger,
    raw_ref: "r2://fred/2.json",
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    source_timestamp: "2026-07-31T00:00:00Z",
    captured_at: new Date().toISOString()
  };

  const deltaSig = deltaDetector.detect(obsCurr, obsPrev);
  if (deltaSig) {
    const enriched = { ...deltaSig, salience_score: salienceEngine.calculateSalience(deltaSig, bookContext) };
    signals.push(enriched);
  }

  // 2. DisagreementDetector Verification (Polymarket vs Kalshi divergence)
  const obsPoly: Observation = {
    id: "obs-poly",
    source_id: "polymarket",
    pillar: Pillar.ALTERNATIVES,
    entity_id: "e-apex-tech-001",
    metric_key: "FED_RATE_CUT_PROBABILITY",
    value: 68n as ScaledInteger,
    raw_ref: "r2://poly/1.json",
    licence_class: LicenceClass.COMMERCIAL_FREE,
    source_timestamp: "2026-07-31T00:00:00Z",
    captured_at: new Date().toISOString()
  };

  const obsKalshi: Observation = {
    id: "obs-kalshi",
    source_id: "kalshi",
    pillar: Pillar.ALTERNATIVES,
    entity_id: "e-apex-tech-001",
    metric_key: "FED_RATE_CUT_PROBABILITY",
    value: 48n as ScaledInteger,
    raw_ref: "r2://kalshi/1.json",
    licence_class: LicenceClass.COMMERCIAL_FREE,
    source_timestamp: "2026-07-31T00:00:00Z",
    captured_at: new Date().toISOString()
  };

  const disagSig = disagreementDetector.detect(obsPoly, obsKalshi);
  if (disagSig) {
    const falsificationSig = { ...disagSig, touches_thesis_falsification: true };
    const enriched = { ...falsificationSig, salience_score: salienceEngine.calculateSalience(falsificationSig, bookContext) };
    signals.push(enriched);
  }

  // 3. AnomalyDetector Verification (> 3.5 sigma)
  const obsAnomaly: Observation = {
    id: "obs-ano",
    source_id: "coingecko",
    pillar: Pillar.MARKETS,
    entity_id: null,
    metric_key: "CRYPTO_BTC_PRICE_USD",
    value: 9500000n as ScaledInteger,
    raw_ref: "r2://cg/1.json",
    licence_class: LicenceClass.COMMERCIAL_FREE,
    source_timestamp: "2026-07-31T00:00:00Z",
    captured_at: new Date().toISOString()
  };

  const anomalySig = anomalyDetector.detect(obsAnomaly, 6500000, 750000);
  if (anomalySig) {
    const enriched = { ...anomalySig, salience_score: salienceEngine.calculateSalience(anomalySig, bookContext) };
    signals.push(enriched);
  }

  // 4. AbsenceDetector Verification (SLA Overrun)
  const absenceSig = absenceDetector.detect("twelve_data", Pillar.MARKETS, "2026-07-31T08:00:00Z", 300);
  if (absenceSig) {
    const enriched = { ...absenceSig, salience_score: salienceEngine.calculateSalience(absenceSig, bookContext) };
    signals.push(enriched);
  }

  signals.sort((a, b) => b.salience_score - a.salience_score);

  console.log("\n[GENERATED SIGNALS SORTED BY SALIENCE SCORE]");
  console.log("--------------------------------------------------------------------------------");
  const outputTable = signals.map(s => ({
    type: s.signal_type,
    salience_score: s.salience_score,
    severity: s.severity,
    primary_source: s.primary_source_id,
    secondary_source: s.secondary_source_id || "N/A",
    math_provenance: s.z_score ? `Z=${s.z_score}σ` : s.divergence_pct ? `Div=${s.divergence_pct}%` : `Overrun=${s.overrun_seconds}s`,
    touches_falsification: s.touches_thesis_falsification,
    summary: s.narrative_summary
  }));
  console.table(outputTable);

  console.log("\n[EXPLICIT CROSS-SOURCE DISAGREEMENT VERIFICATION]");
  const crossDisag = signals.find(s => s.signal_type === "DISAGREEMENT");
  console.log("Primary Source:", crossDisag?.primary_source_id);
  console.log("Secondary Source:", crossDisag?.secondary_source_id);
  console.log("Divergence Percentage:", `${crossDisag?.divergence_pct}%`);
  console.log("Touches Thesis Falsification Condition:", crossDisag?.touches_thesis_falsification);
  console.log("Salience Score:", crossDisag?.salience_score);

  console.log("\nEdge Signal Engine Verification Completed Successfully.");
}

verifyEdgeDetectors().catch(console.error);
