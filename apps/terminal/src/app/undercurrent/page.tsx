"use client";

import React, { useEffect, useState } from "react";
import { tokens, Panel, DataTable, Column } from "@meridian/ui";

export default function UndercurrentPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/pillar/undercurrent")
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
          Undercurrent Pillar // Structural Forces & Entity Resolution
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          USAspending award contracts, GLEIF LEI Registry, and OpenCorporates database.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: tokens.spacing.md }}>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>USASPENDING CONTRACTS</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>$14.2M</div>
          <div style={{ fontSize: "11px", color: tokens.colors.accentGreen }}>Apex Tech Inc Award</div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>GLEIF LEI RESOLUTION</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>100% Match</div>
          <div style={{ fontSize: "11px", color: tokens.colors.accentGreen }}>Exact LEI 5493001KJ9572B569811</div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>OPENCORPORATES ENTITIES</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>Active</div>
          <div style={{ fontSize: "11px", color: tokens.colors.textMuted }}>Weekly Audit Ledger</div>
        </div>
      </div>

      <Panel title="ACTIVE UNDERCURRENT PILLAR DATA SOURCES">
        <DataTable data={data?.sources || []} columns={columns} keyExtractor={(r) => r.id} />
      </Panel>
    </div>
  );
}
