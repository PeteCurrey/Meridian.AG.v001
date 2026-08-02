import React from "react";
import { tokens, KillSwitch, StalenessBadge } from "@meridian/ui";

export interface TerminalShellProps {
  readonly children: React.ReactNode;
  readonly activePath?: string;
  readonly globalStalenessState?: "HEALTHY" | "DEGRADED" | "OFFLINE";
  readonly degradedSourceName?: string;
}

export const NAV_ITEMS = [
  { id: "brief", label: "Brief", path: "/brief", stubbed: true },
  { id: "edge", label: "Edge", path: "/edge", stubbed: true },
  { id: "world", label: "World", path: "/world", stubbed: true },
  { id: "markets", label: "Markets", path: "/markets", stubbed: true },
  { id: "horizon", label: "Horizon", path: "/horizon", stubbed: true },
  { id: "undercurrent", label: "Undercurrent", path: "/undercurrent", stubbed: true },
  { id: "alternatives", label: "Alternatives", path: "/alternatives", stubbed: true },
  { id: "council", label: "Council", path: "/council", stubbed: true },
  { id: "machine", label: "Machine", path: "/machine", stubbed: true },
  { id: "book", label: "Book", path: "/book", stubbed: true },
  { id: "sources", label: "Sources", path: "/sources", stubbed: true },
  { id: "health", label: "Health", path: "/health", stubbed: false }
];

export const TerminalShell: React.FC<TerminalShellProps> = ({
  children,
  activePath = "/health",
  globalStalenessState = "HEALTHY",
  degradedSourceName
}) => {
  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: tokens.colors.bg,
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontFamilySans,
        overflow: "hidden"
      }}
    >
      {/* 1. Persistent Left Navigation */}
      <nav
        style={{
          width: "220px",
          backgroundColor: tokens.colors.panelBg,
          borderRight: `1px solid ${tokens.colors.borderHairline}`,
          display: "flex",
          flexDirection: "column",
          padding: tokens.spacing.md,
          boxSizing: "border-box"
        }}
      >
        <div
          style={{
            fontSize: tokens.typography.fontSizeMd,
            fontWeight: tokens.typography.fontWeightBold,
            color: tokens.colors.textPrimary,
            letterSpacing: "0.1em",
            marginBottom: tokens.spacing.xl,
            paddingLeft: tokens.spacing.xs
          }}
        >
          MERIDIAN <span style={{ fontWeight: tokens.typography.fontWeightRegular, color: tokens.colors.textMuted }}>CENTRE</span>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "4px" }}>
          {NAV_ITEMS.map(item => {
            const isActive = activePath === item.path;

            return (
              <a
                key={item.id}
                href={item.path}
                style={{
                  color: isActive ? tokens.colors.accentGreen : tokens.colors.textMuted,
                  fontWeight: isActive ? tokens.typography.fontWeightMedium : tokens.typography.fontWeightRegular,
                  textDecoration: "none",
                  fontSize: tokens.typography.fontSizeSm,
                  padding: "8px 12px",
                  borderRadius: "4px",
                  backgroundColor: isActive ? "#f8fafc" : "transparent",
                  borderLeft: isActive ? `3px solid ${tokens.colors.accentGreen}` : "3px solid transparent",
                  opacity: item.stubbed ? 0.6 : 1,
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "space-between"
                }}
              >
                <span>{item.label}</span>
                {item.stubbed ? <span style={{ fontSize: "10px", color: tokens.colors.textMuted, fontFamily: tokens.typography.fontFamilyMono }}>STUB</span> : null}
              </a>
            );
          })}
        </div>
      </nav>

      {/* 2. Main Content & Top Bar (No Footer) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", backgroundColor: "#f8fafc" }}>
        {/* Top Bar Header */}
        <header
          style={{
            height: "56px",
            backgroundColor: tokens.colors.panelBg,
            borderBottom: `1px solid ${tokens.colors.borderHairline}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${tokens.spacing.lg}`,
            boxSizing: "border-box"
          }}
        >
          {/* Global Staleness Indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.md }}>
            <span style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted, letterSpacing: "0.05em", textTransform: "uppercase" }}>System Status:</span>
            <StalenessBadge status={globalStalenessState} />
            {degradedSourceName && (
              <span style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.warningAmber }}>
                ({degradedSourceName} DEGRADED)
              </span>
            )}
          </div>

          {/* Current Automation Tier */}
          <div
            style={{
              fontSize: tokens.typography.fontSizeXs,
              color: tokens.colors.textPrimary,
              border: `1px solid ${tokens.colors.borderHairline}`,
              backgroundColor: "#f1f5f9",
              padding: "4px 10px",
              borderRadius: "12px",
              fontWeight: tokens.typography.fontWeightMedium
            }}
          >
            AUTOMATION: TIER 1 (WATCH)
          </div>

          {/* THE KILL SWITCH */}
          <div>
            <KillSwitch />
          </div>
        </header>

        {/* Content Area */}
        <main style={{ flex: 1, overflowY: "auto", padding: tokens.spacing.xl, boxSizing: "border-box" }}>{children}</main>
      </div>
    </div>
  );
};
