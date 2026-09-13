import { Client } from 'pg';

export const API = process.env.E2E_API_URL ?? 'http://localhost:3001/api';

export function dbUrl(): string {
  const u = process.env.DATABASE_URL ?? 'postgresql://postgres:postgres@localhost:5432/welad?schema=public';
  return u.replace('@postgres:', '@localhost:').replace('@redis:', '@localhost:');
}

export async function apiLogin(username: string, password: string) {
  const r = await fetch(`${API}/auth/login`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ username, password }),
  });
  return { status: r.status, body: r.status === 200 ? await r.json() : null };
}

export async function apiAuthed(token: string, method: string, path: string, body?: any) {
  const r = await fetch(`${API}${path}`, {
    method,
    headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
    body: body ? JSON.stringify(body) : undefined,
  });
  const text = await r.text();
  return { status: r.status, body: text ? JSON.parse(text) : null };
}

// Delete all rows created by e2e specs (barcode/test-name prefix).
export async function cleanupPrefix(prefix: string) {
  const c = new Client({ connectionString: dbUrl() });
  await c.connect();
  try {
    await c.query(`DELETE FROM "OrderItem" WHERE "productId" IN (SELECT id FROM "Product" WHERE barcode LIKE $1)`, [`${prefix}%`]);
    await c.query(`DELETE FROM "Order" WHERE id NOT IN (SELECT "orderId" FROM "OrderItem") AND reference LIKE 'WH-%'`);
    await c.query(`DELETE FROM "StockMovement" WHERE "productId" IN (SELECT id FROM "Product" WHERE barcode LIKE $1)`, [`${prefix}%`]);
    await c.query(`DELETE FROM "Inventory" WHERE "productId" IN (SELECT id FROM "Product" WHERE barcode LIKE $1)`, [`${prefix}%`]);
    await c.query(`DELETE FROM "PurchaseItem" WHERE "productId" IN (SELECT id FROM "Product" WHERE barcode LIKE $1)`, [`${prefix}%`]);
    await c.query(`DELETE FROM "Product" WHERE barcode LIKE $1`, [`${prefix}%`]);
  } finally {
    await c.end();
  }
}
