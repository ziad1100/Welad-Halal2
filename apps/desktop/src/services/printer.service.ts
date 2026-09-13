// ESC/POS thermal printing — mirrors ReceiptPrintView structure (header,
// dividers, items, totals with emphasized total, footer). Falls back to console
// when no printer is configured (PRINTER_INTERFACE unset).
export function buildReceiptText(order: any): string {
  const L: string[] = [];
  L.push('ولاد حلال');
  L.push('--------------------------------');
  L.push(`طلب #${order.reference}`);
  L.push(new Date(order.createdAt).toLocaleString('ar-EG'));
  L.push('--------------------------------');
  L.push(`العميل: ${order.customer?.name ?? 'عميل'}`);
  L.push('الحالة: تم التأكيد');
  L.push('--------------------------------');
  for (const it of order.items ?? []) {
    L.push(`${it.qty}x ${it.productName}  ${Number(it.lineTotal).toFixed(2)} EGP`);
  }
  L.push('--------------------------------');
  L.push(`المجموع الفرعي: ${Number(order.subtotal).toFixed(2)} EGP`);
  if (Number(order.deliveryFee ?? 0) > 0) L.push(`التوصيل: ${Number(order.deliveryFee).toFixed(2)} EGP`);
  L.push('================================');
  L.push(`الإجمالي: ${Number(order.total).toFixed(2)} EGP`);
  L.push('الدفع: نقدي');
  L.push('شكراً لتسوقك من ولاد حلال');
  L.push('Thank you for shopping with Welad Halal!');
  L.push('•  •  •');
  return L.join('\n');
}

export async function printReceiptText(text: string) {
  const iface = process.env.PRINTER_INTERFACE;
  if (!iface) {
    // eslint-disable-next-line no-console
    console.log('--- RECEIPT (no printer configured) ---\n' + text);
    return { printed: false, reason: 'no-printer' };
  }
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Printer, types } = require('node-thermal-printer');
  const printer = new Printer({ type: types.EPSON, interface: iface });
  printer.clear();
  printer.println(text);
  printer.cut();
  await printer.execute();
  return { printed: true };
}

export async function openCashDrawer() {
  const iface = process.env.PRINTER_INTERFACE;
  if (!iface) return { opened: false, reason: 'no-printer' };
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  const { Printer, types } = require('node-thermal-printer');
  const printer = new Printer({ type: types.EPSON, interface: iface });
  printer.openCashDrawer();
  await printer.execute();
  return { opened: true };
}
