import React from "react";
import { tokens } from "../tokens";

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
      fontFamily: tokens.typography.fontFamilySans,
      borderRadius: "4px"
    }}
  >
    {title && (
      <div
        style={{
          color: tokens.colors.textPrimary,
          fontSize: tokens.typography.fontSizeSm,
          fontWeight: tokens.typography.fontWeightBold,
          letterSpacing: "0.05em",
          marginBottom: tokens.spacing.md,
          borderBottom: `1px solid ${tokens.colors.borderHairline}`,
          paddingBottom: tokens.spacing.sm
        }}
      >
        {title.toUpperCase()}
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
      fontFamily: tokens.typography.fontFamilySans
    }}
  >
    <span style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted, textTransform: "uppercase", letterSpacing: "0.05em" }}>{label}</span>
    <span style={{ fontSize: tokens.typography.fontSizeMd, fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.textPrimary }}>{children}</span>
  </div>
);
