-- MERIDIAN Database Migration: Phase 8 (Council Multi-Model Deliberations)

CREATE TABLE IF NOT EXISTS council_deliberations (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    brief_id UUID REFERENCES daily_briefs(id),
    prompt_context JSONB NOT NULL,
    model_responses JSONB NOT NULL,
    disagreement_matrix JSONB NOT NULL,
    consensus_summary TEXT NOT NULL,
    actionability_score INTEGER NOT NULL CHECK (actionability_score >= 0 AND actionability_score <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_council_created_at ON council_deliberations (created_at DESC);
