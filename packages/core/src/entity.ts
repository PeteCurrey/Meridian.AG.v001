export enum EntityType {
  COMPANY = "COMPANY",
  INSTRUMENT = "INSTRUMENT",
  PERSON = "PERSON",
  GOVERNMENT_BODY = "GOVERNMENT_BODY",
  THEME = "THEME",
  COMMODITY = "COMMODITY",
  LOCATION = "LOCATION",
  EVENT = "EVENT"
}

export enum IdentifierScheme {
  LEI = "LEI",
  CIK = "CIK",
  ISIN = "ISIN",
  TICKER = "TICKER",
  COMPANIES_HOUSE = "COMPANIES_HOUSE",
  EXCHANGE_SYMBOL = "EXCHANGE_SYMBOL",
  INTERNAL = "INTERNAL"
}

export interface EntityIdentifier {
  readonly scheme: IdentifierScheme;
  readonly value: string;
  readonly source: string;
  readonly confidence: number; // 0.0 - 1.0
}

export interface Entity {
  readonly id: string;
  readonly name: string;
  readonly type: EntityType;
  readonly identifiers: readonly EntityIdentifier[];
  readonly created_at: string;
  readonly updated_at: string;
}

// Personal Context Store (The Book) Types
export interface BookWatchlistEntry {
  readonly id: string;
  readonly entity_id: string;
  readonly why_watched: string;
  readonly review_date: string;
  readonly added_at: string;
}

export interface BookPosition {
  readonly id: string;
  readonly instrument_symbol: string;
  readonly direction: "LONG" | "SHORT";
  readonly size_scaled: bigint;
  readonly entry_price_scaled: bigint;
  readonly risk_state: string;
  readonly updated_at: string;
}

export interface BookThesis {
  readonly id: string;
  readonly text: string;
  readonly linked_entity_ids: readonly string[];
  /** MANDATORY Falsification Condition. CANNOT BE OMITTED OR EMPTY. */
  readonly falsification_condition: string;
  readonly review_date: string;
  readonly confidence: number; // 0-100
  readonly created_at: string;
}

export interface BookQuestion {
  readonly id: string;
  readonly question_text: string;
  readonly category: string;
  readonly cadence: string;
  readonly active: boolean;
}

export interface MergeAuditRecord {
  readonly id: string;
  readonly primary_entity_id: string;
  readonly merged_entity_id: string;
  readonly rule_id: string;
  readonly matched_identifier: string;
  readonly merged_at: string;
  readonly status: "ACTIVE" | "REVERSED";
}

export interface MergeProposal {
  readonly id: string;
  readonly entity_a_id: string;
  readonly entity_b_id: string;
  readonly candidate_name: string;
  readonly match_confidence: number;
  readonly status: "PENDING" | "CONFIRMED" | "REJECTED";
}
