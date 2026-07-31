export * from "./detectors/delta.ts";
export * from "./detectors/disagreement.ts";
export * from "./detectors/anomaly.ts";
export * from "./detectors/absence.ts";
export * from "./salience.ts";

import { DeltaDetector } from "./detectors/delta.ts";
import { DisagreementDetector } from "./detectors/disagreement.ts";
import { AnomalyDetector } from "./detectors/anomaly.ts";
import { AbsenceDetector } from "./detectors/absence.ts";
import { SalienceEngine } from "./salience.ts";
import type { BookContext } from "./salience.ts";
import type { Observation, Signal } from "../../core/src/index.ts";

export class EdgeEngine {
  private readonly deltaDetector = new DeltaDetector();
  private readonly disagreementDetector = new DisagreementDetector();
  private readonly anomalyDetector = new AnomalyDetector();
  private readonly absenceDetector = new AbsenceDetector();
  private readonly salienceEngine = new SalienceEngine();

  public evaluateObservations(
    currentObsList: readonly Observation[],
    historicalObsMap: Map<string, readonly Observation[]>,
    bookContext: BookContext
  ): readonly Signal[] {
    const rawSignals: Signal[] = [];

    // 1. Delta Detection
    for (const obs of currentObsList) {
      const history = historicalObsMap.get(obs.metric_key) || [];
      const prev = history.length > 0 ? history[history.length - 1] : null;
      const deltaSignal = this.deltaDetector.detect(obs, prev || null);
      if (deltaSignal) rawSignals.push(deltaSignal);
    }

    // 2. Disagreement Detection (Cross-source)
    const metricGroups = new Map<string, Observation[]>();
    for (const obs of currentObsList) {
      const group = metricGroups.get(obs.metric_key) || [];
      group.push(obs);
      metricGroups.set(obs.metric_key, group);
    }

    for (const [, group] of metricGroups.entries()) {
      if (group.length >= 2) {
        const disagreementSignal = this.disagreementDetector.detect(group[0], group[1]);
        if (disagreementSignal) rawSignals.push(disagreementSignal);
      }
    }

    // 3. Anomaly Detection (> 3-sigma Outlier)
    for (const obs of currentObsList) {
      const history = historicalObsMap.get(obs.metric_key) || [];
      const anomalySignal = this.anomalyDetector.detect(obs, history);
      if (anomalySignal) rawSignals.push(anomalySignal);
    }

    // 4. Salience Ranking
    return this.salienceEngine.rankSignals(rawSignals, bookContext);
  }
}
