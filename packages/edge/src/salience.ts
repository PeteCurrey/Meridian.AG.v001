import { SignalSeverity } from "../../core/src/index.ts";
import type { Signal } from "../../core/src/index.ts";

export interface BookContext {
  readonly watchlist_entity_ids: readonly string[];
  readonly open_position_symbols?: readonly string[];
  readonly thesis_entity_ids: readonly string[];
  readonly thesis_falsification_keywords?: readonly string[];
  readonly standing_question_keywords?: readonly string[];
  readonly position_entity_ids?: readonly string[];
  readonly question_category_keys?: readonly string[];
}

export class SalienceEngine {
  public calculateSalience(signal: Signal, context: BookContext): number {
    let score = 50;

    if (signal.linked_entity_id && context.watchlist_entity_ids.includes(signal.linked_entity_id)) {
      score += 30;
    }

    const openPositions = context.open_position_symbols || context.position_entity_ids || [];
    const isPosition = openPositions.some(sym =>
      signal.canonical_metric_key.toUpperCase().includes(sym.toUpperCase()) ||
      (signal.linked_entity_id && sym === signal.linked_entity_id)
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

    const questionKeywords = context.standing_question_keywords || context.question_category_keys || [];
    const touchesQuestion = questionKeywords.some(kw =>
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

  public rankSignals(signals: readonly Signal[], context: BookContext): readonly Signal[] {
    return signals
      .map(s => ({
        ...s,
        salience_score: this.calculateSalience(s, context)
      }))
      .sort((a, b) => b.salience_score - a.salience_score);
  }
}
