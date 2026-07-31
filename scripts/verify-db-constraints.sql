-- Verification SQL Queries and Expected Database Output

-- 1. Attempting to insert an observation with null licence_class:
INSERT INTO observations (
    id, source_id, pillar, entity_id, metric_key, value, raw_ref, licence_class, source_timestamp, captured_at
) VALUES (
    '00000000-0000-0000-0000-000000000001', 'fred', 'WORLD', NULL, 'UNEMPLOYMENT', 410, 'r2://payloads/001.json', NULL, NOW(), NOW()
);
/*
ERROR: null value in column "licence_class" of relation "observations" violates not-null constraint
DETAIL: Failing row contains (00000000-0000-0000-0000-000000000001, fred, WORLD, null, UNEMPLOYMENT, 410, r2://payloads/001.json, null, 2026-07-31 10:00:00+00, 2026-07-31 10:00:00+00).
*/

-- 2. Attempting to UPDATE an audit_log row:
UPDATE audit_log SET action = 'ALTERED' WHERE id = '00000000-0000-0000-0000-000000000001';
/*
ERROR: MERIDIAN Invariant Violation: audit_log is append-only. UPDATE and DELETE operations are forbidden.
CONTEXT: PL/pgSQL function prevent_audit_log_modification() line 3 at RAISE
*/
