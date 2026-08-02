"use client";

import React, { useEffect, useState } from "react";
import { tokens } from "@meridian/ui";

const PILLAR_COLORS: Record<string, string> = {
  WORLD: "#38bdf8",
  MARKETS: "#4ade80",
  HORIZON: "#a855f7",
  UNDERCURRENT: "#ec4899",
  ALTERNATIVES: "#f59e0b"
};

export default function SourcesPage() {
  const [healthData, setHealthData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/health").then((r) => r.json()).then(setHealthData).catch(() => null);
  }, []);

  const sources = healthData?.sources || [];

  const byPillar: Record<string, any[]> = {};
  for (const s of sources) {
    const pillar = s.pillar || "UNKNOWN";
    if (!byPillar[pillar]) byPillar[pillar] = [];
    byPillar[pillar].push(s);
  }

  return (
    <div style={{ backgroundColor: "transparent", color: "#f8fafc", fontFamily: tokens.typography.fontFamilySans, minHeight: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#64748b", backgroundColor: "#1e293b", border: "1px solid #334155", padding: "2px 8px", borderRadius: "4px" }}>
            SOURCE REGISTRY
          </span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>41 Registered Adapters · Wave 1 + Wave 2</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff" }}>Source Registry</h1>
        <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
          All MERIDIAN data source adapters grouped by intelligence pillar.
        </p>
      </div>

      {Object.entries(byPillar).map(([pillar, srcs]) => {
        const color = PILLAR_COLORS[pillar] || "#64748b";
        return (
          <div key={pillar} style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
            <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center", marginBottom: "12px" }}>
              <div style={{ fontSize: "12px", fontWeight: "800", color, letterSpacing: "0.08em" }}>
                {pillar} PILLAR ({srcs.length} sources)
              </div>
            </div>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "8px" }}>
              {srcs.map((source: any) => (
                <div key={source.id} style={{ backgroundColor: "#090d16", border: "1px solid #1e293b", borderRadius: "6px", padding: "12px 14px" }}>
                  <div style={{ fontSize: "12px", fontWeight: "800", color, fontFamily: tokens.typography.fontFamilyMono, marginBottom: "2px" }}>{source.id}</div>
                  <div style={{ fontSize: "11px", color: "#94a3b8", fontWeight: "500" }}>{source.name}</div>
                  <div style={{ display: "flex", gap: "10px", marginTop: "6px", fontSize: "10px", color: "#64748b" }}>
                    <span>SLA <strong style={{ color: "#cbd5e1" }}>{source.sla_seconds}s</strong></span>
                    <span>·</span>
                    <span>{source.cadence}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}
