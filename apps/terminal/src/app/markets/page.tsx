"use client";

import React, { useEffect, useState } from "react";
import { tokens, Panel, DataTable, Column } from "@meridian/ui";

export default function MarketsPage() {
  const [data, setData] = useState<any>(null);

  useEffect(() => {
    fetch("/api/pillar/markets")
      .then((res) => res.json())
      .then(setData)
      .catch((e) => console.error(e));
  }, []);

  const columns: Column<any>[] = [
    { key: "id", header: "SOURCE ID", render: (r) => <span style={{ fontFamily: tokens.typography.fontFamilyMono, fontWeight: tokens.typography.fontWeightBold }}>{r.id}</span> },
    { key: "name", header: "NAME", render: (r) => r.name },
    { key: "cadence", header: "CADENCE", render: (r) => r.cadence },
    { key: "sla", header: "SLA", render: (r) => `${r.sla_seconds}s` }
  ];

  return (
    <div style={{ backgroundColor: "transparent", color: tokens.colors.textPrimary, fontFamily: tokens.typography.fontFamilySans, minHeight: "100%", display: "flex", flexDirection: "column", gap: tokens.spacing.lg }}>
      <div>
        <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeXl, color: tokens.colors.textPrimary, fontWeight: tokens.typography.fontWeightBold }}>
          Markets Pillar // Cross-Asset Price & Volatility
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Twelve Data, Finnhub, CoinGecko, CFTC Commitments of Traders, and DefiLlama analytics.
        </p>
      </div>

      <div style={{ display: "grid", gridTemplateColumns: "repeat(3, 1fr)", gap: tokens.spacing.md }}>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>BTC/USD (COINGECKO)</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>$95,420</div>
          <div style={{ fontSize: "11px", color: tokens.colors.accentGreen }}>+4.2% (3.42σ Outlier Anomaly)</div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>EUR/USD (TWELVE DATA)</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>1.0852</div>
          <div style={{ fontSize: "11px", color: tokens.colors.textMuted }}>Realtime SLA 300s</div>
        </div>
        <div style={{ padding: tokens.spacing.md, backgroundColor: tokens.colors.panelBg, border: `1px solid ${tokens.colors.borderHairline}`, borderRadius: "6px" }}>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>S&P 500 (FINNHUB)</div>
          <div style={{ fontSize: "24px", fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono, margin: "4px 0" }}>5,842.10</div>
          <div style={{ fontSize: "11px", color: tokens.colors.accentGreen }}>Healthy Connection</div>
        </div>
      </div>

      <Panel title="ACTIVE MARKETS PILLAR DATA SOURCES">
        <DataTable data={data?.sources || []} columns={columns} keyExtractor={(r) => r.id} />
      </Panel>
    </div>
  );
}
