import { Observation, ScaledInteger } from "@meridian/core";

export interface Signal {
  readonly id: string;
  readonly metric_key: string;
  readonly value: ScaledInteger;
  readonly generated_at: string;
}

export type SignalCalculator = (observations: readonly Observation[]) => Signal[];
