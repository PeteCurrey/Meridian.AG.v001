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
