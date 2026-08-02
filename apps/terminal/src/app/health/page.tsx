"use client";

import React, { useEffect, useState } from "react";
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

export default function HealthBoardPage() {
  const [sources, setSources] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterPillar, setFilterPillar] = useState<string>("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/health");
      if (res.ok) {
        const data = await res.json();
        setSources(data.sources || []);
      }
    } catch (e) {
      console.error("Failed to fetch health data:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchHealth();
  }, []);

  const filteredSources = sources.filter(s => {
    const matchesPillar = filterPillar === "ALL" || s.pillar === filterPillar;
    const matchesSearch =
      s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
      s.source_id.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPillar && matchesSearch;
  });

  const columns: Column<any>[] = [
    {
      key: "id",
      header: "SOURCE ID",
      sortable: true,
      render: (row) => <SourceBadge sourceId={row.source_id} name={row.name} />
    },
    {
      key: "name",
      header: "NAME",
      sortable: true,
      render: (row) => <span style={{ fontWeight: tokens.typography.fontWeightMedium, color: tokens.colors.textPrimary }}>{row.name}</span>
    },
    {
      key: "pillar",
      header: "PILLAR",
      sortable: true,
      render: (row) => (
        <span style={{ fontSize: tokens.typography.fontSizeXs, fontWeight: tokens.typography.fontWeightMedium, color: tokens.colors.accentGreen, backgroundColor: `${tokens.colors.accentGreen}12`, padding: "2px 8px", borderRadius: "12px" }}>
          {row.pillar}
        </span>
      )
    },
    {
      key: "cadence",
      header: "CADENCE",
      sortable: true,
      render: (row) => <span style={{ fontFamily: tokens.typography.fontFamilyMono, fontSize: tokens.typography.fontSizeXs }}>{row.cadence}</span>
    },
    {
      key: "sla",
      header: "SLA (SEC)",
      sortable: true,
      render: (row) => <span style={{ fontFamily: tokens.typography.fontFamilyMono, fontSize: tokens.typography.fontSizeXs }}>{row.sla_seconds}s</span>
    },
    {
      key: "status",
      header: "HEALTH STATE",
      sortable: true,
      render: (row) => <StalenessBadge status={row.status} />
    }
  ];

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
            Source Health & Provenance
          </h1>
          <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
            Real-time status tracking for all 41 registered macro, market, and alternative data feeds.
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: tokens.colors.panelBg,
            border: `1px solid ${tokens.colors.borderHairline}`,
            borderRadius: "4px",
            fontSize: tokens.typography.fontSizeXs,
            fontWeight: tokens.typography.fontWeightMedium,
            cursor: "pointer",
            color: tokens.colors.textPrimary
          }}
        >
          {loading ? "Refreshing..." : "↻ Refresh Feed"}
        </button>
      </div>

      {/* Overview Stat Cards */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: tokens.spacing.md }}>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted, marginBottom: "4px" }}>TOTAL SOURCES</div>
          <div style={{ fontSize: "28px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono }}>{sources.length}</div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted, marginBottom: "4px" }}>HEALTHY FEEDS</div>
          <div style={{ fontSize: "28px", fontWeight: tokens.typography.fontWeightBold, color: "#16a34a", fontFamily: tokens.typography.fontFamilyMono }}>
            {sources.filter(s => s.status === "HEALTHY").length}
          </div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted, marginBottom: "4px" }}>UNCONNECTED / PENDING</div>
          <div style={{ fontSize: "28px", fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.textMuted, fontFamily: tokens.typography.fontFamilyMono }}>
            {sources.filter(s => s.status === "NOT_CONNECTED").length}
          </div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted, marginBottom: "4px" }}>COVERAGE PILLARS</div>
          <div style={{ fontSize: "28px", fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.accentGreen, fontFamily: tokens.typography.fontFamilyMono }}>5</div>
        </div>
      </div>

      {/* Filter & Search Bar */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", gap: tokens.spacing.md }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {["ALL", "WORLD", "MARKETS", "HORIZON", "UNDERCURRENT", "ALTERNATIVES"].map(p => (
            <button
              key={p}
              onClick={() => setFilterPillar(p)}
              style={{
                padding: "6px 12px",
                borderRadius: "4px",
                fontSize: tokens.typography.fontSizeXs,
                fontWeight: filterPillar === p ? tokens.typography.fontWeightMedium : tokens.typography.fontWeightRegular,
                backgroundColor: filterPillar === p ? tokens.colors.accentGreen : tokens.colors.panelBg,
                color: filterPillar === p ? "#ffffff" : tokens.colors.textMuted,
                border: `1px solid ${tokens.colors.borderHairline}`,
                cursor: "pointer"
              }}
            >
              {p}
            </button>
          ))}
        </div>

        <input
          type="text"
          placeholder="Filter sources by name or ID..."
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          style={{
            padding: "8px 12px",
            borderRadius: "4px",
            border: `1px solid ${tokens.colors.borderHairline}`,
            fontSize: tokens.typography.fontSizeSm,
            width: "260px",
            outline: "none"
          }}
        />
      </div>

      {/* Data Table */}
      <Panel title={`REGISTERED DATA SOURCES (${filteredSources.length})`}>
        <DataTable
          data={filteredSources}
          columns={columns}
          keyExtractor={(row) => row.source_id}
          emptyMessage="No matching sources found."
        />
      </Panel>
    </div>
  );
}
