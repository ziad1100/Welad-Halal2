// AVERAGE COST (not FIFO) — single source of truth for all receiving paths
// (purchases receive, manufacturing produce).
export function computeAvgCost(oldQty: number, oldCost: number, inQty: number, inCost: number): number {
  const total = oldQty + inQty;
  if (total <= 0) return inCost;
  return (oldQty * oldCost + inQty * inCost) / total;
}
