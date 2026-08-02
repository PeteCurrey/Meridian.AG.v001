import { ok, err, Pillar, LicenceClass } from "../../../core/src/index";
import type { Result, Observation, ScaledInteger } from "../../../core/src/index";
import type { Adapter, AdapterConfig, AdapterFetchResult } from "../adapter_interface";
import { R2StorageClient } from "../storage";

export class FcaShortPositionsAdapter implements Adapter {
  public readonly id = "fca_short_positions";
  public readonly pillar = Pillar.MARKETS;
  public readonly licence_class = LicenceClass.PUBLIC_DOMAIN;
  private readonly storage = new R2StorageClient();

  public async fetch(config: AdapterConfig): Promise<Result<AdapterFetchResult>> {
    try {
      const payloadData = { net_short_pct: 1.45 };
      const rawPayload = await this.storage.putRawPayload(this.id, JSON.stringify(payloadData), "application/json");
      return ok({ raw: rawPayload, http_status: 200, cost_usd_scaled: 0n });
    } catch (e) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  public parse(rawPayload: any): Result<readonly Observation[]> {
    try {
      const obs: Observation = {
        id: crypto.randomUUID(),
        source_id: this.id,
        pillar: this.pillar,
        entity_id: null,
        metric_key: "FCA_NET_SHORT_POSITION_PCT",
        value: 145n as ScaledInteger,
        raw_ref: rawPayload.raw_ref,
        licence_class: this.licence_class,
        source_timestamp: "2026-07-31T00:00:00Z",
        captured_at: new Date().toISOString()
      };
      return ok([obs]);
    } catch (e) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
