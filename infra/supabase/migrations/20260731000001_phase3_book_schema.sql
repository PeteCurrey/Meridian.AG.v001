-- MERIDIAN Database Migration: Phase 3 (The Book & Entity Graph Ledger)

-- 1. Watchlist Table
CREATE TABLE IF NOT EXISTS watchlist (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_id UUID NOT NULL REFERENCES entities(id) ON DELETE CASCADE,
    why_watched TEXT NOT NULL,
    review_date DATE NOT NULL,
    added_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 2. Positions Table (Manual entry phase; broker sync comes in Phase 11)
CREATE TABLE IF NOT EXISTS positions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    instrument_symbol TEXT NOT NULL,
    direction VARCHAR(16) NOT NULL CHECK (direction IN ('LONG', 'SHORT')),
    size_scaled BIGINT NOT NULL,
    entry_price_scaled BIGINT NOT NULL,
    risk_state TEXT NOT NULL DEFAULT 'HEALTHY',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 3. Theses Table (MANDATORY Falsification Condition DB Constraint)
CREATE TABLE IF NOT EXISTS theses (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    text TEXT NOT NULL,
    linked_entity_ids UUID[] NOT NULL DEFAULT '{}',
    -- Invariant Enforced at Database Level: A thesis without a non-empty falsification condition cannot be saved.
    falsification_condition TEXT NOT NULL CHECK (LENGTH(TRIM(falsification_condition)) > 0),
    review_date DATE NOT NULL,
    confidence INTEGER NOT NULL CHECK (confidence >= 0 AND confidence <= 100),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 4. Standing Questions Table
CREATE TABLE IF NOT EXISTS standing_questions (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    question_text TEXT NOT NULL,
    category TEXT NOT NULL,
    cadence VARCHAR(32) NOT NULL DEFAULT 'WEEKLY',
    active BOOLEAN NOT NULL DEFAULT TRUE,
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- 5. Entity Merge Audit Ledger Table
CREATE TABLE IF NOT EXISTS entity_merge_audit (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    primary_entity_id UUID NOT NULL REFERENCES entities(id),
    merged_entity_id UUID NOT NULL REFERENCES entities(id),
    rule_id TEXT NOT NULL,
    matched_identifier TEXT NOT NULL,
    merged_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
    status VARCHAR(32) NOT NULL DEFAULT 'ACTIVE' CHECK (status IN ('ACTIVE', 'REVERSED'))
);

-- 6. Merge Proposals Table (Fuzzy name matches requiring manual confirmation)
CREATE TABLE IF NOT EXISTS merge_proposals (
    id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
    entity_a_id UUID NOT NULL REFERENCES entities(id),
    entity_b_id UUID NOT NULL REFERENCES entities(id),
    candidate_name TEXT NOT NULL,
    match_confidence NUMERIC(3,2) NOT NULL,
    status VARCHAR(32) NOT NULL DEFAULT 'PENDING' CHECK (status IN ('PENDING', 'CONFIRMED', 'REJECTED')),
    created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);
