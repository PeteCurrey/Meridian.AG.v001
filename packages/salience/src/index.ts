import { Delta } from "@meridian/delta";

export interface SalienceComponents {
  readonly position_exposure: number;
  readonly watchlist_proximity: number;
  readonly thesis_relevance: number;
  readonly question_relevance: number;
  readonly magnitude: number;
  readonly novelty: number;
  readonly source_confidence: number;
  readonly horizon_proximity: number;
}

export interface SalienceResult {
  readonly delta_id: string;
  readonly score: number; // 0-100 deterministic
  readonly components: SalienceComponents;
  readonly calculated_at: string;
}

export type SalienceEvaluator = (delta: Delta) => SalienceResult;
