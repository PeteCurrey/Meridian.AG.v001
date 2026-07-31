export interface ModelResponse {
  readonly model_id: string;
  readonly model_name: string;
  readonly provider: string;
  readonly raw_response: string;
  readonly confidence: number; // 0-100
  readonly key_claims: readonly string[];
  readonly cited_observation_ids: readonly string[];
}

export interface PromptContext {
  readonly brief_id: string;
  readonly executive_summary: string;
  readonly observation_citations: readonly { readonly id: string; readonly metric: string; readonly value: string }[];
  readonly question_text: string;
}

export interface CouncilModelProvider {
  readonly id: string;
  readonly name: string;
  readonly provider: string;

  deliberate(context: PromptContext, apiKey?: string): Promise<ModelResponse>;
}
