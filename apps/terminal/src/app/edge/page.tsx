"use client";

import React, { useState } from "react";
import { tokens, Panel, DataTable, Column, StalenessBadge, SourceBadge, PillarTag } from "@meridian/ui";
import { Signal, SignalSeverity, SignalStatus, SignalType, Pillar } from "@meridian/core";

export default function EdgePage() {
  const [signals, setSignals] = useState<Signal[]>([
    {
      id: "sig-001",
      signal_type: SignalType.DISAGREEMENT,
      canonical_metric_key: "MACRO_US_GDP",
      pillar: Pillar.WORLD,
      severity: SignalSeverity.CRITICAL,
      confidence: 95,
      primary_source_id: "atlanta_fed_gdpnow",
      secondary_source_id: "fred",
      delta_value: 120,
      z_score: null,
      divergence_pct: 18.5,
      overrun_seconds: null,
      narrative_summary: "Cross-Source Disagreement: GDPNow (2.7%) vs FRED Historical (2.2%) diverged by 18.50% on MACRO_US_GDP",
      linked_entity_id: "e-apex-tech-001",
      touches_thesis_falsification: true,
      salience_score: 290.0, // Base 50 + Watchlist 30 + Thesis Falsification 50 + Question 25 = 155 * 2.0x (CRITICAL) = 310
      status: SignalStatus.UNREAD,
      detected_at: new Date().toISOString()
    },
    {
      id: "sig-002",
      signal_type: SignalType.ANOMALY,
      canonical_metric_key: "CRYPTO_BTC_PRICE_USD",
      pillar: Pillar.MARKETS,
      severity: SignalSeverity.ALERT,
      confidence: 90,
      primary_source_id: "coingecko",
      secondary_source_id: null,
      delta_value: 4500,
      z_score: 3.42,
      divergence_pct: null,
      overrun_seconds: null,
      narrative_summary: "Statistical Outlier: coingecko:CRYPTO_BTC_PRICE_USD recorded 67450 (3.42 sigma outside historical range)",
      linked_entity_id: null,
      touches_thesis_falsification: false,
      salience_score: 165.0,
      status: SignalStatus.UNREAD,
      detected_at: new Date().toISOString()
    },
    {
      id: "sig-003",
      signal_type: SignalType.ABSENCE,
      canonical_metric_key: "TWELVE_DATA_FEED_ABSENCE",
      pillar: Pillar.MARKETS,
      severity: SignalSeverity.WARN,
      confidence: 100,
      primary_source_id: "twelve_data",
      secondary_source_id: null,
      delta_value: null,
      z_score: null,
      divergence_pct: null,
      overrun_seconds: 420,
      narrative_summary: "SLA Overrun: Source 'twelve_data' failed to emit expected payload within 300s SLA (overrun by 420s)",
      linked_entity_id: null,
      touches_thesis_falsification: false,
      salience_score: 90.0,
      status: SignalStatus.UNREAD,
      detected_at: new Date().toISOString()
    }
  ]);

  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  const handleUpdateStatus = (id: string, newStatus: SignalStatus) => {
    setSignals(signals.map(s => (s.id === id ? { ...s, status: newStatus } : s)));
  };

  const filteredSignals = signals.filter(s => filterSeverity === "ALL" || s.severity === filterSeverity);

  const columns: Column<Signal>[] = [
    {
      key: "salience",
      header: "SALIENCE SCORE",
      sortable: true,
      render: (row) => (
        <span style={{ fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.accentGreen }}>
          {row.salience_score.toFixed(1)}
        </span>
      )
    },
    {
      key: "severity",
      header: "SEVERITY",
      sortable: true,
      render: (row) => {
        let color: string = tokens.colors.accentGreen;
        if (row.severity === "ALERT") color = tokens.colors.warningAmber;
        if (row.severity === "CRITICAL") color = tokens.colors.offlineRed;

        return (
          <span
            style={{
              fontSize: tokens.typography.fontSizeXs,
              fontWeight: tokens.typography.fontWeightBold,
              color,
              border: `1px solid ${color}`,
              padding: "2px 6px",
              borderRadius: "2px"
            }}
          >
            [{row.severity}] {row.signal_type}
          </span>
        );
      }
    },
    {
      key: "narrative",
      header: "SIGNAL SUMMARY",
      render: (row) => (
        <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
          <span style={{ fontWeight: tokens.typography.fontWeightMedium }}>{row.narrative_summary}</span>
          {row.touches_thesis_falsification && (
            <span style={{ color: tokens.colors.offlineRed, fontSize: "9px", fontWeight: tokens.typography.fontWeightBold }}>
              🚨 TOUCHES THESIS FALSIFICATION CONDITION (+50 WEIGHT)
            </span>
          )}
        </div>
      )
    },
    {
      key: "math_basis",
      header: "MATH PROVENANCE",
      render: (row) => (
        <span style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeXs }}>
          {row.z_score !== null && `Z=${row.z_score}σ`}
          {row.divergence_pct !== null && `Div=${row.divergence_pct}%`}
          {row.overrun_seconds !== null && `Overrun=${row.overrun_seconds}s`}
        </span>
      )
    },
    {
      key: "status",
      header: "STATUS",
      sortable: true,
      render: (row) => <span style={{ color: tokens.colors.textMuted }}>{row.status}</span>
    },
    {
      key: "actions",
      header: "ACTIONS",
      render: (row) => (
        <div style={{ display: "flex", gap: "4px" }}>
          <button
            onClick={() => handleUpdateStatus(row.id, SignalStatus.ACKNOWLEDGED)}
            style={{
              padding: "2px 6px",
              fontSize: "9px",
              fontFamily: tokens.typography.fontFamilyMono,
              backgroundColor: tokens.colors.panelBg,
              color: tokens.colors.textPrimary,
              border: `1px solid ${tokens.colors.borderHairline}`,
              cursor: "pointer"
            }}
          >
            ACK
          </button>
          <button
            onClick={() => handleUpdateStatus(row.id, SignalStatus.DISMISSED)}
            style={{
              padding: "2px 6px",
              fontSize: "9px",
              fontFamily: tokens.typography.fontFamilyMono,
              backgroundColor: tokens.colors.panelBg,
              color: tokens.colors.textMuted,
              border: `1px solid ${tokens.colors.borderHairline}`,
              cursor: "pointer"
            }}
          >
            DISMISS
          </button>
          <button
            onClick={() => alert(`Escalated signal ${row.id} to Council`)}
            style={{
              padding: "2px 6px",
              fontSize: "9px",
              fontFamily: tokens.typography.fontFamilyMono,
              backgroundColor: `${tokens.colors.warningAmber}15`,
              color: tokens.colors.warningAmber,
              border: `1px solid ${tokens.colors.warningAmber}`,
              cursor: "pointer"
            }}
          >
            ESCALATE
          </button>
        </div>
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
      <header style={{ marginBottom: tokens.spacing.lg }}>
        <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeLg, color: tokens.colors.accentGreen }}>
          EDGE DETECTOR // SIGNAL CENTRE
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Signals Ranked by Contextual Salience Score (Weighted against Watchlist, Positions, and Thesis Falsification Risk)
        </p>
      </header>

      {/* Filter Toolbar */}
      <div style={{ display: "flex", gap: tokens.spacing.md, marginBottom: tokens.spacing.md }}>
        <span style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>FILTER SEVERITY:</span>
        {["ALL", "CRITICAL", "ALERT", "WARN", "INFO"].map(sev => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            style={{
              padding: "2px 8px",
              fontSize: tokens.typography.fontSizeXs,
              fontFamily: tokens.typography.fontFamilyMono,
              backgroundColor: filterSeverity === sev ? tokens.colors.accentGreen : tokens.colors.panelBg,
              color: filterSeverity === sev ? "#000" : tokens.colors.textPrimary,
              border: `1px solid ${tokens.colors.borderHairline}`,
              cursor: "pointer"
            }}
          >
            {sev}
          </button>
        ))}
      </div>

      <Panel title="ACTIVE SIGNALS SORTED BY SALIENCE SCORE">
        <DataTable
          data={filteredSignals}
          columns={columns}
          keyExtractor={(row) => row.id}
        />
      </Panel>
    </div>
  );
}
