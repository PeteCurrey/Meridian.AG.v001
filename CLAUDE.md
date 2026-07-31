# CLAUDE.md — MERIDIAN Platform Specification & Binding Rules

## 1. Core Platform Architecture & Stack
- **Monorepo Architecture**: pnpm workspaces + Turborepo + TypeScript (strict mode).
- **Applications**:
  - `apps/terminal`: Next.js 15 App Router (Single authenticated shell UI).
  - `apps/engine`: Node worker runner for ingestion, pipeline, and background jobs.
  - `apps/scheduler`: Node process for cadence and cron scheduling.
- **Packages**:
  - `packages/core`: Core types (`Observation`, `Pillar`, `Entity`, `Money`, `Price`, `Result<T,E>`, etc.).
  - `packages/registry`: Source metadata registry.
  - `packages/adapters`: Ingestion source adapters.
  - `packages/resolve`: Entity resolution engine.
  - `packages/signals`: Signal calculation primitives.
  - `packages/council`: Multi-LLM Council orchestration.
  - `packages/delta`: Change detection engine.
  - `packages/salience`: Deterministic scoring (0-100).
  - `packages/edge`: Opportunity board logic.
  - `packages/horizon`: Forward event timeline model.
  - `packages/risk`: Risk controls and position checks.
  - `packages/execute`: Execution gate and ticket management.
  - `packages/brief`: Executive daily intelligence summary.
  - `packages/automation`: Rule engine and tier triggers.
  - `packages/ui`: Design tokens and core component library.
- **Database & Infrastructure**:
  - Supabase (PostgreSQL with strict schema checks and partitioned tables).
  - Cloudflare R2 (or compatible object store) for raw payload persistence (`raw_ref`).

---

## 2. Type System & Invariants (`packages/core`)

### Pillars
```ts
export enum Pillar {
  WORLD = "WORLD",
  MARKETS = "MARKETS",
  HORIZON = "HORIZON",
  UNDERCURRENT = "UNDERCURRENT",
  ALTERNATIVES = "ALTERNATIVES"
}
```

### Observation Model
```ts
export interface Observation {
  id: string;
  source_id: string;
  pillar: Pillar;
  entity_id: string | null;
  metric_key: string;
  value: ScaledInteger;
  raw_ref: string;
  licence_class: LicenceClass;
  source_timestamp: string; // ISO-8601
  captured_at: string; // ISO-8601
}
```

### Money & Price Type Safety
- Money and Price are represented as scaled integers (BigInt).
- **Constructing Money or Price from a floating-point number is a TypeScript compile-time error**.
- Float construction must be prevented using branded nominal types:
```ts
export type ScaledInteger = bigint & { readonly __brand: unique symbol };
export type Money = { readonly amount: ScaledInteger; readonly currency: string };
export type Price = { readonly value: ScaledInteger; readonly decimals: number };
```

### Result Pattern
- **No thrown errors across package boundaries**. All package APIs must return `Result<T, E>`:
```ts
export type Result<T, E = Error> =
  | { ok: true; value: T }
  | { ok: false; error: E };
```

---

## 3. Database Constraints & Schema (`infra/supabase`)
- Database tables: `sources`, `entities`, `entity_identifiers`, `observations`, `source_health`, `spend`, `audit_log`.
- `observations` table MUST be partitioned by month.
- Database-level CHECK constraints:
  - `NOT NULL` on `licence_class`, `pillar`, `source_timestamp`, `captured_at`.
- Append-only `audit_log`:
  - Enforced by a DB trigger blocking `UPDATE` and `DELETE` queries.

---

## 4. CI Gates & Binding Constraints
1. **Float Check Gate**: Static analysis/TypeScript check failing the build if `Money` or `Price` is instantiated with standard `number` floats.
2. **Broker SDK Gate**: Fails build if any broker SDK (e.g. `oanda`, `ibkr`, `alpaca`, `ccxt`) is present in `package.json`.
3. **Forbidden Route Gate**: Fails build if any signup, registration, or subscription route (`signup`, `register`, `subscribe`) exists in `apps/terminal`.
4. **No Mock Data**: Test fixtures must live under `__fixtures__` and be explicitly synthetic.
5. **No Signup Route**: The application is single-user, protected by Supabase Auth and TOTP 2FA. Signup routes must not exist.

---

## 5. UI & Design System (`packages/ui`)
- Theme: Dark terminal aesthetic.
- Color Tokens:
  - Background: `#0a0a0c`
  - Text Primary: `#e0e0e0`
  - Accent Green: `#00ff88`
  - Amber / Warning: `#ffaa00`
  - Red / Offline: `#ff4444`
  - Border Hairline: `#1e1e24`
- Typography: Monospaced numeric styling (`JetBrains Mono`, `Geist Mono`, or system monospaced).
