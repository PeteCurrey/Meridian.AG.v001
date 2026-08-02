"use client";

import React, { useEffect, useState } from "react";
import { tokens } from "@meridian/ui";

interface Thesis {
  id: string;
  text: string;
  falsification_condition: string;
  review_date: string;
  confidence: number;
}

export default function BookPage() {
  const [theses, setTheses] = useState<Thesis[]>([]);
  const [loading, setLoading] = useState(true);
  const [formText, setFormText] = useState("");
  const [formFalsification, setFormFalsification] = useState("");
  const [formConfidence, setFormConfidence] = useState(75);
  const [error, setError] = useState("");
  const [submitting, setSubmitting] = useState(false);

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

  useEffect(() => { fetchTheses(); }, []);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError("");
    if (!formFalsification.trim()) {
      setError("REJECTED: A thesis without a falsification condition cannot be submitted. Define what would prove you wrong.");
      return;
    }
    try {
      setSubmitting(true);
      const res = await fetch("/api/book", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ text: formText, falsification_condition: formFalsification, confidence: formConfidence })
      });
      if (!res.ok) {
        const data = await res.json();
        setError(data.error || "Submission failed.");
      } else {
        setFormText("");
        setFormFalsification("");
        setFormConfidence(75);
        fetchTheses();
      }
    } catch (e) {
      setError("Network error during submission.");
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div style={{ backgroundColor: "transparent", color: "#f8fafc", fontFamily: tokens.typography.fontFamilySans, minHeight: "100%", display: "flex", flexDirection: "column", gap: "24px" }}>
      {/* Header */}
      <div>
        <div style={{ display: "flex", alignItems: "center", gap: "8px", marginBottom: "4px" }}>
          <span style={{ fontSize: "10px", fontWeight: "800", color: "#16a34a", backgroundColor: "#16a34a20", border: "1px solid #16a34a40", padding: "2px 8px", borderRadius: "4px" }}>
            INVESTMENT THESIS REGISTRY
          </span>
          <span style={{ fontSize: "11px", color: "#64748b", fontFamily: tokens.typography.fontFamilyMono }}>Falsification-Enforced Conviction Tracking</span>
        </div>
        <h1 style={{ margin: 0, fontSize: "24px", fontWeight: "800", color: "#ffffff" }}>The Book // Standing Theses</h1>
        <p style={{ margin: "4px 0 0 0", color: "#94a3b8", fontSize: "13px" }}>
          Every thesis requires a mandatory falsification condition. Define what would prove you wrong — discipline enforced by the engine.
        </p>
      </div>

      {/* Thesis Submission Form */}
      <div style={{ backgroundColor: "#0f172a", border: "1px solid #1e293b", borderRadius: "8px", padding: "24px" }}>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", letterSpacing: "0.08em", marginBottom: "16px" }}>
          SUBMIT NEW INVESTMENT THESIS
        </div>

        {error && (
          <div style={{ padding: "12px 16px", backgroundColor: "#450a0a", border: "1px solid #991b1b", borderRadius: "6px", color: "#fca5a5", fontSize: "13px", fontWeight: "600", marginBottom: "16px" }}>
            🚨 {error}
          </div>
        )}

        <form onSubmit={handleSubmit} style={{ display: "flex", flexDirection: "column", gap: "14px" }}>
          <div>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", display: "block", marginBottom: "6px", letterSpacing: "0.06em" }}>
              THESIS STATEMENT
            </label>
            <textarea
              value={formText}
              onChange={(e) => setFormText(e.target.value)}
              required
              rows={3}
              placeholder="e.g. US Fed will cut rates in Q4 2026 due to cooling labor market dynamics..."
              style={{
                width: "100%", boxSizing: "border-box", padding: "12px 14px",
                backgroundColor: "#090d16", border: "1px solid #334155", borderRadius: "6px",
                color: "#f8fafc", fontSize: "13px", resize: "vertical", outline: "none", lineHeight: 1.5
              }}
            />
          </div>

          <div>
            <label style={{ fontSize: "11px", fontWeight: "700", color: "#f87171", display: "block", marginBottom: "6px", letterSpacing: "0.06em" }}>
              FALSIFICATION CONDITION (MANDATORY)
            </label>
            <textarea
              value={formFalsification}
              onChange={(e) => setFormFalsification(e.target.value)}
              required
              rows={2}
              placeholder="Define exactly what observable data would PROVE THIS THESIS WRONG..."
              style={{
                width: "100%", boxSizing: "border-box", padding: "12px 14px",
                backgroundColor: "#090d16", border: "1px solid #991b1b", borderRadius: "6px",
                color: "#f8fafc", fontSize: "13px", resize: "vertical", outline: "none", lineHeight: 1.5
              }}
            />
          </div>

          <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
            <div style={{ flex: 1 }}>
              <label style={{ fontSize: "11px", fontWeight: "700", color: "#64748b", display: "block", marginBottom: "6px", letterSpacing: "0.06em" }}>
                CONVICTION SCORE: {formConfidence}%
              </label>
              <input
                type="range" min={5} max={99} value={formConfidence}
                onChange={(e) => setFormConfidence(parseInt(e.target.value))}
                style={{ width: "100%", accentColor: "#16a34a" }}
              />
            </div>

            <button
              type="submit"
              disabled={submitting || !formText.trim()}
              style={{
                padding: "12px 24px", backgroundColor: "#16a34a", color: "#ffffff",
                fontWeight: "800", fontSize: "13px", border: "none", borderRadius: "6px",
                cursor: "pointer", alignSelf: "flex-end"
              }}
            >
              {submitting ? "Committing..." : "📖 Commit Thesis to The Book"}
            </button>
          </div>
        </form>
      </div>

      {/* Thesis Registry */}
      <div>
        <div style={{ fontSize: "12px", fontWeight: "800", color: "#38bdf8", letterSpacing: "0.08em", marginBottom: "12px" }}>
          STANDING THESIS REGISTRY ({theses.length})
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: "12px" }}>
          {theses.map((thesis) => (
            <div
              key={thesis.id}
              style={{
                backgroundColor: "#0f172a", border: "1px solid #1e293b",
                borderRadius: "8px", padding: "20px", display: "flex", flexDirection: "column", gap: "12px"
              }}
            >
              <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
                <div style={{ fontSize: "14px", fontWeight: "700", color: "#ffffff", maxWidth: "70%", lineHeight: 1.4 }}>
                  {thesis.text}
                </div>
                <div style={{ display: "flex", gap: "8px" }}>
                  <span style={{
                    fontSize: "12px", fontWeight: "800", fontFamily: tokens.typography.fontFamilyMono,
                    color: thesis.confidence >= 80 ? "#4ade80" : thesis.confidence >= 60 ? "#fbbf24" : "#f87171",
                    backgroundColor: "#1e293b", padding: "4px 10px", borderRadius: "4px", border: "1px solid #334155"
                  }}>
                    CONVICTION: {thesis.confidence}%
                  </span>
                  <span style={{ fontSize: "12px", fontWeight: "600", color: "#64748b", backgroundColor: "#1e293b", padding: "4px 10px", borderRadius: "4px", border: "1px solid #334155" }}>
                    REVIEW: {thesis.review_date}
                  </span>
                </div>
              </div>

              <div style={{ padding: "10px 14px", backgroundColor: "#450a0a20", border: "1px solid #7f1d1d", borderRadius: "6px" }}>
                <span style={{ fontSize: "10px", fontWeight: "800", color: "#f87171", letterSpacing: "0.08em" }}>FALSIFICATION TRIGGER: </span>
                <span style={{ fontSize: "13px", color: "#fca5a5" }}>{thesis.falsification_condition}</span>
              </div>

              <div style={{ display: "flex", gap: "8px" }}>
                <a href="/council" style={{ padding: "6px 12px", backgroundColor: "#4f46e5", color: "#fff", borderRadius: "4px", fontSize: "11px", fontWeight: "700", textDecoration: "none" }}>
                  🧠 Stress Test with AI Council
                </a>
                <a href="/edge" style={{ padding: "6px 12px", backgroundColor: "#1e293b", color: "#38bdf8", border: "1px solid #334155", borderRadius: "4px", fontSize: "11px", fontWeight: "700", textDecoration: "none" }}>
                  ⚡ Check for Falsification Signals
                </a>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
