import { listPending, ackOp } from './db';

// Replay offline queue: held orders, confirmed orders, inventory adjustments.
export async function pushPending(apiUrl: string, token?: string) {
  const ops = listPending();
  for (const op of ops) {
    const endpoint = op.kind === 'order.confirm' ? '/orders/confirm' : op.kind === 'order.hold' ? '/orders/hold' : op.kind === 'inventory.adjust' ? '/inventory/adjust' : null;
    if (!endpoint) {
      ackOp(op.id);
      continue;
    }
    const res = await fetch(`${apiUrl}${endpoint}`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(token ? { Authorization: `Bearer ${token}` } : {}) },
      body: JSON.stringify(op.payload),
    });
    if (res.ok) ackOp(op.id);
    else break; // stop on first failure, retry next cycle
  }
  return { remaining: listPending().length };
}
