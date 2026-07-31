import { Pillar, LicenceClass, Observation, ScaledInteger } from "../src/index.js";

export const SYNTHETIC_OBSERVATION: Observation = {
  id: "00000000-0000-0000-0000-000000000001",
  source_id: "fred",
  pillar: Pillar.WORLD,
  entity_id: null,
  metric_key: "GDP_GROWTH_RATE",
  value: 250n as ScaledInteger,
  raw_ref: "r2://payloads/2026-07/fred_001.json",
  licence_class: LicenceClass.PUBLIC_DOMAIN,
  source_timestamp: "2026-07-31T00:00:00Z",
  captured_at: "2026-07-31T00:01:00Z"
};
