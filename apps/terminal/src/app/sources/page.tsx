"use client";

import React, { useEffect, useState } from "react";
import { tokens, Panel, DataTable, Column, SourceBadge } from "@meridian/ui";

export default function SourcesPage() {
  const [sources, setSources] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/health")
      .then((res) => res.json())
      .then((data) => setSources(data.sources || []))
      .catch(console.error);
  }, []);

  const columns: Column<any>[] = [
    { key: "id", header: "SOURCE ID", render: (r) => <SourceBadge sourceId={r.source_id} name={r.name} /> },
    { key: "name", header: "NAME", render: (r) => <span style={{ fontWeight: tokens.typography.fontWeightMedium }}>{r.name}</span> },
    { key: "pillar", header: "PILLAR", render: (r) => r.pillar },
    { key: "cadence", header: "CADENCE", render: (r) => r.cadence },
    { key: "status", header: "CONNECTION STATUS", render: (r) => <span style={{ color: r.status === "HEALTHY" ? "#16a34a" : tokens.colors.textMuted, fontWeight: tokens.typography.fontWeightBold }}>{r.status}</span> }
  ];

  return (
    <div style={{ backgroundColor: "transparent", color: tokens.colors.textPrimary, fontFamily: tokens.typography.fontFamilySans, minHeight: "100%", display: "flex", flexDirection: "column", gap: tokens.spacing.lg }}>
      <div>
        <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeXl, color: tokens.colors.textPrimary, fontWeight: tokens.typography.fontWeightBold }}>
          Sources Registry & Credentials Manager
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Overview of all 41 data source definitions, credential status, and ingestion parameters.
        </p>
      </div>

      <Panel title="ALL REGISTERED DATA SOURCES">
        <DataTable data={sources} columns={columns} keyExtractor={(r) => r.source_id} />
      </Panel>
    </div>
  );
}
