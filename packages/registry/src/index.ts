import { Pillar, Cadence, LicenceClass } from "../../core/src/index.ts";

export type AuthMethod = "NONE" | "API_KEY" | "OAUTH2" | "BEARER_TOKEN" | "CUSTOM_HEADER";
export type CostModel = "FREE" | "PER_REQUEST" | "MONTHLY_TIER" | "CREDIT_BASED";

export interface SourceRegistryEntry {
  readonly id: string;
  readonly name: string;
  readonly pillar: Pillar;
  readonly category: string;
  readonly cadence: Cadence;
  readonly licence_class: LicenceClass;
  readonly redistributable: boolean;
  readonly auth_method: AuthMethod;
  readonly base_url: string;
  readonly quota_per_month: number | null;
  readonly cost_model: CostModel;
  readonly staleness_sla_seconds: number;
  readonly wave_number: number;
}

export const WAVE_1_REGISTRY: readonly SourceRegistryEntry[] = [
  // WORLD PILLAR
  {
    id: "fred",
    name: "Federal Reserve Economic Data (FRED)",
    pillar: Pillar.WORLD,
    category: "Macroeconomics",
    cadence: Cadence.DAILY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "API_KEY",
    base_url: "https://api.stlouisfed.org/fred",
    quota_per_month: 120000,
    cost_model: "FREE",
    staleness_sla_seconds: 86400,
    wave_number: 1
  },
  {
    id: "us_treasury_fiscal",
    name: "US Treasury Fiscal Data",
    pillar: Pillar.WORLD,
    category: "Fiscal Data",
    cadence: Cadence.DAILY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://api.fiscaldata.treasury.gov/services/api/fiscal_service",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 86400,
    wave_number: 1
  },
  {
    id: "ny_fed",
    name: "New York Fed Market Rates",
    pillar: Pillar.WORLD,
    category: "Central Bank Rates",
    cadence: Cadence.DAILY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://markets.newyorkfed.org/api",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 86400,
    wave_number: 1
  },
  {
    id: "atlanta_fed_gdpnow",
    name: "Atlanta Fed GDPNow",
    pillar: Pillar.WORLD,
    category: "GDP Nowcast",
    cadence: Cadence.WEEKLY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://www.atlantafed.org/api/gdpnow",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 604800,
    wave_number: 1
  },
  {
    id: "cleveland_fed_nowcast",
    name: "Cleveland Fed Inflation Nowcasting",
    pillar: Pillar.WORLD,
    category: "Inflation Nowcast",
    cadence: Cadence.DAILY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://www.clevelandfed.org/api/inflationnowcasting",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 86400,
    wave_number: 1
  },
  {
    id: "gdelt",
    name: "GDELT Project News & Events",
    pillar: Pillar.WORLD,
    category: "Global News Event Stream",
    cadence: Cadence.HOURLY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://api.gdeltproject.org/api/v2",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 7200,
    wave_number: 1
  },
  {
    id: "eia",
    name: "US Energy Information Administration (EIA)",
    pillar: Pillar.WORLD,
    category: "Energy Commodities",
    cadence: Cadence.WEEKLY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "API_KEY",
    base_url: "https://api.eia.gov/v2",
    quota_per_month: 100000,
    cost_model: "FREE",
    staleness_sla_seconds: 604800,
    wave_number: 1
  },

  // MARKETS PILLAR
  {
    id: "twelve_data",
    name: "Twelve Data Financial Feed",
    pillar: Pillar.MARKETS,
    category: "Multi-asset Price Feed",
    cadence: Cadence.REALTIME,
    licence_class: LicenceClass.COMMERCIAL_INTERNAL_ONLY,
    redistributable: false,
    auth_method: "API_KEY",
    base_url: "https://api.twelvedata.com",
    quota_per_month: 800,
    cost_model: "MONTHLY_TIER",
    staleness_sla_seconds: 300,
    wave_number: 1
  },
  {
    id: "finnhub",
    name: "Finnhub Financial Data API",
    pillar: Pillar.MARKETS,
    category: "Market Data & Fundamentals",
    cadence: Cadence.REALTIME,
    licence_class: LicenceClass.COMMERCIAL_INTERNAL_ONLY,
    redistributable: false,
    auth_method: "API_KEY",
    base_url: "https://finnhub.io/api/v1",
    quota_per_month: 6000,
    cost_model: "FREE",
    staleness_sla_seconds: 300,
    wave_number: 1
  },
  {
    id: "cftc_cot",
    name: "CFTC Commitments of Traders (COT)",
    pillar: Pillar.MARKETS,
    category: "Positioning & Sentiment",
    cadence: Cadence.WEEKLY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://www.cftc.gov/api/cot",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 604800,
    wave_number: 1
  },
  {
    id: "fca_short_positions",
    name: "UK FCA Short Positions Register",
    pillar: Pillar.MARKETS,
    category: "Short Interest",
    cadence: Cadence.DAILY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://www.fca.org.uk/publication/data/short-positions-daily-update.csv",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 86400,
    wave_number: 1
  },
  {
    id: "coingecko",
    name: "CoinGecko Crypto API",
    pillar: Pillar.MARKETS,
    category: "Digital Assets",
    cadence: Cadence.HOURLY,
    licence_class: LicenceClass.COMMERCIAL_INTERNAL_ONLY,
    redistributable: false,
    auth_method: "API_KEY",
    base_url: "https://api.coingecko.com/api/v3",
    quota_per_month: 10000,
    cost_model: "FREE",
    staleness_sla_seconds: 3600,
    wave_number: 1
  },
  {
    id: "defillama",
    name: "DefiLlama TVL & Yield API",
    pillar: Pillar.MARKETS,
    category: "DeFi Analytics",
    cadence: Cadence.HOURLY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://api.llama.fi",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 3600,
    wave_number: 1
  },

  // HORIZON PILLAR
  {
    id: "sec_edgar",
    name: "SEC EDGAR Submissions API",
    pillar: Pillar.HORIZON,
    category: "Corporate Filings",
    cadence: Cadence.HOURLY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "CUSTOM_HEADER",
    base_url: "https://data.sec.gov/submissions",
    quota_per_month: 1000000,
    cost_model: "FREE",
    staleness_sla_seconds: 3600,
    wave_number: 1
  },
  {
    id: "nasdaq_ipo_calendar",
    name: "Nasdaq IPO Calendar Feed",
    pillar: Pillar.HORIZON,
    category: "Capital Markets Events",
    cadence: Cadence.DAILY,
    licence_class: LicenceClass.COMMERCIAL_INTERNAL_ONLY,
    redistributable: false,
    auth_method: "NONE",
    base_url: "https://api.nasdaq.com/api/ipo/calendar",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 86400,
    wave_number: 1
  },
  {
    id: "companies_house",
    name: "UK Companies House API",
    pillar: Pillar.HORIZON,
    category: "UK Corporate Registry",
    cadence: Cadence.DAILY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "API_KEY",
    base_url: "https://api.company-information.service.gov.uk",
    quota_per_month: 60000,
    cost_model: "FREE",
    staleness_sla_seconds: 86400,
    wave_number: 1
  },

  // UNDERCURRENT PILLAR
  {
    id: "usaspending",
    name: "USAspending Federal Contracts API",
    pillar: Pillar.UNDERCURRENT,
    category: "Government Procurement",
    cadence: Cadence.DAILY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://api.usaspending.gov/api/v2",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 86400,
    wave_number: 1
  },
  {
    id: "gleif",
    name: "GLEIF Legal Entity Identifier API",
    pillar: Pillar.UNDERCURRENT,
    category: "Entity Resolution",
    cadence: Cadence.WEEKLY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://api.gleif.org/api/v1",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 604800,
    wave_number: 1
  },
  {
    id: "opencorporates",
    name: "OpenCorporates Global API",
    pillar: Pillar.UNDERCURRENT,
    category: "Corporate Intelligence",
    cadence: Cadence.WEEKLY,
    licence_class: LicenceClass.COMMERCIAL_INTERNAL_ONLY,
    redistributable: false,
    auth_method: "API_KEY",
    base_url: "https://api.opencorporates.com/v0.4",
    quota_per_month: 500,
    cost_model: "FREE",
    staleness_sla_seconds: 604800,
    wave_number: 1
  },

  // ALTERNATIVES PILLAR
  {
    id: "kalshi",
    name: "Kalshi Prediction Market API",
    pillar: Pillar.ALTERNATIVES,
    category: "Event Market Derivatives",
    cadence: Cadence.HOURLY,
    licence_class: LicenceClass.COMMERCIAL_INTERNAL_ONLY,
    redistributable: false,
    auth_method: "API_KEY",
    base_url: "https://api.elections.kalshi.com/trade-api/v2",
    quota_per_month: 50000,
    cost_model: "FREE",
    staleness_sla_seconds: 3600,
    wave_number: 1
  },
  {
    id: "polymarket",
    name: "Polymarket CLOB & Gamma API",
    pillar: Pillar.ALTERNATIVES,
    category: "Prediction Markets",
    cadence: Cadence.HOURLY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://gamma-api.polymarket.com",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 3600,
    wave_number: 1
  },
  {
    id: "manifold",
    name: "Manifold Markets API",
    pillar: Pillar.ALTERNATIVES,
    category: "Play-money Prediction Odds",
    cadence: Cadence.HOURLY,
    licence_class: LicenceClass.PUBLIC_DOMAIN,
    redistributable: true,
    auth_method: "NONE",
    base_url: "https://api.manifold.markets/v0",
    quota_per_month: null,
    cost_model: "FREE",
    staleness_sla_seconds: 3600,
    wave_number: 1
  }
];

export class SourceRegistry {
  private readonly sources: Map<string, SourceRegistryEntry>;

  constructor(entries: readonly SourceRegistryEntry[] = WAVE_1_REGISTRY) {
    this.sources = new Map();
    for (const entry of entries) {
      this.sources.set(entry.id, entry);
    }
  }

  public getSource(id: string): SourceRegistryEntry | undefined {
    return this.sources.get(id);
  }

  public listAll(): readonly SourceRegistryEntry[] {
    return Array.from(this.sources.values());
  }

  public listByPillar(pillar: Pillar): readonly SourceRegistryEntry[] {
    return this.listAll().filter(s => s.pillar === pillar);
  }

  public listByWave(waveNumber: number): readonly SourceRegistryEntry[] {
    return this.listAll().filter(s => s.wave_number === waveNumber);
  }
}
