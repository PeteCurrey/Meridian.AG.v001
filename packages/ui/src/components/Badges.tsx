import React from "react";
import { tokens } from "../tokens.ts";
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
      backgroundColor: `${tokens.colors.accentGreen}15`,
      border: `1px solid ${tokens.colors.accentGreen}`,
      padding: "2px 6px",
      borderRadius: "2px",
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
  let color = tokens.colors.accentGreen;
  if (status === "DEGRADED") color = tokens.colors.warningAmber;
  if (status === "OFFLINE") color = tokens.colors.offlineRed;
  if (status === "NOT_CONNECTED") color = tokens.colors.notConnectedGray;

  return (
    <span
      style={{
        fontFamily: tokens.typography.fontFamilyMono,
        fontSize: tokens.typography.fontSizeXs,
        fontWeight: tokens.typography.fontWeightBold,
        color,
        backgroundColor: `${color}18`,
        border: `1px solid ${color}`,
        padding: "2px 6px",
        borderRadius: "2px"
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
      border: `1px solid ${tokens.colors.borderHairline}`,
      padding: "2px 6px",
      borderRadius: "2px"
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
  let color = tokens.colors.warningAmber;
  if (state === "FEED_OFFLINE") color = tokens.colors.offlineRed;
  if (state === "NOT_CONNECTED") color = tokens.colors.notConnectedGray;

  return (
    <div
      style={{
        fontFamily: tokens.typography.fontFamilyMono,
        fontSize: tokens.typography.fontSizeSm,
        backgroundColor: `${color}10`,
        border: `1px solid ${color}`,
        color: color,
        padding: `${tokens.spacing.sm} ${tokens.spacing.md}`,
        borderRadius: "4px",
        marginBottom: tokens.spacing.md,
        display: "flex",
        alignItems: "center",
        gap: tokens.spacing.sm
      }}
    >
      <span style={{ fontWeight: tokens.typography.fontWeightBold }}>[{state}]</span>
      <span>{reason}</span>
    </div>
  );
};
