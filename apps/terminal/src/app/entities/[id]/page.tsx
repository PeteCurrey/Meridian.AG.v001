"use client";

import React from "react";
import { tokens, Panel, Value, SourceBadge, PillarTag } from "@meridian/ui";
import { Pillar } from "@meridian/core";

export default function EntityDossierPage({ params }: { params: { id: string } }) {
  const entityId = params?.id || "e-apex-tech-001";

  // Mock observations for Apex Tech Inc (CIK: 0001234567, LEI: 5493001KJ9572B569811)
  const observations = [
    {
      id: "obs-001",
      pillar: Pillar.HORIZON,
      source_id: "sec_edgar",
      source_name: "SEC EDGAR Submissions",
      metric_key: "SEC_FORM_S1_FILING",
      value: 1n,
      raw_ref: "r2://payloads/sec_edgar/2026-07/9912.json",
      timestamp: "2026-07-31T09:00:00Z"
    },
    {
      id: "obs-002",
      pillar: Pillar.UNDERCURRENT,
      source_id: "usaspending",
      source_name: "USAspending Federal Contracts",
      metric_key: "DEFENSE_CONTRACT_AWARD_USD",
      value: 500000000n, // $5,000,000.00
      raw_ref: "r2://payloads/usaspending/2026-07/4412.json",
      timestamp: "2026-07-31T08:30:00Z"
    },
    {
      id: "obs-003",
      pillar: Pillar.MARKETS,
      source_id: "twelve_data",
      source_name: "Twelve Data Feed",
      metric_key: "STOCK_PRICE_USD",
      value: 14250n, // $142.50
      raw_ref: "r2://payloads/twelve_data/2026-07/1102.json",
      timestamp: "2026-07-31T08:00:00Z"
    }
  ];

  const pillarsList = [Pillar.HORIZON, Pillar.UNDERCURRENT, Pillar.MARKETS, Pillar.WORLD, Pillar.ALTERNATIVES];

  return (
    <div
      style={{
        backgroundColor: tokens.colors.bg,
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontFamilyMono,
        minHeight: "100%",
        padding: tokens.spacing.lg,
        boxSizing: "border-box"
      }}
    >
      <header style={{ marginBottom: tokens.spacing.lg, borderBottom: `1px solid ${tokens.colors.borderHairline}`, paddingBottom: tokens.spacing.md }}>
        <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeLg, color: tokens.colors.accentGreen }}>
          ENTITY DOSSIER // APEX TECH INC
        </h1>
        <div style={{ display: "flex", gap: tokens.spacing.md, marginTop: tokens.spacing.xs, fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted }}>
          <span>ENTITY ID: {entityId}</span>
          <span>CIK: 0001234567</span>
          <span>LEI: 5493001KJ9572B569811</span>
          <span>TYPE: COMPANY</span>
        </div>
      </header>

      {pillarsList.map((pillar) => {
        const pillarObs = observations.filter((o) => o.pillar === pillar);
        if (pillarObs.length === 0) return null;

        return (
          <Panel key={pillar} title={`${pillar} PILLAR OBSERVATIONS`}>
            <div style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
              {pillarObs.map((obs) => (
                <div
                  key={obs.id}
                  style={{
                    backgroundColor: tokens.colors.bg,
                    border: `1px solid ${tokens.colors.borderHairline}`,
                    padding: tokens.spacing.sm,
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center"
                  }}
                >
                  <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.md }}>
                    <SourceBadge sourceId={obs.source_id} name={obs.source_name} />
                    <span style={{ fontWeight: tokens.typography.fontWeightBold }}>{obs.metric_key}</span>
                  </div>

                  <div style={{ display: "flex", alignItems: "center", gap: tokens.spacing.md }}>
                    <Value
                      value={obs.value}
                      scale={obs.metric_key.includes("USD") ? 2 : 0}
                      source={{ id: obs.source_id, name: obs.source_name }}
                      timestamp={obs.timestamp}
                    />
                    <span style={{ fontSize: "9px", color: tokens.colors.textMuted, fontFamily: tokens.typography.fontFamilyMono }}>
                      [{obs.raw_ref}]
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </Panel>
        );
      })}
    </div>
  );
}
