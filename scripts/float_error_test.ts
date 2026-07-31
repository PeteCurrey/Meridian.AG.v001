import { createMoney } from "../packages/core/src/money.ts";

// Attempting to construct Money from a float (10.50):
// @ts-expect-error - Constructing Money from a float produces a TypeScript compile-time error
const invalidMoney = createMoney(10.50, "USD");
