import React from "react";
import { tokens } from "../tokens";
import { Pillar } from "@meridian/core";

export interface SourceBadgeProps {
  readonly sourceId: string;
  readonly name?: string;
}

export const SourceBadge: React.FC<SourceBadgeProps> = ({ sourceId, name }) => (
  <span
    title={name || sourceId}
    style={{
      fontFamily: tokens.typography.fontFamilyMono,
      fontSize: tokens.typography.fontSizeXs,
      color: tokens.colors.accentGreen,
      backgroundColor: "#f1f5f9", // subtle slate-100
      border: `1px solid ${tokens.colors.borderHairline}`,
      padding: "2px 6px",
      borderRadius: "4px",
      display: "inline-block"
    }}
  >
    {sourceId}
  </span>
);

export interface StalenessBadgeProps {
  readonly status: "HEALTHY" | "DEGRADED" | "OFFLINE" | "NOT_CONNECTED";
  readonly slaSeconds?: number;
}

export const StalenessBadge: React.FC<StalenessBadgeProps> = ({ status, slaSeconds }) => {
  let color: string = tokens.colors.accentGreen;
  let bg = "#f1f5f9";
  if (status === "DEGRADED") {
    color = tokens.colors.warningAmber;
    bg = "#fef3c7";
  }
  if (status === "OFFLINE") {
    color = tokens.colors.offlineRed;
    bg = "#fee2e2";
  }
  if (status === "NOT_CONNECTED") {
    color = tokens.colors.notConnectedGray;
    bg = "#f1f5f9";
  }

  return (
    <span
      style={{
        fontFamily: tokens.typography.fontFamilyMono,
        fontSize: tokens.typography.fontSizeXs,
        fontWeight: tokens.typography.fontWeightBold,
        color,
        backgroundColor: bg,
        border: `1px solid ${color}`,
        padding: "2px 6px",
        borderRadius: "4px"
      }}
    >
      {status} {slaSeconds ? `(${slaSeconds}s)` : ""}
    </span>
  );
};

export interface PillarTagProps {
  readonly pillar: Pillar;
}

export const PillarTag: React.FC<PillarTagProps> = ({ pillar }) => (
  <span
    style={{
      fontFamily: tokens.typography.fontFamilyMono,
      fontSize: tokens.typography.fontSizeXs,
      color: tokens.colors.textMuted,
      backgroundColor: "#f8fafc",
      border: `1px solid ${tokens.colors.borderHairline}`,
      padding: "2px 6px",
      borderRadius: "4px"
    }}
  >
    {pillar}
  </span>
);

export interface StateBannerProps {
  readonly state: "NOT_CONNECTED" | "FEED_OFFLINE" | "DEGRADED";
  readonly reason: string;
}

export const StateBanner: React.FC<StateBannerProps> = ({ state, reason }) => {
  let color: string = tokens.colors.warningAmber;
  let bg = "#fef3c7";
  if (state === "FEED_OFFLINE") {
    color = tokens.colors.offlineRed;
    bg = "#fee2e2";
  }
  if (state === "NOT_CONNECTED") {
    color = tokens.colors.notConnectedGray;
    bg = "#f1f5f9";
  }

  return (
    <div
      style={{
        fontFamily: tokens.typography.fontFamilySans,
        fontSize: tokens.typography.fontSizeSm,
        backgroundColor: bg,
        border: `1px solid ${color}`,
        color: tokens.colors.textPrimary,
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        borderRadius: "4px",
        marginBottom: tokens.spacing.md,
        display: "flex",
        alignItems: "center",
        gap: tokens.spacing.sm
      }}
    >
      <span style={{ fontWeight: tokens.typography.fontWeightBold, color, fontFamily: tokens.typography.fontFamilyMono, fontSize: tokens.typography.fontSizeXs }}>[{state}]</span>
      <span>{reason}</span>
    </div>
  );
};
