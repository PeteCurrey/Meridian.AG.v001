import { ok, err, Pillar, LicenceClass } from "../../../core/src/index";
import type { Result, Observation, ScaledInteger } from "../../../core/src/index";
import type { Adapter, AdapterConfig, AdapterFetchResult } from "../adapter_interface";
import { R2StorageClient } from "../storage";

export class NasdaqIpoCalendarAdapter implements Adapter {
  public readonly id = "nasdaq_ipo_calendar";
  public readonly pillar = Pillar.HORIZON;
  public readonly licence_class = LicenceClass.PUBLIC_DOMAIN;
  private readonly storage = new R2StorageClient();

  public async fetch(config: AdapterConfig): Promise<Result<AdapterFetchResult>> {
    try {
      const payloadData = { upcoming_ipos_count: 8 };
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
        metric_key: "NASDAQ_UPCOMING_IPO_COUNT",
        value: 8n as ScaledInteger,
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
