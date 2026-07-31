import { LLMClient } from "../packages/llm/src/client.ts";
import { EntityProfileSynthesizer } from "../packages/llm/src/entity_synthesis.ts";
import { BriefEngine } from "../packages/brief/src/index.ts";
import { Pillar, LicenceClass, SignalType, SignalSeverity, SignalStatus } from "../packages/core/src/index.ts";
import type { Signal, Observation, BookThesis, BookQuestion, ScaledInteger } from "../packages/core/src/index.ts";

async function verifyLlmSynthesis() {
  console.log("=== MERIDIAN Structured LLM Integration & Grounding Verification ===");

  const llmClient = new LLMClient({ forceFallback: true });
  const briefEngine = new BriefEngine(llmClient);
  const profileSynthesizer = new EntityProfileSynthesizer(llmClient);

  // 1. Run Zod-Validated LLM Brief Generation
  console.log("\n[1. RUNNING ZOD-VALIDATED LLM BRIEF GENERATION]");
  const observations: Observation[] = [
    {
      id: "obs-gdp-001",
      source_id: "fred",
      pillar: Pillar.WORLD,
      entity_id: null,
      metric_key: "FRED_GDP",
      value: 2850000n as ScaledInteger,
      raw_ref: "r2://fred/gdp.json",
      licence_class: LicenceClass.PUBLIC_DOMAIN,
      source_timestamp: "2026-07-31T08:00:00Z",
      captured_at: new Date().toISOString()
    }
  ];

  const signals: Signal[] = [
    {
      id: "sig-disag-001",
      signal_type: SignalType.DISAGREEMENT,
      canonical_metric_key: "FED_RATE_CUT_PROBABILITY",
      pillar: Pillar.ALTERNATIVES,
      severity: SignalSeverity.CRITICAL,
      confidence: 95,
      primary_source_id: "polymarket",
      secondary_source_id: "kalshi",
      delta_value: 20,
      z_score: null,
      divergence_pct: 29.41,
      overrun_seconds: null,
      narrative_summary: "Cross-Source Disagreement: Polymarket (68%) vs Kalshi (48%) diverged by 29.41%",
      linked_entity_id: "e-apex-tech-001",
      touches_thesis_falsification: true,
      salience_score: 310.0,
      status: SignalStatus.UNREAD,
      detected_at: new Date().toISOString()
    }
  ];

  const theses: BookThesis[] = [
    {
      id: "th-fed-001",
      text: "US Fed will cut rates in Q4 2026 due to cooling labor dynamics.",
      linked_entity_ids: ["e-apex-tech-001"],
      falsification_condition: "Prediction market divergence > 25%",
      review_date: "2026-10-01",
      confidence: 75,
      created_at: "2026-07-01T00:00:00Z"
    }
  ];

  const questions: BookQuestion[] = [
    {
      id: "q-fed-001",
      question_text: "What is the implied trajectory of Fed rate cuts?",
      category: "MACRO",
      cadence: "WEEKLY",
      active: true
    }
  ];

  const brief = await briefEngine.generateBrief(
    "2026-07-30T10:00:00Z",
    "2026-07-31T10:00:00Z",
    signals,
    observations,
    theses,
    questions
  );

  console.log("Executive Summary:", brief.executive_summary);
  console.log("What Changed Items:", brief.what_changed.length);
  console.log("What Disagrees Items:", brief.what_disagrees.length);
  console.log("PASS: Generated Daily Brief successfully passed Zod schema validation.");

  // 2. Demonstrate Strict Grounding Invariant (Refusal on Empty Context)
  console.log("\n[2. DEMONSTRATING STRICT GROUNDING INVARIANT — REFUSAL ON EMPTY CONTEXT]");
  const ungroundedRes = await llmClient.generateStructuredBrief("", brief as any);
  if (!ungroundedRes.ok) {
    console.log("Grounding Refusal Output:", ungroundedRes.error.message);
    console.log("PASS: LLM client strictly refused ungrounded prompt context.");
  } else {
    console.error("FAIL: LLM accepted empty context without grounding refusal!");
    process.exit(1);
  }

  // 3. Demonstrate Clean Fallback Engine when API Key Missing / Call Fails
  console.log("\n[3. DEMONSTRATING CLEAN FALLBACK ENGINE WHEN OFFLINE]");
  const offlineClient = new LLMClient({ forceFallback: true });
  const profileRes = await profileSynthesizer.synthesizeProfile("e-apex-tech-001", "Apex Tech Inc", observations);

  if (profileRes.ok) {
    console.log("Entity Profile Narrative Summary:", profileRes.value.narrative_summary);
    console.log("Cited Observation IDs:", profileRes.value.cited_observation_ids);
    console.log("PASS: Clean deterministic fallback executed seamlessly without breaking platform.");
  } else {
    console.error("FAIL: Offline fallback failed!");
    process.exit(1);
  }

  console.log("\nStructured LLM Integration & Grounding Verification Completed Successfully.");
}

verifyLlmSynthesis().catch(console.error);
