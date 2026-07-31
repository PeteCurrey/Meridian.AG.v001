export enum CouncilRole {
  RISK_MACRO_OFFICER = "RISK_MACRO_OFFICER",
  PORTFOLIO_STRATEGIST = "PORTFOLIO_STRATEGIST",
  SENTIMENT_NARRATIVE_ANALYST = "SENTIMENT_NARRATIVE_ANALYST"
}

export interface CouncilOpinion {
  readonly role: CouncilRole;
  readonly model_id: string;
  readonly conviction_score: number; // 0-100
  readonly thesis: string;
  readonly citation_ids: readonly string[];
  readonly evaluated_at: string;
}
