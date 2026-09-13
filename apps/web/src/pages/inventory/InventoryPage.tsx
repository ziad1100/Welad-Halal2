import { useEffect, useState } from 'react';
import { inventoryApi } from '../../services/api/erp.api';

export function InventoryPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [moves, setMoves] = useState<any[]>([]);
  const load = () => {
    inventoryApi.live().then(setRows).catch(() => {});
    inventoryApi.movements().then(setMoves).catch(() => {});
  };
  useEffect(load, []);
  return (
    <div style={{ padding: 8 }}>
      <h3>المخزن — الرصيد الحي</h3>
      <table className="wh-table">
        <thead><tr><th>الصنف</th><th>الكمية</th><th>متوسط التكلفة</th><th>القيمة</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ background: '#EDDDE7' }}>
              <td>{r.product?.name}</td><td>{r.quantity}</td><td>{Number(r.avgCost).toFixed(2)}</td>
              <td>{(r.quantity * r.avgCost).toFixed(2)}</td>
            </tr>
          ))}
        </tbody>
      </table>
      <h3>سجل الحركات</h3>
      <table className="wh-table">
        <thead><tr><th>النوع</th><th>التغير</th><th>التاريخ</th></tr></thead>
        <tbody>
          {moves.map((m) => (
            <tr key={m.id}><td>{m.type}</td><td>{m.qtyDelta}</td><td>{new Date(m.createdAt).toLocaleString('ar-EG')}</td></tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
