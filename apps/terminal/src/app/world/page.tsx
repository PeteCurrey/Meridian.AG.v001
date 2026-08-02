"use client";

import React from "react";
import { tokens, Panel, StateBanner } from "@meridian/ui";

export default function WorldPage() {
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
          World
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Geopolitical and macroeconomic global intelligence feed.
        </p>
      </header>
      <StateBanner state="NOT_CONNECTED" reason="World module is not yet connected. Data ingestion adapters are pending configuration." />
      <Panel title="WORLD INTELLIGENCE">
        <p style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm, margin: 0 }}>
          This module is under development. Global macro intelligence, geopolitical risk scoring, and cross-border capital flow analysis will appear here.
        </p>
      </Panel>
    </div>
  );
}
