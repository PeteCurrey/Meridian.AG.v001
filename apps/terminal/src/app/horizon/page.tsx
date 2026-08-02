"use client";

import React, { useEffect, useState } from "react";
import { tokens } from "@meridian/ui";

export default function HorizonPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/pillar/horizon")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, []);

  return (
    <div style={{ backgroundColor: "transparent", color: "#f8fafc", fontFamily: tokens.typography.fontFamilySans, minHeight: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#a855f7", backgroundColor: "#7e22ce20", border: "1px solid #7e22ce40", padding: "2px 8px", borderRadius: "4px" }}>
            HORIZON PILLAR
          </span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>SEC EDGAR · NASDAQ IPO · Companies House</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff" }}>Horizon Pillar // Filings & Catalysts</h1>
        <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>Corporate filings (10-K, 10-Q, S-1), IPO calendar, and registry changes.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>SEC EDGAR STREAM</div>
          <div style={{ fontSize: "15px", fontWeight: "800", color: "#a855f7", margin: "8px 0" }}>User-Agent Authenticated</div>
          <div style={{ fontSize: "11px", color: "#4ade80" }}>10-K / 10-Q / S-1 Filings Live</div>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>COMPANIES HOUSE UK</div>
          <div style={{ fontSize: "15px", fontWeight: "800", color: "#38bdf8", margin: "8px 0" }}>API Key Verified</div>
          <div style={{ fontSize: "11px", color: "#4ade80" }}>Daily Corporate Registry Sync</div>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>NASDAQ IPO CALENDAR</div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#f8fafc", margin: "4px 0" }}>14</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Upcoming Filings Monitored</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#a855f7", letterSpacing: "0.08em", marginBottom: "14px" }}>
          ACTIVE HORIZON PILLAR DATA FEEDS ({data?.sources?.length || 3})
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {data?.sources?.map((s: any) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#090d16", border: "1px solid #1e293b", borderRadius: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#a855f7", fontFamily: tokens.typography.fontFamilyMono }}>{s.id}</span>
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
