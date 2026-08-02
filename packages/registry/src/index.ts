import { Pillar, LicenceClass } from "../../core/src/index";

export interface SourceDefinition {
  readonly id: string;
  readonly name: string;
  readonly pillar: Pillar;
  readonly description: string;
  readonly licence_class: LicenceClass;
  readonly cadence: string;
  readonly sla_seconds: number;
  readonly auth_method?: string;
  readonly base_url?: string;
}

export class SourceRegistry {
  private readonly sources: Map<string, SourceDefinition> = new Map();

  constructor() {
    // Wave 1 Sources (~18)
    this.register({ id: "fred", name: "Federal Reserve Economic Data (FRED)", pillar: Pillar.WORLD, description: "St. Louis Fed Economic Data", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400, auth_method: "API_KEY", base_url: "https://api.stlouisfed.org" });
    this.register({ id: "us_treasury_fiscal", name: "US Treasury Fiscal Data", pillar: Pillar.WORLD, description: "US Debt and Interest Rates", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });
    this.register({ id: "ny_fed", name: "New York Fed", pillar: Pillar.WORLD, description: "NY Fed Market Data", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });
    this.register({ id: "atlanta_fed_gdpnow", name: "Atlanta Fed GDPNow", pillar: Pillar.WORLD, description: "GDP Growth Estimate", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "WEEKLY", sla_seconds: 604800 });
    this.register({ id: "cleveland_fed_nowcast", name: "Cleveland Fed Inflation Nowcast", pillar: Pillar.WORLD, description: "Inflation Forecast", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });
    this.register({ id: "gdelt", name: "GDELT Project", pillar: Pillar.WORLD, description: "Global Event and Tone Index", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "REALTIME", sla_seconds: 900 });
    this.register({ id: "eia", name: "EIA Energy Information Admin", pillar: Pillar.WORLD, description: "Energy Statistics", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "WEEKLY", sla_seconds: 604800 });

    this.register({ id: "twelve_data", name: "Twelve Data", pillar: Pillar.MARKETS, description: "Global Market Data API", licence_class: LicenceClass.PROPRIETARY, cadence: "REALTIME", sla_seconds: 300, auth_method: "API_KEY" });
    this.register({ id: "finnhub", name: "Finnhub Stock API", pillar: Pillar.MARKETS, description: "Stock Market Data", licence_class: LicenceClass.PROPRIETARY, cadence: "REALTIME", sla_seconds: 300, auth_method: "API_KEY" });
    this.register({ id: "cftc_cot", name: "CFTC Commitment of Traders", pillar: Pillar.MARKETS, description: "Futures Positions", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "WEEKLY", sla_seconds: 604800 });
    this.register({ id: "fca_short_positions", name: "FCA Short Positions", pillar: Pillar.MARKETS, description: "UK Short Position Disclosures", licence_class: LicenceClass.REGULATORY, cadence: "DAILY", sla_seconds: 86400 });
    this.register({ id: "coingecko", name: "CoinGecko API", pillar: Pillar.MARKETS, description: "Crypto Market Prices", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "REALTIME", sla_seconds: 600 });
    this.register({ id: "defillama", name: "DefiLlama", pillar: Pillar.MARKETS, description: "DeFi TVL and Yield Data", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "HOURLY", sla_seconds: 3600 });

    this.register({ id: "sec_edgar", name: "SEC EDGAR System", pillar: Pillar.HORIZON, description: "Corporate Filings 10-K, 10-Q, S-1", licence_class: LicenceClass.REGULATORY, cadence: "REALTIME", sla_seconds: 1800, auth_method: "USER_AGENT" });
    this.register({ id: "nasdaq_ipo_calendar", name: "Nasdaq IPO Calendar", pillar: Pillar.HORIZON, description: "Upcoming IPO Filings", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });
    this.register({ id: "companies_house", name: "Companies House UK", pillar: Pillar.HORIZON, description: "UK Corporate Registry", licence_class: LicenceClass.REGULATORY, cadence: "DAILY", sla_seconds: 86400, auth_method: "API_KEY" });

    this.register({ id: "usaspending", name: "USAspending.gov", pillar: Pillar.UNDERCURRENT, description: "US Federal Award Contracts", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });
    this.register({ id: "gleif", name: "GLEIF LEI Registry", pillar: Pillar.UNDERCURRENT, description: "Legal Entity Identifier Data", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });
    this.register({ id: "opencorporates", name: "OpenCorporates", pillar: Pillar.UNDERCURRENT, description: "Global Corporate Database", licence_class: LicenceClass.COMMERCIAL, cadence: "WEEKLY", sla_seconds: 604800 });

    this.register({ id: "kalshi", name: "Kalshi Prediction Exchange", pillar: Pillar.ALTERNATIVES, description: "Regulated Prediction Markets", licence_class: LicenceClass.COMMERCIAL, cadence: "REALTIME", sla_seconds: 300, auth_method: "API_KEY" });
    this.register({ id: "polymarket", name: "Polymarket API", pillar: Pillar.ALTERNATIVES, description: "Decentralized Prediction Market", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "REALTIME", sla_seconds: 300 });
    this.register({ id: "manifold", name: "Manifold Markets", pillar: Pillar.ALTERNATIVES, description: "Play-Money Prediction Platform", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "HOURLY", sla_seconds: 3600 });

    // Wave 2 Expansion Sources (~17)
    this.register({ id: "bis", name: "Bank for International Settlements", pillar: Pillar.WORLD, description: "BIS Macro Credit & REER Statistics", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "MONTHLY", sla_seconds: 2592000 });
    this.register({ id: "oecd", name: "OECD Data API", pillar: Pillar.WORLD, description: "OECD Composite Leading Indicators", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "MONTHLY", sla_seconds: 2592000 });
    this.register({ id: "imf", name: "IMF DataMapper API", pillar: Pillar.WORLD, description: "IMF World Economic Outlook Series", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "MONTHLY", sla_seconds: 2592000 });
    this.register({ id: "world_bank", name: "World Bank API", pillar: Pillar.WORLD, description: "World Bank Economic Indicators", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "MONTHLY", sla_seconds: 2592000 });
    this.register({ id: "ecb", name: "European Central Bank SDW", pillar: Pillar.WORLD, description: "ECB Statistical Data Warehouse", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });
    this.register({ id: "bank_of_england", name: "Bank of England Database", pillar: Pillar.WORLD, description: "BoE Benchmark Interest Rates", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });

    this.register({ id: "yahoo_finance", name: "Yahoo Finance Fallback", pillar: Pillar.MARKETS, description: "Global Market Benchmarks", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "REALTIME", sla_seconds: 300 });
    this.register({ id: "polygon", name: "Polygon.io", pillar: Pillar.MARKETS, description: "US Equity & Options Data", licence_class: LicenceClass.PROPRIETARY, cadence: "REALTIME", sla_seconds: 300 });
    this.register({ id: "coinglass", name: "Coinglass Derivatives", pillar: Pillar.MARKETS, description: "Crypto Derivatives Open Interest", licence_class: LicenceClass.COMMERCIAL, cadence: "HOURLY", sla_seconds: 3600 });
    this.register({ id: "deribit", name: "Deribit Options", pillar: Pillar.MARKETS, description: "Crypto Options Implied Volatility", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "HOURLY", sla_seconds: 3600 });

    this.register({ id: "uspto", name: "USPTO Patent Grants API", pillar: Pillar.HORIZON, description: "US Patent Grants and Filings", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "WEEKLY", sla_seconds: 604800 });
    this.register({ id: "epo", name: "EPO Open Patent Services", pillar: Pillar.HORIZON, description: "European Patent Office Filings", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "WEEKLY", sla_seconds: 604800 });
    this.register({ id: "clinical_trials", name: "ClinicalTrials.gov v2", pillar: Pillar.HORIZON, description: "Clinical Trial Status Changes", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });
    this.register({ id: "arxiv", name: "arXiv API", pillar: Pillar.HORIZON, description: "AI and CS Research Preprints", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });

    this.register({ id: "opensanctions", name: "OpenSanctions", pillar: Pillar.UNDERCURRENT, description: "International Sanctions & PEP List", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });
    this.register({ id: "sam_gov", name: "SAM.gov API", pillar: Pillar.UNDERCURRENT, description: "US Federal Exclusions & Registrations", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });
    this.register({ id: "uk_gazette", name: "UK Gazette Notices", pillar: Pillar.UNDERCURRENT, description: "Corporate Insolvency Notices", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });

    this.register({ id: "predictit", name: "PredictIt API", pillar: Pillar.ALTERNATIVES, description: "Political Prediction Contracts", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "REALTIME", sla_seconds: 300 });
    this.register({ id: "metaculus", name: "Metaculus API", pillar: Pillar.ALTERNATIVES, description: "Crowd Forecasting Platform", licence_class: LicenceClass.PUBLIC_DOMAIN, cadence: "DAILY", sla_seconds: 86400 });
  }

  public register(source: SourceDefinition): void {
    this.sources.set(source.id, source);
  }

  public get(id: string): SourceDefinition | undefined {
    return this.sources.get(id);
  }

  public getSource(id: string): SourceDefinition | undefined {
    return this.sources.get(id);
  }

  public listAll(): readonly SourceDefinition[] {
    return Array.from(this.sources.values());
  }

  public listByPillar(pillar: Pillar): readonly SourceDefinition[] {
    return this.listAll().filter((s) => s.pillar === pillar);
  }
}

export type SourceRegistryEntry = SourceDefinition;
