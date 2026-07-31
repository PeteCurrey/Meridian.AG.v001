import { Pillar } from "./source.ts";

export enum SignalType {
  DELTA = "DELTA",
  DISAGREEMENT = "DISAGREEMENT",
  ANOMALY = "ANOMALY",
  ABSENCE = "ABSENCE"
}

export enum SignalSeverity {
  INFO = "INFO",
  WARN = "WARN",
  ALERT = "ALERT",
  CRITICAL = "CRITICAL"
}

export enum SignalStatus {
  UNREAD = "UNREAD",
  ACKNOWLEDGED = "ACKNOWLEDGED",
  ACTIONED = "ACTIONED",
  DISMISSED = "DISMISSED"
}

export interface Signal {
  readonly id: string;
  readonly signal_type: SignalType;
  readonly canonical_metric_key: string;
  readonly pillar: Pillar;
  readonly severity: SignalSeverity;
  readonly confidence: number; // 0-100
  readonly primary_source_id: string;
  readonly secondary_source_id: string | null;
  readonly delta_value: number | null;
  readonly z_score: number | null;
  readonly divergence_pct: number | null;
  readonly overrun_seconds: number | null;
  readonly narrative_summary: string;
  readonly linked_entity_id: string | null;
  readonly touches_thesis_falsification: boolean;
  readonly salience_score: number;
  readonly status: SignalStatus;
  readonly detected_at: string;
}
