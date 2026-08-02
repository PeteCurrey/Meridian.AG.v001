"use client";

import React, { useEffect, useState } from "react";
import { tokens } from "@meridian/ui";

export default function TerminalPage() {
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/health")
      .then((r) => r.json())
      .then(setHealthData)
      .catch(() => null);
  }, []);

  const totalSources = healthData?.total_sources ?? 41;
  const healthySources = healthData?.healthy_count ?? "—";

  const modules = [
    { icon: "📋", title: "Daily Brief", path: "/brief", description: "LLM-synthesized 24-hour executive summary with citation provenance and thesis falsification evaluation.", badge: "INTELLIGENCE" },
    { icon: "⚡", title: "Edge Detector", path: "/edge", description: "Cross-source disagreement, statistical anomaly (>3σ), and SLA absence signals ranked by contextual salience.", badge: "SIGNALS" },
    { icon: "🧠", title: "Council Room", path: "/council", description: "Multi-model deliberation across Claude 3.5, GPT-4o, Grok 3, and DeepSeek R1 — consensus synthesis with disagreement matrix.", badge: "AI COUNCIL" },
    { icon: "🌐", title: "World Pillar", path: "/world", description: "FRED, NY Fed, GDPNow, GDELT global tone, EIA energy statistics and Cleveland Fed inflation nowcast.", badge: "MACRO" },
    { icon: "📈", title: "Markets Pillar", path: "/markets", description: "Twelve Data, Finnhub, CoinGecko, DefiLlama, and CFTC Commitments of Traders futures positions.", badge: "MARKETS" },
    { icon: "📖", title: "The Book", path: "/book", description: "Standing investment theses with mandatory falsification conditions. Thesis cannot be submitted without a falsification trigger.", badge: "THESES" }
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
        gap: "28px",
        maxWidth: "1100px"
      }}
    >
      {/* Hero Banner */}
      <div
        style={{
          backgroundColor: "#0f172a",
          borderRadius: "8px",
          padding: "40px 48px",
          color: "#ffffff",
          position: "relative",
          overflow: "hidden"
        }}
      >
        {/* Background texture */}
        <div
          style={{
            position: "absolute",
            top: 0,
            right: 0,
            width: "40%",
            height: "100%",
            backgroundImage: "repeating-linear-gradient(45deg, transparent, transparent 10px, rgba(255,255,255,0.015) 10px, rgba(255,255,255,0.015) 20px)",
            pointerEvents: "none"
          }}
        />

        <div style={{ position: "relative" }}>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "16px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.12em",
                color: "#4ade80",
                backgroundColor: "rgba(74, 222, 128, 0.1)",
                border: "1px solid rgba(74, 222, 128, 0.3)",
                padding: "3px 10px",
                borderRadius: "4px"
              }}
            >
              ● LIVE INTELLIGENCE FEED
            </span>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "700",
                letterSpacing: "0.08em",
                color: "#94a3b8",
                fontFamily: "monospace"
              }}
            >
              TIER 1 — WATCH ONLY
            </span>
          </div>

          <h1
            style={{
              margin: "0 0 12px 0",
              fontSize: "32px",
              fontWeight: "800",
              letterSpacing: "-0.02em",
              lineHeight: 1.1,
              color: "#ffffff"
            }}
          >
            Institutional Market Intelligence Terminal
          </h1>

          <p
            style={{
              margin: "0 0 32px 0",
              fontSize: "15px",
              color: "#94a3b8",
              lineHeight: 1.6,
              maxWidth: "620px"
            }}
          >
            Multi-source signal scoring, cross-source disagreement detection, and AI consensus analysis across macro, markets, and alternative data. Built for precision over noise.
          </p>

          <div style={{ display: "flex", gap: "12px" }}>
            <a
              href="/brief"
              style={{
                padding: "10px 20px",
                backgroundColor: "#16a34a",
                color: "#ffffff",
                fontWeight: "600",
                fontSize: "13px",
                borderRadius: "5px",
                textDecoration: "none",
                letterSpacing: "0.01em"
              }}
            >
              Open Daily Brief →
            </a>
            <a
              href="/edge"
              style={{
                padding: "10px 20px",
                backgroundColor: "rgba(255,255,255,0.08)",
                color: "#e2e8f0",
                fontWeight: "600",
                fontSize: "13px",
                borderRadius: "5px",
                textDecoration: "none",
                border: "1px solid rgba(255,255,255,0.12)"
              }}
            >
              View Signal Feed
            </a>
          </div>
        </div>
      </div>

      {/* System Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "12px" }}>
        {[
          { label: "REGISTERED SOURCES", value: String(totalSources), sub: "Wave 1 + Wave 2 adapters", color: "#0f172a" },
          { label: "HEALTHY FEEDS", value: String(healthySources), sub: "Live adapter connections", color: "#16a34a" },
          { label: "AI MODELS IN COUNCIL", value: "4", sub: "Claude · GPT-4o · Grok · DeepSeek", color: "#7c3aed" },
          { label: "DETECTION TYPES", value: "4", sub: "Δ Delta · 3σ Anomaly · Absence · Disagree", color: "#b45309" }
        ].map((stat) => (
          <div
            key={stat.label}
            style={{
              backgroundColor: "#ffffff",
              border: "1px solid #e2e8f0",
              borderRadius: "6px",
              padding: "20px"
            }}
          >
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#94a3b8", letterSpacing: "0.08em", marginBottom: "6px" }}>{stat.label}</div>
            <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: "monospace", color: stat.color, lineHeight: 1 }}>{stat.value}</div>
            <div style={{ fontSize: "11px", color: "#64748b", marginTop: "4px" }}>{stat.sub}</div>
          </div>
        ))}
      </div>

      {/* Module Grid */}
      <div>
        <div style={{ fontSize: "12px", fontWeight: "700", color: "#64748b", letterSpacing: "0.1em", marginBottom: "12px" }}>PLATFORM MODULES</div>
        <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "12px" }}>
          {modules.map((mod) => (
            <a
              key={mod.path}
              href={mod.path}
              style={{
                backgroundColor: "#ffffff",
                border: "1px solid #e2e8f0",
                borderRadius: "6px",
                padding: "20px",
                textDecoration: "none",
                color: "inherit",
                display: "flex",
                flexDirection: "column",
                gap: "8px",
                transition: "border-color 0.15s, box-shadow 0.15s"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <span style={{ fontSize: "22px" }}>{mod.icon}</span>
                <span
                  style={{
                    fontSize: "9px",
                    fontWeight: "700",
                    letterSpacing: "0.08em",
                    color: "#16a34a",
                    backgroundColor: "#f0fdf4",
                    border: "1px solid #bbf7d0",
                    padding: "2px 6px",
                    borderRadius: "3px"
                  }}
                >
                  {mod.badge}
                </span>
              </div>
              <div style={{ fontSize: "14px", fontWeight: "700", color: "#0f172a" }}>{mod.title}</div>
              <div style={{ fontSize: "12px", color: "#64748b", lineHeight: 1.5 }}>{mod.description}</div>
            </a>
          ))}
        </div>
      </div>
    </div>
  );
}
