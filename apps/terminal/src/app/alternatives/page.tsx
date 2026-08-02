"use client";

import React, { useEffect, useState } from "react";
import { tokens, Panel, DataTable, Column } from "@meridian/ui";

export default function AlternativesPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/pillar/alternatives")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, []);

  const columns: Column<any>[] = [
    { key: "id", header: "SOURCE ID", render: (r) => <span style={{ fontFamily: tokens.typography.fontFamilyMono, fontWeight: tokens.typography.fontWeightBold }}>{r.id}</span> },
    { key: "name", header: "NAME", render: (r) => r.name },
    { key: "cadence", header: "CADENCE", render: (r) => r.cadence },
    { key: "sla", header: "SLA", render: (r) => `${r.sla_seconds}s` }
  ];

  return (
    <div style={{ backgroundColor: "transparent", color: tokens.colors.textPrimary, fontFamily: tokens.typography.fontFamilySans, minHeight: "100%", display: "flex", flexDirection: "column", gap: tokens.spacing.lg }}>
      <div>
        <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeXl, color: tokens.colors.textPrimary, fontWeight: tokens.typography.fontWeightBold }}>
          Alternatives Pillar // Prediction Markets & Crowd Forecasts
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Kalshi Regulated Exchange, Polymarket Decentralized Odds, and Manifold forecasting.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: tokens.spacing.md }}>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>POLYMARKET FED CUT ODDS</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>68%</div>
          <div style={{ fontSize: "11px", color: tokens.colors.accentGreen }}>Realtime Ingestion Active</div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>KALSHI FED CUT ODDS</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>48%</div>
          <div style={{ fontSize: "11px", color: "#b45309" }}>29.41% Cross-Source Divergence</div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>MANIFOLD FORECASTS</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>55%</div>
          <div style={{ fontSize: "11px", color: tokens.colors.textMuted }}>Hourly Sync</div>
        </div>
      </div>

      <Panel title="ACTIVE ALTERNATIVES PILLAR DATA SOURCES">
        <DataTable data={data?.sources || []} columns={columns} keyExtractor={(r) => r.id} />
      </Panel>
    </div>
  );
}
