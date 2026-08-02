import React from "react";
import { tokens } from "../tokens";

export interface ValueSourceInfo {
  readonly id: string;
  readonly name: string;
}

export interface ValueProps {
  /** Numerical amount (scaled integer or float) */
  readonly value: number | bigint;
  /** Unit string e.g. "USD", "%", "BPS" */
  readonly unit?: string;
  /** Scale factor if scaled integer (e.g. 2 for cents) */
  readonly scale?: number;
  /** MANDATORY: Source provenance object. TYPE-IMPOSSIBLE to omit. */
  readonly source: ValueSourceInfo;
  /** MANDATORY: ISO-8601 Timestamp of observation. TYPE-IMPOSSIBLE to omit. */
  readonly timestamp: string;
  /** Optional staleness override flag */
  readonly isStale?: boolean;
}

export const Value: React.FC<ValueProps> = ({
  value,
  unit,
  scale,
  source,
  timestamp,
  isStale = false
}) => {
  let displayString = "";

  if (typeof value === "bigint") {
    if (scale && scale > 0) {
      const divisor = BigInt(10 ** scale);
      const integerPart = value / divisor;
      const remainder = (value % divisor).toString().padStart(scale, "0");
      displayString = `${integerPart}.${remainder}`;
    } else {
      displayString = value.toString();
    }
  } else {
    displayString = value.toLocaleString("en-US", { maximumFractionDigits: scale || 2 });
  }

  const formattedTime = new Date(timestamp).toLocaleTimeString("en-US", {
    hour12: false,
    hour: "2-digit",
    minute: "2-digit",
    second: "2-digit"
  });

  return (
    <span
      title={`Source: ${source.name} (${source.id}) | Captured: ${timestamp}`}
      style={{
        fontFamily: tokens.typography.fontFamilyMono,
        fontSize: tokens.typography.fontSizeSm,
        color: isStale ? tokens.colors.warningAmber : tokens.colors.textPrimary,
        display: "inline-flex",
        alignItems: "center",
        gap: "4px"
      }}
    >
      <span style={{ fontWeight: tokens.typography.fontWeightBold }}>{displayString}</span>
      {unit && <span style={{ color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeXs }}>{unit}</span>}
      <span
        style={{
          fontSize: "9px",
          color: tokens.colors.textMuted,
          backgroundColor: tokens.colors.panelBg,
          padding: "1px 4px",
          borderRadius: "2px",
          border: `1px solid ${tokens.colors.borderHairline}`
        }}
      >
        {source.id}:{formattedTime}
      </span>
    </span>
  );
};
