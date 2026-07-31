import React from "react";
import { tokens } from "../tokens.ts";

export interface ConfidenceBarProps {
  readonly score: number; // 0-100
}

export const ConfidenceBar: React.FC<ConfidenceBarProps> = ({ score }) => {
  const percentage = Math.min(100, Math.max(0, score));

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: tokens.typography.fontFamilyMono,
        fontSize: tokens.typography.fontSizeXs
      }}
    >
      <div
        style={{
          width: "60px",
          height: "6px",
          backgroundColor: tokens.colors.panelBg,
          border: `1px solid ${tokens.colors.borderHairline}`,
          borderRadius: "2px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: percentage > 70 ? tokens.colors.accentGreen : tokens.colors.warningAmber
          }}
        />
      </div>
      <span>{percentage}%</span>
    </div>
  );
};

export interface DisagreementBarProps {
  readonly score: number; // 0-100 disagreement rating
}

export const DisagreementBar: React.FC<DisagreementBarProps> = ({ score }) => {
  const percentage = Math.min(100, Math.max(0, score));

  return (
    <div
      style={{
        display: "inline-flex",
        alignItems: "center",
        gap: "6px",
        fontFamily: tokens.typography.fontFamilyMono,
        fontSize: tokens.typography.fontSizeXs
      }}
    >
      <div
        style={{
          width: "60px",
          height: "6px",
          backgroundColor: tokens.colors.panelBg,
          border: `1px solid ${tokens.colors.borderHairline}`,
          borderRadius: "2px",
          overflow: "hidden"
        }}
      >
        <div
          style={{
            width: `${percentage}%`,
            height: "100%",
            backgroundColor: percentage > 50 ? tokens.colors.offlineRed : tokens.colors.accentGreen
          }}
        />
      </div>
      <span style={{ color: percentage > 50 ? tokens.colors.offlineRed : tokens.colors.textMuted }}>
        DIVERGENCE: {percentage}%
      </span>
    </div>
  );
};
