"use client";

import React, { useEffect, useState } from "react";
import { tokens } from "@meridian/ui";

export default function UndercurrentPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/pillar/undercurrent")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, []);

  return (
    <div style={{ backgroundColor: "transparent", color: "#f8fafc", fontFamily: tokens.typography.fontFamilySans, minHeight: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#ec4899", backgroundColor: "#be185d20", border: "1px solid #be185d40", padding: "2px 8px", borderRadius: "4px" }}>
            UNDERCURRENT PILLAR
          </span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>USAspending · GLEIF LEI · OpenCorporates</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff" }}>Undercurrent Pillar // Structural & Entity Data</h1>
        <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>US federal award contracts, GLEIF LEI legal entity registry, and corporate trees.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>USASPENDING AWARD CONTRACTS</div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#ec4899", margin: "4px 0" }}>$14.2M</div>
          <div style={{ fontSize: "11px", color: "#4ade80" }}>Apex Tech Inc Contract Award</div>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>GLEIF LEI RESOLUTION</div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#38bdf8", margin: "4px 0" }}>100%</div>
          <div style={{ fontSize: "11px", color: "#4ade80" }}>Exact LEI 5493001KJ9572B569811</div>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>OPENCORPORATES TREES</div>
          <div style={{ fontSize: "15px", fontWeight: "800", color: "#ffffff", margin: "8px 0" }}>Entity Graph Active</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Weekly Audit Ledger</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#ec4899", letterSpacing: "0.08em", marginBottom: "14px" }}>
          ACTIVE UNDERCURRENT PILLAR DATA FEEDS ({data?.sources?.length || 3})
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {data?.sources?.map((s: any) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#090d16", border: "1px solid #1e293b", borderRadius: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#ec4899", fontFamily: tokens.typography.fontFamilyMono }}>{s.id}</span>
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
