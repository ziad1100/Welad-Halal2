import { useEffect, useState } from 'react';
import { expensesApi } from '../../services/api/erp.api';

export function ExpensesPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [cat, setCat] = useState('');
  const [amount, setAmount] = useState(0);
  const load = () => expensesApi.list().then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);
  async function add() {
    if (!cat.trim() || amount <= 0) return;
    await expensesApi.create({ category: cat.trim(), amount });
    setCat(''); setAmount(0); load();
  }
  return (
    <div style={{ padding: 8 }}>
      <h3>المصروفات</h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <input placeholder="البند" value={cat} onChange={(e) => setCat(e.target.value)} />
        <input type="number" placeholder="المبلغ" value={amount} onChange={(e) => setAmount(Number(e.target.value))} style={{ width: 110 }} />
        <button className="wh-btn" onClick={add}>إضافة مصروف</button>
      </div>
      <table className="wh-table">
        <thead><tr><th>البند</th><th>المبلغ</th><th>ملاحظة</th><th>التاريخ</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ background: '#EDDDE7' }}>
              <td>{r.category}</td><td>{Number(r.amount).toFixed(2)}</td><td>{r.note ?? ''}</td>
              <td>{new Date(r.createdAt).toLocaleString('ar-EG')}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
