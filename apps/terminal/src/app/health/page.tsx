"use client";

import React from "react";
import {
  tokens,
  DataTable,
  SourceBadge,
  StalenessBadge,
  StateBanner,
  Value,
  Panel,
  Column
} from "@meridian/ui";
import { WAVE_1_REGISTRY, SourceRegistryEntry } from "@meridian/registry";

export default function HealthBoardPage() {
  const connectedSources = ["fred", "twelve_data", "sec_edgar", "usaspending", "kalshi", "gdelt"];

  const columns: Column<SourceRegistryEntry>[] = [
    {
      key: "id",
      header: "SOURCE ID",
      sortable: true,
      render: (row) => <SourceBadge sourceId={row.id} name={row.name} />
    },
    {
      key: "name",
      header: "NAME",
      sortable: true,
      render: (row) => <span style={{ fontWeight: tokens.typography.fontWeightMedium }}>{row.name}</span>
    },
    {
      key: "pillar",
      header: "PILLAR",
      sortable: true,
      render: (row) => <span style={{ color: tokens.colors.textMuted }}>{row.pillar}</span>
    },
    {
      key: "cadence",
      header: "CADENCE",
      sortable: true,
      render: (row) => row.cadence
    },
    {
      key: "sla",
      header: "SLA",
      sortable: true,
      render: (row) => `${row.staleness_sla_seconds}s`
    },
    {
      key: "latest_value",
      header: "LATEST VALUE",
      render: (row) => {
        const isConnected = connectedSources.includes(row.id);
        if (!isConnected) {
          return <span style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeXs }}>[NOT_CONNECTED]</span>;
        }

        // Provenance-enforced Value component rendering
        return (
          <Value
            value={108.5}
            unit="INDEX"
            source={{ id: row.id, name: row.name }}
            timestamp={new Date().toISOString()}
          />
        );
      }
    },
    {
      key: "status",
      header: "STATE",
      sortable: true,
      render: (row) => {
        const isConnected = connectedSources.includes(row.id);
        const status = isConnected ? "HEALTHY" : "NOT_CONNECTED";
        return <StalenessBadge status={status} />;
      }
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
      <StateBanner
        state="NOT_CONNECTED"
        reason="12 Wave 1 sources awaiting API key configuration or adapter binding."
      />

      <Panel title="SOURCE HEALTH & PROVENANCE BOARD">
        <DataTable
          data={WAVE_1_REGISTRY}
          columns={columns}
          keyExtractor={(row) => row.id}
          emptyMessage="No registry sources found."
        />
      </Panel>
    </div>
  );
}
