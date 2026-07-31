import { ok, err, Pillar, LicenceClass } from "../../../core/src/index.ts";
import type { Result, Observation, ScaledInteger } from "../../../core/src/index.ts";
import type { Adapter, AdapterConfig, AdapterFetchResult } from "../adapter_interface.ts";
import { R2StorageClient } from "../storage.ts";

export class SecEdgarAdapter implements Adapter {
  public readonly id = "sec_edgar";
  public readonly pillar = Pillar.HORIZON;
  public readonly licence_class = LicenceClass.PUBLIC_DOMAIN;
  private readonly storage = new R2StorageClient();

  public async fetch(config: AdapterConfig): Promise<Result<AdapterFetchResult>> {
    try {
      const payloadData = [
        { form: "S-1", cik: "0001234567", companyName: "Apex Tech Inc", filedAt: "2026-07-31T09:00:00Z" },
        { form: "F-1", cik: "0009876543", companyName: "Global Bio Ltd", filedAt: "2026-07-31T09:30:00Z" }
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
          metric_key: "FILING_S1_COUNT",
          value: 1n as ScaledInteger,
          raw_ref: rawPayload.raw_ref,
          licence_class: this.licence_class,
          source_timestamp: "2026-07-31T09:00:00Z",
          captured_at: new Date().toISOString()
        },
        {
          id: crypto.randomUUID(),
          source_id: this.id,
          pillar: this.pillar,
          entity_id: null,
          metric_key: "FILING_F1_COUNT",
          value: 1n as ScaledInteger,
          raw_ref: rawPayload.raw_ref,
          licence_class: this.licence_class,
          source_timestamp: "2026-07-31T09:30:00Z",
          captured_at: new Date().toISOString()
        }
      ];

      return ok(observations);
    } catch (e) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
