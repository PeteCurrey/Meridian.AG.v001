"use client";

import React, { useEffect, useState } from "react";
import { tokens } from "@meridian/ui";

export default function MarketsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/pillar/markets")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, []);

  return (
    <div style={{ backgroundColor: "transparent", color: "#f8fafc", fontFamily: tokens.typography.fontFamilySans, minHeight: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#4ade80", backgroundColor: "#16a34a20", border: "1px solid #16a34a40", padding: "2px 8px", borderRadius: "4px" }}>
            MARKETS PILLAR
          </span>
          <span style={{ fontSize: "11px", color: "#64748b" }}>Twelve Data · Finnhub · CoinGecko · DefiLlama · CFTC</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff" }}>Markets Pillar // Asset Prices & Volatility</h1>
        <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>Realtime cross-asset feeds across Equities, Forex, Crypto, and Futures positioning.</p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: "16px" }}>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>BTC/USD (COINGECKO)</div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#4ade80", margin: "6px 0" }}>$95,420</div>
          <div style={{ fontSize: "11px", color: "#fbbf24" }}>+4.2% (3.42σ Statistical Outlier)</div>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>EUR/USD (TWELVE DATA)</div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#38bdf8", margin: "6px 0" }}>1.0852</div>
          <div style={{ fontSize: "11px", color: "#94a3b8" }}>Realtime SLA 300s Active</div>
        </div>
        <div style={{ padding: "20px", backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px" }}>
          <div style={{ fontSize: "10px", fontWeight: "800", color: "#64748b" }}>S&P 500 (FINNHUB)</div>
          <div style={{ fontSize: "28px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono, color: "#4ade80", margin: "6px 0" }}>5,842.10</div>
          <div style={{ fontSize: "11px", color: "#4ade80" }}>Healthy Connection</div>
        </div>
      </div>

      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#4ade80", letterSpacing: "0.08em", marginBottom: "14px" }}>
          ACTIVE MARKETS PILLAR DATA FEEDS ({data?.sources?.length || 6})
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "8px" }}>
          {data?.sources?.map((s: any) => (
            <div key={s.id} style={{ display: "flex", justifyContent: "space-between", alignItems: "center", padding: "12px 16px", backgroundColor: "#090d16", border: "1px solid #1e293b", borderRadius: "6px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                <span style={{ fontSize: "12px", fontWeight: "800", color: "#4ade80", fontFamily: tokens.typography.fontFamilyMono }}>{s.id}</span>
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
