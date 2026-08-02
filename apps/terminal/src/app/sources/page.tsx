"use client";

import React from "react";
import { tokens, Panel, StateBanner } from "@meridian/ui";

export default function SourcesPage() {
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
          Sources
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Data source registry, API key management, and adapter configuration.
        </p>
      </header>
      <StateBanner state="NOT_CONNECTED" reason="Sources module is not yet connected. Source registry management UI is pending." />
      <Panel title="SOURCE REGISTRY">
        <p style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm, margin: 0 }}>
          This module is under development. Full source registry with adapter status, API key configuration, and ingestion history will appear here. See the Health page for current source status.
        </p>
      </Panel>
    </div>
  );
}
