import React from "react";
import { tokens } from "@meridian/ui";

export default function TerminalPage() {
  return (
    <main
      style={{
        display: "flex",
        flexDirection: "column",
        justifyContent: "center",
        height: "100%",
        maxWidth: "1000px",
        margin: "0 auto",
        padding: tokens.spacing.xl,
        backgroundColor: "transparent",
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontFamilySans
      }}
    >
      {/* Top Badge */}
      <div style={{ marginBottom: tokens.spacing.xl }}>
        <span
          style={{
            fontFamily: tokens.typography.fontFamilyMono,
            fontSize: tokens.typography.fontSizeXs,
            color: tokens.colors.textMuted,
            backgroundColor: "#f8fafc",
            border: `1px solid ${tokens.colors.borderHairline}`,
            padding: "4px 8px",
            borderRadius: "4px",
            letterSpacing: "0.1em",
            textTransform: "uppercase"
          }}
        >
          <span style={{ color: tokens.colors.accentGreen, marginRight: "8px" }}>●</span>
          LIVE INTELLIGENCE FEED
        </span>
      </div>

      {/* Hero Content */}
      <h1
        style={{
          fontSize: tokens.typography.fontSizeXl,
          fontWeight: tokens.typography.fontWeightBold,
          letterSpacing: "-0.02em",
          color: tokens.colors.textPrimary,
          margin: `0 0 ${tokens.spacing.md} 0`,
          lineHeight: 1.1,
          maxWidth: "700px"
        }}
      >
        Market intelligence for institutional participants.
      </h1>

      <p
        style={{
          fontSize: tokens.typography.fontSizeMd,
          color: tokens.colors.textMuted,
          lineHeight: 1.6,
          maxWidth: "600px",
          marginBottom: tokens.spacing.xl
        }}
      >
        Multi-source signal scoring and AI consensus analysis across Forex,
        Indices, Commodities and Crypto. Built for professional traders,
        proprietary desks, and sophisticated investors who require precision over
        noise.
      </p>

      {/* Actions */}
      <div style={{ display: "flex", gap: tokens.spacing.md, marginBottom: tokens.spacing.xxl }}>
        <button
          style={{
            backgroundColor: tokens.colors.accentGreen, // Actually navy blue now
            color: "#ffffff",
            border: "none",
            padding: "12px 24px",
            fontSize: tokens.typography.fontSizeSm,
            fontWeight: tokens.typography.fontWeightMedium,
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          Request Access
        </button>
        <button
          style={{
            backgroundColor: "transparent",
            color: tokens.colors.textPrimary,
            border: `1px solid ${tokens.colors.borderHairline}`,
            padding: "12px 24px",
            fontSize: tokens.typography.fontSizeSm,
            fontWeight: tokens.typography.fontWeightMedium,
            borderRadius: "4px",
            cursor: "pointer"
          }}
        >
          View Methodology
        </button>
      </div>

      {/* Stats Grid */}
      <div
        style={{
          display: "grid",
          gridTemplateColumns: "repeat(3, 1fr)",
          border: `1px solid ${tokens.colors.borderHairline}`,
          borderRight: "none", // Remove right edge to balance internal borders
          backgroundColor: tokens.colors.panelBg,
          borderRadius: "4px",
          overflow: "hidden"
        }}
      >
        <div style={{ padding: tokens.spacing.xl, borderRight: `1px solid ${tokens.colors.borderHairline}` }}>
          <div style={{ fontFamily: tokens.typography.fontFamilyMono, fontSize: tokens.typography.fontSizeLg, color: tokens.colors.textPrimary, marginBottom: tokens.spacing.xs }}>47</div>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>Instruments Monitored</div>
        </div>
        <div style={{ padding: tokens.spacing.xl, borderRight: `1px solid ${tokens.colors.borderHairline}` }}>
          <div style={{ fontFamily: tokens.typography.fontFamilyMono, fontSize: tokens.typography.fontSizeLg, color: tokens.colors.textPrimary, marginBottom: tokens.spacing.xs }}>3</div>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>AI Models in Consensus</div>
        </div>
        <div style={{ padding: tokens.spacing.xl, borderRight: `1px solid ${tokens.colors.borderHairline}` }}>
          <div style={{ fontFamily: tokens.typography.fontFamilyMono, fontSize: tokens.typography.fontSizeLg, color: tokens.colors.textPrimary, marginBottom: tokens.spacing.xs }}>0-100</div>
          <div style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>Conviction Score Range</div>
        </div>
      </div>
    </main>
  );
}
