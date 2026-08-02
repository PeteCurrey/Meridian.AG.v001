"use client";

import React, { useEffect, useState } from "react";
import { tokens, Panel, DataTable, Column, StateBanner } from "@meridian/ui";

export default function MachinePage() {
  const [machineData, setMachineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  const fetchMachineStatus = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/machine");
      if (res.ok) {
        const data = await res.json();
        setMachineData(data);
      }
    } catch (e) {
      console.error("Failed to fetch machine status:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMachineStatus();
  }, []);

  const handleToggleKillSwitch = async () => {
    try {
      const nextState = !machineData?.kill_switch_active;
      const res = await fetch("/api/machine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kill_switch_active: nextState })
      });
      if (res.ok) {
        fetchMachineStatus();
      }
    } catch (e) {
      console.error("Kill switch toggle error:", e);
    }
  };

  const cronColumns: Column<any>[] = [
    {
      key: "job_name",
      header: "JOB NAME",
      render: (row) => <span style={{ fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.textPrimary }}>{row.job_name}</span>
    },
    {
      key: "cron",
      header: "CRON EXPRESSION",
      render: (row) => <span style={{ fontFamily: tokens.typography.fontFamilyMono, color: tokens.colors.accentGreen }}>{row.cron_expression}</span>
    },
    {
      key: "cadence",
      header: "CADENCE",
      render: (row) => <span style={{ fontSize: tokens.typography.fontSizeXs }}>{row.cadence}</span>
    },
    {
      key: "status",
      header: "STATUS",
      render: (row) => {
        const isHalted = row.status === "HALTED";
        return (
          <span
            style={{
              fontSize: tokens.typography.fontSizeXs,
              fontWeight: tokens.typography.fontWeightBold,
              color: isHalted ? "#dc2626" : "#16a34a",
              backgroundColor: isHalted ? "#fef2f2" : "#f0fdf4",
              border: `1px solid ${isHalted ? "#fecaca" : "#bbf7d0"}`,
              padding: "2px 8px",
              borderRadius: "4px"
            }}
          >
            {row.status}
          </span>
        );
      }
    }
  ];

  const logColumns: Column<any>[] = [
    {
      key: "timestamp",
      header: "TIMESTAMP",
      render: (row) => <span style={{ fontFamily: tokens.typography.fontFamilyMono, fontSize: tokens.typography.fontSizeXs }}>{row.timestamp}</span>
    },
    {
      key: "job_name",
      header: "JOB NAME",
      render: (row) => <span style={{ fontWeight: tokens.typography.fontWeightMedium }}>{row.job_name}</span>
    },
    {
      key: "status",
      header: "STATUS",
      render: (row) => {
        let color = "#16a34a";
        let bg = "#f0fdf4";
        let border = "#bbf7d0";

        if (row.status === "REJECTED_KILL_SWITCH") {
          color = "#dc2626";
          bg = "#fef2f2";
          border = "#fecaca";
        }

        return (
          <span style={{ fontSize: tokens.typography.fontSizeXs, fontWeight: tokens.typography.fontWeightBold, color, backgroundColor: bg, border: `1px solid ${border}`, padding: "2px 8px", borderRadius: "4px" }}>
            {row.status}
          </span>
        );
      }
    },
    {
      key: "duration",
      header: "DURATION",
      render: (row) => <span style={{ fontFamily: tokens.typography.fontFamilyMono }}>{row.duration_ms}ms</span>
    },
    {
      key: "rows",
      header: "ROWS PROCESSED",
      render: (row) => <span style={{ fontFamily: tokens.typography.fontFamilyMono }}>{row.rows_processed}</span>
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
      {/* Header & Kill Switch Toggle */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeXl, color: tokens.colors.textPrimary, fontWeight: tokens.typography.fontWeightBold }}>
            Machine Control Room
          </h1>
          <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
            Background automation schedules, execution tier management, and emergency kill switch controls.
          </p>
        </div>

        <button
          onClick={handleToggleKillSwitch}
          style={{
            padding: "10px 20px",
            backgroundColor: machineData?.kill_switch_active ? "#dc2626" : "#16a34a",
            color: "#ffffff",
            fontWeight: tokens.typography.fontWeightBold,
            fontSize: tokens.typography.fontSizeSm,
            border: "none",
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          {machineData?.kill_switch_active ? "🚨 KILL SWITCH ACTIVE (CLICK TO RESUME)" : "🛡️ KILL SWITCH READY (CLICK TO HALT)"}
        </button>
      </div>

      {machineData?.kill_switch_active && (
        <StateBanner
          state="FEED_OFFLINE"
          reason="EMERGENCY KILL SWITCH ACTIVE: All background automation jobs and scheduled triggers are HALTED."
        />
      )}

      {/* Tier Control Panel */}
      <Panel title="AUTOMATION EXECUTION TIER CONTROL">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: tokens.typography.fontSizeSm, fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.accentGreen }}>
              CURRENT TIER: TIER 1 (WATCH ONLY)
            </div>
            <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted, marginTop: "2px" }}>
              Ingestion, entity resolution, edge detection, and brief generation run automatically. Zero execution actions permitted.
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            {["TIER 0 (MANUAL)", "TIER 1 (WATCH)", "TIER 2 (ASSISTED) [LOCKED]"].map((tier, idx) => (
              <button
                key={tier}
                disabled={idx >= 2}
                style={{
                  padding: "6px 12px",
                  borderRadius: "4px",
                  fontSize: tokens.typography.fontSizeXs,
                  backgroundColor: idx === 1 ? tokens.colors.accentGreen : tokens.colors.panelBg,
                  color: idx === 1 ? "#ffffff" : tokens.colors.textMuted,
                  border: `1px solid ${tokens.colors.borderHairline}`,
                  cursor: idx >= 2 ? "not-allowed" : "pointer"
                }}
              >
                {tier}
              </button>
            ))}
          </div>
        </div>
      </Panel>

      {/* Active Cron Schedules */}
      <Panel title="ACTIVE BACKGROUND CRON SCHEDULES">
        <DataTable
          data={machineData?.schedules || []}
          columns={cronColumns}
          keyExtractor={(row) => row.id}
          emptyMessage="No schedules."
        />
      </Panel>

      {/* Immutable Job Audit Log */}
      <Panel title="IMMUTABLE JOB AUDIT LOG">
        <DataTable
          data={machineData?.audit_logs || []}
          columns={logColumns}
          keyExtractor={(row) => row.id}
          emptyMessage="No audit logs."
        />
      </Panel>
    </div>
  );
}
