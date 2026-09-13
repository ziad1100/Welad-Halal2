import { describe, expect, it } from 'vitest';
import { computeAvgCost } from './costing';

describe('computeAvgCost (AVERAGE COST, not FIFO)', () => {
  it('first receipt sets cost', () => {
    expect(computeAvgCost(0, 0, 50, 20)).toBe(20);
  });
  it('blends two receipts: (50x20 + 50x30)/100 = 25', () => {
    expect(computeAvgCost(50, 20, 50, 30)).toBeCloseTo(25, 10);
  });
  it('weights by quantity', () => {
    expect(computeAvgCost(100, 10, 50, 40)).toBeCloseTo(20, 10);
  });
  it('falls back to incoming cost on empty stock', () => {
    expect(computeAvgCost(0, 99, 0, 7)).toBe(7);
  });
});
