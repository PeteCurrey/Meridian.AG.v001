import React from "react";
import { tokens, KillSwitch, StalenessBadge } from "@meridian/ui";

export interface TerminalShellProps {
  readonly children: React.ReactNode;
  readonly activePath?: string;
  readonly globalStalenessState?: "HEALTHY" | "DEGRADED" | "OFFLINE";
  readonly degradedSourceName?: string;
}

const NAV_SECTIONS = [
  {
    label: "INTELLIGENCE",
    items: [
      { id: "brief", label: "Daily Brief", path: "/brief", icon: "📋", description: "24h executive synthesis" },
      { id: "edge", label: "Edge Detector", path: "/edge", icon: "⚡", description: "Signal & anomaly feed" },
      { id: "council", label: "Council Room", path: "/council", icon: "🧠", description: "Multi-model deliberation" }
    ]
  },
  {
    label: "DATA PILLARS",
    items: [
      { id: "world", label: "World", path: "/world", icon: "🌐", description: "Global macro & geopolitics" },
      { id: "markets", label: "Markets", path: "/markets", icon: "📈", description: "Cross-asset price feeds" },
      { id: "horizon", label: "Horizon", path: "/horizon", icon: "🔭", description: "Corporate filings & IPO" },
      { id: "undercurrent", label: "Undercurrent", path: "/undercurrent", icon: "🔬", description: "Structural & entity data" },
      { id: "alternatives", label: "Alternatives", path: "/alternatives", icon: "🎲", description: "Prediction markets" }
    ]
  },
  {
    label: "SYSTEM",
    items: [
      { id: "book", label: "The Book", path: "/book", icon: "📖", description: "Investment theses" },
      { id: "machine", label: "Machine Room", path: "/machine", icon: "⚙️", description: "Automation control" },
      { id: "health", label: "Source Health", path: "/health", icon: "🩺", description: "41 feed status board" },
      { id: "sources", label: "Sources", path: "/sources", icon: "🔗", description: "Registry & credentials" }
    ]
  }
];

