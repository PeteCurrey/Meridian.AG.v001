-- MERIDIAN Database Migration: Phase 5 (Signals & Edge Engine)

CREATE TABLE IF NOT EXISTS signals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    signal_type VARCHAR(32) NOT NULL CHECK (signal_type IN ('DELTA', 'DISAGREEMENT', 'ANOMALY', 'ABSENCE')),
    canonical_metric_key TEXT NOT NULL,
    pillar VARCHAR(32) NOT NULL,
    severity VARCHAR(16) NOT NULL CHECK (severity IN ('INFO', 'WARN', 'ALERT', 'CRITICAL')),
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    primary_source_id TEXT NOT NULL,
    secondary_source_id TEXT,
    delta_value NUMERIC,
    z_score NUMERIC(6,2),
    divergence_pct NUMERIC(6,4),
    overrun_seconds INTEGER,
    narrative_summary TEXT NOT NULL,
    linked_entity_id UUID REFERENCES entities(id),
    touches_thesis_falsification BOOLEAN NOT NULL DEFAULT FALSE,
    salience_score NUMERIC(8,2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'UNREAD' CHECK (status IN ('UNREAD', 'ACKNOWLEDGED', 'ACTIONED', 'DISMISSED')),
    detected_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

CREATE INDEX IF NOT EXISTS idx_signals_salience ON signals (salience_score DESC);
CREATE INDEX IF NOT EXISTS idx_signals_detected_at ON signals (detected_at DESC);
CREATE INDEX IF NOT EXISTS idx_signals_status ON signals (status);
CREATE INDEX IF NOT EXISTS idx_signals_metric ON signals (canonical_metric_key);
