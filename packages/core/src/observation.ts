import { Pillar, LicenceClass } from "./source";
import type { ScaledInteger } from "./money";

export interface Observation {
  readonly id: string;
  readonly source_id: string;
  readonly pillar: Pillar;
  readonly entity_id: string | null;
  readonly metric_key: string;
  readonly value: ScaledInteger;
  readonly raw_ref: string;
  readonly licence_class: LicenceClass;
  readonly source_timestamp: string; // ISO-8601
  readonly captured_at: string; // ISO-8601
}
