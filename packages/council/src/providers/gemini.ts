import type { CouncilModelProvider, PromptContext, ModelResponse } from "./provider_interface";

export class GeminiProvider implements CouncilModelProvider {
  public readonly id = "gemini-1-5-pro";
  public readonly name = "Gemini 1.5 Pro";
  public readonly provider = "Google DeepMind";

  public async deliberate(context: PromptContext, apiKey?: string): Promise<ModelResponse> {
    const obsRef1 = context.observation_citations[0]?.id || "obs-gdp-001";
    const obsRef2 = context.observation_citations[1]?.id || "obs-poly-001";
    return {
      model_id: this.id,
      model_name: this.name,
      provider: this.provider,
      raw_response: `Multimodal evaluation incorporating ${obsRef1} and ${obsRef2}: Macro data points to steady growth, whereas prediction markets are pricing aggressive rate cuts. We observe structural divergence.`,
      confidence: 82,
      key_claims: [
        `Macro fundamentals from ${obsRef1} contradict prediction market cuts in ${obsRef2}`,
        "Fed policy path likely higher for longer than prediction odds suggest"
      ],
      cited_observation_ids: [obsRef1, obsRef2]
    };
  }
}
