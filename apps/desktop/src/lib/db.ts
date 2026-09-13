import * as path from 'path';

// Offline-first queue (better-sqlite3). Cashier keeps working without internet;
// pushPending() replays to Postgres backend on reconnect.
let db: any = null;

export function localDb() {
  if (db) return db;
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const Database = require('better-sqlite3');
  const file = process.env.OFFLINE_DB ?? path.join(process.cwd(), 'offline.db');
  db = new Database(file);
  db.exec(`CREATE TABLE IF NOT EXISTS pending_ops (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    kind TEXT NOT NULL,
    payload TEXT NOT NULL,
    created_at TEXT NOT NULL DEFAULT (datetime('now'))
  )`);
  return db;
}

export function queueOp(kind: string, payload: any) {
  localDb().prepare('INSERT INTO pending_ops (kind, payload) VALUES (?, ?)').run(kind, JSON.stringify(payload));
}

export function listPending(): { id: number; kind: string; payload: any }[] {
  return localDb()
    .prepare('SELECT id, kind, payload FROM pending_ops ORDER BY id ASC LIMIT 100')
    .all()
    .map((r: any) => ({ id: r.id, kind: r.kind, payload: JSON.parse(r.payload) }));
}

export function ackOp(id: number) {
  localDb().prepare('DELETE FROM pending_ops WHERE id = ?').run(id);
}
