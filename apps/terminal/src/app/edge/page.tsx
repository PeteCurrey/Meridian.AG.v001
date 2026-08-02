"use client";

import React, { useEffect, useState } from "react";
import { tokens } from "@meridian/ui";

export default function EdgePage() {
  const [signals, setSignals] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeTab, setActiveTab] = useState<string>("ALL");
  const [selectedSignal, setSelectedSignal] = useState<any>(null);

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
    setSignals(signals.map((s) => (s.id === id ? { ...s, status: newStatus } : s)));
  };

  const filteredSignals = signals.filter((s) => {
    if (activeTab === "ALL") return true;
    if (activeTab === "THESIS_RISK") return s.touches_thesis_falsification;
    return s.signal_type === activeTab;
  });

  return (
    <div
      style={{
        backgroundColor: "transparent",
        color: "#f8fafc",
        fontFamily: tokens.typography.fontFamilySans,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "800",
                color: "#38bdf8",
                backgroundColor: "#0369a120",
                border: "1px solid #0284c740",
                padding: "2px 8px",
                borderRadius: "4px"
              }}
            >
              SIGNAL OPERATIONS DESK
            </span>
            <span style={{ fontSize: "11px", color: "#64748b", fontFamily: tokens.typography.fontFamilyMono }}>
              Composite Salience Weighting Engine
            </span>
          </div>

          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.01em" }}>
            Edge Detector & Signal Centre
          </h1>
          <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
            Identify structural cross-source disagreements, statistical outliers (&gt;3σ), and feed SLA overruns.
          </p>
        </div>

        <button
          onClick={fetchSignals}
          disabled={loading}
          style={{
            padding: "8px 16px",
            backgroundColor: "#0f172a",
            border: "1px solid #334155",
            borderRadius: "5px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer",
            color: "#38bdf8"
          }}
        >
          {loading ? "Scanning Engine..." : "↻ Scan Signals"}
        </button>
      </div>

      {/* Signal Type Tabs */}
      <div style={{ display: "flex", gap: "8px" }}>
        {[
          { key: "ALL", label: "ALL SIGNALS" },
          { key: "DISAGREEMENT", label: "⚡ DISAGREEMENT SPREADS" },
          { key: "ANOMALY", label: "📊 3σ ANOMALIES" },
          { key: "ABSENCE", label: "⏱️ SLA ABSENCES" },
          { key: "THESIS_RISK", label: "🚨 THESIS FALSIFICATION" }
        ].map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveTab(tab.key)}
            style={{
              padding: "8px 14px",
              borderRadius: "5px",
              fontSize: "11px",
              fontWeight: activeTab === tab.key ? "800" : "600",
              backgroundColor: activeTab === tab.key ? "#0284c7" : "#0f172a",
              color: activeTab === tab.key ? "#ffffff" : "#94a3b8",
              border: `1px solid ${activeTab === tab.key ? "#38bdf8" : "#1e293b"}`,
              cursor: "pointer"
            }}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Signals Operations List */}
      <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
        {filteredSignals.map((sig) => {
          const isCritical = sig.severity === "CRITICAL";
          const isAlert = sig.severity === "ALERT";
          const saliencePct = Math.min(100, Math.max(10, (sig.salience_score / 310) * 100));

          return (
            <div
              key={sig.id}
              style={{
                backgroundColor: "#0f172a",
                border: `1px solid ${isCritical ? "#991b1b" : isAlert ? "#92400e" : "#1e293b"}`,
                borderRadius: "8px",
                padding: "20px",
                display: "flex",
                flexDirection: "column",
                gap: "14px"
              }}
            >
              {/* Header Row */}
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span
                    style={{
                      fontSize: "10px",
                      fontWeight: "900",
                      color: isCritical ? "#f87171" : isAlert ? "#fbbf24" : "#38bdf8",
                      backgroundColor: isCritical ? "#450a0a" : isAlert ? "#451a03" : "#0c4a6e",
                      border: `1px solid ${isCritical ? "#991b1b" : isAlert ? "#92400e" : "#0284c7"}`,
                      padding: "2px 8px",
                      borderRadius: "4px"
                    }}
                  >
                    [{sig.severity}] {sig.signal_type}
                  </span>

                  <span style={{ fontSize: "14px", fontWeight: "800", color: "#ffffff", fontFamily: tokens.typography.fontFamilyMono }}>
                    {sig.canonical_metric_key}
                  </span>

                  <span
                    style={{
                      fontSize: "10px",
                      color: "#94a3b8",
                      backgroundColor: "#1e293b",
                      padding: "2px 6px",
                      borderRadius: "3px",
                      fontWeight: "700"
                    }}
                  >
                    PILLAR: {sig.pillar}
                  </span>
                </div>

                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                  <span style={{ fontSize: "11px", color: "#64748b", fontFamily: tokens.typography.fontFamilyMono }}>
                    STATUS: <strong style={{ color: sig.status === "ACKNOWLEDGED" ? "#4ade80" : "#fbbf24" }}>{sig.status}</strong>
                  </span>
                </div>
              </div>

              {/* Summary Narrative */}
              <div style={{ fontSize: "13px", color: "#cbd5e1", lineHeight: 1.5 }}>
                {sig.narrative_summary}
              </div>

              {/* Salience Progress Bar & Metrics Row */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 200px", gap: "20px", alignItems: "center" }}>
                {/* Progress bar */}
                <div>
                  <div style={{ display: "flex", justifyContent: "space-between", fontSize: "10px", fontWeight: "700", color: "#64748b", marginBottom: "4px" }}>
                    <span>SALIENCE RATING: {sig.salience_score?.toFixed(1)} / 310</span>
                    <span>CONFIDENCE: {sig.confidence}%</span>
                  </div>
                  <div style={{ height: "6px", backgroundColor: "#1e293b", borderRadius: "3px", overflow: "hidden" }}>
                    <div
                      style={{
                        width: `${saliencePct}%`,
                        height: "100%",
                        backgroundColor: isCritical ? "#ef4444" : isAlert ? "#f59e0b" : "#3b82f6",
                        borderRadius: "3px"
                      }}
                    />
                  </div>
                </div>

                {/* Primary Sources */}
                <div style={{ fontSize: "11px", color: "#94a3b8", fontFamily: tokens.typography.fontFamilyMono, textAlign: "right" }}>
                  Primary: <strong style={{ color: "#ffffff" }}>{sig.primary_source_id}</strong>
                  {sig.secondary_source_id && (
                    <> vs <strong style={{ color: "#38bdf8" }}>{sig.secondary_source_id}</strong></>
                  )}
                </div>
              </div>

              {/* Action Toolbar */}
              <div style={{ borderTop: "1px solid #1e293b", paddingTop: "12px", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <div style={{ fontSize: "11px", color: "#64748b" }}>
                  {sig.touches_thesis_falsification ? (
                    <span style={{ color: "#f87171", fontWeight: "800" }}>🚨 Touches Standing Investment Thesis Falsification</span>
                  ) : (
                    <span>No active thesis threat</span>
                  )}
                </div>

                <div style={{ display: "flex", gap: "8px" }}>
                  <button
                    onClick={() => handleUpdateStatus(sig.id, "ACKNOWLEDGED")}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#1e293b",
                      color: "#cbd5e1",
                      border: "1px solid #334155",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      cursor: "pointer"
                    }}
                  >
                    ✓ Acknowledge
                  </button>

                  <a
                    href={`/council?topic=${encodeURIComponent(sig.canonical_metric_key)}`}
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#4f46e5",
                      color: "#ffffff",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textDecoration: "none"
                    }}
                  >
                    🧠 Escalate to Council
                  </a>

                  <a
                    href="/book"
                    style={{
                      padding: "5px 10px",
                      backgroundColor: "#0284c7",
                      color: "#ffffff",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textDecoration: "none"
                    }}
                  >
                    📖 Add Falsification Trigger
                  </a>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
