import { beforeEach, describe, expect, it } from 'vitest';
import { useCart } from './cartStore';

beforeEach(() => useCart.getState().clear());

describe('cartStore', () => {
  it('adds a line and computes subtotal', () => {
    useCart.getState().addLine({ productId: 'p1', unitId: null, name: 'Rice', unitName: 'قطاعي', price: 50, qty: 2 });
    expect(useCart.getState().subtotal()).toBe(100);
    expect(useCart.getState().count()).toBe(2);
  });
  it('merges same product+unit, keeps units distinct', () => {
    const s = useCart.getState();
    s.addLine({ productId: 'p1', unitId: null, name: 'Rice', unitName: 'قطاعي', price: 50, qty: 1 });
    s.addLine({ productId: 'p1', unitId: null, name: 'Rice', unitName: 'قطاعي', price: 50, qty: 1 });
    s.addLine({ productId: 'p1', unitId: 'u-box', name: 'Rice', unitName: 'كرتونة', price: 480, qty: 1 });
    expect(useCart.getState().lines).toHaveLength(2);
    expect(useCart.getState().subtotal()).toBe(580);
  });
  it('setQty(0) removes the line', () => {
    const s = useCart.getState();
    s.addLine({ productId: 'p1', unitId: null, name: 'Rice', unitName: 'قطاعي', price: 50, qty: 1 });
    const key = useCart.getState().lines[0].key;
    s.setQty(key, 0);
    expect(useCart.getState().lines).toHaveLength(0);
  });
});
