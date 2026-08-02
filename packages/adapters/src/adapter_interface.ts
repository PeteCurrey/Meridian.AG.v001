import { Pillar, LicenceClass } from "../../core/src/index";
import type { Result, Observation, RawPayload } from "../../core/src/index";

export interface AdapterConfig {
  readonly source_id: string;
  readonly api_key?: string;
  readonly base_url: string;
}

export interface AdapterFetchResult {
  readonly raw: RawPayload;
  readonly http_status: number;
  readonly cost_usd_scaled: bigint;
}

export interface Adapter {
  readonly id: string;
  readonly pillar: Pillar;
  readonly licence_class: LicenceClass;

  /**
   * Fetch raw response from source endpoint.
   * MUST NOT throw error past boundary; returns Result.
   */
  fetch(config: AdapterConfig): Promise<Result<AdapterFetchResult>>;

  /**
   * Parse raw payload buffer/JSON into Observation types after validating with Zod.
   */
  parse(raw: RawPayload): Result<readonly Observation[]>;
}
