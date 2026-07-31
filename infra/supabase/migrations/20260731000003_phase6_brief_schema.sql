-- MERIDIAN Database Migration: Phase 6 (Daily Briefs & Citation Graph)

CREATE TABLE IF NOT EXISTS daily_briefs (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    window_start TIMESTAMPTZ NOT NULL,
    window_end TIMESTAMPTZ NOT NULL,
    executive_summary TEXT NOT NULL,
    sections_json JSONB NOT NULL,
    citation_index JSONB NOT NULL,
    generated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_daily_briefs_window ON daily_briefs (window_start DESC, window_end DESC);
