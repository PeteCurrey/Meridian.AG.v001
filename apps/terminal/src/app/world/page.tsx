"use client";

import React, { useEffect, useState } from "react";
import { tokens, Panel, DataTable, Column, StateBanner } from "@meridian/ui";

export default function WorldPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/pillar/world")
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
          World Pillar // Global Macro & Geopolitics
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Macroeconomic growth, central bank policy paths, and global event tone monitoring.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: tokens.spacing.md }}>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>US GDP (FRED)</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>2.2%</div>
          <div style={{ fontSize: "11px", color: tokens.colors.accentGreen }}>Updated Daily</div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>GDPNOW (ATLANTA FED)</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>2.7%</div>
          <div style={{ fontSize: "11px", color: "#b45309" }}>18.5% Divergence detected</div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>GDELT GLOBAL TONE</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>-1.42</div>
          <div style={{ fontSize: "11px", color: tokens.colors.textMuted }}>Realtime Global Event Feed</div>
        </div>
      </div>

      <Panel title="ACTIVE WORLD PILLAR DATA SOURCES">
        <DataTable data={data?.sources || []} columns={columns} keyExtractor={(r) => r.id} />
      </Panel>
    </div>
  );
}
