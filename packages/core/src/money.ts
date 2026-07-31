declare const ScaledBrand: unique symbol;
export type ScaledInteger = bigint & { readonly [ScaledBrand]: true };

export function toScaledInteger(val: bigint): ScaledInteger {
  return val as ScaledInteger;
}

export interface Money {
  readonly amount: ScaledInteger;
  readonly currency: string;
  readonly scale: number; // e.g. 2 for cents (100 = $1.00), 4 for basis points
}

export interface Price {
  readonly value: ScaledInteger;
  readonly decimals: number;
  readonly currency: string;
}

/**
 * Construct Money from a scaled bigint.
 * Constructing from a float (number) is a TypeScript compile-time error.
 */
export function createMoney(amount: bigint, currency: string, scale = 2): Money {
  return {
    amount: toScaledInteger(amount),
    currency: currency.toUpperCase(),
    scale
  };
}

/**
 * Construct Price from a scaled bigint.
 * Constructing from a float (number) is a TypeScript compile-time error.
 */
export function createPrice(value: bigint, decimals: number, currency: string): Price {
  return {
    value: toScaledInteger(value),
    decimals,
    currency: currency.toUpperCase()
  };
}

export const MoneyHelpers = {
  add(a: Money, b: Money): Money {
    if (a.currency !== b.currency || a.scale !== b.scale) {
      throw new Error(`Cannot add incompatible Money values: ${a.currency}/${a.scale} vs ${b.currency}/${b.scale}`);
    }
    return createMoney(a.amount + b.amount, a.currency, a.scale);
  },

  subtract(a: Money, b: Money): Money {
    if (a.currency !== b.currency || a.scale !== b.scale) {
      throw new Error(`Cannot subtract incompatible Money values: ${a.currency}/${a.scale} vs ${b.currency}/${b.scale}`);
    }
    return createMoney(a.amount - b.amount, a.currency, a.scale);
  },

  multiply(m: Money, multiplier: bigint): Money {
    return createMoney(m.amount * multiplier, m.currency, m.scale);
  },

  divide(m: Money, divisor: bigint): Money {
    if (divisor === 0n) {
      throw new Error("Division by zero in MoneyHelpers.divide");
    }
    return createMoney(m.amount / divisor, m.currency, m.scale);
  }
};
