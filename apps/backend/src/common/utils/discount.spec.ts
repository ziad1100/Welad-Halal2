import { describe, expect, it } from 'vitest';
import { computeDiscountAmount, discountError } from './discount';

describe('computeDiscountAmount', () => {
  it('percentage: 10% of 200 = 20', () => {
    expect(computeDiscountAmount('percentage', 10, 200)).toBe(20);
  });
  it('fixed: min(value, subtotal)', () => {
    expect(computeDiscountAmount('fixed_amount', 30, 200)).toBe(30);
    expect(computeDiscountAmount('fixed_amount', 500, 200)).toBe(200);
  });
});

describe('discountError', () => {
  const base = { isActive: true, validFrom: null, validTo: null, usageLimit: null, usedCount: 0 };
  it('rejects missing/inactive', () => {
    expect(discountError(null)).toBe('Invalid discount');
    expect(discountError({ ...base, isActive: false })).toBe('Invalid discount');
  });
  it('rejects expired code', () => {
    expect(discountError({ ...base, validTo: new Date('2000-01-01') })).toBe('Discount expired');
  });
  it('rejects not-started code', () => {
    expect(discountError({ ...base, validFrom: new Date('2999-01-01') })).toBe('Discount not started');
  });
  it('rejects exhausted usage limit', () => {
    expect(discountError({ ...base, usageLimit: 5, usedCount: 5 })).toBe('Discount exhausted');
  });
  it('accepts valid code', () => {
    expect(discountError(base)).toBeNull();
  });
});
