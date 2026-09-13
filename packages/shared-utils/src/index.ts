// Screen currency: ج.م — Receipt currency: EGP (never mix)
export function formatScreen(amount: number): string {
  return `${Number(amount).toFixed(2)} ج.م`;
}
export function formatReceipt(amount: number): string {
  return `${Number(amount).toFixed(2)} EGP`;
}
export function cartKey(productId: string, unitId?: string | null): string {
  return `${productId}::${unitId ?? 'base'}`;
}
