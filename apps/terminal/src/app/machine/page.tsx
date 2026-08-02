"use client";

import React, { useState } from "react";
import { tokens, Panel, DataTable, Column, KillSwitch, StateBanner } from "@meridian/ui";

interface AuditLogRow {
  id: string;
  job_name: string;
  trigger_type: string;
  status: "SUCCESS" | "FAILED" | "REJECTED_KILL_SWITCH";
  duration_ms: number;
  rows_processed: number;
  cost_usd_scaled: string;
  timestamp: string;
}

interface CronSchedule {
  id: string;
  job_name: string;
  cron_expression: string;
  cadence: string;
  next_run_iso: string;
  status: "ACTIVE" | "HALTED";
}

export default function MachinePage() {
  const [isKillSwitchActive, setIsKillSwitchActive] = useState(false);

  const cronSchedules: CronSchedule[] = [
    {
      id: "cron-001",
      job_name: "REALTIME_INGESTION_PASS",
      cron_expression: "*/5 * * * *",
      cadence: "EVERY_5_MIN",
      next_run_iso: "2026-07-31T10:50:00Z",
      status: isKillSwitchActive ? "HALTED" : "ACTIVE"
    },
    {
      id: "cron-002",
      job_name: "HOURLY_MACRO_PASS",
      cron_expression: "0 * * * *",
      cadence: "HOURLY",
      next_run_iso: "2026-07-31T11:00:00Z",
      status: isKillSwitchActive ? "HALTED" : "ACTIVE"
    },
    {
      id: "cron-003",
      job_name: "DAILY_BRIEF_GENERATION",
      cron_expression: "0 6 * * *",
      cadence: "DAILY_0600_UTC",
      next_run_iso: "2026-08-01T06:00:00Z",
      status: isKillSwitchActive ? "HALTED" : "ACTIVE"
    }
  ];

  const [auditLogs, setAuditLogs] = useState<AuditLogRow[]>([
    {
      id: "log-001",
      job_name: "INGESTION_PASS_WAVE_1",
      trigger_type: "CADENCE_PASS",
      status: "SUCCESS",
      duration_ms: 142,
      rows_processed: 21,
      cost_usd_scaled: "25",
      timestamp: "2026-07-31T10:45:00Z"
    },
    {
      id: "log-002",
      job_name: "EDGE_DETECTION_PASS",
      trigger_type: "AFTER_INGESTION",
      status: "SUCCESS",
      duration_ms: 38,
      rows_processed: 4,
      cost_usd_scaled: "0",
      timestamp: "2026-07-31T10:45:01Z"
    },
    {
      id: "log-003",
      job_name: "DAILY_BRIEF_GENERATION",
      trigger_type: "CRON_0600_UTC",
      status: "SUCCESS",
      duration_ms: 85,
      rows_processed: 1,
      cost_usd_scaled: "0",
      timestamp: "2026-07-31T06:00:00Z"
    }
  ]);

  const cronColumns: Column<CronSchedule>[] = [
    {
      key: "job_name",
      header: "JOB NAME",
      render: (row) => <span style={{ fontWeight: tokens.typography.fontWeightBold }}>{row.job_name}</span>
    },
    {
      key: "cron",
      header: "CRON EXPRESSION",
      render: (row) => <span style={{ color: tokens.colors.accentGreen }}>{row.cron_expression}</span>
    },
    {
      key: "cadence",
      header: "CADENCE",
      render: (row) => row.cadence
    },
    {
      key: "next_run",
      header: "NEXT RUN (UTC)",
      render: (row) => row.next_run_iso
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
              color: isHalted ? tokens.colors.offlineRed : tokens.colors.accentGreen,
              backgroundColor: isHalted ? `${tokens.colors.offlineRed}15` : `${tokens.colors.accentGreen}15`,
              border: `1px solid ${isHalted ? tokens.colors.offlineRed : tokens.colors.accentGreen}`,
              padding: "2px 6px",
              borderRadius: "2px"
            }}
          >
            {row.status}
          </span>
        );
      }
    }
  ];

  const logColumns: Column<AuditLogRow>[] = [
    {
      key: "timestamp",
      header: "TIMESTAMP",
      render: (row) => row.timestamp
    },
    {
      key: "job_name",
      header: "JOB NAME",
      render: (row) => <span style={{ fontWeight: tokens.typography.fontWeightMedium }}>{row.job_name}</span>
    },
    {
      key: "trigger",
      header: "TRIGGER TYPE",
      render: (row) => <span style={{ color: tokens.colors.textMuted }}>{row.trigger_type}</span>
    },
    {
      key: "status",
      header: "STATUS",
      render: (row) => {
        let color: string = tokens.colors.accentGreen;
        if (row.status === "FAILED") color = tokens.colors.warningAmber;
        if (row.status === "REJECTED_KILL_SWITCH") color = tokens.colors.offlineRed;

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
            {row.status}
          </span>
        );
      }
    },
    {
      key: "duration",
      header: "DURATION",
      render: (row) => `${row.duration_ms}ms`
    },
    {
      key: "rows",
      header: "ROWS PROCESSED",
      render: (row) => row.rows_processed
    },
    {
      key: "cost",
      header: "COST (USD)",
      render: (row) => `$0.${row.cost_usd_scaled.padStart(2, "0")}`
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
      <header style={{ marginBottom: tokens.spacing.lg, borderBottom: `1px solid ${tokens.colors.borderHairline}`, paddingBottom: tokens.spacing.md }}>
        <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeLg, color: tokens.colors.accentGreen }}>
          MACHINE CONTROL ROOM // BACKGROUND AUTOMATION ENGINE
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Active Cron Triggers, Immutable Job Audit Ledger, and Emergency Kill Switch Control
        </p>
      </header>

      {isKillSwitchActive && (
        <StateBanner
          state="FEED_OFFLINE"
          reason="EMERGENCY KILL SWITCH ACTIVE: All background automation jobs and scheduled triggers are HALTED."
        />
      )}

      {/* Tier Selector Bar */}
      <Panel title="AUTOMATION EXECUTION TIER CONTROL">
        <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <div>
            <div style={{ fontSize: tokens.typography.fontSizeSm, fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.accentGreen }}>
              CURRENT TIER: TIER 1 (WATCH ONLY)
            </div>
            <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted, marginTop: "2px" }}>
              Ingestion, entity resolution, edge detection, and brief generation run automatically. Zero trading or broker actions permitted.
            </div>
          </div>

          <div style={{ display: "flex", gap: "6px" }}>
            {["TIER 0 (MANUAL)", "TIER 1 (WATCH)", "TIER 2 (ASSISTED) [LOCKED]", "TIER 3 (AUTONOMOUS) [LOCKED]"].map((tier, idx) => (
              <button
                key={tier}
                disabled={idx >= 2}
                style={{
                  padding: "6px 12px",
                  fontSize: tokens.typography.fontSizeXs,
                  fontFamily: tokens.typography.fontFamilyMono,
                  backgroundColor: idx === 1 ? tokens.colors.accentGreen : tokens.colors.panelBg,
                  color: idx === 1 ? "#000" : tokens.colors.textMuted,
                  border: `1px solid ${tokens.colors.borderHairline}`,
                  cursor: idx >= 2 ? "not-allowed" : "pointer",
                  opacity: idx >= 2 ? 0.5 : 1
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
          data={cronSchedules}
          columns={cronColumns}
          keyExtractor={(row) => row.id}
        />
      </Panel>

      {/* Job Audit Log */}
      <Panel title="IMMUTABLE JOB AUDIT LOG (AUDIT_LOG TABLE)">
        <DataTable
          data={auditLogs}
          columns={logColumns}
          keyExtractor={(row) => row.id}
        />
      </Panel>
    </div>
  );
}
