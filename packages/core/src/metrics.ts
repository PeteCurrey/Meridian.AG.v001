export interface CanonicalMetricDefinition {
  readonly canonical_key: string;
  readonly display_name: string;
  readonly description: string;
  readonly unit: string;
  readonly primary_source_id: string;
  readonly secondary_source_id?: string;
  readonly divergence_threshold_pct?: number;
}

export const CANONICAL_METRIC_DICTIONARY: Record<string, CanonicalMetricDefinition> = {
  // Wave 1 Dual-Source Mappings
  MACRO_US_GDP: {
    canonical_key: "MACRO_US_GDP",
    display_name: "US Gross Domestic Product",
    description: "Annualized nominal GDP of the United States in USD billions.",
    unit: "USD_BILLIONS",
    primary_source_id: "fred",
    secondary_source_id: "us_treasury_fiscal",
    divergence_threshold_pct: 2.0
  },
  MACRO_US_INFLATION_CPI: {
    canonical_key: "MACRO_US_INFLATION_CPI",
    display_name: "US Consumer Price Index (CPI)",
    description: "Consumer price index year-over-year percentage change.",
    unit: "PERCENTAGE",
    primary_source_id: "fred",
    secondary_source_id: "cleveland_fed_nowcast",
    divergence_threshold_pct: 0.5
  },
  CRYPTO_BTC_PRICE_USD: {
    canonical_key: "CRYPTO_BTC_PRICE_USD",
    display_name: "Bitcoin Spot Price (USD)",
    description: "Bitcoin spot trading price in USD.",
    unit: "USD",
    primary_source_id: "coingecko",
    secondary_source_id: "defillama",
    divergence_threshold_pct: 1.0
  },
  FED_RATE_CUT_PROBABILITY: {
    canonical_key: "FED_RATE_CUT_PROBABILITY",
    display_name: "Fed Interest Rate Cut Probability",
    description: "Implied probability of a Fed rate cut at next FOMC meeting.",
    unit: "PERCENTAGE",
    primary_source_id: "polymarket",
    secondary_source_id: "kalshi",
    divergence_threshold_pct: 10.0
  },

  // Wave 2 Expansion Dual-Source & Single-Source Metrics (~25 total)
  MACRO_CREDIT_TO_GDP: {
    canonical_key: "MACRO_CREDIT_TO_GDP",
    display_name: "Credit to Non-Financial Sector (% of GDP)",
    description: "Total credit extended to non-financial private sector as % of GDP.",
    unit: "PERCENTAGE",
    primary_source_id: "bis",
    secondary_source_id: "fred",
    divergence_threshold_pct: 5.0
  },
  MACRO_GLOBAL_GROWTH: {
    canonical_key: "MACRO_GLOBAL_GROWTH",
    display_name: "Global Real GDP Growth Rate",
    description: "Annualized global real GDP growth rate forecast.",
    unit: "PERCENTAGE",
    primary_source_id: "imf",
    secondary_source_id: "world_bank",
    divergence_threshold_pct: 5.0
  },
  MACRO_COMPOSITE_LEADING_INDICATOR: {
    canonical_key: "MACRO_COMPOSITE_LEADING_INDICATOR",
    display_name: "OECD Composite Leading Indicator",
    description: "Leading economic indicator amplitude adjusted index.",
    unit: "INDEX",
    primary_source_id: "oecd"
  },
  MACRO_ECB_DEPOSIT_RATE: {
    canonical_key: "MACRO_ECB_DEPOSIT_RATE",
    display_name: "ECB Deposit Facility Rate",
    description: "European Central Bank deposit facility key rate.",
    unit: "PERCENTAGE",
    primary_source_id: "ecb"
  },
  MACRO_BOE_BASE_RATE: {
    canonical_key: "MACRO_BOE_BASE_RATE",
    display_name: "Bank of England Official Bank Rate",
    description: "BoE benchmark interest rate.",
    unit: "PERCENTAGE",
    primary_source_id: "bank_of_england"
  },
  MARKET_SP500_INDEX: {
    canonical_key: "MARKET_SP500_INDEX",
    display_name: "S&P 500 Index Level",
    description: "US equity market benchmark index level.",
    unit: "INDEX",
    primary_source_id: "yahoo_finance",
    secondary_source_id: "polygon",
    divergence_threshold_pct: 1.0
  },
  MARKET_US_EQUITY_VOLATILITY: {
    canonical_key: "MARKET_US_EQUITY_VOLATILITY",
    display_name: "US Equity Market Volatility (VIX)",
    description: "CBOE Volatility Index level.",
    unit: "INDEX",
    primary_source_id: "polygon"
  },
  CRYPTO_BTC_OPEN_INTEREST: {
    canonical_key: "CRYPTO_BTC_OPEN_INTEREST",
    display_name: "Bitcoin Derivatives Open Interest",
    description: "Aggregate open interest across crypto derivatives exchanges in USD.",
    unit: "USD",
    primary_source_id: "coinglass"
  },
  CRYPTO_BTC_OPTIONS_IV: {
    canonical_key: "CRYPTO_BTC_OPTIONS_IV",
    display_name: "Bitcoin Options Implied Volatility",
    description: "Deribit Bitcoin 30-day implied volatility index.",
    unit: "PERCENTAGE",
    primary_source_id: "deribit"
  },
  PATENTS_US_GRANTED_WEEKLY: {
    canonical_key: "PATENTS_US_GRANTED_WEEKLY",
    display_name: "USPTO Weekly Granted Patents",
    description: "Count of patents granted by USPTO in current week.",
    unit: "COUNT",
    primary_source_id: "uspto"
  },
  PATENTS_EPO_APPLICATIONS: {
    canonical_key: "PATENTS_EPO_APPLICATIONS",
    display_name: "EPO European Patent Applications",
    description: "European Patent Office patent applications count.",
    unit: "COUNT",
    primary_source_id: "epo"
  },
  HEALTH_CLINICAL_TRIALS_PHASE3: {
    canonical_key: "HEALTH_CLINICAL_TRIALS_PHASE3",
    display_name: "Active Phase 3 Clinical Trials",
    description: "Count of active Phase 3 clinical trials on ClinicalTrials.gov.",
    unit: "COUNT",
    primary_source_id: "clinical_trials"
  },
  RESEARCH_AI_PAPERS_WEEKLY: {
    canonical_key: "RESEARCH_AI_PAPERS_WEEKLY",
    display_name: "arXiv AI/CS Submissions Weekly",
    description: "Weekly count of computer science and artificial intelligence research submissions.",
    unit: "COUNT",
    primary_source_id: "arxiv"
  },
  SANCTIONS_DESIGNATIONS_TOTAL: {
    canonical_key: "SANCTIONS_DESIGNATIONS_TOTAL",
    display_name: "Active Global Sanctions Designations",
    description: "Total active designated entities across global sanctions lists.",
    unit: "COUNT",
    primary_source_id: "opensanctions"
  },
  GOV_SAM_EXCLUSIONS_ACTIVE: {
    canonical_key: "GOV_SAM_EXCLUSIONS_ACTIVE",
    display_name: "SAM.gov Active Vendor Exclusions",
    description: "Count of active excluded vendors in US federal procurement.",
    unit: "COUNT",
    primary_source_id: "sam_gov"
  },
  UK_CORPORATE_INSOLVENCIES_MONTHLY: {
    canonical_key: "UK_CORPORATE_INSOLVENCIES_MONTHLY",
    display_name: "UK Corporate Insolvency Notices",
    description: "Monthly count of UK corporate insolvency notices published in the Gazette.",
    unit: "COUNT",
    primary_source_id: "uk_gazette"
  },
  PREDICTION_FED_CUT_PROBABILITY: {
    canonical_key: "PREDICTION_FED_CUT_PROBABILITY",
    display_name: "PredictIt Fed Cut Implied Odds",
    description: "PredictIt political contract implied probability of Fed interest rate cuts.",
    unit: "PERCENTAGE",
    primary_source_id: "predictit"
  },
  FORECAST_AGI_TIMELINE_YEAR: {
    canonical_key: "FORECAST_AGI_TIMELINE_YEAR",
    display_name: "Metaculus AGI Median Arrival Year",
    description: "Metaculus crowd forecasting median expected arrival year for AGI.",
    unit: "YEAR",
    primary_source_id: "metaculus"
  }
};

export function getCanonicalMetric(metricKey: string): CanonicalMetricDefinition | undefined {
  return CANONICAL_METRIC_DICTIONARY[metricKey];
}
