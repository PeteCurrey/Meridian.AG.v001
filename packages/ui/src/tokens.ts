/**
 * DESIGN TOKENS (APPROXIMATION REQUIRING REPLACEMENT IF SIGNAL CENTRE REPO IS PRESENT)
 * Dark monospaced terminal styling for MERIDIAN platform shell.
 */
export const tokens = {
  colors: {
    bg: "#0a0a0c",
    panelBg: "#121216",
    textPrimary: "#e0e0e0",
    textMuted: "#888892",
    accentGreen: "#00ff88",
    warningAmber: "#ffaa00",
    offlineRed: "#ff4444",
    borderHairline: "#1e1e24",
    notConnectedGray: "#4a4a52"
  },
  typography: {
    fontFamilyMono: "'JetBrains Mono', 'Geist Mono', monospace",
    fontSizeXs: "11px",
    fontSizeSm: "13px",
    fontSizeMd: "15px",
    fontSizeLg: "20px",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px"
  }
} as const;
