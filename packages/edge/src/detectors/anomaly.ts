import { SignalType, SignalSeverity, SignalStatus, Pillar } from "../../../core/src/index.ts";
import type { Signal, Observation } from "../../../core/src/index.ts";

export class AnomalyDetector {
  public detect(obs: Observation, mean: number, stddev: number): Signal | null {
    if (stddev === 0) return null;

    const val = Number(obs.value);
    const zScore = Math.abs(val - mean) / stddev;

    if (zScore >= 2.5) {
      const isCritical = zScore >= 3.5;
      return {
        id: crypto.randomUUID(),
        signal_type: SignalType.ANOMALY,
        canonical_metric_key: obs.metric_key,
        pillar: obs.pillar,
        severity: isCritical ? SignalSeverity.CRITICAL : SignalSeverity.ALERT,
        confidence: 95,
        primary_source_id: obs.source_id,
        secondary_source_id: null,
        delta_value: val - mean,
        z_score: Number(zScore.toFixed(2)),
        divergence_pct: null,
        overrun_seconds: null,
        narrative_summary: `Statistical Outlier: ${obs.source_id}:${obs.metric_key} recorded ${val} (${zScore.toFixed(2)} sigma outside historical range)`,
        linked_entity_id: obs.entity_id,
        touches_thesis_falsification: false,
        salience_score: 0,
        status: SignalStatus.UNREAD,
        detected_at: new Date().toISOString()
      };
    }
    return null;
  }
}
