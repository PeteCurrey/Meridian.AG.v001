"use client";

import React, { useEffect, useState } from "react";
import { tokens } from "@meridian/ui";

const TIERS = [
  { id: "TIER_1_WATCH", label: "TIER 1 // WATCH", description: "Monitor only. No automated execution.", color: "#4ade80" },
  { id: "TIER_2_ALERT", label: "TIER 2 // ALERT", description: "Notify operator on signal. No auto-action.", color: "#fbbf24" },
  { id: "TIER_3_EXECUTE", label: "TIER 3 // EXECUTE", description: "Automated signal-triggered actions enabled.", color: "#f87171" }
];

export default function MachinePage() {
  const [machineData, setMachineData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [toggling, setToggling] = useState(false);

  const fetchMachine = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/machine");
      if (res.ok) setMachineData(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchMachine(); }, []);

  const toggleKillSwitch = async () => {
    if (!machineData) return;
    try {
      setToggling(true);
      const res = await fetch("/api/machine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ kill_switch_active: !machineData.kill_switch_active })
      });
      if (res.ok) fetchMachine();
    } catch (e) { console.error(e); }
    finally { setToggling(false); }
  };

  const setTier = async (tier: string) => {
    try {
      const res = await fetch("/api/machine", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ tier })
      });
      if (res.ok) fetchMachine();
    } catch (e) { console.error(e); }
  };

  const isKilled = machineData?.kill_switch_active;
  const currentTier = machineData?.current_tier || "TIER_1_WATCH";

  return (
    <div style={{ backgroundColor: "transparent", color: "#f8fafc", fontFamily: tokens.typography.fontFamilySans, minHeight: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#f87171", backgroundColor: "#7f1d1d20", border: "1px solid #7f1d1d40", padding: "2px 8px", borderRadius: "4px" }}>
            AUTOMATION CONTROL
          </span>
          <span style={{ fontSize: "11px", color: "#64748b", fontFamily: tokens.typography.fontFamilyMono }}>Immutable Audit Log · Kill Switch · Tier Selector</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff" }}>Machine Room // Automation Control</h1>
        <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
          Manage automation tier, emergency kill switch, scheduled ingestion passes, and immutable job audit log.
        </p>
      </div>

      {/* Kill Switch + Tier Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "16px" }}>
        {/* Kill Switch Card */}
        <div
          style={{
            backgroundColor: "#0f172a",
            border: `1px solid ${isKilled ? "#991b1b" : "#1e293b"}`,
            borderRadius: "8px",
            padding: "24px",
            display: "flex",
            flexDirection: "column",
            gap: "16px"
          }}
        >
          <div style={{ fontSize: "12px", fontWeight: "800", color: isKilled ? "#f87171" : "#64748b", letterSpacing: "0.08em" }}>
            GLOBAL EMERGENCY KILL SWITCH
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div
              style={{
                width: "60px", height: "60px", borderRadius: "50%",
                backgroundColor: isKilled ? "#7f1d1d" : "#14532d",
                border: `3px solid ${isKilled ? "#ef4444" : "#16a34a"}`,
                display: "flex", alignItems: "center", justifyContent: "center",
                fontSize: "22px"
              }}
            >
              {isKilled ? "🛑" : "✅"}
            </div>
            <div>
              <div style={{ fontSize: "18px", fontWeight: "900", color: isKilled ? "#f87171" : "#4ade80" }}>
                {isKilled ? "KILL SWITCH ACTIVE" : "ENGINE RUNNING"}
              </div>
              <div style={{ fontSize: "12px", color: "#64748b", marginTop: "2px" }}>
                {isKilled ? "All automation halted. Manual operator override required." : "All cron passes executing normally."}
              </div>
            </div>
          </div>

          <button
            onClick={toggleKillSwitch}
            disabled={toggling || loading}
            style={{
              padding: "12px 20px",
              backgroundColor: isKilled ? "#16a34a" : "#dc2626",
              color: "#ffffff",
              fontWeight: "800",
              fontSize: "13px",
              border: "none",
              borderRadius: "6px",
              cursor: "pointer",
              letterSpacing: "0.04em"
            }}
          >
            {toggling ? "Updating..." : isKilled ? "🟢 RESTORE AUTOMATION" : "🛑 ENGAGE KILL SWITCH"}
          </button>
        </div>

        {/* Tier Selector */}
        <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "24px", display: "flex", flexDirection: "column", gap: "12px" }}>
          <div style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", letterSpacing: "0.08em" }}>AUTOMATION TIER SELECTOR</div>
          {TIERS.map((tier) => {
            const isActive = currentTier === tier.id;
            return (
              <button
                key={tier.id}
                onClick={() => setTier(tier.id)}
                style={{
                  padding: "12px 16px",
                  backgroundColor: isActive ? "#1e293b" : "#090d16",
                  border: `1px solid ${isActive ? tier.color : "#334155"}`,
                  borderLeft: `4px solid ${isActive ? tier.color : "#334155"}`,
                  borderRadius: "6px",
                  cursor: "pointer",
                  textAlign: "left",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center"
                }}
              >
                <div>
                  <div style={{ fontSize: "12px", fontWeight: "800", color: isActive ? tier.color : "#94a3b8" }}>{tier.label}</div>
                  <div style={{ fontSize: "11px", color: "#64748b", marginTop: "2px" }}>{tier.description}</div>
                </div>
                {isActive && <span style={{ fontSize: "10px", fontWeight: "800", color: tier.color, backgroundColor: `${tier.color}20`, padding: "3px 8px", borderRadius: "4px" }}>ACTIVE</span>}
              </button>
            );
          })}
        </div>
      </div>

      {/* Cron Schedules */}
      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", letterSpacing: "0.08em", marginBottom: "14px" }}>
          SCHEDULED INGESTION PASSES
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {(machineData?.schedules || []).map((s: any) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#090d16", border: "1px solid #1e293b", borderRadius: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: isKilled ? "#ef4444" : "#4ade80", display: "inline-block", flexShrink: 0 }} />
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", fontFamily: tokens.typography.fontFamilyMono }}>{s.job_name}</span>
                <span style={{ fontSize: "10px", color: "#64748b", backgroundColor: "#1e293b", padding: "2px 6px", borderRadius: "3px" }}>{s.cron_expression}</span>
              </div>
              <div style={{ display: "flex", gap: "12px", fontSize: "11px" }}>
                <span style={{ color: "#64748b" }}>Cadence: <strong style={{ color: "#cbd5e1" }}>{s.cadence}</strong></span>
                <span style={{ color: isKilled ? "#f87171" : "#4ade80", fontWeight: "700" }}>{isKilled ? "HALTED" : "ACTIVE"}</span>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Audit Log */}
      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#64748b", letterSpacing: "0.08em", marginBottom: "14px" }}>
          IMMUTABLE JOB AUDIT LOG (LAST 20)
        </div>
        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {(machineData?.audit_logs || []).map((log: any) => (
            <div key={log.id} style={{ display: "grid", gridTemplateColumns: "180px 160px 120px 1fr auto", gap: "12px", alignItems: "center", padding: "10px 14px", backgroundColor: "#090d16", border: "1px solid #1e293b", borderRadius: "5px", fontSize: "11px", fontFamily: tokens.typography.fontFamilyMono }}>
              <span style={{ color: "#94a3b8", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                {new Date(log.timestamp).toLocaleTimeString("en-GB")}
              </span>
              <span style={{ color: "#38bdf8", fontWeight: "700", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>{log.job_name}</span>
              <span style={{ color: "#64748b" }}>{log.trigger_type}</span>
              <span style={{ color: log.status === "SUCCESS" ? "#4ade80" : log.status?.includes("KILL") ? "#f87171" : "#fbbf24", fontWeight: "700" }}>{log.status}</span>
              <span style={{ color: "#475569" }}>{log.duration_ms}ms</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
