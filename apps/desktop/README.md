# Welad Halal Desktop (Electron) — cashier station

Parallel track to `apps/web`. Loads the web cashier (`WEB_URL`, default
`http://localhost:5173/cashier`) inside Electron with:

- `electron/main.ts` — window, IPC, background sync every 30s
- `electron/preload.ts` — `window.whDesktop` bridge (barcode/print/drawer)
- `electron/barcode-listener.ts` — HID timing detection + optional `SERIAL_PORT`
- `src/lib/db.ts` + `src/lib/sync.ts` — `better-sqlite3` offline queue → Postgres replay
- `src/services/printer.service.ts` — ESC/POS receipt (mirrors `ReceiptPrintView`) + drawer kick

Install (needs native build tools for `better-sqlite3`):

```bash
npm install --workspace @welad/desktop
npm run dev --workspace @welad/desktop
```

Env: `WEB_URL`, `VITE_API_URL`, `SERIAL_PORT`, `PRINTER_INTERFACE`, `OFFLINE_DB`.
