import { SignalType, SignalSeverity, SignalStatus, Pillar } from "../../../core/src/index";
import type { Signal, Observation } from "../../../core/src/index";

export class DisagreementDetector {
  public detect(obsA: Observation, obsB: Observation): Signal | null {
    if (obsA.source_id === obsB.source_id) return null;

    const valA = Number(obsA.value);
    const valB = Number(obsB.value);
    const maxVal = Math.max(Math.abs(valA), Math.abs(valB));
    if (maxVal === 0) return null;

    const divergencePct = Math.abs(valA - valB) / maxVal;

    if (divergencePct >= 0.05) {
      const isCritical = divergencePct >= 0.15;
      return {
        id: crypto.randomUUID(),
        signal_type: SignalType.DISAGREEMENT,
        canonical_metric_key: obsA.metric_key,
        pillar: obsA.pillar,
        severity: isCritical ? SignalSeverity.CRITICAL : SignalSeverity.ALERT,
        confidence: 90,
        primary_source_id: obsA.source_id,
        secondary_source_id: obsB.source_id,
        delta_value: valA - valB,
        z_score: null,
        divergence_pct: Number((divergencePct * 100).toFixed(2)),
        overrun_seconds: null,
        narrative_summary: `Cross-Source Disagreement: ${obsA.source_id} (${valA}) vs ${obsB.source_id} (${valB}) diverged by ${(divergencePct * 100).toFixed(2)}% on ${obsA.metric_key}`,
        linked_entity_id: obsA.entity_id || obsB.entity_id,
        touches_thesis_falsification: false,
        salience_score: 0,
        status: SignalStatus.UNREAD,
        detected_at: new Date().toISOString()
      };
    }
    return null;
  }
}
