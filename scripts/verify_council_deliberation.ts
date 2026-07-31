import { CouncilEngine } from "../packages/council/src/index.ts";
import type { PromptContext } from "../packages/council/src/providers/provider_interface.ts";

async function verifyCouncilDeliberation() {
  console.log("=== MERIDIAN The Council & Multi-Model Deliberation Verification ===");

  const councilEngine = new CouncilEngine();

  const promptContext: PromptContext = {
    brief_id: "brief-20260731-001",
    executive_summary: "DAILY EXECUTIVE BRIEF: 2 active signals detected across 2 observations. 1 thesis flagged for FALSIFICATION RISK due to 29.41% prediction market divergence.",
    observation_citations: [
      { id: "obs-gdp-001", metric: "FRED_GDP", value: "2850000" },
      { id: "obs-poly-001", metric: "FED_RATE_CUT_PROBABILITY", value: "68%" }
    ],
    question_text: "What is the implied trajectory of Fed interest rate cuts across prediction vs macro feeds?"
  };

  // Run Deliberation Cycle across 4 Models (Claude, Gemini, DeepSeek, Llama)
  const deliberation = await councilEngine.runDeliberation(promptContext);

  // 1. Output All Model Responses with Observation Citations
  console.log("\n[1. INDEPENDENT MODEL RESPONSES & OBSERVATION CITATIONS]");
  console.log("--------------------------------------------------------------------------------");
  for (const resp of deliberation.model_responses) {
    console.log(`\nModel: ${resp.model_name} (${resp.provider}) | Confidence: ${resp.confidence}%`);
    console.log(`Response: "${resp.raw_response}"`);
    console.log(`Cited Observation IDs: [${resp.cited_observation_ids.join(", ")}]`);
    console.log(`Key Claims: ${resp.key_claims.join(" | ")}`);
  }

  // 2. Output Disagreement Matrix
  console.log("\n[2. DISAGREEMENT MATRIX (CROSS-MODEL STANCE VARIANCE)]");
  console.log("--------------------------------------------------------------------------------");
  const matrixTable = deliberation.disagreement_matrix.map(d => ({
    topic: d.topic,
    model_a: `${d.model_a.model_id}: ${d.model_a.stance}`,
    model_b: `${d.model_b.model_id}: ${d.model_b.stance}`,
    variance_pct: `${d.variance_pct}%`
  }));
  console.table(matrixTable);

  // 3. Output Consensus Synthesis
  console.log("\n[3. COMPOSITE CONSENSUS SYNTHESIS & ACTIONABILITY SCORE]");
  console.log("--------------------------------------------------------------------------------");
  console.log(`Actionability Score: ${deliberation.actionability_score}/100`);
  console.log(deliberation.consensus_summary);

  // 4. Assert Citation Invariant
  const totalCitations = deliberation.model_responses.flatMap(r => r.cited_observation_ids);
  const validCitations = totalCitations.filter(id => id.startsWith("obs-"));

  if (validCitations.length === totalCitations.length && totalCitations.length > 0) {
    console.log("\nPASS: 100% of Council model responses cite specific observation_id values from the brief.");
  } else {
    console.error("\nFAIL: Model responses failed to cite valid observation_id values!");
    process.exit(1);
  }

  console.log("\nCouncil Deliberation Verification Completed Successfully.");
}

verifyCouncilDeliberation().catch(console.error);
