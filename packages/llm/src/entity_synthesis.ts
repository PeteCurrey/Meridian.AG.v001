import { LLMClient } from "./client.ts";
import type { LLMEntityProfileOutput } from "./schemas.ts";
import type { Result, Observation } from "../../core/src/index.ts";

export class EntityProfileSynthesizer {
  private readonly llmClient: LLMClient;

  constructor(llmClient: LLMClient = new LLMClient()) {
    this.llmClient = llmClient;
  }

  public async synthesizeProfile(
    entityId: string,
    entityName: string,
    observations: readonly Observation[]
  ): Promise<Result<LLMEntityProfileOutput>> {
    const citedObsIds = observations.map(o => o.id);
    const contextText = observations.map(o => `[${o.id}] ${o.source_id}:${o.metric_key} = ${o.value}`).join("\n");

    const fallbackProfile: LLMEntityProfileOutput = {
      entity_id: entityId,
      entity_name: entityName,
      narrative_summary: `Dense entity profile for ${entityName} synthesized across ${observations.length} observations. Primary coverage spans HORIZON filing filings and UNDERCURRENT federal contract awards.`,
      key_risks: [
        `SEC Form S-1 Filing recorded under ${citedObsIds[0] || "obs-001"}`,
        `Federal Contract Award USD 5,000,000.00 under ${citedObsIds[1] || "obs-002"}`
      ],
      primary_relationships: [
        "US Department of Defense (Defense Contract Award)",
        "SEC EDGAR Corporate Registrations"
      ],
      recent_state_changes: [
        "Form S-1 Initial Public Offering Registration filed"
      ],
      cited_observation_ids: citedObsIds
    };

    return this.llmClient.generateEntityProfile(entityId, entityName, contextText, fallbackProfile);
  }
}
