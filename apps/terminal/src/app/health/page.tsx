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

export default function HealthPage() {
  const [healthData, setHealthData] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [selectedPillar, setSelectedPillar] = useState("ALL");
  const [searchQuery, setSearchQuery] = useState("");

  const fetchHealth = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/health");
      if (res.ok) setHealthData(await res.json());
    } catch (e) { console.error(e); }
    finally { setLoading(false); }
  };

  useEffect(() => { fetchHealth(); }, []);

  const sources = healthData?.sources || [];
  const pillars = ["ALL", "WORLD", "MARKETS", "HORIZON", "UNDERCURRENT", "ALTERNATIVES"];

  const filtered = sources.filter((s: any) => {
    const matchesPillar = selectedPillar === "ALL" || s.pillar === selectedPillar;
    const matchesSearch = !searchQuery || s.id?.toLowerCase().includes(searchQuery.toLowerCase()) || s.name?.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesPillar && matchesSearch;
  });

  const totalSources = healthData?.total_sources ?? sources.length;
  const healthyCount = healthData?.healthy_count ?? sources.filter((s: any) => s.is_active).length;
  const staleSources = sources.filter((s: any) => !s.is_active).length;

  return (
    <div style={{ backgroundColor: "transparent", color: "#f8fafc", fontFamily: tokens.typography.fontFamilySans, minHeight: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span style={{ fontSize: "10px", fontWeight: "800", color: "#4ade80", backgroundColor: "#16a34a20", border: "1px solid #16a34a40", padding: "2px 8px", borderRadius: "4px" }}>
              FEED HEALTH MONITOR
            </span>
            <span style={{ fontSize: "11px", color: "#64748b", fontFamily: tokens.typography.fontFamilyMono }}>41 Registered Adapters · 5 Pillars</span>
          </div>
          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff" }}>Source Health Board</h1>
          <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
            Live status for all data source adapters across the MERIDIAN intelligence engine.
          </p>
        </div>
        <button
          onClick={fetchHealth}
          disabled={loading}
          style={{ padding: "8px 16px", backgroundColor: "#0f172a", border: "1px solid #334155", borderRadius: "5px", fontSize: "12px", fontWeight: "700", cursor: "pointer", color: "#38bdf8" }}
        >
          {loading ? "Scanning..." : "↻ Refresh"}
        </button>
      </div>

      {/* Stats Row */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: "14px" }}>
        {[
          { label: "TOTAL REGISTERED", value: totalSources, color: "#38bdf8" },
          { label: "HEALTHY / ONLINE", value: healthyCount, color: "#4ade80" },
          { label: "STALE / ABSENT", value: staleSources, color: "#f87171" },
          { label: "PILLARS COVERED", value: 5, color: "#a855f7" }
        ].map((s) => (
          <div key={s.label} style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "16px 20px" }}>
            <div style={{ fontSize: "10px", fontWeight: "700", color: "#64748b", letterSpacing: "0.08em", marginBottom: "4px" }}>{s.label}</div>
            <div style={{ fontSize: "32px", fontWeight: "900", fontFamily: tokens.typography.fontFamilyMono, color: s.color }}>{s.value}</div>
          </div>
        ))}
      </div>

      {/* Pillar Filter & Search */}
      <div style={{ display: "flex", gap: "10px", alignItems: "center" }}>
        <div style={{ display: "flex", gap: "6px" }}>
          {pillars.map((p) => (
            <button
              key={p}
              onClick={() => setSelectedPillar(p)}
              style={{
                padding: "6px 12px", borderRadius: "4px", fontSize: "11px", fontWeight: "700",
                backgroundColor: selectedPillar === p ? (PILLAR_COLORS[p] ? `${PILLAR_COLORS[p]}30` : "#1e293b") : "#0f172a",
                color: selectedPillar === p ? (PILLAR_COLORS[p] || "#38bdf8") : "#94a3b8",
                border: `1px solid ${selectedPillar === p ? (PILLAR_COLORS[p] || "#38bdf8") : "#1e293b"}`,
                cursor: "pointer"
              }}
            >
              {p}
            </button>
          ))}
        </div>
        <input
          type="text"
          value={searchQuery}
          onChange={(e) => setSearchQuery(e.target.value)}
          placeholder="Search source ID or name..."
          style={{
            flex: 1, padding: "7px 12px", backgroundColor: "#090d16", border: "1px solid #334155",
            borderRadius: "5px", color: "#f8fafc", fontSize: "12px", outline: "none"
          }}
        />
      </div>

      {/* Source Grid */}
      <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "10px" }}>
        {filtered.map((source: any) => {
          const pillarColor = PILLAR_COLORS[source.pillar] || "#64748b";
          const isActive = source.is_active !== false;
          return (
            <div
              key={source.id}
              style={{
                backgroundColor: "#0f172a",
                border: `1px solid ${isActive ? "#1e293b" : "#7f1d1d"}`,
                borderRadius: "8px",
                padding: "14px 16px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <div style={{ display: "flex", alignItems: "center", gap: "12px", minWidth: 0 }}>
                <span style={{ width: "8px", height: "8px", borderRadius: "50%", backgroundColor: isActive ? "#4ade80" : "#ef4444", flexShrink: 0 }} />
                <div style={{ minWidth: 0 }}>
                  <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
                    <span style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", fontFamily: tokens.typography.fontFamilyMono }}>{source.id}</span>
                    <span style={{ fontSize: "9px", fontWeight: "700", color: pillarColor, backgroundColor: `${pillarColor}20`, border: `1px solid ${pillarColor}40`, padding: "1px 5px", borderRadius: "3px" }}>
                      {source.pillar}
                    </span>
                  </div>
                  <div style={{ fontSize: "12px", color: "#cbd5e1", fontWeight: "600", marginTop: "1px", overflow: "hidden", textOverflow: "ellipsis", whiteSpace: "nowrap" }}>
                    {source.name}
                  </div>
                </div>
              </div>
              <div style={{ display: "flex", gap: "10px", fontSize: "10px", color: "#64748b", fontFamily: tokens.typography.fontFamilyMono, flexShrink: 0 }}>
                <span>SLA:<strong style={{ color: "#cbd5e1" }}> {source.sla_seconds}s</strong></span>
                <span style={{ color: isActive ? "#4ade80" : "#f87171", fontWeight: "800" }}>
                  {isActive ? "HEALTHY" : "ABSENT"}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
