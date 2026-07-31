-- MERIDIAN Initial Database Migration
-- Phase 0: Schema Foundation & Provenance Invariants

CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- 1. Sources Registry Table
CREATE TABLE IF NOT EXISTS sources (
    id VARCHAR(64) PRIMARY KEY,
    name TEXT NOT NULL,
    pillar VARCHAR(32) NOT NULL CHECK (pillar IN ('WORLD', 'MARKETS', 'HORIZON', 'UNDERCURRENT', 'ALTERNATIVES')),
    category TEXT NOT NULL,
    cadence VARCHAR(32) NOT NULL CHECK (cadence IN ('REALTIME', 'HOURLY', 'DAILY', 'WEEKLY', 'MONTHLY', 'ON_DEMAND')),
    licence_class VARCHAR(64) NOT NULL CHECK (licence_class IN ('PUBLIC_DOMAIN', 'CREATIVE_COMMONS', 'COMMERCIAL_REDISTRIBUTABLE', 'COMMERCIAL_INTERNAL_ONLY', 'PROPRIETARY')),
    redistributable BOOLEAN NOT NULL DEFAULT FALSE,
    auth_method VARCHAR(32) NOT NULL,
    base_url TEXT NOT NULL,
    quota_per_month INTEGER,
    cost_model VARCHAR(32) NOT NULL,
    staleness_sla_seconds INTEGER NOT NULL,
    wave_number INTEGER NOT NULL,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Entities Table
CREATE TABLE IF NOT EXISTS entities (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    name TEXT NOT NULL,
    type VARCHAR(32) NOT NULL CHECK (type IN ('COMPANY', 'INSTRUMENT', 'PERSON', 'GOVERNMENT_BODY', 'THEME', 'COMMODITY', 'LOCATION', 'EVENT')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Entity Identifiers Table
CREATE TABLE IF NOT EXISTS entity_identifiers (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    scheme VARCHAR(32) NOT NULL CHECK (scheme IN ('LEI', 'CIK', 'ISIN', 'TICKER', 'COMPANIES_HOUSE', 'EXCHANGE_SYMBOL', 'INTERNAL')),
    value TEXT NOT NULL,
    source TEXT NOT NULL,
    confidence NUMERIC(3,2) NOT NULL CHECK (confidence >= 0.0 AND confidence <= 1.0),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    UNIQUE(scheme, value)
);

-- 4. Partitioned Observations Table
-- Must be partitioned by month. DB CHECK constraints enforce NOT NULL on licence_class, pillar, source_timestamp, captured_at.
CREATE TABLE IF NOT EXISTS observations (
    id UUID NOT NULL DEFAULT uuid_generate_v4(),
    source_id VARCHAR(64) NOT NULL REFERENCES sources(id),
    pillar VARCHAR(32) NOT NULL CHECK (pillar IN ('WORLD', 'MARKETS', 'HORIZON', 'UNDERCURRENT', 'ALTERNATIVES')),
    entity_id UUID REFERENCES entities(id),
    metric_key TEXT NOT NULL,
    value BIGINT NOT NULL, -- Scaled integer representation
    raw_ref TEXT NOT NULL,
    licence_class VARCHAR(64) NOT NULL CHECK (licence_class IN ('PUBLIC_DOMAIN', 'CREATIVE_COMMONS', 'COMMERCIAL_REDISTRIBUTABLE', 'COMMERCIAL_INTERNAL_ONLY', 'PROPRIETARY')),
    source_timestamp TIMESTAMPTZ NOT NULL,
    captured_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    PRIMARY KEY (id, captured_at)
) PARTITION BY RANGE (captured_at);

-- Initial Partition Examples
CREATE TABLE IF NOT EXISTS observations_2026_07 PARTITION OF observations
    FOR VALUES FROM ('2026-07-01 00:00:00+00') TO ('2026-08-01 00:00:00+00');

CREATE TABLE IF NOT EXISTS observations_2026_08 PARTITION OF observations
    FOR VALUES FROM ('2026-08-01 00:00:00+00') TO ('2026-09-01 00:00:00+00');

-- 5. Source Health Table
CREATE TABLE IF NOT EXISTS source_health (
    source_id VARCHAR(64) PRIMARY KEY REFERENCES sources(id),
    status VARCHAR(32) NOT NULL CHECK (status IN ('HEALTHY', 'DEGRADED', 'OFFLINE', 'NOT_CONNECTED')),
    last_successful_fetch TIMESTAMPTZ,
    error_rate_24h NUMERIC(5,2) NOT NULL DEFAULT 0.0,
    rows_written_last_window INTEGER NOT NULL DEFAULT 0,
    quota_consumed_mtd INTEGER NOT NULL DEFAULT 0,
    cost_mtd_usd_scaled BIGINT NOT NULL DEFAULT 0,
    last_checked_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 6. Spend Table
CREATE TABLE IF NOT EXISTS spend (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    source_id VARCHAR(64) NOT NULL REFERENCES sources(id),
    request_count INTEGER NOT NULL,
    cost_usd_scaled BIGINT NOT NULL,
    recorded_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 7. Append-Only Audit Log Table
CREATE TABLE IF NOT EXISTS audit_log (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    actor TEXT NOT NULL,
    action TEXT NOT NULL,
    target_resource TEXT NOT NULL,
    payload JSONB,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Trigger Function to Block UPDATE and DELETE on audit_log
CREATE OR REPLACE FUNCTION prevent_audit_log_modification()
RETURNS TRIGGER AS $$
BEGIN
    RAISE EXCEPTION 'MERIDIAN Invariant Violation: audit_log is append-only. UPDATE and DELETE operations are forbidden.';
END;
$$ LANGUAGE plpgsql;

CREATE OR REPLACE TRIGGER audit_log_append_only_trigger
BEFORE UPDATE OR DELETE ON audit_log
FOR EACH ROW
EXECUTE FUNCTION prevent_audit_log_modification();
