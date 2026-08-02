"use client";

import React, { useState } from "react";
import { tokens, Panel, DataTable, Column } from "@meridian/ui";

export default function CouncilPage() {
  const [isDeliberating, setIsDeliberating] = useState(false);
  const [deliberation, setDeliberation] = useState<any>(null);
  const [topicInput, setTopicInput] = useState("Fed Rate Cut Timing & Urgency");

  const handleTriggerDeliberation = async () => {
    try {
      setIsDeliberating(true);
      const res = await fetch("/api/council", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ topic: topicInput })
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
      raw_response: "Analysis based on obs-gdp-001: The divergence between prediction markets and Fed funds rate path signals a potential repricing event in interest rate futures.",
      cited_observation_ids: ["obs-gdp-001"]
    },
    {
      model_id: "gemini-1-5-pro",
      model_name: "Gemini 1.5 Pro",
      provider: "Google DeepMind",
      confidence: 82,
      raw_response: "Multimodal evaluation incorporating obs-gdp-001 and obs-poly-001: Macro data points to steady growth, whereas prediction markets are pricing aggressive rate cuts.",
      cited_observation_ids: ["obs-gdp-001", "obs-poly-001"]
    },
    {
      model_id: "deepseek-r1",
      model_name: "DeepSeek R1",
      provider: "DeepSeek",
      confidence: 91,
      raw_response: "Chain-of-thought reasoning over obs-poly-001: The 29.41% divergence between Polymarket and Kalshi creates a statistical arbitrage signal between prediction platforms.",
      cited_observation_ids: ["obs-poly-001"]
    },
    {
      model_id: "llama-3-3-70b",
      model_name: "Llama 3.3 70B",
      provider: "Meta (Groq)",
      confidence: 84,
      raw_response: "Open model synthesis citing obs-gdp-001: Macro stability index remains resilient. Rate cuts are unlikely to materialize as fast as prediction platforms imply.",
      cited_observation_ids: ["obs-gdp-001"]
    }
  ];

  const disagreements = deliberation?.disagreement_matrix || [
    {
      topic: "Fed Rate Cut Timing & Urgency",
      model_a: { model_id: "claude-3-5-sonnet", stance: "Elevated repricing risk in interest rate futures." },
      model_b: { model_id: "gemini-1-5-pro", stance: "Rates higher for longer; prediction cuts over-optimistic." },
      variance_pct: 22.5
    },
    {
      topic: "Prediction Market Arbitrage",
      model_a: { model_id: "deepseek-r1", stance: "29.41% divergence offers statistical arbitrage." },
      model_b: { model_id: "llama-3-3-70b", stance: "Divergence is liquidity noise; risk premium accurate." },
      variance_pct: 18.0
    }
  ];

  const disagreementColumns: Column<any>[] = [
    {
      key: "topic",
      header: "DELIBERATION TOPIC",
      render: (row) => <span style={{ fontWeight: tokens.typography.fontWeightBold }}>{row.topic}</span>
    },
    {
      key: "model_a",
      header: "MODEL A STANCE",
      render: (row) => <span style={{ color: tokens.colors.accentGreen, fontSize: tokens.typography.fontSizeXs }}>{row.model_a?.stance || row.model_a_stance}</span>
    },
    {
      key: "model_b",
      header: "MODEL B STANCE",
      render: (row) => <span style={{ color: "#b45309", fontSize: tokens.typography.fontSizeXs }}>{row.model_b?.stance || row.model_b_stance}</span>
    },
    {
      key: "variance",
      header: "VARIANCE",
      render: (row) => (
        <span style={{ color: "#dc2626", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono }}>
          {row.variance_pct?.toFixed(1) || "0.0"}%
        </span>
      )
    }
  ];

  return (
    <div
      style={{
        backgroundColor: "transparent",
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontFamilySans,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing.lg
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeXl, color: tokens.colors.textPrimary, fontWeight: tokens.typography.fontWeightBold }}>
            The Council Room
          </h1>
          <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
            Multi-model LLM consensus engine across Claude 3.5, Gemini 1.5, DeepSeek R1, and Llama 3.3.
          </p>
        </div>

        <div style={{ display: "flex", gap: "8px", alignItems: "center" }}>
          <input
            type="text"
            value={topicInput}
            onChange={(e) => setTopicInput(e.target.value)}
            placeholder="Deliberation topic..."
            style={{
              padding: "8px 12px",
              borderRadius: "4px",
              border: `1px solid ${tokens.colors.borderHairline}`,
              fontSize: tokens.typography.fontSizeSm,
              width: "240px"
            }}
          />

          <button
            onClick={handleTriggerDeliberation}
            disabled={isDeliberating}
            style={{
              padding: "8px 16px",
              backgroundColor: tokens.colors.accentGreen,
              color: "#ffffff",
              border: "none",
              borderRadius: "4px",
              fontSize: tokens.typography.fontSizeXs,
              fontWeight: tokens.typography.fontWeightMedium,
              cursor: "pointer"
            }}
          >
            {isDeliberating ? "Deliberating across LLMs..." : "⚡ Execute Multi-LLM Deliberation"}
          </button>
        </div>
      </div>

      {/* Consensus Summary */}
      <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
        <div style={{ fontSize: tokens.typography.fontSizeXs, fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.textMuted, letterSpacing: "0.05em", marginBottom: "6px" }}>
          COMPOSITE CONSENSUS SYNTHESIS (ACTIONABILITY SCORE: {deliberation?.actionability_score || 86}/100)
        </div>
        <div style={{ fontSize: tokens.typography.fontSizeSm, color: tokens.colors.textPrimary, lineHeight: 1.5, whiteSpace: "pre-wrap" }}>
          {deliberation?.consensus_summary || "All 4 models agree that prediction market odds (Polymarket 68% vs Kalshi 48%) diverge significantly from historical macro indicators. Claude 3.5 Sonnet and DeepSeek R1 see actionable repricing, whereas Gemini 1.5 Pro and Llama 3.3 view it as liquidity noise."}
        </div>
      </div>

      {/* Disagreement Matrix */}
      <Panel title="CROSS-MODEL DISAGREEMENT MATRIX">
        <DataTable
          data={disagreements}
          columns={disagreementColumns}
          keyExtractor={(row) => row.topic || String(Math.random())}
        />
      </Panel>

      {/* 4 Model Response Cards */}
      <Panel title="INDEPENDENT MODEL RESPONSES (4 MODELS SIDE-BY-SIDE)">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: tokens.spacing.md }}>
          {modelResponses.map((m: any) => (
            <div
              key={m.model_id}
              style={{
                backgroundColor: tokens.colors.panelBg,
                border: `1px solid ${tokens.colors.borderHairline}`,
                borderRadius: "6px",
                padding: tokens.spacing.md,
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.xs
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.accentGreen }}>
                  {m.model_name} <span style={{ fontWeight: tokens.typography.fontWeightRegular, color: tokens.colors.textMuted }}>({m.provider})</span>
                </span>
                <span style={{ fontSize: tokens.typography.fontSizeXs, fontFamily: tokens.typography.fontFamilyMono, color: tokens.colors.textMuted }}>
                  CONFIDENCE: {m.confidence}%
                </span>
              </div>

              <p style={{ margin: "6px 0", fontSize: tokens.typography.fontSizeSm, color: tokens.colors.textPrimary, lineHeight: 1.4 }}>
                "{m.raw_response}"
              </p>

              <div style={{ display: "flex", gap: "4px" }}>
                {m.cited_observation_ids?.map((obsId: string) => (
                  <span
                    key={obsId}
                    style={{
                      fontSize: "10px",
                      fontFamily: tokens.typography.fontFamilyMono,
                      color: tokens.colors.accentGreen,
                      backgroundColor: "#f0fdf4",
                      padding: "2px 6px",
                      borderRadius: "4px",
                      border: "1px solid #bbf7d0"
                    }}
                  >
                    CIT: {obsId}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
