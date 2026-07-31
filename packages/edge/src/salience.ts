import { SignalSeverity } from "../../core/src/index.ts";
import type { Signal } from "../../core/src/index.ts";

export interface BookContext {
  readonly watchlist_entity_ids: readonly string[];
  readonly open_position_symbols: readonly string[];
  readonly thesis_entity_ids: readonly string[];
  readonly thesis_falsification_keywords: readonly string[];
  readonly standing_question_keywords: readonly string[];
}

export class SalienceEngine {
  public calculateSalience(signal: Signal, context: BookContext): number {
    let score = 50;

    if (signal.linked_entity_id && context.watchlist_entity_ids.includes(signal.linked_entity_id)) {
      score += 30;
    }

    const isPosition = context.open_position_symbols.some(sym =>
      signal.canonical_metric_key.toUpperCase().includes(sym.toUpperCase())
    );
    if (isPosition) {
      score += 40;
    }

    if (signal.touches_thesis_falsification) {
      score += 50;
    } else if (
      signal.linked_entity_id &&
      context.thesis_entity_ids.includes(signal.linked_entity_id)
    ) {
      score += 20;
    }

    const touchesQuestion = context.standing_question_keywords.some(kw =>
      signal.narrative_summary.toLowerCase().includes(kw.toLowerCase()) ||
      signal.canonical_metric_key.toLowerCase().includes(kw.toLowerCase())
    );
    if (touchesQuestion) {
      score += 25;
    }

    let multiplier = 1.0;
    if (signal.severity === SignalSeverity.CRITICAL) multiplier = 2.0;
    else if (signal.severity === SignalSeverity.ALERT) multiplier = 1.5;
    else if (signal.severity === SignalSeverity.WARN) multiplier = 1.2;

    return Number((score * multiplier).toFixed(2));
  }
}
