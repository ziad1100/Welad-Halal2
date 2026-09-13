// Server-side discount math — backend is the price authority, never the frontend.
export type DiscountKind = 'percentage' | 'fixed_amount';

export function computeDiscountAmount(type: DiscountKind, value: number, subtotal: number): number {
  if (type === 'percentage') return (subtotal * value) / 100;
  return Math.min(value, subtotal);
}

export function discountError(dc: { isActive: boolean; validFrom: Date | null; validTo: Date | null; usageLimit: number | null; usedCount: number } | null, now = new Date()): string | null {
  if (!dc || !dc.isActive) return 'Invalid discount';
  if (dc.validFrom && dc.validFrom > now) return 'Discount not started';
  if (dc.validTo && dc.validTo < now) return 'Discount expired';
  if (dc.usageLimit != null && dc.usedCount >= dc.usageLimit) return 'Discount exhausted';
  return null;
}
