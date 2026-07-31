export enum ExecutionMode {
  OBSERVE = "OBSERVE",
  PAPER = "PAPER",
  LIVE = "LIVE"
}

export interface TradeTicket {
  readonly ticket_id: string;
  readonly instrument: string;
  readonly direction: "BUY" | "SELL";
  readonly size_scaled: bigint;
  readonly entry_price_scaled: bigint;
  readonly stop_loss_scaled: bigint;
  readonly take_profit_scaled: bigint;
  readonly mode: ExecutionMode;
}
