import { describe, expect, it } from 'vitest';
import { minLevelFor, routeForRole } from './routing';

describe('routeForRole', () => {
  it('employee → cashier only', () => {
    expect(routeForRole('employee', false)).toBe('/cashier');
  });
  it('manager/owner → orders shell', () => {
    expect(routeForRole('manager', false)).toBe('/orders');
    expect(routeForRole('owner', false)).toBe('/orders');
  });
  it('forced password change wins', () => {
    expect(routeForRole('owner', true)).toBe('/change-password');
    expect(routeForRole('employee', true)).toBe('/change-password');
  });
});

describe('minLevelFor', () => {
  it('manager modules require 50', () => {
    for (const p of ['/orders', '/inventory', '/purchases', '/suppliers', '/manufacturing', '/reports', '/hr', '/admin']) {
      expect(minLevelFor(p)).toBe(50);
    }
  });
  it('cashier/pending allow level 10', () => {
    expect(minLevelFor('/cashier')).toBe(10);
    expect(minLevelFor('/pending')).toBe(10);
  });
});
