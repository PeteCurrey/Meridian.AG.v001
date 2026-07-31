export * from "./detectors/delta.ts";
export * from "./detectors/disagreement.ts";
export * from "./detectors/anomaly.ts";
export * from "./detectors/absence.ts";
export * from "./salience.ts";

import { DeltaDetector } from "./detectors/delta.ts";
import { DisagreementDetector } from "./detectors/disagreement.ts";
import { AnomalyDetector } from "./detectors/anomaly.ts";
import { AbsenceDetector } from "./detectors/absence.ts";
import { SalienceEngine, BookContext } from "./salience.ts";
import type { Signal, Observation } from "../../core/src/index.ts";

export class SignalEngine {
  private readonly deltaDetector = new DeltaDetector();
  private readonly disagreementDetector = new DisagreementDetector();
  private readonly anomalyDetector = new AnomalyDetector();
  private readonly absenceDetector = new AbsenceDetector();
  private readonly salienceEngine = new SalienceEngine();

  public processObservations(
    observations: readonly Observation[],
    previousObservations: Map<string, Observation>,
    bookContext: BookContext
  ): Signal[] {
    const signals: Signal[] = [];

    for (const obs of observations) {
      // 1. Delta Detection
      const prev = previousObservations.get(`${obs.source_id}:${obs.metric_key}`) || null;
      const deltaSig = this.deltaDetector.detect(obs, prev);
      if (deltaSig) {
        signals.push(this.enrichSignal(deltaSig, bookContext));
      }

      // 2. Anomaly Detection (Simulated historical stats)
      const mean = Number(obs.value) * 0.8;
      const stddev = Number(obs.value) * 0.05;
      const anomalySig = this.anomalyDetector.detect(obs, mean, stddev);
      if (anomalySig) {
        signals.push(this.enrichSignal(anomalySig, bookContext));
      }
    }

    // 3. Disagreement Detection across dual-source observations
    for (let i = 0; i < observations.length; i++) {
      for (let j = i + 1; j < observations.length; j++) {
        const obsA = observations[i]!;
        const obsB = observations[j]!;
        if (obsA.metric_key === obsB.metric_key) {
          const disagSig = this.disagreementDetector.detect(obsA, obsB);
          if (disagSig) {
            signals.push(this.enrichSignal(disagSig, bookContext));
          }
        }
      }
    }

    return signals.sort((a, b) => b.salience_score - a.salience_score);
  }

  private enrichSignal(signal: Signal, context: BookContext): Signal {
    const score = this.salienceEngine.calculateSalience(signal, context);
    return { ...signal, salience_score: score };
  }
}
