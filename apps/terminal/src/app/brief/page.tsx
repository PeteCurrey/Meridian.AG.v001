"use client";

import React from "react";
import { tokens, Panel, StateBanner } from "@meridian/ui";

export default function BriefPage() {
  const briefData = {
    generated_at: "2026-07-31T10:00:00Z",
    window: "2026-07-30T10:00:00Z to 2026-07-31T10:00:00Z",
    executive_summary: "DAILY EXECUTIVE BRIEF: 4 active signals detected across 21 Wave 1 observations. 1 thesis flagged for FALSIFICATION RISK due to 29.41% prediction market divergence.",
    what_changed: [
      {
        id: "c-001",
        text: "coingecko:CRYPTO_BTC_PRICE_USD — Statistical Outlier: recorded $95,000 (4.00 sigma outside historical range)",
        citation_ref: "sig-anomaly-001",
        entity_id: null
      },
      {
        id: "c-002",
        text: "twelve_data:TWELVE_DATA_FEED_ABSENCE — SLA Overrun: failed to emit expected payload within 300s SLA",
        citation_ref: "sig-absence-001",
        entity_id: null
      },
      {
        id: "c-003",
        text: "fred:FRED_GDP — Jumped by 7.50% past 5.00% delta threshold",
        citation_ref: "sig-delta-001",
        entity_id: null
      }
    ],
    what_disagrees: [
      {
        id: "d-001",
        text: "Cross-source divergence on FED_RATE_CUT_PROBABILITY: polymarket (68%) vs kalshi (48%) diverged by 29.41%",
        citation_ref: "sig-disag-001",
        entity_id: "e-apex-tech-001",
        entity_name: "Apex Tech Inc"
      }
    ],
    thesis_evaluations: [
      {
        id: "th-001",
        statement: "US Fed will cut rates in Q4 2026 due to cooling labor dynamics.",
        status: "FALSIFICATION_RISK",
        confidence: 45,
        falsification_condition: "Prediction market divergence > 25% or Core PCE > 3.2%",
        triggering_signal: "sig-disag-001 (Polymarket vs Kalshi 29.41% divergence)"
      }
    ],
    question_progress: [
      {
        id: "q-001",
        question: "What is the implied trajectory of Fed interest rate cuts across prediction vs macro feeds?",
        finding: "Polymarket assigns 68% probability while Kalshi assigns 48%. High uncertainty divergence.",
        citation_ref: "obs-poly-001"
      }
    ]
  };

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
      {/* Header */}
      <header style={{ marginBottom: tokens.spacing.lg, borderBottom: `1px solid ${tokens.colors.borderHairline}`, paddingBottom: tokens.spacing.md }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeLg, color: tokens.colors.accentGreen }}>
            MERIDIAN EXECUTIVE DAILY BRIEF
          </h1>
          <span style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>
            WINDOW: {briefData.window}
          </span>
        </div>
        <p style={{ margin: "8px 0 0 0", color: tokens.colors.textPrimary, fontSize: tokens.typography.fontSizeSm, fontWeight: tokens.typography.fontWeightBold }}>
          {briefData.executive_summary}
        </p>
      </header>

      {/* 1. What Changed */}
      <Panel title="SECTION 1 // WHAT CHANGED (DELTAS, ANOMALIES, ABSENCES)">
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
          {briefData.what_changed.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: tokens.colors.bg,
                border: `1px solid ${tokens.colors.borderHairline}`,
                padding: tokens.spacing.sm,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span>{item.text}</span>
              <span style={{ fontSize: "9px", color: tokens.colors.accentGreen, backgroundColor: `${tokens.colors.accentGreen}15`, padding: "2px 6px", border: `1px solid ${tokens.colors.accentGreen}` }}>
                [CIT: {item.citation_ref}]
              </span>
            </div>
          ))}
        </div>
      </Panel>

      {/* 2. What Disagrees */}
      <Panel title="SECTION 2 // WHAT DISAGREES (CROSS-SOURCE DIVERGENCE)">
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
          {briefData.what_disagrees.map((item) => (
            <div
              key={item.id}
              style={{
                backgroundColor: tokens.colors.bg,
                border: `1px solid ${tokens.colors.warningAmber}`,
                padding: tokens.spacing.sm,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.md }}>
                <span style={{ color: tokens.colors.warningAmber, fontWeight: tokens.typography.fontWeightBold }}>{item.text}</span>
                {item.entity_id && (
                  <a
                    href={`/entities/${item.entity_id}`}
                    style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.accentGreen, textDecoration: "underline" }}
                  >
                    [DOSSIER: {item.entity_name}]
                  </a>
                )}
              </div>
              <span style={{ fontSize: "9px", color: tokens.colors.warningAmber, backgroundColor: `${tokens.colors.warningAmber}15`, padding: "2px 6px", border: `1px solid ${tokens.colors.warningAmber}` }}>
                [CIT: {item.citation_ref}]
              </span>
            </div>
          ))}
        </div>
      </Panel>

      {/* 3. Thesis Status */}
      <Panel title="SECTION 3 // THESIS STATUS (BOOK EVALUATION)">
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
          {briefData.thesis_evaluations.map((th) => (
            <div
              key={th.id}
              style={{
                backgroundColor: tokens.colors.bg,
                border: `1px solid ${tokens.colors.offlineRed}`,
                padding: tokens.spacing.md,
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: tokens.typography.fontWeightBold }}>{th.statement}</span>
                <span style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.offlineRed, backgroundColor: `${tokens.colors.offlineRed}20`, padding: "2px 8px", fontWeight: tokens.typography.fontWeightBold, border: `1px solid ${tokens.colors.offlineRed}` }}>
                  [{th.status}] (CONFIDENCE: {th.confidence}%)
                </span>
              </div>
              <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>
                FALSIFICATION CONDITION: <span style={{ color: tokens.colors.offlineRed }}>{th.falsification_condition}</span>
              </div>
              <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.offlineRed, fontWeight: tokens.typography.fontWeightMedium }}>
                🚨 TRIGGERING SIGNAL: {th.triggering_signal}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      {/* 4. Standing Question Progress */}
      <Panel title="SECTION 4 // STANDING QUESTION PROGRESS">
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
          {briefData.question_progress.map((q) => (
            <div
              key={q.id}
              style={{
                backgroundColor: tokens.colors.bg,
                border: `1px solid ${tokens.colors.borderHairline}`,
                padding: tokens.spacing.sm,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
                <span style={{ fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.accentGreen }}>{q.question}</span>
                <span style={{ fontSize: tokens.typography.fontSizeSm, color: tokens.colors.textPrimary }}>{q.finding}</span>
              </div>
              <span style={{ fontSize: "9px", color: tokens.colors.accentGreen, backgroundColor: `${tokens.colors.accentGreen}15`, padding: "2px 6px", border: `1px solid ${tokens.colors.accentGreen}` }}>
                [CIT: {q.citation_ref}]
              </span>
            </div>
          ))}
        </div>
      </Panel>
    </div>
  );
}
