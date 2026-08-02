export enum Pillar {
  WORLD = "WORLD",
  MARKETS = "MARKETS",
  HORIZON = "HORIZON",
  UNDERCURRENT = "UNDERCURRENT",
  ALTERNATIVES = "ALTERNATIVES"
}

export enum Cadence {
  REALTIME = "REALTIME",
  HOURLY = "HOURLY",
  DAILY = "DAILY",
  WEEKLY = "WEEKLY",
  MONTHLY = "MONTHLY",
  ON_DEMAND = "ON_DEMAND"
}

export enum LicenceClass {
  PUBLIC_DOMAIN = "PUBLIC_DOMAIN",
  CREATIVE_COMMONS = "CREATIVE_COMMONS",
  COMMERCIAL_REDISTRIBUTABLE = "COMMERCIAL_REDISTRIBUTABLE",
  COMMERCIAL_INTERNAL_ONLY = "COMMERCIAL_INTERNAL_ONLY",
  PROPRIETARY = "PROPRIETARY",
  REGULATORY = "REGULATORY",
  COMMERCIAL = "COMMERCIAL",
  COMMERCIAL_FREE = "COMMERCIAL_FREE",
  COMMERCIAL_PAID = "COMMERCIAL_PAID"
}

export enum SourceHealthStatus {
  HEALTHY = "HEALTHY",
  DEGRADED = "DEGRADED",
  OFFLINE = "OFFLINE",
  NOT_CONNECTED = "NOT_CONNECTED"
}

export interface SourceHealth {
  readonly source_id: string;
  readonly status: SourceHealthStatus;
  readonly last_successful_fetch: string | null;
  readonly error_rate_24h: number;
  readonly rows_written_last_window: number;
  readonly quota_consumed_mtd: number;
  readonly cost_mtd_usd_scaled: bigint;
  readonly last_checked_at: string;
}

export interface TimeWindow {
  readonly start: string; // ISO-8601
  readonly end: string;   // ISO-8601
}

export interface RawPayload {
  readonly id: string;
  readonly source_id: string;
  readonly raw_ref: string; // R2 object key
  readonly payload_bytes: number;
  readonly content_type: string;
  readonly captured_at: string;
}
