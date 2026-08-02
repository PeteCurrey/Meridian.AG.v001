import { SignalType, SignalSeverity, SignalStatus, Pillar } from "../../../core/src/index";
import type { Signal } from "../../../core/src/index";

export class AbsenceDetector {
  public detect(
    sourceId: string,
    pillar: Pillar,
    lastSuccessfulIso: string | null,
    slaSeconds: number
  ): Signal | null {
    if (!lastSuccessfulIso) return null;

    const lastTime = new Date(lastSuccessfulIso).getTime();
    const elapsedSeconds = Math.floor((Date.now() - lastTime) / 1000);

    if (elapsedSeconds > slaSeconds) {
      const overrun = elapsedSeconds - slaSeconds;
      return {
        id: crypto.randomUUID(),
        signal_type: SignalType.ABSENCE,
        canonical_metric_key: `${sourceId.toUpperCase()}_FEED_ABSENCE`,
        pillar,
        severity: overrun > slaSeconds ? SignalSeverity.CRITICAL : SignalSeverity.WARN,
        confidence: 100,
        primary_source_id: sourceId,
        secondary_source_id: null,
        delta_value: null,
        z_score: null,
        divergence_pct: null,
        overrun_seconds: overrun,
        narrative_summary: `SLA Overrun: Source '${sourceId}' failed to emit expected payload within ${slaSeconds}s SLA (overrun by ${overrun}s)`,
        linked_entity_id: null,
        touches_thesis_falsification: false,
        salience_score: 0,
        status: SignalStatus.UNREAD,
        detected_at: new Date().toISOString()
      };
    }
    return null;
  }
}