export const TerminalShell: React.FC<TerminalShellProps> = ({
  children,
  activePath = "/brief",
  globalStalenessState = "HEALTHY",
  degradedSourceName
}) => {
  const now = new Date();
  const timeStr = now.toLocaleTimeString("en-GB", { hour: "2-digit", minute: "2-digit", second: "2-digit" });
  const dateStr = now.toLocaleDateString("en-GB", { weekday: "short", year: "numeric", month: "short", day: "numeric" });

  return (
    <div
      style={{
        display: "flex",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#f0f2f5",
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontFamilySans,
        overflow: "hidden"
      }}
    >
      {/* ── Sidebar Navigation ── */}
      <nav
        style={{
          width: "240px",
          minWidth: "240px",
          backgroundColor: "#ffffff",
          borderRight: "1px solid #e2e8f0",
          display: "flex",
          flexDirection: "column",
          boxSizing: "border-box",
          overflow: "hidden"
        }}
      >
        {/* Wordmark */}
        <div
          style={{
            padding: "20px 20px 16px 20px",
            borderBottom: "1px solid #e2e8f0"
          }}
        >
          <div
            style={{
              fontSize: "17px",
              fontWeight: "800",
              letterSpacing: "0.12em",
              color: "#0f172a"
            }}
          >
            MERIDIAN
          </div>
          <div
            style={{
              fontSize: "10px",
              fontWeight: "500",
              color: "#64748b",
              letterSpacing: "0.08em",
              marginTop: "2px"
            }}
          >
            INSTITUTIONAL INTELLIGENCE
          </div>
        </div>

        {/* Nav Sections */}
        <div style={{ flex: 1, overflowY: "auto", padding: "12px 12px" }}>
          {NAV_SECTIONS.map(section => (
            <div key={section.label} style={{ marginBottom: "20px" }}>
              <div
                style={{
                  fontSize: "10px",
                  fontWeight: "700",
                  color: "#94a3b8",
                  letterSpacing: "0.1em",
                  padding: "0 8px",
                  marginBottom: "4px"
                }}
              >
                {section.label}
              </div>
              <div style={{ display: "flex", flexDirection: "column", gap: "1px" }}>
                {section.items.map(item => {
                  const isActive = activePath === item.path;
                  return (
                    <a
                      key={item.id}
                      href={item.path}
                      style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "10px",
                        padding: "8px 10px",
                        borderRadius: "6px",
                        textDecoration: "none",
                        backgroundColor: isActive ? "#f0fdf4" : "transparent",
                        borderLeft: isActive ? "3px solid #16a34a" : "3px solid transparent",
                        transition: "background-color 0.1s"
                      }}
                    >
                      <span style={{ fontSize: "14px", flexShrink: 0 }}>{item.icon}</span>
                      <div style={{ minWidth: 0 }}>
                        <div
                          style={{
                            fontSize: "13px",
                            fontWeight: isActive ? "600" : "500",
                            color: isActive ? "#15803d" : "#334155",
                            lineHeight: 1.2
                          }}
                        >
                          {item.label}
                        </div>
                        <div
                          style={{
                            fontSize: "10px",
                            color: "#94a3b8",
                            lineHeight: 1.2,
                            marginTop: "1px",
                            whiteSpace: "nowrap",
                            overflow: "hidden",
                            textOverflow: "ellipsis"
                          }}
                        >
                          {item.description}
                        </div>
                      </div>
                    </a>
                  );
                })}
              </div>
            </div>
          ))}
        </div>

        {/* Sidebar Footer — System State */}
        <div
          style={{
            borderTop: "1px solid #e2e8f0",
            padding: "12px 16px",
            display: "flex",
            flexDirection: "column",
            gap: "6px"
          }}
        >
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "600", letterSpacing: "0.05em" }}>ENGINE STATUS</span>
            <span style={{ fontSize: "10px", fontWeight: "700", color: "#16a34a" }}>● ACTIVE</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", color: "#64748b" }}>Tier</span>
            <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#334155", fontWeight: "600" }}>TIER 1 (WATCH)</span>
          </div>
          <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
            <span style={{ fontSize: "10px", color: "#64748b" }}>Sources</span>
            <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#334155", fontWeight: "600" }}>41 registered</span>
          </div>
        </div>
      </nav>

      {/* ── Main Content Area ── */}
      <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0 }}>

        {/* Top Bar */}
        <header
          style={{
            height: "52px",
            backgroundColor: "#ffffff",
            borderBottom: "1px solid #e2e8f0",
            display: "flex",
            alignItems: "center",
            justifyContent: "space-between",
            padding: "0 24px",
            boxSizing: "border-box",
            flexShrink: 0
          }}
        >
          {/* Left: Current page breadcrumb */}
          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "500" }}>MERIDIAN</span>
              <span style={{ fontSize: "11px", color: "#94a3b8" }}>›</span>
              <span style={{ fontSize: "11px", color: "#0f172a", fontWeight: "600", textTransform: "uppercase", letterSpacing: "0.04em" }}>
                {activePath?.replace("/", "") || "BRIEF"}
              </span>
            </div>
            <div
              style={{
                fontSize: "10px",
                color: "#64748b",
                fontFamily: "monospace",
                backgroundColor: "#f8fafc",
                border: "1px solid #e2e8f0",
                padding: "2px 8px",
                borderRadius: "4px"
              }}
            >
              {dateStr} · {timeStr}
            </div>
          </div>

          {/* Right: Status indicators */}
          <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
            <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
              <span style={{ fontSize: "11px", color: "#64748b" }}>System:</span>
              <StalenessBadge status={globalStalenessState} />
              {degradedSourceName && (
                <span style={{ fontSize: "11px", color: "#b45309" }}>({degradedSourceName})</span>
              )}
            </div>

            <div
              style={{
                width: "1px",
                height: "20px",
                backgroundColor: "#e2e8f0"
              }}
            />

            <KillSwitch />
          </div>
        </header>

        {/* Content */}
        <main
          style={{
            flex: 1,
            overflowY: "auto",
            padding: "24px 28px",
            boxSizing: "border-box",
            backgroundColor: "#f0f2f5"
          }}
        >
          {children}
        </main>
      </div>
    </div>
  );
};
