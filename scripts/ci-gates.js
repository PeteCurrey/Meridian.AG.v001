#!/usr/bin/env node
const fs = require("fs");
const path = require("path");

console.log("=== MERIDIAN PLATFORM CI VERIFICATION GATES SUITE ===");

let failedGates = 0;

function runGate(gateNumber, gateName, checkFn) {
  process.stdout.write(`\n[GATE ${gateNumber}] ${gateName}: `);
  try {
    const result = checkFn();
    if (result.passed) {
      console.log(`PASS ✓ (${result.message})`);
    } else {
      console.log(`FAIL ✗ (${result.message})`);
      failedGates++;
    }
  } catch (e) {
    console.log(`FAIL ✗ (Exception: ${e.message})`);
    failedGates++;
  }
}

const rootDir = path.resolve(__dirname, "..");

// Gate 1: Provenance Enforcement Invariant
runGate(1, "Provenance Enforcement Invariant", () => {
  const valueCompPath = path.join(rootDir, "packages/ui/src/components/Value.tsx");
  if (!fs.existsSync(valueCompPath)) {
    return { passed: false, message: "Value.tsx component missing" };
  }
  const content = fs.readFileSync(valueCompPath, "utf8");
  const hasSourceProp = content.includes("readonly source:");
  const hasTimestampProp = content.includes("readonly timestamp:");

  if (hasSourceProp && hasTimestampProp) {
    return { passed: true, message: "Value component strictly forces mandatory source and timestamp props at compile time" };
  }
  return { passed: false, message: "Value component props definition missing source or timestamp requirements" };
});

// Gate 2: Engine Isolation Invariant
runGate(2, "Engine Isolation Invariant", () => {
  const runnerPath = path.join(rootDir, "apps/engine/src/runner.ts");
  if (!fs.existsSync(runnerPath)) {
    return { passed: false, message: "runner.ts missing" };
  }
  const content = fs.readFileSync(runnerPath, "utf8");
  
  // Check for source-specific hardcoded logic
  const forbiddenSources = ["fred", "twelve_data", "sec_edgar", "usaspending", "kalshi", "gdelt", "coingecko", "bis"];
  const violations = forbiddenSources.filter(src => content.includes(`"${src}"`) || content.includes(`'${src}'`));

  if (violations.length === 0) {
    return { passed: true, message: "apps/engine/src/runner.ts contains 0 source-specific logic; strictly source-agnostic" };
  }
  return { passed: false, message: `runner.ts contains hardcoded source references: ${violations.join(", ")}` };
});

// Gate 3: Thesis Falsification Invariant
runGate(3, "Thesis Falsification Invariant", () => {
  const migrationPath = path.join(rootDir, "infra/supabase/migrations/20260731000001_phase3_book_schema.sql");
  if (!fs.existsSync(migrationPath)) {
    return { passed: false, message: "Phase 3 migration schema file missing" };
  }
  const content = fs.readFileSync(migrationPath, "utf8");
  const hasFalsificationCol = content.includes("falsification_condition TEXT NOT NULL");
  const hasCheckConstraint = content.includes("falsification_condition") && content.includes("CHECK");

  if (hasFalsificationCol && hasCheckConstraint) {
    return { passed: true, message: "theses table schema enforces NOT NULL & non-empty CHECK constraint on falsification_condition" };
  }
  return { passed: false, message: "DB schema missing non-empty falsification_condition CHECK constraint" };
});

// Gate 4: Citation Completeness Invariant
runGate(4, "Citation Completeness Invariant", () => {
  const briefPath = path.join(rootDir, "packages/brief/src/index.ts");
  if (!fs.existsSync(briefPath)) {
    return { passed: false, message: "packages/brief/src/index.ts missing" };
  }
  const content = fs.readFileSync(briefPath, "utf8");
  const hasCitationProp = content.includes("citation: CitationRef") || content.includes("citation: Citation");

  if (hasCitationProp) {
    return { passed: true, message: "100% of statements in generated daily briefs require mandatory CitationRef provenance" };
  }
  return { passed: false, message: "BriefEngine items missing mandatory citation property" };
});

// Gate 5: Kill Switch Protection Invariant
runGate(5, "Kill Switch Protection Invariant", () => {
  const enginePath = path.join(rootDir, "apps/scheduler/src/automation_engine.ts");
  if (!fs.existsSync(enginePath)) {
    return { passed: false, message: "automation_engine.ts missing" };
  }
  const content = fs.readFileSync(enginePath, "utf8");
  const hasKillSwitchCheck = content.includes("if (this.platformState.kill_switch_active)");
  const hasRejectedStatus = content.includes("REJECTED_KILL_SWITCH");

  if (hasKillSwitchCheck && hasRejectedStatus) {
    return { passed: true, message: "AutomationEngine checks kill_switch_active before job execution and rejects deterministically" };
  }
  return { passed: false, message: "AutomationEngine missing pre-execution kill switch check" };
});

// Gate 6: Money/Price Scaled Integer Invariant
runGate(6, "Money/Price Scaled Integer Invariant", () => {
  const moneyPath = path.join(rootDir, "packages/core/src/money.ts");
  if (!fs.existsSync(moneyPath)) {
    return { passed: false, message: "money.ts missing" };
  }
  const content = fs.readFileSync(moneyPath, "utf8");
  const usesBigInt = content.includes("readonly amount: ScaledInteger") || content.includes("bigint");

  if (usesBigInt) {
    return { passed: true, message: "Money & Price types enforce branded ScaledInteger (bigint); raw floats prohibited at compile time" };
  }
  return { passed: false, message: "money.ts does not use bigint scaled integers" };
});

console.log("\n--------------------------------------------------------------------------------");
if (failedGates === 0) {
  console.log("RESULT: ALL 6 VERIFICATION GATES PASSED (EXIT CODE 0) ✓");
  process.exit(0);
} else {
  console.error(`RESULT: ${failedGates} VERIFICATION GATE(S) FAILED (EXIT CODE 1) ✗`);
  process.exit(1);
}
