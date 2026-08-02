/**
 * DESIGN TOKENS (APPROXIMATION REQUIRING REPLACEMENT IF SIGNAL CENTRE REPO IS PRESENT)
 * Dark monospaced terminal styling for MERIDIAN platform shell.
 */
export const tokens = {
  colors: {
    bg: "#ffffff",
    panelBg: "#ffffff",
    textPrimary: "#1e293b",
    textMuted: "#64748b",
    accentGreen: "#1e3a8a", // Re-mapped to corporate navy blue but keeping name for compatibility, ideally rename to accentPrimary in future
    warningAmber: "#f59e0b",
    offlineRed: "#ef4444",
    borderHairline: "#e2e8f0",
    notConnectedGray: "#94a3b8"
  },
  typography: {
    fontFamilySans: "'Inter', 'Helvetica Neue', 'Arial', sans-serif",
    fontFamilyMono: "'JetBrains Mono', 'Geist Mono', monospace",
    fontSizeXs: "11px",
    fontSizeSm: "13px",
    fontSizeMd: "15px",
    fontSizeLg: "24px",
    fontSizeXl: "40px",
    fontWeightRegular: 400,
    fontWeightMedium: 500,
    fontWeightBold: 700
  },
  spacing: {
    xs: "4px",
    sm: "8px",
    md: "16px",
    lg: "24px",
    xl: "32px",
    xxl: "48px"
  }
} as const;
