export enum AutomationTier {
  TIER_1_WATCH = "TIER_1_WATCH",
  TIER_2_RESEARCH = "TIER_2_RESEARCH",
  TIER_3_PREPARE = "TIER_3_PREPARE",
  TIER_4_EXECUTE = "TIER_4_EXECUTE"
}

export interface AutomationRule {
  readonly id: string;
  readonly name: string;
  readonly tier: AutomationTier;
  readonly enabled: boolean;
  readonly dry_run: boolean;
}
