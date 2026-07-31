export * from "./adapter_interface.ts";
export * from "./storage.ts";
export * from "./sources/fred.ts";
export * from "./sources/us_treasury_fiscal.ts";
export * from "./sources/ny_fed.ts";
export * from "./sources/atlanta_fed_gdpnow.ts";
export * from "./sources/cleveland_fed_nowcast.ts";
export * from "./sources/gdelt.ts";
export * from "./sources/eia.ts";
export * from "./sources/twelve_data.ts";
export * from "./sources/finnhub.ts";
export * from "./sources/cftc_cot.ts";
export * from "./sources/fca_short_positions.ts";
export * from "./sources/coingecko.ts";
export * from "./sources/defillama.ts";
export * from "./sources/sec_edgar.ts";
export * from "./sources/nasdaq_ipo_calendar.ts";
export * from "./sources/companies_house.ts";
export * from "./sources/usaspending.ts";
export * from "./sources/gleif.ts";
export * from "./sources/opencorporates.ts";
export * from "./sources/kalshi.ts";
export * from "./sources/polymarket.ts";
export * from "./sources/manifold.ts";
export * from "./wave2.ts";

import type { Adapter } from "./adapter_interface.ts";
import { FredAdapter } from "./sources/fred.ts";
import { UsTreasuryFiscalAdapter } from "./sources/us_treasury_fiscal.ts";
import { NyFedAdapter } from "./sources/ny_fed.ts";
import { AtlantaFedGdpNowAdapter } from "./sources/atlanta_fed_gdpnow.ts";
import { ClevelandFedNowcastAdapter } from "./sources/cleveland_fed_nowcast.ts";
import { GdeltAdapter } from "./sources/gdelt.ts";
import { EiaAdapter } from "./sources/eia.ts";
import { TwelveDataAdapter } from "./sources/twelve_data.ts";
import { FinnhubAdapter } from "./sources/finnhub.ts";
import { CftcCotAdapter } from "./sources/cftc_cot.ts";
import { FcaShortPositionsAdapter } from "./sources/fca_short_positions.ts";
import { CoinGeckoAdapter } from "./sources/coingecko.ts";
import { DefiLlamaAdapter } from "./sources/defillama.ts";
import { SecEdgarAdapter } from "./sources/sec_edgar.ts";
import { NasdaqIpoCalendarAdapter } from "./sources/nasdaq_ipo_calendar.ts";
import { CompaniesHouseAdapter } from "./sources/companies_house.ts";
import { USAspendingAdapter } from "./sources/usaspending.ts";
import { GleifAdapter } from "./sources/gleif.ts";
import { OpenCorporatesAdapter } from "./sources/opencorporates.ts";
import { KalshiAdapter } from "./sources/kalshi.ts";
import { PolymarketAdapter } from "./sources/polymarket.ts";
import { ManifoldAdapter } from "./sources/manifold.ts";
import { wave2AdaptersMap } from "./wave2.ts";

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
