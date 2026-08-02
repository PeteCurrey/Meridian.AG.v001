"use client";

import React from "react";
import { tokens, Panel, StateBanner } from "@meridian/ui";

export default function MarketsPage() {
  return (
    <div
      style={{
        backgroundColor: tokens.colors.bg,
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontFamilySans,
        minHeight: "100%",
        padding: tokens.spacing.lg,
        boxSizing: "border-box"
      }}
    >
      <header style={{ marginBottom: tokens.spacing.lg }}>
        <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeLg, color: tokens.colors.textPrimary, fontWeight: tokens.typography.fontWeightBold }}>
          Markets
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Real-time price feeds, volatility surfaces, and cross-asset signal monitoring.
        </p>
      </header>
      <StateBanner state="NOT_CONNECTED" reason="Markets module is not yet connected. Live price feed adapters are pending configuration." />
      <Panel title="MARKET DATA">
        <p style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm, margin: 0 }}>
          This module is under development. Forex, indices, commodities, and crypto price feeds with conviction scoring will appear here.
        </p>
      </Panel>
    </div>
  );
}
