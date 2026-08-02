"use client";

import React from "react";
import { tokens, Panel, StateBanner } from "@meridian/ui";

export default function AlternativesPage() {
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
          Alternatives
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Alternative data signals: prediction markets, satellite data, sentiment indices.
        </p>
      </header>
      <StateBanner state="NOT_CONNECTED" reason="Alternatives module is not yet connected. Alternative data adapters are pending configuration." />
      <Panel title="ALTERNATIVE DATA">
        <p style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm, margin: 0 }}>
          This module is under development. Prediction market odds, satellite imagery analytics, social sentiment, and web traffic signals will appear here.
        </p>
      </Panel>
    </div>
  );
}
