"use client";

import React, { useEffect, useState } from "react";
import { tokens, Panel, StateBanner } from "@meridian/ui";

export default function BriefPage() {
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchBrief = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/brief");
      if (res.ok) {
        const data = await res.json();
        setBrief(data);
      }
    } catch (e) {
      console.error("Failed to fetch brief:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, []);

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
            Executive Daily Brief
          </h1>
          <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
            Synthesized intelligence feed across observations, cross-source deltas, and thesis falsification risks.
          </p>
        </div>

        <button
          onClick={fetchBrief}
          disabled={loading}
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
          {loading ? "Synthesizing..." : "⚡ Generate Live Brief"}
        </button>
      </div>

      {/* Executive Summary Card */}
      <div
        style={{
          padding: tokens.spacing.lg,
          backgroundColor: tokens.colors.panelBg,
          border: `1px solid ${tokens.colors.borderHairline}`,
          borderRadius: "6px"
        }}
      >
        <div style={{ fontSize: tokens.typography.fontSizeXs, fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.textMuted, letterSpacing: "0.05em", marginBottom: "8px" }}>
          EXECUTIVE SUMMARY // 24-HOUR SYNTHESIS
        </div>
        <div style={{ fontSize: tokens.typography.fontSizeMd, fontWeight: tokens.typography.fontWeightMedium, color: tokens.colors.textPrimary, lineHeight: 1.5 }}>
          {brief?.executive_summary || (loading ? "Generating grounded executive summary..." : "No summary available.")}
        </div>
      </div>

      {/* Section 1: What Changed */}
      <Panel title="SECTION 1 // WHAT CHANGED (DELTAS & ANOMALIES)">
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
          {brief?.what_changed?.map((item: any) => (
            <div
              key={item.id}
              style={{
                padding: tokens.spacing.md,
                backgroundColor: tokens.colors.bg,
                border: `1px solid ${tokens.colors.borderHairline}`,
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: tokens.typography.fontSizeSm, fontWeight: tokens.typography.fontWeightMedium }}>{item.text}</span>
              <span style={{ fontSize: "11px", fontFamily: tokens.typography.fontFamilyMono, color: tokens.colors.accentGreen, backgroundColor: "#f0fdf4", padding: "2px 8px", borderRadius: "4px", border: "1px solid #bbf7d0" }}>
                CITATION: {item.citation?.ref_id || item.citation_ref}
              </span>
            </div>
          )) || <div style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>Loading changes...</div>}
        </div>
      </Panel>

      {/* Section 2: What Disagrees */}
      <Panel title="SECTION 2 // WHAT DISAGREES (CROSS-SOURCE DIVERGENCE)">
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
          {brief?.what_disagrees?.map((item: any) => (
            <div
              key={item.id}
              style={{
                padding: tokens.spacing.md,
                backgroundColor: "#fffbebf5",
                border: "1px solid #fde68a",
                borderRadius: "4px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: tokens.typography.fontSizeSm, fontWeight: tokens.typography.fontWeightMedium, color: "#92400e" }}>
                {item.text}
              </span>
              <span style={{ fontSize: "11px", fontFamily: tokens.typography.fontFamilyMono, color: "#b45309", backgroundColor: "#fef3c7", padding: "2px 8px", borderRadius: "4px", border: "1px solid #fde68a" }}>
                CITATION: {item.citation?.ref_id || item.citation_ref}
              </span>
            </div>
          )) || <div style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>Loading divergence signals...</div>}
        </div>
      </Panel>

      {/* Section 3: Thesis Status */}
      <Panel title="SECTION 3 // THESIS STATUS (FALSIFICATION EVALUATION)">
        <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
          {brief?.thesis_evaluations?.map((th: any) => (
            <div
              key={th.id}
              style={{
                padding: tokens.spacing.md,
                backgroundColor: tokens.colors.bg,
                border: "1px solid #fecaca",
                borderRadius: "4px",
                display: "flex",
                flexDirection: "column",
                gap: "6px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.textPrimary }}>{th.statement || th.thesis_statement}</span>
                <span style={{ fontSize: tokens.typography.fontSizeXs, fontWeight: tokens.typography.fontWeightBold, color: "#dc2626", backgroundColor: "#fef2f2", padding: "2px 8px", borderRadius: "4px", border: "1px solid #fecaca" }}>
                  [{th.status}] (CONFIDENCE: {th.confidence}%)
                </span>
              </div>
              <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>
                FALSIFICATION CONDITION: <span style={{ color: "#dc2626" }}>{th.falsification_condition}</span>
              </div>
            </div>
          )) || <div style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>Loading thesis status...</div>}
        </div>
      </Panel>
    </div>
  );
}
