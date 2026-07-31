"use client";

import React, { useState } from "react";
import { tokens, Panel, DataTable, Column } from "@meridian/ui";

interface ModelResponseCard {
  model_id: string;
  model_name: string;
  provider: string;
  confidence: number;
  raw_response: string;
  cited_observation_ids: string[];
}

interface DisagreementMatrixRow {
  id: string;
  topic: string;
  model_a_stance: string;
  model_b_stance: string;
  variance_pct: number;
}

export default function CouncilPage() {
  const [isDeliberating, setIsDeliberating] = useState(false);

  const modelResponses: ModelResponseCard[] = [
    {
      model_id: "claude-3-5-sonnet",
      model_name: "Claude 3.5 Sonnet",
      provider: "Anthropic",
      confidence: 88,
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

  const disagreements: DisagreementMatrixRow[] = [
    {
      id: "disag-001",
      topic: "Fed Rate Cut Timing & Urgency",
      model_a_stance: "Claude 3.5: Elevated repricing risk in interest rate futures.",
      model_b_stance: "Gemini 1.5: Rates higher for longer; prediction cuts over-optimistic.",
      variance_pct: 22.5
    },
    {
      id: "disag-002",
      topic: "Prediction Market Arbitrage",
      model_a_stance: "DeepSeek R1: 29.41% divergence offers statistical arbitrage.",
      model_b_stance: "Llama 3.3: Divergence is liquidity noise; risk premium accurate.",
      variance_pct: 18.0
    }
  ];

  const handleTriggerDeliberation = () => {
    setIsDeliberating(true);
    setTimeout(() => {
      setIsDeliberating(false);
    }, 1200);
  };

  const disagreementColumns: Column<DisagreementMatrixRow>[] = [
    {
      key: "topic",
      header: "DELIBERATION TOPIC",
      render: (row) => <span style={{ fontWeight: tokens.typography.fontWeightBold }}>{row.topic}</span>
    },
    {
      key: "model_a",
      header: "MODEL A STANCE",
      render: (row) => <span style={{ color: tokens.colors.accentGreen }}>{row.model_a_stance}</span>
    },
    {
      key: "model_b",
      header: "MODEL B STANCE",
      render: (row) => <span style={{ color: tokens.colors.warningAmber }}>{row.model_b_stance}</span>
    },
    {
      key: "variance",
      header: "VARIANCE",
      render: (row) => (
        <span style={{ color: tokens.colors.offlineRed, fontWeight: tokens.typography.fontWeightBold }}>
          {row.variance_pct.toFixed(1)}%
        </span>
      )
    }
  ];

  return (
    <div
      style={{
        backgroundColor: tokens.colors.bg,
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontFamilyMono,
        minHeight: "100%",
        padding: tokens.spacing.lg,
        boxSizing: "border-box"
      }}
    >
      {/* Header & Trigger Control */}
      <header
        style={{
          marginBottom: tokens.spacing.lg,
          borderBottom: `1px solid ${tokens.colors.borderHairline}`,
          paddingBottom: tokens.spacing.md,
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeLg, color: tokens.colors.accentGreen }}>
            THE COUNCIL // MULTI-MODEL DELIBERATION ROOM
          </h1>
          <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
            Independent Deliberation across Claude 3.5, Gemini 1.5, DeepSeek R1, and Llama 3.3 70B
          </p>
        </div>

        <button
          onClick={handleTriggerDeliberation}
          disabled={isDeliberating}
          style={{
            padding: "10px 20px",
            backgroundColor: tokens.colors.accentGreen,
            color: "#000",
            fontWeight: tokens.typography.fontWeightBold,
            fontSize: tokens.typography.fontSizeSm,
            fontFamily: tokens.typography.fontFamilyMono,
            border: "none",
            cursor: "pointer"
          }}
        >
          {isDeliberating ? "[DELIBERATING ACROSS LLMs...]" : "TRIGGER COUNCIL DELIBERATION"}
        </button>
      </header>

      {/* Consensus Summary Banner */}
      <Panel title="COMPOSITE CONSENSUS SYNTHESIS (ACTIONABILITY SCORE: 86/100)">
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
          <div style={{ color: tokens.colors.accentGreen, fontWeight: tokens.typography.fontWeightBold }}>
            ✓ WHERE MODELS AGREE: All 4 models agree that prediction market odds (Polymarket 68% vs Kalshi 48%) diverge significantly from historical macro indicators. All models cite observation obs-gdp-001.
          </div>
          <div style={{ color: tokens.colors.warningAmber, fontWeight: tokens.typography.fontWeightBold }}>
            ⚡ WHERE MODELS DISAGREE: Claude 3.5 Sonnet and DeepSeek R1 see actionable repricing and arbitrage opportunities, whereas Gemini 1.5 Pro and Llama 3.3 70B view the divergence as noise, expecting Fed policy to remain higher for longer.
          </div>
        </div>
      </Panel>

      {/* Disagreement Matrix */}
      <Panel title="DISAGREEMENT MATRIX (CROSS-MODEL STANCE VARIANCE)">
        <DataTable
          data={disagreements}
          columns={disagreementColumns}
          keyExtractor={(row) => row.id}
        />
      </Panel>

      {/* Side-by-Side Model Comparison Cards */}
      <Panel title="INDEPENDENT MODEL RESPONSES (4 MODELS SIDE-BY-SIDE)">
        <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: tokens.spacing.md }}>
          {modelResponses.map((m) => (
            <div
              key={m.model_id}
              style={{
                backgroundColor: tokens.colors.bg,
                border: `1px solid ${tokens.colors.borderHairline}`,
                padding: tokens.spacing.md,
                display: "flex",
                flexDirection: "column",
                gap: tokens.spacing.xs
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.accentGreen }}>
                  {m.model_name} ({m.provider})
                </span>
                <span style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>
                  CONFIDENCE: {m.confidence}%
                </span>
              </div>

              <p style={{ margin: "4px 0", fontSize: tokens.typography.fontSizeSm, color: tokens.colors.textPrimary }}>
                "{m.raw_response}"
              </p>

              <div style={{ display: "flex", gap: "4px", marginTop: "4px" }}>
                {m.cited_observation_ids.map((obsId) => (
                  <span
                    key={obsId}
                    style={{
                      fontSize: "9px",
                      color: tokens.colors.accentGreen,
                      backgroundColor: `${tokens.colors.accentGreen}15`,
                      padding: "2px 6px",
                      border: `1px solid ${tokens.colors.accentGreen}`
                    }}
                  >
                    [CIT: {obsId}]
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
