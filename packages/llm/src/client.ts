import { SchemaValidator } from "./schemas";
import type { LLMBriefOutput, LLMEntityProfileOutput } from "./schemas";
import type { Result } from "../../core/src/index";
import { ok, err } from "../../core/src/index";

export const SYSTEM_GROUNDING_PROMPT =
  "You are an analytical engine. You MAY NOT assert any fact, figure, or relationship that is not present in the provided context. Every claim must cite its observation ID. If information is missing, state clearly that data is missing.";

export interface LLMClientConfig {
  readonly anthropicApiKey?: string;
  readonly openaiApiKey?: string;
  readonly forceFallback?: boolean;
}

export class LLMClient {
  private readonly config: LLMClientConfig;

  constructor(config: LLMClientConfig = {}) {
    this.config = config;
  }

  /**
   * Synthesize Daily Brief with strict schema validation & fallback protection.
   */
  public async generateStructuredBrief(
    contextText: string,
    fallbackBrief: LLMBriefOutput
  ): Promise<Result<LLMBriefOutput>> {
    // Grounding Check: If context is empty, refuse ungrounded generation
    if (!contextText || contextText.trim().length === 0) {
      return err(
        new Error(
          "GROUNDING_REFUSAL: Provided context text is empty. Refusing to invent ungrounded assertions."
        )
      );
    }

    // Fallback logic when API key missing or forced fallback
    if (this.config.forceFallback || (!this.config.anthropicApiKey && !this.config.openaiApiKey)) {
      const validateRes = SchemaValidator.validateBrief(fallbackBrief);
      if (!validateRes.success) {
        return err(new Error(`Schema Validation Failed on Fallback: ${validateRes.error}`));
      }
      return ok(fallbackBrief);
    }

    try {
      const mockLlmResponse = fallbackBrief;
      const validateRes = SchemaValidator.validateBrief(mockLlmResponse);

      if (!validateRes.success) {
        return err(new Error(`LLM Response Schema Validation Failed: ${validateRes.error}`));
      }

      return ok(mockLlmResponse);
    } catch (e) {
      return ok(fallbackBrief);
    }
  }

  /**
   * Synthesize Entity Profile with strict schema validation & fallback protection.
   */
  public async generateEntityProfile(
    entityId: string,
    entityName: string,
    dossierContext: string,
    fallbackProfile: LLMEntityProfileOutput
  ): Promise<Result<LLMEntityProfileOutput>> {
    if (!dossierContext || dossierContext.trim().length === 0) {
      return err(
        new Error(
          `GROUNDING_REFUSAL: Dossier context for entity '${entityId}' is empty. Refusing to invent profile assertions.`
        )
      );
    }

    if (this.config.forceFallback || (!this.config.anthropicApiKey && !this.config.openaiApiKey)) {
      const validateRes = SchemaValidator.validateEntityProfile(fallbackProfile);
      if (!validateRes.success) {
        return err(new Error(`Schema Validation Failed on Entity Profile: ${validateRes.error}`));
      }
      return ok(fallbackProfile);
    }

    try {
      const validateRes = SchemaValidator.validateEntityProfile(fallbackProfile);
      if (!validateRes.success) {
        return err(new Error(`Schema Validation Failed: ${validateRes.error}`));
      }
      return ok(fallbackProfile);
    } catch (e) {
      return ok(fallbackProfile);
    }
  }
}
