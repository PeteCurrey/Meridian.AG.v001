"use client";

import React, { useEffect, useState } from "react";
import { tokens, Panel, DataTable, Column, StateBanner } from "@meridian/ui";

export default function BookPage() {
  const [theses, setTheses] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [newThesisText, setNewThesisText] = useState("");
  const [newFalsification, setNewFalsification] = useState("");
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fetchTheses = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/book");
      if (res.ok) {
        const data = await res.json();
        setTheses(data.theses || []);
      }
    } catch (e) {
      console.error("Failed to fetch theses:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchTheses();
  }, []);

  const handleAddThesis = async (e: React.FormEvent) => {
    e.preventDefault();
    setErrorMessage(null);

    // Invariant Enforcement: Thesis WITHOUT falsification condition MUST BE REJECTED
    if (!newFalsification || newFalsification.trim().length === 0) {
      setErrorMessage("REJECTED: A thesis without a falsification condition cannot be saved.");
      return;
    }

    try {
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          text: newThesisText,
          falsification_condition: newFalsification,
          confidence: 75
        })
      });

      if (!res.ok) {
        const errData = await res.json();
        setErrorMessage(errData.error || "Failed to save thesis");
        return;
      }

      setNewThesisText("");
      setNewFalsification("");
      fetchTheses();
    } catch (err: any) {
      setErrorMessage(err.message || "Network error");
    }
  };

  const thesisColumns: Column<any>[] = [
    {
      key: "text",
      header: "THESIS STATEMENT",
      render: (row) => <span style={{ fontWeight: tokens.typography.fontWeightMedium, color: tokens.colors.textPrimary }}>{row.text}</span>
    },
    {
      key: "falsification",
      header: "FALSIFICATION CONDITION (MANDATORY)",
      render: (row) => (
        <span style={{ color: "#dc2626", fontWeight: tokens.typography.fontWeightMedium, backgroundColor: "#fef2f2", padding: "2px 8px", borderRadius: "4px", border: "1px solid #fecaca" }}>
          [FALSIFY IF] {row.falsification_condition}
        </span>
      )
    },
    {
      key: "confidence",
      header: "CONFIDENCE",
      render: (row) => <span style={{ color: tokens.colors.accentGreen, fontWeight: tokens.typography.fontWeightBold, fontFamily: tokens.typography.fontFamilyMono }}>{row.confidence}%</span>
    },
    {
      key: "review_date",
      header: "REVIEW DATE",
      render: (row) => <span style={{ fontFamily: tokens.typography.fontFamilyMono, fontSize: tokens.typography.fontSizeXs }}>{row.review_date}</span>
    }
  ];

  return (
    <div
      style={{
        backgroundColor: "transparent",
        color: tokens.colors.textPrimary,
        fontFamily: tokens.typography.fontFamilySans,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: tokens.spacing.lg
      }}
    >
      {/* Header */}
      <div>
        <h1 style={{ margin: 0, fontSize: tokens.typography.fontSizeXl, color: tokens.colors.textPrimary, fontWeight: tokens.typography.fontWeightBold }}>
          The Book // Standing Investment Theses
        </h1>
        <p style={{ margin: "4px 0 0 0", color: tokens.colors.textMuted, fontSize: tokens.typography.fontSizeSm }}>
          Standing investment theses with mandatory falsification conditions to prevent narrative bias.
        </p>
      </div>

      {errorMessage && <StateBanner state="DEGRADED" reason={errorMessage} />}

      {/* New Thesis Form */}
      <Panel title="ADD STANDING THESIS (MANDATORY FALSIFICATION CONDITION)">
        <form onSubmit={handleAddThesis} style={{ display: "flex", flexDirection: "column", gap: tokens.spacing.md }}>
          <div>
            <label style={{ display: "block", fontSize: tokens.typography.fontSizeXs, fontWeight: tokens.typography.fontWeightBold, color: tokens.colors.textMuted, marginBottom: "4px" }}>
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
                padding: "10px 12px",
                borderRadius: "4px",
                border: `1px solid ${tokens.colors.borderHairline}`,
                fontSize: tokens.typography.fontSizeSm,
                boxSizing: "border-box",
                outline: "none"
              }}
            />
          </div>

          <div>
            <label style={{ display: "block", fontSize: tokens.typography.fontSizeXs, fontWeight: tokens.typography.fontWeightBold, color: "#dc2626", marginBottom: "4px" }}>
              FALSIFICATION CONDITION (MANDATORY — CANNOT BE BLANK):
            </label>
            <input
              type="text"
              value={newFalsification}
              onChange={(e) => setNewFalsification(e.target.value)}
              placeholder="e.g. TSMC monthly revenue drops > 5% YoY for two consecutive months"
              style={{
                width: "100%",
                padding: "10px 12px",
                borderRadius: "4px",
                border: "1px solid #fecaca",
                fontSize: tokens.typography.fontSizeSm,
                boxSizing: "border-box",
                outline: "none"
              }}
            />
          </div>

          <button
            type="submit"
            style={{
              alignSelf: "flex-start",
              padding: "10px 20px",
              backgroundColor: tokens.colors.accentGreen,
              color: "#ffffff",
              fontWeight: tokens.typography.fontWeightMedium,
              fontSize: tokens.typography.fontSizeSm,
              border: "none",
              borderRadius: "4px",
              cursor: "pointer"
            }}
          >
            + Save Thesis to Book
          </button>
        </form>
      </Panel>

      <Panel title={`ACTIVE THESES (${theses.length})`}>
        <DataTable
          data={theses}
          columns={thesisColumns}
          keyExtractor={(row) => row.id}
          emptyMessage="No active theses recorded."
        />
      </Panel>
    </div>
  );
}
