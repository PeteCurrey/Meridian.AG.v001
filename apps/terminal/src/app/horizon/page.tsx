"use client";

import React from "react";
import { tokens, Panel, StateBanner } from "@meridian/ui";

export default function HorizonPage() {
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
          Horizon
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Forward-looking scenario modelling and probabilistic outcome forecasting.
        </p>
      </header>
      <StateBanner state="NOT_CONNECTED" reason="Horizon module is not yet connected. Scenario engine is pending configuration." />
      <Panel title="HORIZON SCENARIOS">
        <p style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm, margin: 0 }}>
          This module is under development. Forward-looking scenario trees, tail-risk modelling, and probabilistic outcome distributions will appear here.
        </p>
      </Panel>
    </div>
  );
}
