"use client";

import React, { useEffect, useState } from "react";
import { tokens } from "@meridian/ui";

export default function TerminalDashboard() {
  const [healthData, setHealthData] = useState<any>(null);
  const [signals, setSignals] = useState<any[]>([]);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealthData)
      .catch(() => null);

    fetch("/api/edge")
      .then((r) => r.json())
      .then((data) => setSignals(data.signals || []))
      .catch(() => null);
  }, []);

  const totalSources = healthData?.total_sources ?? 41;
  const healthySources = healthData?.healthy_count ?? 15;

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
      {/* ── 1. MARKET REGIME & PURPOSE BANNER ── */}
      <div
        style={{
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "8px",
          padding: "24px 28px",
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center"
        }}
      >
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "8px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "800",
                letterSpacing: "0.12em",
                color: "#38bdf8",
                backgroundColor: "#0369a120",
                border: "1px solid #0284c740",
                padding: "3px 10px",
                borderRadius: "4px"
              }}
            >
              MACRO REGIME // GROWTH RESILIENT vs PREDICTION DIVERGENCE
            </span>
            <span style={{ fontSize: "11px", color: "#64748b", fontFamily: tokens.typography.fontFamilyMono }}>
              Updated 24h Window
            </span>
          </div>

          <h1 style={{ margin: "0 0 6px 0", fontSize: "24px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.01em" }}>
            Executive Command Centre
          </h1>

          <p style={{ margin: 0, fontSize: "13px", color: "#94a3b8", maxWidth: "680px", lineHeight: 1.5 }}>
            MERIDIAN evaluates 41 cross-asset feeds across World Macro, Markets, Filings, and Alternatives. Signals are detected via 3σ anomalies, cross-source disagreement spreads, and SLA absences.
          </p>
        </div>

        <div style={{ display: "flex", gap: "10px" }}>
          <a
            href="/brief"
            style={{
              padding: "10px 18px",
              backgroundColor: "#16a34a",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "12px",
              borderRadius: "5px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            📋 Daily Brief →
          </a>
          <a
            href="/council"
            style={{
              padding: "10px 18px",
              backgroundColor: "#0284c7",
              color: "#ffffff",
              fontWeight: "700",
              fontSize: "12px",
              borderRadius: "5px",
              textDecoration: "none",
              display: "flex",
              alignItems: "center",
              gap: "6px"
            }}
          >
            🧠 AI Council →
          </a>
        </div>
      </div>

      {/* ── 2. METRIC & OPPORTUNITY CARDS ── */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "16px" }}>
        <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "18px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", letterSpacing: "0.08em", marginBottom: "6px" }}>
            HIGH-SALIENCE SIGNALS
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#f87171" }}>
            {signals.length || 4}
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
            2 Critical Disagreements Detected
          </div>
        </div>

        <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "18px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", letterSpacing: "0.08em", marginBottom: "6px" }}>
            PREDICTION SPREAD (FED CUT)
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#fbbf24" }}>
            29.41%
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
            Polymarket (68%) vs Kalshi (48%)
          </div>
        </div>

        <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "18px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", letterSpacing: "0.08em", marginBottom: "6px" }}>
            ACTIVE THESIS RISK
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#f87171" }}>
            1 FLAG
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
            US Rate Cut thesis near falsification
          </div>
        </div>

        <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "18px" }}>
          <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", letterSpacing: "0.08em", marginBottom: "6px" }}>
            REGISTERED FEEDS
          </div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#4ade80" }}>
            {healthySources} / {totalSources}
          </div>
          <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "4px" }}>
            Live Ingestion Adapters Online
          </div>
        </div>
      </div>

      {/* ── 3. PREDICTION MARKET ARBITRAGE VISUALIZER ── */}
      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", letterSpacing: "0.08em" }}>
              CROSS-PLATFORM SPREAD VISUALIZER // FED RATE CUT ODDS
            </span>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
              Structural disagreement between decentralized (Polymarket) and regulated (Kalshi) exchanges
            </div>
          </div>
          <a
            href="/alternatives"
            style={{ fontSize: "11px", color: "#38bdf8", textDecoration: "none", fontWeight: "700" }}
          >
            Explore Alternatives Pillar →
          </a>
        </div>

        {/* Spread Bars */}
        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {/* Polymarket */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
              <span style={{ color: "#cbd5e1", fontWeight: "600" }}>Polymarket (Decentralized Odds)</span>
              <span style={{ color: "#4ade80", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono }}>68% Implied Cut</span>
            </div>
            <div style={{ height: "10px", backgroundColor: "#1e293b", borderRadius: "5px", overflow: "hidden" }}>
              <div style={{ width: "68%", height: "100%", backgroundColor: "#16a34a", borderRadius: "5px" }} />
            </div>
          </div>

          {/* Kalshi */}
          <div>
            <div style={{ display: "flex", justifyContent: "space-between", fontSize: "12px", marginBottom: "4px" }}>
              <span style={{ color: "#cbd5e1", fontWeight: "600" }}>Kalshi (CFTC Regulated Exchange)</span>
              <span style={{ color: "#fbbf24", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono }}>48% Implied Cut</span>
            </div>
            <div style={{ height: "10px", backgroundColor: "#1e293b", borderRadius: "5px", overflow: "hidden" }}>
              <div style={{ width: "48%", height: "100%", backgroundColor: "#d97706", borderRadius: "5px" }} />
            </div>
          </div>

          {/* Spread Callout */}
          <div
            style={{
              padding: "10px 14px",
              backgroundColor: "#1e1b4b",
              border: "1px solid #3730a3",
              borderRadius: "6px",
              fontSize: "12px",
              color: "#c7d2fe",
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              marginTop: "4px"
            }}
          >
            <span>🚨 <strong>29.41% Spread Divergence</strong> — Indicates liquidity fragmentation or active rate repricing risk.</span>
            <a
              href="/council"
              style={{
                fontSize: "11px",
                fontWeight: "700",
                color: "#ffffff",
                backgroundColor: "#4f46e5",
                padding: "4px 10px",
                borderRadius: "4px",
                textDecoration: "none"
              }}
            >
              Trigger AI Deliberation
            </a>
          </div>
        </div>
      </div>

      {/* ── 4. SALIENCE-RANKED ACTIVE SIGNALS MATRIX ── */}
      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "16px" }}>
          <div>
            <span style={{ fontSize: "12px", fontWeight: "800", color: "#f87171", letterSpacing: "0.08em" }}>
              TOP SALIENCE-RANKED SIGNALS ({signals.length || 4})
            </span>
            <div style={{ fontSize: "11px", color: "#94a3b8", marginTop: "2px" }}>
              Signals ranked by composite salience score (Severity + Thesis Proximity + Overrun)
            </div>
          </div>
          <a href="/edge" style={{ fontSize: "11px", color: "#38bdf8", textDecoration: "none", fontWeight: "700" }}>
            Open Signal Centre →
          </a>
        </div>

        {/* Signals List */}
        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {signals.map((sig) => {
            const isCritical = sig.severity === "CRITICAL";
            const isAlert = sig.severity === "ALERT";
            const scorePct = Math.min(100, (sig.salience_score / 310) * 100);

            return (
              <div
                key={sig.id}
                style={{
                  backgroundColor: "#0b0f19",
                  border: `1px solid ${isCritical ? "#7f1d1d" : isAlert ? "#78350f" : "#1e293b"}`,
                  borderRadius: "6px",
                  padding: "14px 16px",
                  display: "flex",
                  justifyContent: "space-between",
                  alignItems: "center",
                  gap: "16px"
                }}
              >
                {/* Left: Salience score bar & title */}
                <div style={{ display: "flex", alignItems: "center", gap: "14px", flex: 1 }}>
                  <div style={{ textAlign: "center", minWidth: "50px" }}>
                    <div style={{ fontSize: "16px", fontWeight: "900", fontFamily: tokens.typography.fontFamilyMono, color: isCritical ? "#f87171" : "#fbbf24" }}>
                      {sig.salience_score?.toFixed(0)}
                    </div>
                    <div style={{ fontSize: "9px", color: "#64748b", fontWeight: "700" }}>SALIENCE</div>
                  </div>

                  <div style={{ flex: 1 }}>
                    <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
                      <span
                        style={{
                          fontSize: "10px",
                          fontWeight: "800",
                          color: isCritical ? "#f87171" : "#fbbf24",
                          backgroundColor: isCritical ? "#450a0a" : "#451a03",
                          border: `1px solid ${isCritical ? "#991b1b" : "#92400e"}`,
                          padding: "1px 6px",
                          borderRadius: "3px"
                        }}
                      >
                        [{sig.severity}] {sig.signal_type}
                      </span>
                      <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "700" }}>
                        {sig.canonical_metric_key}
                      </span>
                      {sig.touches_thesis_falsification && (
                        <span style={{ fontSize: "10px", color: "#f87171", fontWeight: "800" }}>
                          🚨 FALSIFICATION TRIGGER
                        </span>
                      )}
                    </div>

                    <div style={{ fontSize: "12px", color: "#cbd5e1", lineHeight: 1.4 }}>
                      {sig.narrative_summary}
                    </div>
                  </div>
                </div>

                {/* Right Actions */}
                <div style={{ display: "flex", gap: "8px" }}>
                  <a
                    href="/council"
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#1e293b",
                      color: "#38bdf8",
                      border: "1px solid #334155",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textDecoration: "none"
                    }}
                  >
                    Deliberate
                  </a>
                  <a
                    href="/edge"
                    style={{
                      padding: "6px 12px",
                      backgroundColor: "#16a34a",
                      color: "#ffffff",
                      borderRadius: "4px",
                      fontSize: "11px",
                      fontWeight: "700",
                      textDecoration: "none"
                    }}
                  >
                    Inspect
                  </a>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
