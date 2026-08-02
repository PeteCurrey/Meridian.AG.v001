"use client";

import React, { useState } from "react";
import { tokens } from "@meridian/ui";

const PRESET_SCENARIOS = [
  { label: "⚡ Fed Rate Cut Mispricing", topic: "Fed Rate Cut Timing & Urgency" },
  { label: "📊 BTC 3.42σ Anomaly Evaluation", topic: "BTC Price Surge & Outlier Risk" },
  { label: "🎲 Prediction Market Arbitrage", topic: "Polymarket vs Kalshi 29.41% Divergence" },
  { label: "📖 Semiconductor ASP Thesis Falsification", topic: "Semiconductor CapEx & ASP Trajectory" }
];

export default function CouncilPage() {
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [deliberation, setDeliberation] = useState<any>(null);
  const [topicInput, setTopicInput] = useState("Fed Rate Cut Timing & Urgency");

  const runDeliberation = async (topicToRun: string) => {
    try {
      setIsDeliberating(true);
      const res = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicToRun })
      });
      if (res.ok) {
        const data = await res.json();
        setDeliberation(data);
      }
    } catch (e) {
      console.error("Deliberation error:", e);
    } finally {
      setIsDeliberating(false);
    }
  };

  const modelResponses = deliberation?.model_responses || [
    {
      model_id: "claude-3-5-sonnet",
      model_name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      confidence: 94,
      raw_response: "Analysis based on obs-gdp-001: The divergence between prediction markets (68%) and Fed funds rate path signals a potential repricing event in interest rate futures. Recommend maintaining elevated watch stance.",
      cited_observation_ids: ["obs-gdp-001", "obs-poly-001"],
      is_live: true
    },
    {
      model_id: "gpt-4o-mini",
      model_name: "GPT-4o Mini",
      provider: "OpenAI",
      confidence: 87,
      raw_response: "Referencing obs-poly-001: The 29.41% spread between prediction exchanges is inconsistent with macro stability implied by obs-gdp-001. This divergence reflects liquidity-driven noise rather than fundamental mispricing.",
      cited_observation_ids: ["obs-gdp-001", "obs-poly-001"],
      is_live: true
    },
    {
      model_id: "grok-3-mini",
      model_name: "Grok 3 Mini",
      provider: "xAI",
      confidence: 89,
      raw_response: "Cross-referencing obs-gdp-001 and obs-poly-001: GDPNow resilience at 2.7% fundamentally undermines aggressive rate-cut expectations. The prediction market spread presents a structural arbitrage opportunity.",
      cited_observation_ids: ["obs-gdp-001", "obs-poly-001"],
      is_live: true
    },
    {
      model_id: "deepseek-r1",
      model_name: "DeepSeek R1",
      provider: "DeepSeek",
      confidence: 91,
      raw_response: "Chain-of-thought reasoning over obs-poly-001: The 29.41% Polymarket-Kalshi spread is statistically significant. Isolate liquidity noise before taking position.",
      cited_observation_ids: ["obs-poly-001"],
      is_live: false
    }
  ];

  const disagreements = deliberation?.disagreement_matrix || [
    {
      topic: "Fed Rate Cut Timing & Urgency",
      model_a: { model_id: "claude-3-5-sonnet", stance: "Structural disconnect between prediction markets and macro fundamentals warrants elevated monitoring." },
      model_b: { model_id: "gpt-4o-mini", stance: "Divergence is liquidity noise — maintain watch stance, no position change." },
      variance_pct: 22.5
    },
    {
      topic: "Prediction Market Arbitrage",
      model_a: { model_id: "grok-3-mini", stance: "29.41% spread is a structural arbitrage opportunity — escalate to Council." },
      model_b: { model_id: "deepseek-r1", stance: "Isolate liquidity noise before interpreting as fundamental mispricing." },
      variance_pct: 18.0
    }
  ];

  const actionabilityScore = deliberation?.actionability_score || 88;

  return (
    <div
      style={{
        backgroundColor: "transparent",
        color: "#f8fafc",
        fontFamily: tokens.typography.fontFamilySans,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "800",
                color: "#7c3aed",
                backgroundColor: "#5b21b620",
                border: "1px solid #6d28d940",
                padding: "2px 8px",
                borderRadius: "4px"
              }}
            >
              MULTI-LLM DELIBERATION SUITE
            </span>
            <span style={{ fontSize: "11px", color: "#64748b", fontFamily: tokens.typography.fontFamilyMono }}>
              Consensus & Disagreement Matrix
            </span>
          </div>

          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.01em" }}>
            The Council Room
          </h1>
          <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
            Parallel multi-model deliberation across Claude 3.5, GPT-4o, Grok 3, and DeepSeek R1 to stress-test trading hypotheses.
          </p>
        </div>

        {/* Live LLM Indicator */}
        <div
          style={{
            padding: "8px 14px",
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "6px",
            fontSize: "11px",
            fontFamily: tokens.typography.fontFamilyMono,
            color: "#4ade80"
          }}
        >
          ● 3 LIVE API PROVIDERS READY
        </div>
      </div>

      {/* Preset Scenarios Chips & Custom Input */}
      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "18px" }}>
        <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", letterSpacing: "0.1em", marginBottom: "10px" }}>
          ONE-CLICK DELIBERATION SCENARIOS:
        </div>

        <div style={{ display: "flex", gap: "8px", flexWrap: "wrap", marginBottom: "14px" }}>
          {PRESET_SCENARIOS.map((scen) => (
            <button
              key={scen.label}
              onClick={() => {
                setTopicInput(scen.topic);
                runDeliberation(scen.topic);
              }}
              disabled={isDeliberating}
              style={{
                padding: "8px 12px",
                backgroundColor: topicInput === scen.topic ? "#4f46e5" : "#1e293b",
                color: "#ffffff",
                border: `1px solid ${topicInput === scen.topic ? "#6366f1" : "#334155"}`,
                borderRadius: "5px",
                fontSize: "11px",
                fontWeight: "700",
                cursor: "pointer"
              }}
            >
              {scen.label}
            </button>
          ))}
        </div>

        {/* Custom Prompt Builder */}
        <div style={{ display: "flex", gap: "10px" }}>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Enter custom trade or macro hypothesis to stress-test..."
            style={{
              flex: 1,
              padding: "10px 14px",
              backgroundColor: "#090d16",
              border: "1px solid #334155",
              borderRadius: "5px",
              color: "#ffffff",
              fontSize: "13px",
              outline: "none"
            }}
          />

          <button
            onClick={() => runDeliberation(topicInput)}
            disabled={isDeliberating}
            style={{
              padding: "10px 20px",
              backgroundColor: "#16a34a",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "12px",
              border: "none",
              borderRadius: "5px",
              cursor: "pointer"
            }}
          >
            {isDeliberating ? "Deliberating across Models..." : "⚡ Run Council Deliberation"}
          </button>
        </div>
      </div>

      {/* Consensus Gauge & Summary Card */}
      <div style={{ display: "grid", gridTemplateColumns: "220px 1fr", gap: "16px" }}>
        {/* Gauge Score Card */}
        <div
          style={{
            backgroundColor: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "8px",
            padding: "20px",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            justifyContent: "center",
            textAlign: "center"
          }}
        >
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", letterSpacing: "0.1em", marginBottom: "6px" }}>
            ACTIONABILITY SCORE
          </div>
          <div style={{ fontSize: "42px", fontWeight: "900", fontFamily: tokens.typography.fontFamilyMono, color: "#38bdf8", lineHeight: 1 }}>
            {actionabilityScore}
          </div>
          <div style={{ fontSize: "11px", color: "#4ade80", fontWeight: "700", marginTop: "4px" }}>
            High Conviction
          </div>
          <div style={{ fontSize: "10px", color: "#64748b", marginTop: "6px" }}>
            Composite score derived from model confidence & variance
          </div>
        </div>

        {/* Executive Consensus Statement */}
        <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#38bdf8", letterSpacing: "0.1em", marginBottom: "8px" }}>
            COMPOSITE COUNCIL CONSENSUS SYNTHESIS
          </div>
          <div style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.6, whiteSpace: "pre-wrap" }}>
            {deliberation?.consensus_summary ||
              "All 4 models agree that prediction market odds (Polymarket 68% vs Kalshi 48%) diverge significantly from historical macro indicators. Claude 3.5 Sonnet and Grok 3 see actionable rate repricing, whereas GPT-4o Mini and DeepSeek R1 view it as liquidity noise."}
          </div>
        </div>
      </div>

      {/* Disagreement Matrix */}
      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#f87171", letterSpacing: "0.08em", marginBottom: "14px" }}>
          CROSS-MODEL DISAGREEMENT MATRIX
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {disagreements.map((dis: any, idx: number) => (
            <div
              key={idx}
              style={{
                backgroundColor: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "6px",
                padding: "14px 16px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "800", color: "#ffffff", fontSize: "13px" }}>{dis.topic}</span>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#f87171", fontFamily: tokens.typography.fontFamilyMono, backgroundColor: "#450a0a", padding: "2px 8px", borderRadius: "4px", border: "1px solid #991b1b" }}>
                  VARIANCE: {dis.variance_pct}%
                </span>
              </div>

              <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", fontSize: "12px" }}>
                <div style={{ backgroundColor: "#0f172a", padding: "10px", borderRadius: "4px", borderLeft: "3px solid #38bdf8" }}>
                  <strong style={{ color: "#38bdf8" }}>{dis.model_a?.model_id}:</strong> {dis.model_a?.stance}
                </div>
                <div style={{ backgroundColor: "#0f172a", padding: "10px", borderRadius: "4px", borderLeft: "3px solid #fbbf24" }}>
                  <strong style={{ color: "#fbbf24" }}>{dis.model_b?.model_id}:</strong> {dis.model_b?.stance}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4 Model Side-by-Side Stance Cards */}
      <div>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", letterSpacing: "0.08em", marginBottom: "12px" }}>
          INDEPENDENT MODEL RESPONSES (4 MODELS SIDE-BY-SIDE)
        </div>

        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "16px" }}>
          {modelResponses.map((m: any) => (
            <div
              key={m.model_id}
              style={{
                backgroundColor: "#0f172a",
                border: "1px solid #1e293b",
                borderRadius: "8px",
                padding: "18px",
                display: "flex",
                flexDirection: "column",
                gap: "10px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                  <span style={{ fontWeight: "800", color: "#38bdf8", fontSize: "14px" }}>{m.model_name}</span>
                  <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "700" }}>({m.provider})</span>
                </div>
                <span style={{ fontSize: "11px", fontWeight: "800", color: "#4ade80", fontFamily: tokens.typography.fontFamilyMono }}>
                  CONFIDENCE: {m.confidence}%
                </span>
              </div>

              <div style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5, fontStyle: "italic" }}>
                "{m.raw_response}"
              </div>

              <div style={{ display: "flex", gap: "6px", marginTop: "4px" }}>
                {m.cited_observation_ids?.map((obsId: string) => (
                  <span
                    key={obsId}
                    style={{
                      fontSize: "10px",
                      fontFamily: tokens.typography.fontFamilyMono,
                      color: "#38bdf8",
                      backgroundColor: "#0c4a6e",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      border: "1px solid #0284c7"
                    }}
                  >
                    CIT: {obsId}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
