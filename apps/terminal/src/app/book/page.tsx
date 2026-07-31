"use client";

import React, { useState } from "react";
import { tokens, Panel, DataTable, Column, Value, StateBanner } from "@meridian/ui";

interface ThesisItem {
  id: string;
  text: string;
  falsification_condition: string;
  review_date: string;
  confidence: number;
}

export default function BookPage() {
  const [theses, setTheses] = useState<ThesisItem[]>([
    {
      id: "th-001",
      text: "US Fed will cut rates in Q4 2026 due to cooling labor dynamics.",
      falsification_condition: "Core PCE inflation accelerates above 3.2% year-over-year.",
      review_date: "2026-10-01",
      confidence: 75
    }
  ]);

  const [newThesisText, setNewThesisText] = useState("");
  const [newFalsification, setNewFalsification] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const handleAddThesis = (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Invariant Enforcement: Thesis WITHOUT falsification condition MUST BE REJECTED
    if (!newFalsification || newFalsification.trim().length === 0) {
      setErrorMessage("REJECTED: A thesis without a falsification condition cannot be saved.");
      return;
    }

    const created: ThesisItem = {
      id: `th-${Date.now()}`,
      text: newThesisText,
      falsification_condition: newFalsification.trim(),
      review_date: "2026-12-31",
      confidence: 70
    };

    setTheses([...theses, created]);
    setNewThesisText("");
    setNewFalsification("");
  };

  const thesisColumns: Column<ThesisItem>[] = [
    {
      key: "text",
      header: "THESIS STATEMENT",
      render: (row) => <span style={{ fontWeight: tokens.typography.fontWeightMedium }}>{row.text}</span>
    },
    {
      key: "falsification",
      header: "FALSIFICATION CONDITION (MANDATORY)",
      render: (row) => (
        <span style={{ color: tokens.colors.offlineRed, fontWeight: tokens.typography.fontWeightBold }}>
          [FALSIFY IF] {row.falsification_condition}
        </span>
      )
    },
    {
      key: "confidence",
      header: "CONFIDENCE",
      render: (row) => <span style={{ color: tokens.colors.accentGreen }}>{row.confidence}%</span>
    },
    {
      key: "review_date",
      header: "REVIEW DATE",
      render: (row) => row.review_date
    }
  ];

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
      <header style={{ marginBottom: tokens.spacing.lg }}>
        <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeLg, color: tokens.colors.accentGreen }}>
          THE BOOK // PERSONAL CONTEXT & STANDING THESES
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Watchlist, Manual Positions, Falsification-Gated Investment Theses, and Standing Questions
        </p>
      </header>

      {errorMessage && <StateBanner state="DEGRADED" reason={errorMessage} />}

      {/* New Thesis Form */}
      <Panel title="ADD STANDING THESIS (MANDATORY FALSIFICATION CONDITION)">
        <form onSubmit={handleAddThesis} style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.sm }}>
          <div>
            <label style={{ display: "block", fontSize: tokens.typography.fontSizeXs, color: tokens.colors.textMuted, marginBottom: "4px" }}>
              THESIS STATEMENT:
            </label>
            <input
              type="text"
              value={newThesisText}
              onChange={(e) => setNewThesisText(e.target.value)}
              placeholder="e.g. Semiconductor supply constraints will elevate ASPs in H2"
              required
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: tokens.colors.bg,
                color: tokens.colors.textPrimary,
                border: `1px solid ${tokens.colors.borderHairline}`,
                fontFamily: tokens.typography.fontFamilyMono
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: tokens.typography.fontSizeXs, color: tokens.colors.offlineRed, marginBottom: "4px" }}>
              FALSIFICATION CONDITION (MANDATORY — CANNOT BE BLANK):
            </label>
            <input
              type="text"
              value={newFalsification}
              onChange={(e) => setNewFalsification(e.target.value)}
              placeholder="e.g. TSMC monthly revenue drops > 5% YoY for two consecutive months"
              style={{
                width: "100%",
                padding: "8px",
                backgroundColor: tokens.colors.bg,
                color: tokens.colors.offlineRed,
                border: `1px solid ${tokens.colors.offlineRed}`,
                fontFamily: tokens.typography.fontFamilyMono
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              alignSelf: "flex-start",
              padding: "8px 16px",
              backgroundColor: tokens.colors.accentGreen,
              color: "#000000",
              fontWeight: tokens.typography.fontWeightBold,
              border: "none",
              cursor: "pointer",
              fontFamily: tokens.typography.fontFamilyMono
            }}
          >
            SAVE THESIS
          </button>
        </form>
      </Panel>

      <Panel title="ACTIVE THESES">
        <DataTable
          data={theses}
          columns={thesisColumns}
          keyExtractor={(row) => row.id}
        />
      </Panel>
    </div>
  );
}
