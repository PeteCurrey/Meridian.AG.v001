"use client";

import React, { useEffect, useState } from "react";
import { tokens, Panel, DataTable, Column } from "@meridian/ui";

export default function EdgePage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [filterSeverity, setFilterSeverity] = useState<string>("ALL");

  const fetchSignals = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/edge");
      if (res.ok) {
        const data = await res.json();
        setSignals(data.signals || []);
      }
    } catch (e) {
      console.error("Failed to fetch signals:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchSignals();
  }, []);

  const handleUpdateStatus = (id: string, newStatus: string) => {
    setSignals(signals.map(s => (s.id === id ? { ...s, status: newStatus } : s)));
  };

  const filteredSignals = signals.filter(s => filterSeverity === "ALL" || s.severity === filterSeverity);

  const columns: Column<any>[] = [
    {
      key: "salience",
      header: "SALIENCE SCORE",
      sortable: true,
      render: (row) => (
        <span style={{ fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, color: tokens.colors.accentGreen, fontSize: tokens.typography.fontSizeMd }}>
          {row.salience_score?.toFixed(1) || "0.0"}
        </span>
      )
    },
    {
      key: "severity",
      header: "SEVERITY",
      sortable: true,
      render: (row) => {
        let bgColor = "#f0fdf4";
        let color = "#16a34a";
        let border = "#bbf7d0";

        if (row.severity === "ALERT") {
          bgColor = "#fffbe0";
          color = "#d97706";
          border = "#fde68a";
        } else if (row.severity === "CRITICAL") {
          bgColor = "#fef2f2";
          color = "#dc2626";
          border = "#fecaca";
        }

        return (
          <span
            style={{
              fontSize: tokens.typography.fontSizeXs,
              fontWeight: tokens.typography.fontWeightBold,
              color,
              backgroundColor: bgColor,
              border: `1px solid ${border}`,
              padding: "2px 8px",
              borderRadius: "4px"
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
          <span style={{ fontWeight: tokens.typography.fontWeightMedium, color: tokens.colors.textPrimary }}>{row.narrative_summary}</span>
          {row.touches_thesis_falsification && (
            <span style={{ color: "#dc2626", fontSize: "11px", fontWeight: tokens.typography.fontWeightBold }}>
              🚨 TOUCHES THESIS FALSIFICATION CONDITION (+50 WEIGHT)
            </span>
          )}
        </div>
      )
    },
    {
      key: "status",
      header: "STATUS",
      sortable: true,
      render: (row) => <span style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeXs }}>{row.status}</span>
    },
    {
      key: "actions",
      header: "ACTIONS",
      render: (row) => (
        <div style={{ display: "flex", gap: "6px" }}>
          <button
            onClick={() => handleUpdateStatus(row.id, "ACKNOWLEDGED")}
            style={{
              padding: "4px 8px",
              fontSize: "11px",
              backgroundColor: tokens.colors.panelBg,
              color: tokens.colors.textPrimary,
              border: `1px solid ${tokens.colors.borderHairline}`,
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            ACK
          </button>

          <button
            onClick={() => alert(`Signal ${row.id} escalated to Council Room.`)}
            style={{
              padding: "4px 8px",
              fontSize: "11px",
              backgroundColor: "#fffbe0",
              color: "#b45309",
              border: "1px solid #fde68a",
              borderRadius: "4px",
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
            Edge Detector & Signal Centre
          </h1>
          <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
            Cross-source disagreement, statistical anomaly, and SLA absence signals ranked by contextual salience.
          </p>
        </div>

        <button
          onClick={fetchSignals}
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
          {loading ? "Scanning..." : "↻ Scan Signals"}
        </button>
      </div>

      {/* Filter Severity Toolbar */}
      <div style={{ display: "flex", gap: "6px" }}>
        {["ALL", "CRITICAL", "ALERT", "WARN"].map(sev => (
          <button
            key={sev}
            onClick={() => setFilterSeverity(sev)}
            style={{
              padding: "6px 12px",
              borderRadius: "4px",
              fontSize: tokens.typography.fontSizeXs,
              fontWeight: filterSeverity === sev ? tokens.typography.fontWeightMedium : tokens.typography.fontWeightRegular,
              backgroundColor: filterSeverity === sev ? tokens.colors.accentGreen : tokens.colors.panelBg,
              color: filterSeverity === sev ? "#ffffff" : tokens.colors.textMuted,
              border: `1px solid ${tokens.colors.borderHairline}`,
              cursor: "pointer"
            }}
          >
            {sev}
          </button>
        ))}
      </div>

      {/* Signals Table */}
      <Panel title={`ACTIVE DETECTED SIGNALS (${filteredSignals.length})`}>
        <DataTable
          data={filteredSignals}
          columns={columns}
          keyExtractor={(row) => row.id}
          emptyMessage="No active signals detected."
        />
      </Panel>
    </div>
  );
}
