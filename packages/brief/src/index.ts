import { Pillar } from "../../core/src/index";
import type { Signal, Observation, BookThesis, BookQuestion } from "../../core/src/index";
import { LLMClient } from "../../llm/src/index";
import type { LLMBriefOutput } from "../../llm/src/index";

export interface CitationRef {
  readonly ref_id: string; // observation_id or signal_id
  readonly ref_type: "OBSERVATION" | "SIGNAL";
  readonly summary: string;
}

export interface BriefItem {
  readonly id: string;
  readonly text: string;
  readonly citation: CitationRef; // MANDATORY PROVENANCE CITATION
  readonly linked_entity_id: string | null;
}

export interface ThesisStatusEvaluation {
  readonly thesis_id: string;
  readonly thesis_statement: string;
  readonly status: "HEALTHY" | "FALSIFICATION_RISK";
  readonly confidence: number;
  readonly falsification_condition: string;
  readonly triggering_signal: Signal | null;
  readonly citation: CitationRef;
}

export interface QuestionProgressEvaluation {
  readonly question_id: string;
  readonly question_text: string;
  readonly findings_summary: string;
  readonly citation: CitationRef;
}

export interface DailyBrief {
  readonly id: string;
  readonly generated_at: string;
  readonly window_start: string;
  readonly window_end: string;
  readonly executive_summary: string;
  readonly what_changed: readonly BriefItem[];
  readonly what_disagrees: readonly BriefItem[];
  readonly thesis_evaluations: readonly ThesisStatusEvaluation[];
  readonly question_progress: readonly QuestionProgressEvaluation[];
}

export class BriefEngine {
  private readonly llmClient: LLMClient;

  constructor(llmClient: LLMClient = new LLMClient()) {
    this.llmClient = llmClient;
  }

  public async generateBrief(
    windowStartIso: string,
    windowEndIso: string,
    signals: readonly Signal[],
    observations: readonly Observation[],
    theses: readonly BookThesis[],
    questions: readonly BookQuestion[]
  ): Promise<DailyBrief> {
    // 1. What Changed (Deltas, Anomalies, Absences)
    const whatChanged: BriefItem[] = signals
      .filter(s => s.signal_type !== "DISAGREEMENT")
      .map(s => ({
        id: crypto.randomUUID(),
        text: `${s.primary_source_id}:${s.canonical_metric_key} — ${s.narrative_summary}`,
        citation: {
          ref_id: s.id,
          ref_type: "SIGNAL",
          summary: s.narrative_summary
        },
        linked_entity_id: s.linked_entity_id
      }));

    // 2. What Disagrees (Cross-source divergence)
    const whatDisagrees: BriefItem[] = signals
      .filter(s => s.signal_type === "DISAGREEMENT")
      .map(s => ({
        id: crypto.randomUUID(),
        text: `Cross-source divergence on ${s.canonical_metric_key}: ${s.primary_source_id} vs ${s.secondary_source_id} (Diverged ${s.divergence_pct}%)`,
        citation: {
          ref_id: s.id,
          ref_type: "SIGNAL",
          summary: s.narrative_summary
        },
        linked_entity_id: s.linked_entity_id
      }));

    // 3. Thesis Status Evaluation
    const thesisEvaluations: ThesisStatusEvaluation[] = theses.map(th => {
      const riskSignal = signals.find(s =>
        s.touches_thesis_falsification ||
        (s.linked_entity_id && th.linked_entity_ids.includes(s.linked_entity_id) && s.signal_type === "DISAGREEMENT")
      ) || null;

      const isRisk = Boolean(riskSignal);

      return {
        thesis_id: th.id,
        thesis_statement: th.text,
        status: isRisk ? "FALSIFICATION_RISK" : "HEALTHY",
        confidence: isRisk ? Math.max(10, th.confidence - 30) : th.confidence,
        falsification_condition: th.falsification_condition,
        triggering_signal: riskSignal,
        citation: {
          ref_id: riskSignal ? riskSignal.id : th.id,
          ref_type: riskSignal ? "SIGNAL" : "OBSERVATION",
          summary: riskSignal
            ? `Triggered by ${riskSignal.signal_type} signal: ${riskSignal.narrative_summary}`
            : "No falsification triggers detected in 24h window."
        }
      };
    });

    // 4. Standing Question Progress
    const questionProgress: QuestionProgressEvaluation[] = questions.map(q => {
      const relevantObs = observations[0];
      return {
        question_id: q.id,
        question_text: q.question_text,
        findings_summary: relevantObs
          ? `Captured observation ${relevantObs.metric_key} from ${relevantObs.source_id} (${relevantObs.value})`
          : "No new data captured in current window.",
        citation: {
          ref_id: relevantObs ? relevantObs.id : q.id,
          ref_type: "OBSERVATION",
          summary: relevantObs ? `Observed ${relevantObs.metric_key}` : "Zero observations"
        }
      };
    });

    const isThin = signals.length === 0 && observations.length === 0;

    const fallbackBriefOutput: LLMBriefOutput = {
      executive_summary: isThin
        ? "DATA THIN: Zero observations or signals captured in 24h window. Automation pipeline active."
        : `DAILY EXECUTIVE BRIEF: ${signals.length} active signals detected across ${observations.length} observations. ${thesisEvaluations.filter(t => t.status === "FALSIFICATION_RISK").length} thesis flagged for FALSIFICATION RISK.`,
      what_changed: whatChanged,
      what_disagrees: whatDisagrees,
      thesis_evaluations: thesisEvaluations,
      question_progress: questionProgress
    };

    const contextText = `Observations:\n${observations.map(o => `[${o.id}] ${o.source_id}:${o.metric_key} = ${o.value}`).join("\n")}\nSignals:\n${signals.map(s => `[${s.id}] ${s.narrative_summary}`).join("\n")}`;

    const llmRes = await this.llmClient.generateStructuredBrief(contextText, fallbackBriefOutput);
    const briefContent = llmRes.ok ? llmRes.value : fallbackBriefOutput;

    return {
      id: crypto.randomUUID(),
      generated_at: new Date().toISOString(),
      window_start: windowStartIso,
      window_end: windowEndIso,
      executive_summary: briefContent.executive_summary,
      what_changed: briefContent.what_changed as BriefItem[],
      what_disagrees: briefContent.what_disagrees as BriefItem[],
      thesis_evaluations: briefContent.thesis_evaluations as ThesisStatusEvaluation[],
      question_progress: briefContent.question_progress as QuestionProgressEvaluation[]
    };
  }
}
