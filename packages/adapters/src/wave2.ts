import { ok, err, Pillar, LicenceClass } from "../../core/src/index";
import type { Result, Observation, ScaledInteger } from "../../core/src/index";
import type { Adapter, AdapterConfig, AdapterFetchResult } from "./adapter_interface";
import { R2StorageClient } from "./storage";

export class GenericWave2Adapter implements Adapter {
  public readonly id: string;
  public readonly pillar: Pillar;
  public readonly licence_class: LicenceClass;
  private readonly metricKey: string;
  private readonly mockValue: number;
  private readonly storage = new R2StorageClient();

  constructor(
    id: string,
    pillar: Pillar,
    metricKey: string,
    mockValue: number,
    licenceClass: LicenceClass = LicenceClass.PUBLIC_DOMAIN
  ) {
    this.id = id;
    this.pillar = pillar;
    this.metricKey = metricKey;
    this.mockValue = mockValue;
    this.licence_class = licenceClass;
  }

  public async fetch(config: AdapterConfig): Promise<Result<AdapterFetchResult>> {
    try {
      const payloadData = {
        source_id: this.id,
        metric_key: this.metricKey,
        value: this.mockValue,
        timestamp: "2026-07-31T00:00:00Z"
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
      const obs: Observation = {
        id: crypto.randomUUID(),
        source_id: this.id,
        pillar: this.pillar,
        entity_id: null,
        metric_key: this.metricKey,
        value: BigInt(Math.round(this.mockValue * 100)) as ScaledInteger,
        raw_ref: rawPayload.raw_ref || `r2://${this.id}/latest.json`,
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

// Pillar WORLD Adapters
export const bisAdapter = new GenericWave2Adapter("bis", Pillar.WORLD, "MACRO_CREDIT_TO_GDP", 265.4);
export const oecdAdapter = new GenericWave2Adapter("oecd", Pillar.WORLD, "MACRO_COMPOSITE_LEADING_INDICATOR", 99.8);
export const imfAdapter = new GenericWave2Adapter("imf", Pillar.WORLD, "MACRO_GLOBAL_GROWTH", 3.2);
export const worldBankAdapter = new GenericWave2Adapter("world_bank", Pillar.WORLD, "MACRO_GLOBAL_GROWTH", 2.9);
export const ecbAdapter = new GenericWave2Adapter("ecb", Pillar.WORLD, "MACRO_ECB_DEPOSIT_RATE", 3.25);
export const bankOfEnglandAdapter = new GenericWave2Adapter("bank_of_england", Pillar.WORLD, "MACRO_BOE_BASE_RATE", 4.75);

// Pillar MARKETS Adapters
export const yahooFinanceAdapter = new GenericWave2Adapter("yahoo_finance", Pillar.MARKETS, "MARKET_SP500_INDEX", 5900);
export const polygonAdapter = new GenericWave2Adapter("polygon", Pillar.MARKETS, "MARKET_US_EQUITY_VOLATILITY", 15.2, LicenceClass.PROPRIETARY);
export const coinglassAdapter = new GenericWave2Adapter("coinglass", Pillar.MARKETS, "CRYPTO_BTC_OPEN_INTEREST", 420000000);
export const deribitAdapter = new GenericWave2Adapter("deribit", Pillar.MARKETS, "CRYPTO_BTC_OPTIONS_IV", 54.5);

// Pillar HORIZON Adapters
export const usptoAdapter = new GenericWave2Adapter("uspto", Pillar.HORIZON, "PATENTS_US_GRANTED_WEEKLY", 6450);
export const epoAdapter = new GenericWave2Adapter("epo", Pillar.HORIZON, "PATENTS_EPO_APPLICATIONS", 3800);
export const clinicalTrialsAdapter = new GenericWave2Adapter("clinical_trials", Pillar.HORIZON, "HEALTH_CLINICAL_TRIALS_PHASE3", 1240);
export const arxivAdapter = new GenericWave2Adapter("arxiv", Pillar.HORIZON, "RESEARCH_AI_PAPERS_WEEKLY", 890);

// Pillar UNDERCURRENT Adapters
export const openSanctionsAdapter = new GenericWave2Adapter("opensanctions", Pillar.UNDERCURRENT, "SANCTIONS_DESIGNATIONS_TOTAL", 48200);
export const samGovAdapter = new GenericWave2Adapter("sam_gov", Pillar.UNDERCURRENT, "GOV_SAM_EXCLUSIONS_ACTIVE", 15400);
export const ukGazetteAdapter = new GenericWave2Adapter("uk_gazette", Pillar.UNDERCURRENT, "UK_CORPORATE_INSOLVENCIES_MONTHLY", 2100);

// Pillar ALTERNATIVES Adapters
export const predictitAdapter = new GenericWave2Adapter("predictit", Pillar.ALTERNATIVES, "PREDICTION_FED_CUT_PROBABILITY", 65);
export const metaculusAdapter = new GenericWave2Adapter("metaculus", Pillar.ALTERNATIVES, "FORECAST_AGI_TIMELINE_YEAR", 2028);

export const wave2AdaptersMap = new Map<string, Adapter>([
  ["bis", bisAdapter],
  ["oecd", oecdAdapter],
  ["imf", imfAdapter],
  ["world_bank", worldBankAdapter],
  ["ecb", ecbAdapter],
  ["bank_of_england", bankOfEnglandAdapter],
  ["yahoo_finance", yahooFinanceAdapter],
  ["polygon", polygonAdapter],
  ["coinglass", coinglassAdapter],
  ["deribit", deribitAdapter],
  ["uspto", usptoAdapter],
  ["epo", epoAdapter],
  ["clinical_trials", clinicalTrialsAdapter],
  ["arxiv", arxivAdapter],
  ["opensanctions", openSanctionsAdapter],
  ["sam_gov", samGovAdapter],
  ["uk_gazette", ukGazetteAdapter],
  ["predictit", predictitAdapter],
  ["metaculus", metaculusAdapter]
]);
