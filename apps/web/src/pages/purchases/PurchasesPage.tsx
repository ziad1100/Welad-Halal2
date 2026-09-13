import { useEffect, useState } from 'react';
import { purchasesApi, partiesApi } from '../../services/api/erp.api';
import { searchProducts } from '../../services/api/products.api';
import { SearchableSelect } from '../../components/ui/SearchableSelect';

export function PurchasesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [suppliers, setSuppliers] = useState<any[]>([]);
  const [products, setProducts] = useState<any[]>([]);
  const [supId, setSupId] = useState('');
  const [prodId, setProdId] = useState('');
  const [qty, setQty] = useState(1);
  const [cost, setCost] = useState(0);
  const load = () => {
    purchasesApi.list().then(setRows).catch(() => {});
    partiesApi.list('supplier').then(setSuppliers).catch(() => {});
    searchProducts('').then(setProducts).catch(() => {});
  };
  useEffect(load, []);
  async function create() {
    if (!supId || !prodId || qty <= 0) return;
    await purchasesApi.create({ supplierId: supId, items: [{ productId: prodId, qty, unitCost: cost }] });
    load();
  }
  async function receive(id: string) {
    await purchasesApi.receive(id);
    load();
  }
  return (
    <div style={{ padding: 8 }}>
      <h3>المشتريات</h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8, flexWrap: 'wrap' }}>
        <SearchableSelect options={suppliers.map((s) => ({ value: s.id, label: s.name }))} value={supId} onChange={setSupId} placeholder="مورد..." />
        <SearchableSelect options={products.map((p) => ({ value: p.id, label: p.name }))} value={prodId} onChange={setProdId} placeholder="صنف..." />
        <input type="number" value={qty} onChange={(e) => setQty(Number(e.target.value))} style={{ width: 80 }} placeholder="كمية" />
        <input type="number" value={cost} onChange={(e) => setCost(Number(e.target.value))} style={{ width: 90 }} placeholder="تكلفة" />
        <button className="wh-btn" onClick={create}>إنشاء فاتورة شراء</button>
      </div>
      <table className="wh-table">
        <thead><tr><th>المورد</th><th>الإجمالي</th><th>مستلمة</th><th></th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ background: '#EDDDE7' }}>
              <td>{r.supplier?.name}</td><td>{Number(r.total).toFixed(2)}</td><td>{r.isReceived ? 'نعم' : 'لا'}</td>
              <td>{!r.isReceived && <button className="wh-btn" onClick={() => receive(r.id)}>استلام</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
