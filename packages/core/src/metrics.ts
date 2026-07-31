export interface MetricDefinition {
  readonly key: string;
  readonly name: string;
  readonly unit: string;
  readonly scale: number;
  readonly expected_range_min: number;
  readonly expected_range_max: number;
  readonly delta_change_threshold: number; // Percentage or absolute threshold for delta detection
  readonly mapped_source_keys: readonly { readonly source_id: string; readonly source_metric_key: string }[];
}

export const CANONICAL_METRIC_DICTIONARY: readonly MetricDefinition[] = [
  // 1. Dual-Source Mapping Example #1: US GDP Growth / Nowcast
  {
    key: "MACRO_US_GDP",
    name: "US Real GDP (Quarterly / Nowcast)",
    unit: "USD_BILLIONS",
    scale: 2,
    expected_range_min: 15000,
    expected_range_max: 35000,
    delta_change_threshold: 0.02, // 2% change threshold
    mapped_source_keys: [
      { source_id: "fred", source_metric_key: "FRED_GDP" },
      { source_id: "atlanta_fed_gdpnow", source_metric_key: "ATLANTA_FED_GDPNOW" }
    ]
  },

  // 2. Dual-Source Mapping Example #2: US CPI Inflation Rate / Nowcast
  {
    key: "MACRO_US_INFLATION_CPI",
    name: "US Consumer Price Index (CPI / Inflation Nowcast)",
    unit: "INDEX_OR_PERCENT",
    scale: 2,
    expected_range_min: -5,
    expected_range_max: 20,
    delta_change_threshold: 0.005, // 0.5% threshold
    mapped_source_keys: [
      { source_id: "fred", source_metric_key: "FRED_CPIAUCSL" },
      { source_id: "cleveland_fed_nowcast", source_metric_key: "CLEVELAND_FED_INFLATION_NOW" }
    ]
  },

  // 3. Dual-Source Mapping Example #3: Bitcoin Spot Price
  {
    key: "CRYPTO_BTC_PRICE_USD",
    name: "Bitcoin Spot Price (USD)",
    unit: "USD",
    scale: 2,
    expected_range_min: 1000,
    expected_range_max: 250000,
    delta_change_threshold: 0.03, // 3% price move threshold
    mapped_source_keys: [
      { source_id: "coingecko", source_metric_key: "COINGECKO_BITCOIN_PRICE_USD" },
      { source_id: "twelve_data", source_metric_key: "PRICE_BTC_USD" }
    ]
  },

  // Other Canonical Metrics
  {
    key: "TREASURY_TOTAL_PUBLIC_DEBT_USD",
    name: "US Total Public Debt",
    unit: "USD",
    scale: 2,
    expected_range_min: 10000000000000,
    expected_range_max: 50000000000000,
    delta_change_threshold: 0.01,
    mapped_source_keys: [{ source_id: "us_treasury_fiscal", source_metric_key: "TOTAL_DEBT_USD" }]
  },
  {
    key: "NY_FED_SOFR_RATE",
    name: "Secured Overnight Financing Rate (SOFR)",
    unit: "PERCENT",
    scale: 4,
    expected_range_min: 0,
    expected_range_max: 15,
    delta_change_threshold: 0.001,
    mapped_source_keys: [{ source_id: "ny_fed", source_metric_key: "SOFR_RATE" }]
  },
  {
    key: "ENERGY_CRUDE_OIL_INVENTORY_BARRELS",
    name: "US Weekly Crude Oil Stocks",
    unit: "BARRELS",
    scale: 0,
    expected_range_min: 100000000,
    expected_range_max: 1000000000,
    delta_change_threshold: 0.02,
    mapped_source_keys: [{ source_id: "eia", source_metric_key: "CRUDE_STOCKS_BARRELS" }]
  }
];

export function getCanonicalMetric(key: string): MetricDefinition | undefined {
  return CANONICAL_METRIC_DICTIONARY.find(m => m.key === key);
}
