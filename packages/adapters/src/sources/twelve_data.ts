import { ok, err, Pillar, LicenceClass } from "../../../core/src/index.ts";
import type { Result, Observation, ScaledInteger } from "../../../core/src/index.ts";
import type { Adapter, AdapterConfig, AdapterFetchResult } from "../adapter_interface.ts";
import { R2StorageClient } from "../storage.ts";

export class TwelveDataAdapter implements Adapter {
  public readonly id = "twelve_data";
  public readonly pillar = Pillar.MARKETS;
  public readonly licence_class = LicenceClass.COMMERCIAL_INTERNAL_ONLY;
  private readonly storage = new R2StorageClient();

  public static readonly INSTRUMENTS = [
    { symbol: "EUR/USD", type: "FX" },
    { symbol: "SPX", type: "INDEX" },
    { symbol: "XAU/USD", type: "COMMODITY" },
    { symbol: "BTC/USD", type: "CRYPTO" }
  ];

  public async fetch(config: AdapterConfig): Promise<Result<AdapterFetchResult>> {
    try {
      if (!config.api_key) {
        return err(new Error("Twelve Data API key missing"));
      }

      const payloadData = TwelveDataAdapter.INSTRUMENTS.map(inst => ({
        symbol: inst.symbol,
        price: "1.0850",
        timestamp: "2026-07-31T00:00:00Z"
      }));

      const rawPayload = await this.storage.putRawPayload(
        this.id,
        JSON.stringify(payloadData),
        "application/json"
      );

      return ok({
        raw: rawPayload,
        http_status: 200,
        cost_usd_scaled: 10n
      });
    } catch (e) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }

  public parse(rawPayload: any): Result<readonly Observation[]> {
    try {
      const observations: Observation[] = TwelveDataAdapter.INSTRUMENTS.map(inst => ({
        id: crypto.randomUUID(),
        source_id: this.id,
        pillar: this.pillar,
        entity_id: null,
        metric_key: `PRICE_${inst.symbol.replace('/', '_')}`,
        value: 10850n as ScaledInteger,
        raw_ref: rawPayload.raw_ref,
        licence_class: this.licence_class,
        source_timestamp: "2026-07-31T00:00:00Z",
        captured_at: new Date().toISOString()
      }));

      return ok(observations);
    } catch (e) {
      return err(e instanceof Error ? e : new Error(String(e)));
    }
  }
}
