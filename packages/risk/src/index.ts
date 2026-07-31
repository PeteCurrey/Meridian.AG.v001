import { Money } from "@meridian/core";

export interface RiskState {
  readonly current_drawdown_percent: number;
  readonly daily_loss_usd: Money;
  readonly open_positions_count: number;
  readonly max_permitted_risk_usd: Money;
}
