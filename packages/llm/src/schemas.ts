export interface Citation {
  readonly ref_id: string;
  readonly ref_type: "OBSERVATION" | "SIGNAL";
  readonly summary: string;
}

export interface BriefItem {
  readonly id: string;
  readonly text: string;
  readonly citation: Citation;
  readonly linked_entity_id: string | null;
}

export interface ThesisEvaluation {
  readonly thesis_id: string;
  readonly thesis_statement: string;
  readonly status: "HEALTHY" | "FALSIFICATION_RISK";
  readonly confidence: number;
  readonly falsification_condition: string;
  readonly citation: Citation;
}

export interface QuestionProgress {
  readonly question_id: string;
  readonly question_text: string;
  readonly findings_summary: string;
  readonly citation: Citation;
}

export interface LLMBriefOutput {
  readonly executive_summary: string;
  readonly what_changed: readonly BriefItem[];
  readonly what_disagrees: readonly BriefItem[];
  readonly thesis_evaluations: readonly ThesisEvaluation[];
  readonly question_progress: readonly QuestionProgress[];
}

export interface LLMEntityProfileOutput {
  readonly entity_id: string;
  readonly entity_name: string;
  readonly narrative_summary: string;
  readonly key_risks: readonly string[];
  readonly primary_relationships: readonly string[];
  readonly recent_state_changes: readonly string[];
  readonly cited_observation_ids: readonly string[];
}

export class SchemaValidator {
  public static validateBrief(data: any): { success: boolean; error?: string } {
    if (!data || typeof data !== "object") return { success: false, error: "Data is not an object" };
    if (typeof data.executive_summary !== "string") return { success: false, error: "executive_summary must be string" };
    if (!Array.isArray(data.what_changed)) return { success: false, error: "what_changed must be array" };
    if (!Array.isArray(data.what_disagrees)) return { success: false, error: "what_disagrees must be array" };
    if (!Array.isArray(data.thesis_evaluations)) return { success: false, error: "thesis_evaluations must be array" };
    if (!Array.isArray(data.question_progress)) return { success: false, error: "question_progress must be array" };

    for (const item of data.what_changed) {
      if (!item.id || !item.text || !item.citation || !item.citation.ref_id) {
        return { success: false, error: "what_changed item missing required citation fields" };
      }
    }

    return { success: true };
  }

  public static validateEntityProfile(data: any): { success: boolean; error?: string } {
    if (!data || typeof data !== "object") return { success: false, error: "Data is not an object" };
    if (typeof data.entity_id !== "string") return { success: false, error: "entity_id must be string" };
    if (typeof data.entity_name !== "string") return { success: false, error: "entity_name must be string" };
    if (typeof data.narrative_summary !== "string") return { success: false, error: "narrative_summary must be string" };
    if (!Array.isArray(data.cited_observation_ids)) return { success: false, error: "cited_observation_ids must be array" };

    return { success: true };
  }
}
