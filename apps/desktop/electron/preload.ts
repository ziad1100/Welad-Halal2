import { contextBridge, ipcRenderer } from 'electron';

// IPC bridge: renderer (React web build) talks to main for print/drawer/barcode.
contextBridge.exposeInMainWorld('whDesktop', {
  onBarcode: (cb: (code: string) => void) => ipcRenderer.on('barcode:scan', (_e, code: string) => cb(code)),
  printReceipt: (text: string) => ipcRenderer.invoke('print:receipt', text),
  openDrawer: () => ipcRenderer.invoke('drawer:open'),
});
