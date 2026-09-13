import { useEffect, useState } from 'react';
import { partiesApi } from '../../services/api/erp.api';

export function SuppliersPage() {
  const [rows, setRows] = useState<any[]>([]);
  const [name, setName] = useState('');
  const [type, setType] = useState('both');
  const [filter, setFilter] = useState('');
  const load = () => partiesApi.list(filter).then(setRows).catch(() => {});
  useEffect(() => { load(); }, []);
  useEffect(() => { const t = setTimeout(load, 250); return () => clearTimeout(t); });
  async function add() {
    if (!name.trim()) return;
    await partiesApi.create({ name: name.trim(), type });
    setName('');
    load();
  }
  return (
    <div style={{ padding: 8 }}>
      <h3>الموردين والعملاء</h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <select value={filter} onChange={(e) => setFilter(e.target.value)}>
          <option value="">الكل</option><option value="supplier">مورد</option>
          <option value="customer">عميل</option><option value="both">كلاهما</option>
        </select>
        <button className="wh-btn" onClick={load}>تحديث</button>
        <input placeholder="اسم جديد" value={name} onChange={(e) => setName(e.target.value)} />
        <select value={type} onChange={(e) => setType(e.target.value)}>
          <option value="supplier">مورد</option><option value="customer">عميل</option><option value="both">كلاهما</option>
        </select>
        <button className="wh-btn" onClick={add}>إضافة</button>
      </div>
      <table className="wh-table">
        <thead><tr><th>الاسم</th><th>النوع</th><th>هاتف</th><th>نقاط</th><th>رصيد</th></tr></thead>
        <tbody>
          {rows.map((r) => (
            <tr key={r.id} style={{ background: '#EDDDE7' }}>
              <td>{r.name}</td><td>{r.type}</td><td>{r.phone ?? ''}</td><td>{r.loyaltyPoints}</td><td>{r.creditBalance}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
