"use client";

import React, { useEffect, useState } from "react";
import { tokens } from "@meridian/ui";

export default function BriefPage() {
  const [brief, setBrief] = useState<any>(null);
  const [loading, setLoading] = useState(true);
  const [activeCitation, setActiveCitation] = useState<any>(null);

  const fetchBrief = async () => {
    try {
      setLoading(true);
      const res = await fetch("/api/brief");
      if (res.ok) {
        const data = await res.json();
        setBrief(data);
      }
    } catch (e) {
      console.error("Failed to fetch brief:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBrief();
  }, []);

  return (
    <div
      style={{
        backgroundColor: "transparent",
        color: "#f8fafc",
        fontFamily: tokens.typography.fontFamilySans,
        minHeight: "100%",
        display: "flex",
        flexDirection: "column",
        gap: "24px"
      }}
    >
      {/* Header */}
      <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
        <div>
          <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
            <span
              style={{
                fontSize: "10px",
                fontWeight: "800",
                color: "#16a34a",
                backgroundColor: "#16a34a20",
                border: "1px solid #16a34a40",
                padding: "2px 8px",
                borderRadius: "4px"
              }}
            >
              24-HOUR SYNTHESIS FEED
            </span>
            <span style={{ fontSize: "11px", color: "#64748b", fontFamily: tokens.typography.fontFamilyMono }}>
              LLM Schema Grounded Output
            </span>
          </div>

          <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff", letterSpacing: "-0.01em" }}>
            Executive Daily Brief
          </h1>
          <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
            Synthesized intelligence feed connecting observations, cross-source deltas, and investment thesis falsification risks.
          </p>
        </div>

        <button
          onClick={fetchBrief}
          disabled={loading}
          style={{
            padding: "10px 18px",
            backgroundColor: "#16a34a",
            color: "#ffffff",
            border: "none",
            borderRadius: "5px",
            fontSize: "12px",
            fontWeight: "700",
            cursor: "pointer"
          }}
        >
          {loading ? "Synthesizing..." : "⚡ Generate Live Brief"}
        </button>
      </div>

      {/* Citation Inspector Modal / Drawer */}
      {activeCitation && (
        <div
          style={{
            padding: "16px 20px",
            backgroundColor: "#0284c715",
            border: "1px solid #0284c750",
            borderRadius: "8px",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center"
          }}
        >
          <div>
            <div style={{ fontSize: "10px", fontWeight: "800", color: "#38bdf8", letterSpacing: "0.08em" }}>
              CITATION PROVENANCE DETAIL // [{activeCitation.ref_id}] ({activeCitation.ref_type})
            </div>
            <div style={{ fontSize: "13px", color: "#f8fafc", fontWeight: "600", marginTop: "2px" }}>
              {activeCitation.summary}
            </div>
          </div>
          <button
            onClick={() => setActiveCitation(null)}
            style={{
              padding: "4px 10px",
              backgroundColor: "#1e293b",
              color: "#cbd5e1",
              border: "1px solid #334155",
              borderRadius: "4px",
              fontSize: "11px",
              cursor: "pointer"
            }}
          >
            Close
          </button>
        </div>
      )}

      {/* Morning Meeting Executive Summary Banner */}
      <div
        style={{
          padding: "24px 28px",
          backgroundColor: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: "8px"
        }}
      >
        <div style={{ fontSize: "10px", fontWeight: "800", color: "#38bdf8", letterSpacing: "0.1em", marginBottom: "8px" }}>
          EXECUTIVE MORNING BRIEF // GROUNDED SUMMARY
        </div>
        <div style={{ fontSize: "14px", fontWeight: "600", color: "#ffffff", lineHeight: 1.6 }}>
          {brief?.executive_summary || "Generating grounded executive summary..."}
        </div>
      </div>

      {/* Section 1: What Changed */}
      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#4ade80", letterSpacing: "0.08em", marginBottom: "14px" }}>
          SECTION 1 // WHAT CHANGED (DELTAS & ANOMALIES)
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {brief?.what_changed?.map((item: any) => (
            <div
              key={item.id}
              style={{
                padding: "14px 16px",
                backgroundColor: "#090d16",
                border: "1px solid #1e293b",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: "13px", color: "#cbd5e1", fontWeight: "500" }}>{item.text}</span>
              <button
                onClick={() => setActiveCitation(item.citation)}
                style={{
                  fontSize: "10px",
                  fontFamily: tokens.typography.fontFamilyMono,
                  color: "#38bdf8",
                  backgroundColor: "#0c4a6e",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #0284c7",
                  cursor: "pointer"
                }}
              >
                CIT: {item.citation?.ref_id || "SIGNAL"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 2: What Disagrees */}
      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#fbbf24", letterSpacing: "0.08em", marginBottom: "14px" }}>
          SECTION 2 // WHAT DISAGREES (CROSS-SOURCE DIVERGENCE)
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "10px" }}>
          {brief?.what_disagrees?.map((item: any) => (
            <div
              key={item.id}
              style={{
                padding: "14px 16px",
                backgroundColor: "#451a0315",
                border: "1px solid #78350f",
                borderRadius: "6px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center"
              }}
            >
              <span style={{ fontSize: "13px", color: "#fde68a", fontWeight: "600" }}>{item.text}</span>
              <button
                onClick={() => setActiveCitation(item.citation)}
                style={{
                  fontSize: "10px",
                  fontFamily: tokens.typography.fontFamilyMono,
                  color: "#fbbf24",
                  backgroundColor: "#451a03",
                  padding: "4px 8px",
                  borderRadius: "4px",
                  border: "1px solid #92400e",
                  cursor: "pointer"
                }}
              >
                CIT: {item.citation?.ref_id || "OBSERVATION"}
              </button>
            </div>
          ))}
        </div>
      </div>

      {/* Section 3: Thesis Status */}
      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "20px" }}>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#f87171", letterSpacing: "0.08em", marginBottom: "14px" }}>
          SECTION 3 // THESIS FALSIFICATION EVALUATION
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {brief?.thesis_evaluations?.map((th: any) => (
            <div
              key={th.id}
              style={{
                padding: "16px",
                backgroundColor: "#450a0a15",
                border: "1px solid #991b1b",
                borderRadius: "6px",
                display: "flex",
                flexDirection: "column",
                gap: "8px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                <span style={{ fontWeight: "800", color: "#ffffff", fontSize: "14px" }}>{th.thesis_statement || th.statement}</span>
                <span style={{ fontSize: "11px", fontWeight: "900", color: "#f87171", backgroundColor: "#450a0a", padding: "2px 8px", borderRadius: "4px", border: "1px solid #991b1b" }}>
                  [{th.status}] CONFIDENCE: {th.confidence}%
                </span>
              </div>
              <div style={{ fontSize: "12px", color: "#fca5a5" }}>
                FALSIFICATION CONDITION: <strong>{th.falsification_condition}</strong>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
