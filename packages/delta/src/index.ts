export enum DeltaKind {
  NEW = "NEW",
  CHANGE = "CHANGE",
  ACCELERATION = "ACCELERATION",
  REGIME = "REGIME",
  HEALTH = "HEALTH",
  CONTRADICTION = "CONTRADICTION",
  HORIZON_SHIFT = "HORIZON_SHIFT"
}

export interface Delta {
  readonly id: string;
  readonly kind: DeltaKind;
  readonly metric_key: string;
  readonly entity_id: string | null;
  readonly source_observation_ids: readonly string[];
  readonly detected_at: string;
}
