import React from "react";
import { tokens } from "../tokens.ts";

export interface PanelProps {
  readonly title?: string;
  readonly children: React.ReactNode;
}

export const Panel: React.FC<PanelProps> = ({ title, children }) => (
  <div
    style={{
      backgroundColor: tokens.colors.panelBg,
      border: `1px solid ${tokens.colors.borderHairline}`,
      padding: tokens.spacing.md,
      marginBottom: tokens.spacing.md,
      fontFamily: tokens.typography.fontFamilyMono
    }}
  >
    {title && (
      <div
        style={{
          color: tokens.colors.accentGreen,
          fontSize: tokens.typography.fontSizeXs,
          fontWeight: tokens.typography.fontWeightBold,
          letterSpacing: "0.1em",
          marginBottom: tokens.spacing.sm,
          borderBottom: `1px solid ${tokens.colors.borderHairline}`,
          paddingBottom: tokens.spacing.xs
        }}
      >
        // {title.toUpperCase()}
      </div>
    )}
    {children}
  </div>
);

export const Rule: React.FC = () => (
  <hr style={{ border: "none", borderTop: `1px solid ${tokens.colors.borderHairline}`, margin: `${tokens.spacing.md} 0` }} />
);

export interface MetricCellProps {
  readonly label: string;
  readonly children: React.ReactNode;
}

export const MetricCell: React.FC<MetricCellProps> = ({ label, children }) => (
  <div
    style={{
      display: "flex",
      flexDirection: "column",
      gap: "2px",
      fontFamily: tokens.typography.fontFamilyMono
    }}
  >
    <span style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>{label}</span>
    <span style={{ fontSize: tokens.typography.fontSizeSm, fontWeight: tokens.typography.fontWeightMedium }}>{children}</span>
  </div>
);
