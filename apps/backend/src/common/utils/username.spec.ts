import { describe, expect, it } from 'vitest';
import { isValidUsername, normalizeUsername } from './username';

describe('normalizeUsername', () => {
  it('trims and collapses internal spaces', () => {
    expect(normalizeUsername('  Ahmed   Elseyad  ')).toBe('Ahmed Elseyad');
  });
  it('treats double-space variant as identical (no duplicate accounts)', () => {
    expect(normalizeUsername('احمد  الصياد')).toBe(normalizeUsername('احمد الصياد'));
  });
  it('never requires email format', () => {
    expect(normalizeUsername('Ahmed Elseyad')).toBe('Ahmed Elseyad');
    expect(normalizeUsername('Ahmed Elseyad')).not.toContain('@');
  });
});

describe('isValidUsername', () => {
  it('enforces minimum length only', () => {
    expect(isValidUsername('ab')).toBe(false);
    expect(isValidUsername('abc')).toBe(true);
    expect(isValidUsername('Ahmed Elseyad')).toBe(true);
  });
});
