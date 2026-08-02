"use client";

import React, { useEffect, useState } from "react";
import { tokens, Panel, DataTable, Column } from "@meridian/ui";

export default function HorizonPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/pillar/horizon")
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
          Horizon Pillar // Corporate Filings & Pipeline
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          SEC EDGAR 10-K/10-Q/S-1 filings, NASDAQ IPO calendar, and UK Companies House.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: tokens.spacing.md }}>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>SEC EDGAR USER-AGENT</div>
          <div style={{ fontSize: "14px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "6px 0" }}>Declared & Authenticated</div>
          <div style={{ fontSize: "11px", color: tokens.colors.accentGreen }}>SLA 1800s Active</div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>COMPANIES HOUSE UK</div>
          <div style={{ fontSize: "14px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "6px 0" }}>API Key Active</div>
          <div style={{ fontSize: "11px", color: tokens.colors.accentGreen }}>Daily Cadence</div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>NASDAQ IPO CALENDAR</div>
          <div style={{ fontSize: "14px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "6px 0" }}>14 Filings Pending</div>
          <div style={{ fontSize: "11px", color: tokens.colors.textMuted }}>Public Feed</div>
        </div>
      </div>

      <Panel title="ACTIVE HORIZON PILLAR DATA SOURCES">
        <DataTable data={data?.sources || []} columns={columns} keyExtractor={(r) => r.id} />
      </Panel>
    </div>
  );
}
