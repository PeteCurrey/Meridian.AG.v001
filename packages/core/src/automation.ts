import { ok, err } from "./result";
import type { Result } from "./result";

export enum AutomationTier {
  TIER_0_MANUAL = "TIER_0_MANUAL",
  TIER_1_WATCH = "TIER_1_WATCH",
  TIER_2_ASSISTED = "TIER_2_ASSISTED",
  TIER_3_AUTONOMOUS = "TIER_3_AUTONOMOUS"
}

export interface PlatformState {
  readonly kill_switch_active: boolean;
  readonly current_tier: AutomationTier;
  readonly updated_at: string;
}

export function requireAutomationTier(
  requiredTier: AutomationTier,
  currentTier: AutomationTier
): Result<boolean> {
  const tierLevels: Record<AutomationTier, number> = {
    [AutomationTier.TIER_0_MANUAL]: 0,
    [AutomationTier.TIER_1_WATCH]: 1,
    [AutomationTier.TIER_2_ASSISTED]: 2,
    [AutomationTier.TIER_3_AUTONOMOUS]: 3
  };

  if (tierLevels[currentTier] < tierLevels[requiredTier]) {
    return err(
      new Error(
        `FAILED_CLOSED: Operation requires Automation Tier ${requiredTier}, but current tier is ${currentTier}. External actions prohibited.`
      )
    );
  }

  return ok(true);
}
