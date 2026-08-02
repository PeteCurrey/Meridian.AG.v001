"use client";

import React, { useState } from "react";
import { tokens } from "../tokens";

export interface KillSwitchProps {
  readonly onHalt?: () => void;
  readonly initialHalted?: boolean;
}

export const KillSwitch: React.FC<KillSwitchProps> = ({ onHalt, initialHalted = false }) => {
  const [isHalted, setIsHalted] = useState(initialHalted);

  const handleClick = () => {
    const nextState = !isHalted;
    setIsHalted(nextState);
    if (onHalt) onHalt();
  };

  return (
    <button
      onClick={handleClick}
      title="EMERGENCY KILL SWITCH — One-click halt to all platform automation"
      style={{
        fontFamily: tokens.typography.fontFamilyMono,
        fontSize: tokens.typography.fontSizeXs,
        fontWeight: tokens.typography.fontWeightBold,
        letterSpacing: "0.1em",
        padding: "6px 12px",
        borderRadius: "2px",
        cursor: "pointer",
        transition: "none",
        backgroundColor: isHalted ? tokens.colors.offlineRed : "#ff444422",
        color: isHalted ? "#ffffff" : tokens.colors.offlineRed,
        border: `1px solid ${tokens.colors.offlineRed}`,
        display: "inline-flex",
        alignItems: "center",
        gap: "6px"
      }}
    >
      <span
        style={{
          width: "8px",
          height: "8px",
          borderRadius: "50%",
          backgroundColor: isHalted ? "#ffffff" : tokens.colors.offlineRed
        }}
      />
      {isHalted ? "AUTOMATION HALTED (KILL SWITCH ACTIVE)" : "KILL SWITCH — HALT ALL"}
    </button>
  );
};
