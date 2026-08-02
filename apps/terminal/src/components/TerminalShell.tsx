import React from "react";
import { tokens, KillSwitch, StalenessBadge } from "@meridian/ui";

export interface TerminalShellProps {
  readonly children: React.ReactNode;
  readonly activePath?: string;
  readonly globalStalenessState?: "HEALTHY" | "DEGRADED" | "OFFLINE";
  readonly degradedSourceName?: string;
}

const TICKER_ITEMS = [
  { symbol: "BTC/USD", price: "$95,420.00", change: "+4.2%", positive: true, note: "3.42σ Anomaly" },
  { symbol: "S&P 500", price: "5,842.10", change: "+0.65%", positive: true, note: "Healthy" },
  { symbol: "EUR/USD", price: "1.0852", change: "-0.12%", positive: false, note: "SLA 300s" },
  { symbol: "US 10Y YIELD", price: "4.182%", change: "+3.4bps", positive: true, note: "FRED" },
  { symbol: "FED CUT ODDS", price: "Poly 68% / Kalshi 48%", change: "Δ 20%", positive: false, note: "Spread Alert" }
];

const NAV_SECTIONS = [
  {
    label: "COMMAND CENTRE",
    items: [
      { id: "dashboard", label: "Executive Dashboard", path: "/", icon: "📊", description: "Market regime & live signals" }
    ]
  },
  {
    label: "INTELLIGENCE ENGINE",
    items: [
      { id: "brief", label: "Daily Brief", path: "/brief", icon: "📋", description: "24h executive summary & citations" },
      { id: "edge", label: "Edge Detector", path: "/edge", icon: "⚡", description: "Salience-ranked signal matrix" },
      { id: "council", label: "Council Room", path: "/council", icon: "🧠", description: "Multi-LLM consensus suite" }
    ]
  },
  {
    label: "MARKET PILLARS",
    items: [
      { id: "world", label: "World", path: "/world", icon: "🌐", description: "Global macro & geopolitics" },
      { id: "markets", label: "Markets", path: "/markets", icon: "📈", description: "Cross-asset prices & vol" },
      { id: "horizon", label: "Horizon", path: "/horizon", icon: "🔭", description: "SEC filings & IPO pipeline" },
      { id: "undercurrent", label: "Undercurrent", path: "/undercurrent", icon: "🔬", description: "Entity resolution & awards" },
      { id: "alternatives", label: "Alternatives", path: "/alternatives", icon: "🎲", description: "Prediction market odds" }
    ]
  },
  {
    label: "PORTFOLIO & SYSTEM",
    items: [
      { id: "book", label: "The Book", path: "/book", icon: "📖", description: "Theses & falsification triggers" },
      { id: "machine", label: "Machine Room", path: "/machine", icon: "⚙️", description: "Automation & kill switch" },
      { id: "health", label: "Source Health", path: "/health", icon: "🩺", description: "41 feed status board" },
      { id: "sources", label: "Sources", path: "/sources", icon: "🔗", description: "Registry & credentials" }
    ]
  }
];

