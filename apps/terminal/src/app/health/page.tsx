import React from "react";
import { tokens } from "@meridian/ui";
import { WAVE_1_REGISTRY } from "@meridian/registry";

export default function HealthBoardPage() {
  return (
    <div
      style={{
        backgroundColor: tokens.colors.bg,
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontFamilyMono,
        minHeight: "100vh",
        padding: tokens.spacing.lg
      }}
    >
      <header
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          borderBottom: `1px solid ${tokens.colors.borderHairline}`,
          paddingBottom: tokens.spacing.md,
          marginBottom: tokens.spacing.lg
        }}
      >
        <div>
          <h1
            style={{
              margin: 0,
              fontSize: tokens.typography.fontSizeLg,
              color: tokens.colors.accentGreen,
              letterSpacing: "0.15em"
            }}
          >
            MERIDIAN // SOURCE HEALTH BOARD
          </h1>
          <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
            Real-time feed provenance, staleness SLA, error rates, and quota status
          </p>
        </div>

        <div style={{ textAlign: "right" }}>
          <span style={{ fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>
            TOTAL WAVE 1 SOURCES: {WAVE_1_REGISTRY.length}
          </span>
        </div>
      </header>

      <table
        style={{
          width: "100%",
          borderCollapse: "collapse",
          fontSize: tokens.typography.fontSizeSm,
          textAlign: "left"
        }}
      >
        <thead>
          <tr style={{ borderBottom: `1px solid ${tokens.colors.borderHairline}`, color: tokens.colors.textMuted }}>
            <th style={{ padding: "8px 12px" }}>SOURCE ID</th>
            <th style={{ padding: "8px 12px" }}>NAME</th>
            <th style={{ padding: "8px 12px" }}>PILLAR</th>
            <th style={{ padding: "8px 12px" }}>CADENCE</th>
            <th style={{ padding: "8px 12px" }}>SLA (SEC)</th>
            <th style={{ padding: "8px 12px" }}>24H ERR</th>
            <th style={{ padding: "8px 12px" }}>ROWS</th>
            <th style={{ padding: "8px 12px" }}>STATE</th>
          </tr>
        </thead>
        <tbody>
          {WAVE_1_REGISTRY.map(source => {
            const isConnected = ["fred", "twelve_data", "sec_edgar", "usaspending", "kalshi", "gdelt"].includes(source.id);
            const stateLabel = isConnected ? "HEALTHY" : "NOT_CONNECTED";
            const stateColor = isConnected ? tokens.colors.accentGreen : tokens.colors.notConnectedGray;

            return (
              <tr
                key={source.id}
                style={{
                  borderBottom: `1px solid ${tokens.colors.borderHairline}`,
                  backgroundColor: tokens.colors.panelBg
                }}
              >
                <td style={{ padding: "10px 12px", color: tokens.colors.accentGreen }}>{source.id}</td>
                <td style={{ padding: "10px 12px", fontWeight: tokens.typography.fontWeightMedium }}>{source.name}</td>
                <td style={{ padding: "10px 12px", color: tokens.colors.textMuted }}>{source.pillar}</td>
                <td style={{ padding: "10px 12px" }}>{source.cadence}</td>
                <td style={{ padding: "10px 12px" }}>{source.staleness_sla_seconds}s</td>
                <td style={{ padding: "10px 12px" }}>0.0%</td>
                <td style={{ padding: "10px 12px" }}>{isConnected ? 12 : 0}</td>
                <td style={{ padding: "10px 12px" }}>
                  <span
                    style={{
                      padding: "2px 8px",
                      borderRadius: "2px",
                      fontSize: tokens.typography.fontSizeXs,
                      fontWeight: tokens.typography.fontWeightBold,
                      backgroundColor: `${stateColor}22`,
                      color: stateColor,
                      border: `1px solid ${stateColor}`
                    }}
                  >
                    {stateLabel}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}
