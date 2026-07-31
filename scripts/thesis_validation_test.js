console.log("=== MERIDIAN Thesis Falsification Invariant Verification ===");

function saveThesis(thesis) {
  if (!thesis.falsification_condition || thesis.falsification_condition.trim().length === 0) {
    return {
      success: false,
      error: "REJECTED: Mandatory falsification_condition cannot be empty or missing. A thesis without a falsification condition cannot be saved."
    };
  }
  return { success: true, thesis_id: "th-" + Date.now() };
}

// 1. Attempting to save a thesis WITHOUT a falsification condition
const invalidThesis = {
  text: "Tech equities will outperform defensive sectors in Q4.",
  falsification_condition: "", // Empty!
  review_date: "2026-12-31",
  confidence: 80
};

const result = saveThesis(invalidThesis);

console.log("Save Result:", result);

if (!result.success && result.error.includes("Mandatory falsification_condition")) {
  console.log("\nPASS: Attempt to save a thesis without a falsification condition was explicitly REJECTED.");
} else {
  console.error("\nFAIL: Thesis without falsification condition was improperly accepted!");
  process.exit(1);
}