export const TerminalShell: React.FC<TerminalShellProps> = ({
  children,
  activePath = "/",
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
        flexDirection: "column",
        height: "100vh",
        width: "100vw",
        backgroundColor: "#090d16",
        color: "#f8fafc",
        fontFamily: tokens.typography.fontFamilySans,
        overflow: "hidden"
      }}
    >
      {/* ── TOP LIVE MARKET TICKER TAPE ── */}
      <div
        style={{
          height: "32px",
          backgroundColor: "#020617",
          borderBottom: "1px solid #1e293b",
          display: "flex",
          alignItems: "center",
          padding: "0 16px",
          overflowX: "auto",
          gap: "24px",
          fontSize: "11px",
          fontFamily: tokens.typography.fontFamilyMono,
          whiteSpace: "nowrap",
          flexShrink: 0
        }}
      >
        <div style={{ color: "#38bdf8", fontWeight: "700", display: "flex", alignItems: "center", gap: "6px" }}>
          <span style={{ color: "#4ade80", animation: "pulse 2s infinite" }}>●</span> LIVE TICKER:
        </div>

        {TICKER_ITEMS.map((item, idx) => (
          <div key={idx} style={{ display: "flex", alignItems: "center", gap: "8px" }}>
            <span style={{ color: "#94a3b8", fontWeight: "600" }}>{item.symbol}:</span>
            <span style={{ color: "#f8fafc", fontWeight: "700" }}>{item.price}</span>
            <span style={{ color: item.positive ? "#4ade80" : "#f87171", fontWeight: "600" }}>{item.change}</span>
            <span style={{ fontSize: "10px", color: "#64748b", backgroundColor: "#0f172a", padding: "1px 5px", borderRadius: "3px", border: "1px solid #1e293b" }}>
              {item.note}
            </span>
          </div>
        ))}
      </div>

      <div style={{ display: "flex", flex: 1, overflow: "hidden", minHeight: 0 }}>
        {/* ── SIDEBAR NAVIGATION ── */}
        <nav
          style={{
            width: "240px",
            minWidth: "240px",
            backgroundColor: "#0f172a",
            borderRight: "1px solid #1e293b",
            display: "flex",
            flexDirection: "column",
            boxSizing: "border-box",
            overflow: "hidden"
          }}
        >
          {/* Brand / Logo */}
          <div
            style={{
              padding: "16px 20px",
              borderBottom: "1px solid #1e293b"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", gap: "8px" }}>
              <div
                style={{
                  width: "24px",
                  height: "24px",
                  borderRadius: "4px",
                  backgroundColor: "#16a34a",
                  display: "flex",
                  alignItems: "center",
                  justifyContent: "center",
                  fontWeight: "900",
                  fontSize: "14px",
                  color: "#ffffff"
                }}
              >
                M
              </div>
              <div>
                <div style={{ fontSize: "15px", fontWeight: "800", letterSpacing: "0.12em", color: "#ffffff", lineHeight: 1 }}>
                  MERIDIAN
                </div>
                <div style={{ fontSize: "9px", fontWeight: "600", color: "#38bdf8", letterSpacing: "0.08em", marginTop: "3px" }}>
                  TRADING TERMINAL v1.0
                </div>
              </div>
            </div>
          </div>

          {/* Navigation Items */}
          <div style={{ flex: 1, overflowY: "auto", padding: "12px 10px" }}>
            {NAV_SECTIONS.map(section => (
              <div key={section.label} style={{ marginBottom: "18px" }}>
                <div
                  style={{
                    fontSize: "9px",
                    fontWeight: "800",
                    color: "#64748b",
                    letterSpacing: "0.12em",
                    padding: "0 8px",
                    marginBottom: "4px"
                  }}
                >
                  {section.label}
                </div>
                <div style={{ display: "flex", flexDirection: "column", gap: "2px" }}>
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
                          backgroundColor: isActive ? "#1e293b" : "transparent",
                          borderLeft: isActive ? "3px solid #38bdf8" : "3px solid transparent",
                          transition: "background-color 0.1s"
                        }}
                      >
                        <span style={{ fontSize: "14px", flexShrink: 0 }}>{item.icon}</span>
                        <div style={{ minWidth: 0 }}>
                          <div
                            style={{
                              fontSize: "13px",
                              fontWeight: isActive ? "700" : "500",
                              color: isActive ? "#38bdf8" : "#cbd5e1",
                              lineHeight: 1.2
                            }}
                          >
                            {item.label}
                          </div>
                          <div
                            style={{
                              fontSize: "10px",
                              color: "#64748b",
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

          {/* System Footer Status */}
          <div
            style={{
              borderTop: "1px solid #1e293b",
              padding: "12px 14px",
              backgroundColor: "#020617",
              display: "flex",
              flexDirection: "column",
              gap: "4px"
            }}
          >
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: "#64748b", fontWeight: "600", letterSpacing: "0.05em" }}>ENGINE STATUS</span>
              <span style={{ fontSize: "10px", fontWeight: "700", color: "#4ade80" }}>● ONLINE</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: "#64748b" }}>AUTOMATION TIER</span>
              <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#38bdf8", fontWeight: "700" }}>TIER 1 (WATCH)</span>
            </div>
            <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
              <span style={{ fontSize: "10px", color: "#64748b" }}>REGISTERED FEEDS</span>
              <span style={{ fontSize: "10px", fontFamily: "monospace", color: "#cbd5e1", fontWeight: "700" }}>41 active</span>
            </div>
          </div>
        </nav>

        {/* ── MAIN CONTENT AREA ── */}
        <div style={{ flex: 1, display: "flex", flexDirection: "column", overflow: "hidden", minWidth: 0, backgroundColor: "#0b0f19" }}>
          {/* Header Bar */}
          <header
            style={{
              height: "48px",
              backgroundColor: "#0f172a",
              borderBottom: "1px solid #1e293b",
              display: "flex",
              alignItems: "center",
              justifyContent: "space-between",
              padding: "0 24px",
              boxSizing: "border-box",
              flexShrink: 0
            }}
          >
            {/* Breadcrumbs */}
            <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "#64748b", fontWeight: "600" }}>MERIDIAN TERMINAL</span>
                <span style={{ fontSize: "11px", color: "#475569" }}>›</span>
                <span style={{ fontSize: "11px", color: "#38bdf8", fontWeight: "700", textTransform: "uppercase", letterSpacing: "0.05em" }}>
                  {activePath === "/" ? "EXECUTIVE COMMAND CENTRE" : activePath.replace("/", "").toUpperCase()}
                </span>
              </div>
              <div
                style={{
                  fontSize: "10px",
                  color: "#94a3b8",
                  fontFamily: tokens.typography.fontFamilyMono,
                  backgroundColor: "#1e293b",
                  border: "1px solid #334155",
                  padding: "2px 8px",
                  borderRadius: "4px"
                }}
              >
                {dateStr} · {timeStr}
              </div>
            </div>

            {/* Header Right Status */}
            <div style={{ display: "flex", alignItems: "center", gap: "14px" }}>
              <div style={{ display: "flex", alignItems: "center", gap: "6px" }}>
                <span style={{ fontSize: "11px", color: "#94a3b8" }}>Staleness:</span>
                <StalenessBadge status={globalStalenessState} />
                {degradedSourceName && (
                  <span style={{ fontSize: "11px", color: "#fbbf24" }}>({degradedSourceName})</span>
                )}
              </div>

              <div style={{ width: "1px", height: "18px", backgroundColor: "#334155" }} />

              <KillSwitch />
            </div>
          </header>

          {/* Main Workspace */}
          <main
            style={{
              flex: 1,
              overflowY: "auto",
              padding: "24px 28px",
              boxSizing: "border-box",
              backgroundColor: "#0b0f19"
            }}
          >
            {children}
          </main>
        </div>
      </div>
    </div>
  );
};
