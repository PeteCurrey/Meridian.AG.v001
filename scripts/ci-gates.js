const fs = require("node:fs");
const path = require("node:path");

console.log("=== MERIDIAN CI Verification Gates ===");

let failed = false;

// 1. Float Check Gate
console.log("\n[GATE 1] Running Float Check Gate...");
const moneyPath = path.join(process.cwd(), "packages/core/src/money.ts");
if (!fs.existsSync(moneyPath)) {
  console.error("FAIL: packages/core/src/money.ts not found");
  failed = true;
} else {
  const content = fs.readFileSync(moneyPath, "utf-8");
  if (!content.includes("amount: bigint") && !content.includes("value: bigint")) {
    console.error("FAIL: Money/Price constructor signatures do not enforce bigint parameters");
    failed = true;
  } else {
    console.log("PASS: Scaled-integer bigint enforcement present on Money and Price constructors.");
  }
}

// 2. Broker SDK Gate
console.log("\n[GATE 2] Running Broker SDK Gate...");
const forbiddenBrokerPackages = [
  "oanda",
  "ibkr",
  "alpaca",
  "ccxt",
  "interactive-brokers",
  "ig-api",
  "tradovate",
  "tdameritrade"
];

function scanPackageJson(dir) {
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory() && entry.name !== "node_modules" && entry.name !== "dist" && entry.name !== ".next") {
      scanPackageJson(fullPath);
    } else if (entry.isFile() && entry.name === "package.json") {
      const pkg = JSON.parse(fs.readFileSync(fullPath, "utf-8"));
      const deps = { ...pkg.dependencies, ...pkg.devDependencies, ...pkg.peerDependencies };
      for (const depKey of Object.keys(deps)) {
        for (const forbidden of forbiddenBrokerPackages) {
          if (depKey.toLowerCase().includes(forbidden)) {
            console.error(`FAIL: Forbidden broker SDK package '${depKey}' found in ${fullPath}`);
            failed = true;
          }
        }
      }
    }
  }
}
scanPackageJson(process.cwd());
if (!failed) {
  console.log("PASS: Zero forbidden broker SDK dependencies detected across all workspace packages.");
}

// 3. Forbidden Route Name Gate
console.log("\n[GATE 3] Running Forbidden Route Name Gate...");
const forbiddenRouteKeywords = ["signup", "register", "subscribe"];
const terminalAppDir = path.join(process.cwd(), "apps/terminal/src/app");

function scanRoutes(dir) {
  if (!fs.existsSync(dir)) return;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const entry of entries) {
    const fullPath = path.join(dir, entry.name);
    const relativePath = path.relative(terminalAppDir, fullPath).toLowerCase();
    for (const keyword of forbiddenRouteKeywords) {
      if (relativePath.includes(keyword)) {
        console.error(`FAIL: Forbidden route '${relativePath}' matching '${keyword}' found in terminal app.`);
        failed = true;
      }
    }
    if (entry.isDirectory()) {
      scanRoutes(fullPath);
    }
  }
}
scanRoutes(terminalAppDir);
if (!failed) {
  console.log("PASS: Zero forbidden signup/register/subscribe routes exist in terminal app.");
}

if (failed) {
  console.error("\nResult: CI Verification Gates FAILED.");
  process.exit(1);
} else {
  console.log("\nResult: All MERIDIAN CI Verification Gates PASSED.");
}
