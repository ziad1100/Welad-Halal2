import { useCallback, useEffect, useState } from 'react';
import { barcodeLookup, listCategories, searchProducts } from '../../services/api/products.api';
import { confirmOrder, holdOrder } from '../../services/api/orders.api';
import { useCart } from '../../store/cartStore';
import { useOrder } from '../../store/orderStore';
import { useBarcodeScanner } from '../../hooks/useBarcodeScanner';

export function CashierPage() {
  const { lines, addLine, setQty, remove, clear, subtotal, count, orderType, setOrderType } = useCart();
  const setLastOrder = useOrder((s) => s.setLastOrder);
  const [catalog, setCatalog] = useState<any[]>([]);
  const [cats, setCats] = useState<any[]>([]);
  const [search, setSearch] = useState('');
  const [catId, setCatId] = useState('');
  const [barcode, setBarcode] = useState('');
  const [msg, setMsg] = useState('');
  const [showNewProduct, setShowNewProduct] = useState<string | null>(null);

  const load = useCallback(async () => {
    const data = await searchProducts(search, catId);
    setCatalog(data);
  }, [search, catId]);

  useEffect(() => {
    listCategories().then(setCats).catch(() => {});
  }, []);
  useEffect(() => {
    const t = setTimeout(load, 200);
    return () => clearTimeout(t);
  }, [load]);

  const addProduct = useCallback((p: any, unit: any | null) => {
    addLine({
      productId: p.id,
      unitId: unit?.id ?? null,
      name: p.name,
      unitName: unit?.unitName ?? 'قطاعي',
      price: unit?.sellingPrice ?? p.basePrice,
      qty: 1,
    });
  }, [addLine]);

  const handleScan = useCallback(async (code: string) => {
    setMsg('');
    try {
      const { product, unit } = await barcodeLookup(code);
      addProduct(product, unit);
    } catch {
      setShowNewProduct(code);
    }
  }, [addProduct]);

  useBarcodeScanner(handleScan);

  async function doBarcodeField() {
    if (barcode.trim()) await handleScan(barcode.trim());
    setBarcode('');
  }

  async function doConfirm() {
    setMsg('');
    try {
      const order = await confirmOrder({
        lines: lines.map((l) => ({ productId: l.productId, unitId: l.unitId, qty: l.qty })),
        type: orderType,
        paymentMethod: 'cash',
      });
      setLastOrder(order);
      clear();
      setMsg(`تم التأكيد: ${order.reference} — ${Number(order.total).toFixed(2)} EGP`);
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Confirm failed');
    }
  }

  async function doHold() {
    setMsg('');
    try {
      const order = await holdOrder({
        lines: lines.map((l) => ({ productId: l.productId, unitId: l.unitId, qty: l.qty })),
        type: orderType,
      });
      clear();
      setMsg(`تم التعليق: ${order.reference}`);
    } catch (e: any) {
      setMsg(e?.response?.data?.message ?? 'Hold failed');
    }
  }

  useEffect(() => {
    const h = (e: KeyboardEvent) => {
      if (e.key === 'F9') { e.preventDefault(); doHold(); }
      if (e.key === 'F12') { e.preventDefault(); doConfirm(); }
      if (e.key === 'F2') { e.preventDefault(); document.getElementById('barcode-input')?.focus(); }
      if (e.key === 'F4') { e.preventDefault(); document.getElementById('search-input')?.focus(); }
    };
    window.addEventListener('keydown', h);
    return () => window.removeEventListener('keydown', h);
  });

  return (
    <div className="layout">
      <div className="wh-header">
        <span>عميل: زائر (F2)</span>
        <select value={orderType} onChange={(e) => setOrderType(e.target.value as any)}>
          <option value="pickup">استلام</option>
          <option value="delivery">توصيل</option>
        </select>
        <input id="barcode-input" data-barcode className="barcode-field" placeholder="باركود" value={barcode}
          onChange={(e) => setBarcode(e.target.value)}
          onKeyDown={(e) => { if (e.key === 'Enter') doBarcodeField(); }} style={{ flex: 1 }} />
      </div>
      <div style={{ display: 'flex', gap: 8, padding: 6 }}>
        <input id="search-input" placeholder="بحث (F4)" value={search} onChange={(e) => setSearch(e.target.value)} style={{ flex: 1 }} />
        <select value={catId} onChange={(e) => setCatId(e.target.value)}>
          <option value="">كل التصنيفات</option>
          {cats.map((c) => <option key={c.id} value={c.id}>{c.name}</option>)}
        </select>
      </div>
      <div className="cashier-grid">
        <div style={{ overflow: 'auto' }}>
          <table className="wh-table">
            <thead><tr><th>التصنيف</th><th>الصنف</th><th>الوصف</th><th>باركود</th><th>رصيد</th><th>قطاعي</th></tr></thead>
            <tbody>
              {catalog.map((p) => (
                <tr key={p.id} onClick={() => addProduct(p, null)} style={{ cursor: 'pointer' }}>
                  <td>{p.categoryName ?? ''}</td><td>{p.name}</td><td>{p.description ?? ''}</td>
                  <td>{p.barcode ?? ''}</td><td>{p.stockQty}</td><td>{Number(p.basePrice).toFixed(2)}</td>
                </tr>
              ))}
            </tbody>
          </table>
          <h4>السلة</h4>
          <table className="wh-table">
            <thead><tr><th>الصنف</th><th>التسعير</th><th>السعر</th><th>الكمية</th><th>الكلي</th><th></th></tr></thead>
            <tbody>
              {lines.map((l) => (
                <tr key={l.key} className="wh-active">
                  <td>{l.name}</td><td>{l.unitName}</td><td>{l.price.toFixed(2)}</td>
                  <td><input type="number" min={0.1} step={1} value={l.qty} onChange={(e) => setQty(l.key, Number(e.target.value))} style={{ width: 70 }} /></td>
                  <td>{(l.price * l.qty).toFixed(2)}</td>
                  <td><button className="wh-btn" onClick={() => remove(l.key)}>x</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
        <div>
          <div className="wh-total-box">الأصناف: {count()}<br />الإجمالي: {subtotal().toFixed(2)} ج.م</div>
          {msg && <div style={{ marginTop: 8 }}>{msg}</div>}
        </div>
      </div>
      <div className="bottom-bar">
        <button className="wh-btn">الطلبات</button>
        <button className="wh-btn">المشتريات</button>
        <button className="wh-btn">الأصناف</button>
        <button className="wh-btn">مرتجع</button>
        <button className="wh-btn">المصروفات</button>
        <button className="wh-btn">فتح الدرج</button>
        <button className="wh-btn">طباعة نسخة</button>
        <button className="wh-btn" onClick={doHold}>تعليق الفاتورة (F9)</button>
        <button className="wh-btn" onClick={doConfirm}>تأكيد (F12)</button>
      </div>
      {showNewProduct && (
        <div className="wh-modal" style={{ position: 'fixed', inset: '20% 30%', zIndex: 50 }}>
          <h3>صنف جديد — باركود {showNewProduct}</h3>
          <p>الباركود غير مسجل. أنشئ الصنف من شاشة الأصناف ثم أعد المسح.</p>
          <button className="wh-btn" onClick={() => setShowNewProduct(null)}>إغلاق</button>
        </div>
      )}
    </div>
  );
}
