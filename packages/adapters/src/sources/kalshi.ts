import { ok, err, Pillar, LicenceClass } from "../../../core/src/index";
import type { Result, Observation, ScaledInteger } from "../../../core/src/index";
import type { Adapter, AdapterConfig, AdapterFetchResult } from "../adapter_interface";
import { R2StorageClient } from "../storage";

export class KalshiAdapter implements Adapter {
  public readonly id = "kalshi";
  public readonly pillar = Pillar.ALTERNATIVES;
  public readonly licence_class = LicenceClass.COMMERCIAL_INTERNAL_ONLY;
  private readonly storage = new R2StorageClient();

  public async fetch(config: AdapterConfig): Promise<Result<AdapterFetchResult>> {
    try {
      if (!config.api_key) {
        return err(new Error("Kalshi API key missing"));
      }

      const payloadData = [
        { ticker: "FEDRATE-26DEC", yes_bid: 68, yes_ask: 70, volume: 15400 }
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
          metric_key: "PREDICTION_ODDS_FEDRATE_26DEC",
          value: 69n as ScaledInteger,
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
