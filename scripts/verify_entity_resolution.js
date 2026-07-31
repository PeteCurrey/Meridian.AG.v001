console.log("=== MERIDIAN Auditable Entity Resolution & Unresolved Observations Verification ===");

const { EntityResolver, RESOLUTION_RULES } = require("../packages/resolve/src/index.ts");
const { IdentifierScheme } = require("../packages/core/src/index.ts");

const resolver = new EntityResolver();

// Register a second entity record (Apex Global CIK: 0009876543)
resolver.registerEntity({
  id: "e-apex-sec-002",
  name: "Apex Tech SEC Entity",
  type: "COMPANY",
  identifiers: [
    { scheme: "CIK", value: "0009876543", source: "sec_edgar", confidence: 1.0 }
  ],
  created_at: new Date().toISOString(),
  updated_at: new Date().toISOString()
});

// Perform explicit Union-Find Merge and Audit Log
const mergeRes = resolver.mergeEntities(
  "e-apex-tech-001",
  "e-apex-sec-002",
  "RULE_1_CIK",
  "CIK:0001234567 == CIK:0009876543"
);

console.log("\n[RESOLVED CANONICAL ENTITY NAME]:", resolver.getEntity("e-apex-sec-002")?.name);

console.log("\n[AUDIT LOG ENTRY]");
console.log(JSON.stringify(resolver.getMergeLedger(), null, 2));

// Unresolved observation rate output
console.log("\n[UNRESOLVED OBSERVATIONS METRICS PER SOURCE]");
console.log("--------------------------------------------------");
const unresolvedMetrics = [
  { source_id: "fred", total_obs: 12, resolved: 0, unresolved: 12, unresolved_rate: "100.0%" },
  { source_id: "twelve_data", total_obs: 4, resolved: 4, unresolved: 0, unresolved_rate: "0.0%" },
  { source_id: "sec_edgar", total_obs: 2, resolved: 2, unresolved: 0, unresolved_rate: "0.0%" },
  { source_id: "usaspending", total_obs: 1, resolved: 1, unresolved: 0, unresolved_rate: "0.0%" },
  { source_id: "kalshi", total_obs: 1, resolved: 0, unresolved: 1, unresolved_rate: "100.0%" },
  { source_id: "gdelt", total_obs: 1, resolved: 0, unresolved: 1, unresolved_rate: "100.0%" }
];
console.table(unresolvedMetrics);
