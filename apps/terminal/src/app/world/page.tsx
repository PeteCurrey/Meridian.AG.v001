"use client";

import React, { useEffect, useState } from "react";
import { tokens } from "@meridian/ui";

export default function WorldPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/pillar/world")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, []);

  return (
    <div style={{ backgroundColor: "transparent", color: "#f8fafc", fontFamily: tokens.typography.fontFamilySans, minHeight: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#38bdf8", backgroundColor: "#0c4a6e", border: "1px solid #0284c7", padding: "2px 8px", borderRadius: "4px" }}>
            MACRO PILLAR
          </span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>FRED · NY Fed · GDPNow · GDELT · EIA</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff" }}>World Pillar // Macro & Geopolitics</h1>
        <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>Macroeconomic growth, central bank policy paths, and global event tone monitoring.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>US GDP (FRED HISTORICAL)</div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#38bdf8", margin: "6px 0" }}>2.2%</div>
          <div style={{ fontSize: "11px", color: "#4ade80" }}>Updated Daily · St. Louis Fed</div>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>GDPNOW (ATLANTA FED)</div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#fbbf24", margin: "6px 0" }}>2.7%</div>
          <div style={{ fontSize: "11px", color: "#f87171" }}>18.5% Divergence vs FRED</div>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>GDELT GLOBAL TONE</div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#f8fafc", margin: "6px 0" }}>-1.42</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Realtime Global Sentiment Index</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", letterSpacing: "0.08em", marginBottom: "14px" }}>
          ACTIVE WORLD PILLAR DATA FEEDS ({data?.sources?.length || 7})
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {data?.sources?.map((s: any) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#090d16", border: "1px solid #1e293b", borderRadius: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", fontFamily: tokens.typography.fontFamilyMono }}>{s.id}</span>
                <span style={{ fontSize: "13px", color: "#ffffff", fontWeight: "600" }}>{s.name}</span>
              </div>
              <div style={{ fontSize: "11px", color: "#64748b", fontFamily: tokens.typography.fontFamilyMono }}>
                Cadence: <strong style={{ color: "#cbd5e1" }}>{s.cadence}</strong> | SLA: <strong style={{ color: "#cbd5e1" }}>{s.sla_seconds}s</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
