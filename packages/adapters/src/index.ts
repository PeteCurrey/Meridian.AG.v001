import { Result, Observation, RawPayload } from "@meridian/core";

export interface AdapterConfig {
  readonly source_id: string;
  readonly api_key?: string;
  readonly base_url: string;
}

export interface Adapter {
  readonly id: string;
  fetch(config: AdapterConfig): Promise<Result<RawPayload>>;
  parse(raw: RawPayload): Result<readonly Observation[]>;
}
