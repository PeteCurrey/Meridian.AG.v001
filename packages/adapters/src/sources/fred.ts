import { ok, err, Pillar, LicenceClass } from "../../../core/src/index.ts";
import type { Result, Observation, ScaledInteger } from "../../../core/src/index.ts";
import type { Adapter, AdapterConfig, AdapterFetchResult } from "../adapter_interface.ts";
import { R2StorageClient } from "../storage.ts";

export class FredAdapter implements Adapter {
  public readonly id = "fred";
  public readonly pillar = Pillar.WORLD;
  public readonly licence_class = LicenceClass.PUBLIC_DOMAIN;
  private readonly storage = new R2StorageClient();

  public static readonly SERIES = [
    "CPIAUCSL", "GDP", "UNRATE", "FEDFUNDS", "T10Y2Y",
    "M2SL", "PAYEMS", "INDPRO", "HOUST", "CSUSHPISA", "PCOPPUSDM", "BAA10Y"
  ];

  public async fetch(config: AdapterConfig): Promise<Result<AdapterFetchResult>> {
    try {
      if (!config.api_key) {
        return err(new Error("FRED API key missing"));
      }

      const payloadData = {
        observations: FredAdapter.SERIES.map((series, idx) => ({
          date: "2026-07-31",
          value: (100.5 + idx * 2.5).toFixed(2),
          series_id: series
        }))
      };

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
      const mockObservations: Observation[] = FredAdapter.SERIES.map((series, idx) => ({
        id: crypto.randomUUID(),
        source_id: this.id,
        pillar: this.pillar,
        entity_id: null,
        metric_key: `FRED_${series}`,
        value: BigInt(Math.round((100.5 + idx * 2.5) * 100)) as ScaledInteger,
        raw_ref: rawPayload.raw_ref,
        licence_class: this.licence_class,
        source_timestamp: "2026-07-31T00:00:00Z",
        captured_at: new Date().toISOString()
      }));

      return ok(mockObservations);
    } catch (e) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
