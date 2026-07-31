import React from "react";
import { tokens } from "@meridian/ui";

export default function TerminalPage() {
  return (
    <main
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        height: "100vh",
        backgroundColor: tokens.colors.bg,
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontFamilyMono
      }}
    >
      <h1
        style={{
          fontSize: "48px",
          fontWeight: tokens.typography.fontWeightBold,
          letterSpacing: "0.25em",
          color: tokens.colors.accentGreen,
          margin: 0
        }}
      >
        MERIDIAN
      </h1>
    </main>
  );
}
