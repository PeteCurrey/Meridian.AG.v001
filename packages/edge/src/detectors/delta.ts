import { SignalType, SignalSeverity, SignalStatus, Pillar, getCanonicalMetric } from "../../../core/src/index.ts";
import type { Signal, Observation } from "../../../core/src/index.ts";

export class DeltaDetector {
  public detect(curr: Observation, prev: Observation | null): Signal | null {
    if (!prev) return null;

    const currVal = Number(curr.value);
    const prevVal = Number(prev.value);
    if (prevVal === 0) return null;

    const changePct = Math.abs(currVal - prevVal) / Math.abs(prevVal);
    const def = getCanonicalMetric(curr.metric_key);
    const threshold = def ? def.delta_change_threshold : 0.05;

    if (changePct >= threshold) {
      const isCritical = changePct >= threshold * 2;
      return {
        id: crypto.randomUUID(),
        signal_type: SignalType.DELTA,
        canonical_metric_key: curr.metric_key,
        pillar: curr.pillar,
        severity: isCritical ? SignalSeverity.ALERT : SignalSeverity.WARN,
        confidence: 85,
        primary_source_id: curr.source_id,
        secondary_source_id: null,
        delta_value: currVal - prevVal,
        z_score: null,
        divergence_pct: Number((changePct * 100).toFixed(2)),
        overrun_seconds: null,
        narrative_summary: `${curr.source_id}:${curr.metric_key} jumped by ${(changePct * 100).toFixed(2)}% (threshold: ${(threshold * 100).toFixed(2)}%)`,
        linked_entity_id: curr.entity_id,
        touches_thesis_falsification: false,
        salience_score: 0,
        status: SignalStatus.UNREAD,
        detected_at: new Date().toISOString()
      };
    }
    return null;
  }
}
