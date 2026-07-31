-- MERIDIAN Database Migration: Phase 7 (Platform State & Automation Engine)

CREATE TABLE IF NOT EXISTS platform_state (
    id VARCHAR(32) PRIMARY KEY DEFAULT 'MAIN',
    kill_switch_active BOOLEAN NOT NULL DEFAULT FALSE,
    current_tier VARCHAR(32) NOT NULL DEFAULT 'TIER_1_WATCH',
    updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Seed initial platform state row
INSERT INTO platform_state (id, kill_switch_active, current_tier, updated_at)
VALUES ('MAIN', FALSE, 'TIER_1_WATCH', NOW())
ON CONFLICT (id) DO NOTHING;
