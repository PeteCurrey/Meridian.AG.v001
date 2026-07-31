export * from "./adapter_interface.ts";
export * from "./storage.ts";
export * from "./sources/fred.ts";
export * from "./sources/twelve_data.ts";
export * from "./sources/sec_edgar.ts";
export * from "./sources/usaspending.ts";
export * from "./sources/kalshi.ts";
export * from "./sources/gdelt.ts";

import type { Adapter } from "./adapter_interface.ts";
import { FredAdapter } from "./sources/fred.ts";
import { TwelveDataAdapter } from "./sources/twelve_data.ts";
import { SecEdgarAdapter } from "./sources/sec_edgar.ts";
import { USAspendingAdapter } from "./sources/usaspending.ts";
import { KalshiAdapter } from "./sources/kalshi.ts";
import { GdeltAdapter } from "./sources/gdelt.ts";

export class AdapterFactory {
  private static readonly adaptersMap = new Map<string, Adapter>([
    ["fred", new FredAdapter()],
    ["twelve_data", new TwelveDataAdapter()],
    ["sec_edgar", new SecEdgarAdapter()],
    ["usaspending", new USAspendingAdapter()],
    ["kalshi", new KalshiAdapter()],
    ["gdelt", new GdeltAdapter()]
  ]);

  public static getAdapter(sourceId: string): Adapter | undefined {
    return this.adaptersMap.get(sourceId);
  }

  public static listAdapterIds(): string[] {
    return Array.from(this.adaptersMap.keys());
  }
}
