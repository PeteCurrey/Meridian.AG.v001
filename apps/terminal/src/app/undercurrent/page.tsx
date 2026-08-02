"use client";

import React from "react";
import { tokens, Panel, StateBanner } from "@meridian/ui";

export default function UndercurrentPage() {
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
          Undercurrent
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Non-obvious structural forces: credit stress, fund flows, regulatory pipeline.
        </p>
      </header>
      <StateBanner state="NOT_CONNECTED" reason="Undercurrent module is not yet connected. Structural analysis adapters are pending configuration." />
      <Panel title="UNDERCURRENT ANALYSIS">
        <p style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm, margin: 0 }}>
          This module is under development. Credit stress indicators, dark pool flow analysis, and regulatory pipeline monitoring will appear here.
        </p>
      </Panel>
    </div>
  );
}
