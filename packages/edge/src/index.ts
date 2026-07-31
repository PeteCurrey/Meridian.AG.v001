export interface Edge {
  readonly id: string;
  readonly asset_class: string;
  readonly instrument: string;
  readonly direction: "LONG" | "SHORT" | "NEUTRAL";
  readonly horizon: string;
  readonly conviction_score: number;
  readonly falsification_condition: string;
  readonly created_at: string;
}
