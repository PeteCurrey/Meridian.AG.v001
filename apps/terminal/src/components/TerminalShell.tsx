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
        fontFamily: tokens.typography.fontFamilyMono,
        overflow: "hidden"
      }}
    >
      {/* 1. Persistent Left Navigation */}
      <nav
        style={{
          width: "180px",
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
            color: tokens.colors.accentGreen,
            letterSpacing: "0.2em",
            marginBottom: tokens.spacing.lg
          }}
        >
          MERIDIAN
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
          {NAV_ITEMS.map(item => {
            const isActive = activePath === item.path;

            return (
              <a
                key={item.id}
                href={item.path}
                style={{
                  color: isActive ? tokens.colors.accentGreen : tokens.colors.textPrimary,
                  textDecoration: "none",
                  fontSize: tokens.typography.fontSizeSm,
                  padding: "6px 8px",
                  borderRadius: "2px",
                  backgroundColor: isActive ? `${tokens.colors.accentGreen}15` : "transparent",
                  borderLeft: isActive ? `2px solid ${tokens.colors.accentGreen}` : "2px solid transparent",
                  opacity: item.stubbed ? 0.6 : 1
                }}
              >
                {item.label} {item.stubbed ? <span style={{ fontSize: "9px", color: tokens.colors.textMuted }}>[STUB]</span> : ""}
              </a>
            );
          })}
        </div>
      </nav>

      {/* 2. Main Content & Top Bar (No Footer) */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden" }}>
        {/* Top Bar Header */}
        <header
          style={{
            height: "48px",
            backgroundColor: tokens.colors.panelBg,
            borderBottom: `1px solid ${tokens.colors.borderHairline}`,
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: `0 ${tokens.spacing.md}`,
            boxSizing: "border-box"
          }}
        >
          {/* Global Staleness Indicator */}
          <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.md }}>
            <span style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>STALENESS:</span>
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
              color: tokens.colors.accentGreen,
              border: `1px solid ${tokens.colors.accentGreen}`,
              padding: "2px 8px",
              borderRadius: "2px"
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
        <main style={{ flex: 1, overflowY: "auto" }}>{children}</main>
      </div>
    </div>
  );
};
