import { useEffect, useRef } from 'react';

// HID scanner: fast burst + Enter. Falls back to manual entry.
export function useBarcodeScanner(onScan: (code: string) => void) {
  const buf = useRef('');
  const last = useRef(0);

  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement;
      const typing = target && (target.tagName === 'INPUT' || target.tagName === 'TEXTAREA');
      // Allow global scan unless user is typing in a text field (except barcode field)
      if (typing && !(target as HTMLInputElement).dataset?.barcode) {
        if (e.key !== 'Enter') return;
      }
      const now = Date.now();
      if (now - last.current > 120) buf.current = '';
      last.current = now;
      if (e.key === 'Enter') {
        if (buf.current.length >= 3) {
          onScan(buf.current);
          buf.current = '';
        }
        return;
      }
      if (e.key.length === 1) buf.current += e.key;
    };
    window.addEventListener('keydown', handler);
    return () => window.removeEventListener('keydown', handler);
  }, [onScan]);
}
