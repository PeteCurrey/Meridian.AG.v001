export interface BriefClaim {
  readonly claim: string;
  readonly citation_ids: readonly string[];
  readonly salience: number;
  readonly kind: string;
}

export interface Brief {
  readonly id: string;
  readonly generated_at: string;
  readonly is_quiet_window: boolean;
  readonly claims: readonly BriefClaim[];
}
