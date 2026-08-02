export * from "./adapter_interface";
export * from "./storage";
export * from "./sources/fred";
export * from "./sources/us_treasury_fiscal";
export * from "./sources/ny_fed";
export * from "./sources/atlanta_fed_gdpnow";
export * from "./sources/cleveland_fed_nowcast";
export * from "./sources/gdelt";
export * from "./sources/eia";
export * from "./sources/twelve_data";
export * from "./sources/finnhub";
export * from "./sources/cftc_cot";
export * from "./sources/fca_short_positions";
export * from "./sources/coingecko";
export * from "./sources/defillama";
export * from "./sources/sec_edgar";
export * from "./sources/nasdaq_ipo_calendar";
export * from "./sources/companies_house";
export * from "./sources/usaspending";
export * from "./sources/gleif";
export * from "./sources/opencorporates";
export * from "./sources/kalshi";
export * from "./sources/polymarket";
export * from "./sources/manifold";
export * from "./wave2";

import type { Adapter } from "./adapter_interface";
import { FredAdapter } from "./sources/fred";
import { UsTreasuryFiscalAdapter } from "./sources/us_treasury_fiscal";
import { NyFedAdapter } from "./sources/ny_fed";
import { AtlantaFedGdpNowAdapter } from "./sources/atlanta_fed_gdpnow";
import { ClevelandFedNowcastAdapter } from "./sources/cleveland_fed_nowcast";
import { GdeltAdapter } from "./sources/gdelt";
import { EiaAdapter } from "./sources/eia";
import { TwelveDataAdapter } from "./sources/twelve_data";
import { FinnhubAdapter } from "./sources/finnhub";
import { CftcCotAdapter } from "./sources/cftc_cot";
import { FcaShortPositionsAdapter } from "./sources/fca_short_positions";
import { CoinGeckoAdapter } from "./sources/coingecko";
import { DefiLlamaAdapter } from "./sources/defillama";
import { SecEdgarAdapter } from "./sources/sec_edgar";
import { NasdaqIpoCalendarAdapter } from "./sources/nasdaq_ipo_calendar";
import { CompaniesHouseAdapter } from "./sources/companies_house";
import { USAspendingAdapter } from "./sources/usaspending";
import { GleifAdapter } from "./sources/gleif";
import { OpenCorporatesAdapter } from "./sources/opencorporates";
import { KalshiAdapter } from "./sources/kalshi";
import { PolymarketAdapter } from "./sources/polymarket";
import { ManifoldAdapter } from "./sources/manifold";
import { wave2AdaptersMap } from "./wave2";

export class AdapterFactory {
  private static readonly adaptersMap = new Map<string, Adapter>([
    ["fred", new FredAdapter()],
    ["us_treasury_fiscal", new UsTreasuryFiscalAdapter()],
    ["ny_fed", new NyFedAdapter()],
    ["atlanta_fed_gdpnow", new AtlantaFedGdpNowAdapter()],
    ["cleveland_fed_nowcast", new ClevelandFedNowcastAdapter()],
    ["gdelt", new GdeltAdapter()],
    ["eia", new EiaAdapter()],
    ["twelve_data", new TwelveDataAdapter()],
    ["finnhub", new FinnhubAdapter()],
    ["cftc_cot", new CftcCotAdapter()],
    ["fca_short_positions", new FcaShortPositionsAdapter()],
    ["coingecko", new CoinGeckoAdapter()],
    ["defillama", new DefiLlamaAdapter()],
    ["sec_edgar", new SecEdgarAdapter()],
    ["nasdaq_ipo_calendar", new NasdaqIpoCalendarAdapter()],
    ["companies_house", new CompaniesHouseAdapter()],
    ["usaspending", new USAspendingAdapter()],
    ["gleif", new GleifAdapter()],
    ["opencorporates", new OpenCorporatesAdapter()],
    ["kalshi", new KalshiAdapter()],
    ["polymarket", new PolymarketAdapter()],
    ["manifold", new ManifoldAdapter()],

    // Wave 2 Adapters
    ...Array.from(wave2AdaptersMap.entries())
  ]);

  public static getAdapter(sourceId: string): Adapter | undefined {
    return this.adaptersMap.get(sourceId);
  }

  public static listAdapterIds(): string[] {
    return Array.from(this.adaptersMap.keys());
  }
}
