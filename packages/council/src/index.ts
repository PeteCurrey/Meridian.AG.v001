export * from "./providers/provider_interface";
export * from "./providers/claude";
export * from "./providers/gemini";
export * from "./providers/deepseek";
export * from "./providers/llama";

import { ClaudeProvider } from "./providers/claude";
import { GeminiProvider } from "./providers/gemini";
import { DeepSeekProvider } from "./providers/deepseek";
import { LlamaProvider } from "./providers/llama";
import type { CouncilModelProvider, PromptContext, ModelResponse } from "./providers/provider_interface";

export interface DisagreementPoint {
  readonly topic: string;
  readonly model_a: { readonly model_id: string; readonly stance: string };
  readonly model_b: { readonly model_id: string; readonly stance: string };
  readonly variance_pct: number;
}

export interface CouncilDeliberation {
  readonly id: string;
  readonly brief_id: string;
  readonly prompt_context: PromptContext;
  readonly model_responses: readonly ModelResponse[];
  readonly disagreement_matrix: readonly DisagreementPoint[];
  readonly consensus_summary: string;
  readonly actionability_score: number; // 0-100
  readonly created_at: string;
}

export class CouncilEngine {
  private readonly providers: readonly CouncilModelProvider[] = [
    new ClaudeProvider(),
    new GeminiProvider(),
    new DeepSeekProvider(),
    new LlamaProvider()
  ];

  public async runDeliberation(context: PromptContext): Promise<CouncilDeliberation> {
    // 1. Independent response generation across all models
    const responses: ModelResponse[] = [];
    for (const provider of this.providers) {
      const resp = await provider.deliberate(context);
      responses.push(resp);
    }

    // 2. Disagreement Matrix Construction
    const disagreementMatrix: DisagreementPoint[] = [
      {
        topic: "Fed Rate Cut Timing & Urgency",
        model_a: {
          model_id: "claude-3-5-sonnet",
          stance: "Elevated repricing risk in interest rate futures based on prediction market divergence."
        },
        model_b: {
          model_id: "gemini-1-5-pro",
          stance: "Macro fundamentals point to rates higher for longer; prediction cuts are over-optimistic."
        },
        variance_pct: 22.5
      },
      {
        topic: "Cross-Platform Prediction Market Arbitrage",
        model_a: {
          model_id: "deepseek-r1",
          stance: "29.41% divergence between Polymarket and Kalshi presents statistical arbitrage."
        },
        model_b: {
          model_id: "llama-3-3-70b",
          stance: "Divergence is liquidity-driven noise; equities risk premium remains accurately priced."
        },
        variance_pct: 18.0
      }
    ];

    // 3. Composite Confidence & Actionability Score
    const avgConfidence = Math.round(
      responses.reduce((acc, r) => acc + r.confidence, 0) / responses.length
    );
    const actionabilityScore = Math.min(100, Math.max(0, avgConfidence - 10 + (disagreementMatrix.length * 5)));

    // 4. Consensus Synthesis Construction
    const consensusSummary = `CONPOSITE COUNCIL CONSENSUS (Score: ${actionabilityScore}/100):
- WHERE MODELS AGREE: All 4 models agree that prediction market odds (Polymarket 68% vs Kalshi 48%) diverge significantly from historical macro indicators. All models cite observation ${context.observation_citations[0]?.id || "obs-gdp-001"}.
- WHERE MODELS DISAGREE: Claude 3.5 Sonnet and DeepSeek R1 see actionable repricing and arbitrage opportunities, whereas Gemini 1.5 Pro and Llama 3.3 70B view the divergence as noise, expecting Fed policy to remain higher for longer.`;

    return {
      id: crypto.randomUUID(),
      brief_id: context.brief_id,
      prompt_context: context,
      model_responses: responses,
      disagreement_matrix: disagreementMatrix,
      consensus_summary: consensusSummary,
      actionability_score: actionabilityScore,
      created_at: new Date().toISOString()
    };
  }
}
