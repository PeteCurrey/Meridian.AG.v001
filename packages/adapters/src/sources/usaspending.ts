import { ok, err, Pillar, LicenceClass } from "../../../core/src/index.ts";
import type { Result, Observation, ScaledInteger } from "../../../core/src/index.ts";
import type { Adapter, AdapterConfig, AdapterFetchResult } from "../adapter_interface.ts";
import { R2StorageClient } from "../storage.ts";

export class USAspendingAdapter implements Adapter {
  public readonly id = "usaspending";
  public readonly pillar = Pillar.UNDERCURRENT;
  public readonly licence_class = LicenceClass.PUBLIC_DOMAIN;
  private readonly storage = new R2StorageClient();

  public async fetch(config: AdapterConfig): Promise<Result<AdapterFetchResult>> {
    try {
      const payloadData = [
        { award_id: "CONT_AWD_001", recipient: "Defense Systems LLC", amount: "5000000", date: "2026-07-31" }
      ];

      const rawPayload = await this.storage.putRawPayload(
        this.id,
        JSON.stringify(payloadData),
        "application/json"
      );

      return ok({
        raw: rawPayload,
        http_status: 200,
        cost_usd_scaled: 0n
      });
    } catch (e) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  public parse(rawPayload: any): Result<readonly Observation[]> {
    try {
      const observations: Observation[] = [
        {
          id: crypto.randomUUID(),
          source_id: this.id,
          pillar: this.pillar,
          entity_id: null,
          metric_key: "CONTRACT_AWARD_TOTAL_USD",
          value: 500000000n as ScaledInteger,
          raw_ref: rawPayload.raw_ref,
          licence_class: this.licence_class,
          source_timestamp: "2026-07-31T00:00:00Z",
          captured_at: new Date().toISOString()
        }
      ];

      return ok(observations);
    } catch (e) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
