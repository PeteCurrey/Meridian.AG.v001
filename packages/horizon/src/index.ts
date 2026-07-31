export enum HorizonEventKind {
  IPO_PRICING = "IPO_PRICING",
  IPO_FILING = "IPO_FILING",
  DIRECT_LISTING = "DIRECT_LISTING",
  LOCKUP_EXPIRY = "LOCKUP_EXPIRY",
  TOKEN_UNLOCK = "TOKEN_UNLOCK",
  EARNINGS = "EARNINGS",
  CENTRAL_BANK_DECISION = "CENTRAL_BANK_DECISION",
  CENTRAL_BANK_SPEECH = "CENTRAL_BANK_SPEECH",
  ECONOMIC_RELEASE = "ECONOMIC_RELEASE",
  INDEX_REBALANCE = "INDEX_REBALANCE",
  BOND_AUCTION = "BOND_AUCTION",
  OPTIONS_EXPIRY = "OPTIONS_EXPIRY",
  REGULATORY_DEADLINE = "REGULATORY_DEADLINE",
  COURT_DATE = "COURT_DATE",
  ELECTION = "ELECTION",
  COMMODITY_REPORT = "COMMODITY_REPORT",
  DIVIDEND = "DIVIDEND",
  BUYBACK = "BUYBACK",
  PRODUCT_LAUNCH = "PRODUCT_LAUNCH",
  PATENT_GRANT = "PATENT_GRANT"
}

export enum DateConfidence {
  CONFIRMED = "CONFIRMED",
  ESTIMATED = "ESTIMATED",
  RUMOURED = "RUMOURED"
}

export interface HorizonEvent {
  readonly id: string;
  readonly kind: HorizonEventKind;
  readonly entity_id: string | null;
  readonly title: string;
  readonly scheduled_at: string;
  readonly date_confidence: DateConfidence;
  readonly window_start: string | null;
  readonly window_end: string | null;
  readonly source_ids: readonly string[];
}
