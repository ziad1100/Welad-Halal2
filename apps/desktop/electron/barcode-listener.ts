// HID keyboard-emulation detection (timing-based) + optional Serial path.
// The React cashier ALSO has useBarcodeScanner; this main-process listener covers
// global capture even when the window is not focused.
export function startBarcodeListener(onScan: (code: string) => void) {
  let buf = '';
  let last = 0;
  const onKey = (chunk: string) => {
    const now = Date.now();
    if (now - last > 120) buf = '';
    last = now;
    if (chunk === '\r' || chunk === '\n') {
      if (buf.length >= 3) onScan(buf);
      buf = '';
      return;
    }
    if (chunk.length === 1) buf += chunk;
  };

  // Serial/Bluetooth scanners via `serialport` (optional — enabled if SERIAL_PORT set)
  const port = process.env.SERIAL_PORT;
  if (port) {
    try {
      // eslint-disable-next-line @typescript-eslint/no-require-imports
      const { SerialPort } = require('serialport');
      const sp = new SerialPort({ path: port, baudRate: 9600 });
      sp.on('data', (d: Buffer) => {
        for (const ch of d.toString()) onKey(ch === '\r' ? '\n' : ch);
      });
    } catch {
      /* serial unavailable — HID path still active */
    }
  }
  // NOTE: main-process stdin key capture is platform-specific; renderer hook is primary.
  if (process.stdin.isTTY) {
    try {
      process.stdin.setRawMode(true);
      process.stdin.on('data', (d: Buffer) => onKey(d.toString()));
    } catch {
      /* ignore */
    }
  }
}
