import test from "node:test";
import assert from "node:assert/strict";
import { createMoney, MoneyHelpers } from "./money";

test("Money constructed with bigint scaled integer works properly", () => {
  const m1 = createMoney(1000n, "USD", 2); // $10.00
  const m2 = createMoney(550n, "USD", 2);  // $5.50

  const sum = MoneyHelpers.add(m1, m2);
  assert.equal(sum.amount, 1550n);
  assert.equal(sum.currency, "USD");

  const diff = MoneyHelpers.subtract(m1, m2);
  assert.equal(diff.amount, 450n);
});
