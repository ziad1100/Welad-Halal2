import { useEffect, useState } from 'react';
import { employeesApi, usersApi, shiftsApi } from '../../services/api/erp.api';

export function HRPage() {
  const [emps, setEmps] = useState<any[]>([]);
  const [users, setUsers] = useState<any[]>([]);
  const [shifts, setShifts] = useState<any[]>([]);
  const [userId, setUserId] = useState('');
  const [openCash, setOpenCash] = useState(0);
  const load = () => {
    employeesApi.list().then(setEmps).catch(() => {});
    usersApi.list().then(setUsers).catch(() => {});
    shiftsApi.list().then(setShifts).catch(() => {});
  };
  useEffect(load, []);
  return (
    <div style={{ padding: 8 }}>
      <h3>شئون العاملين</h3>
      <div style={{ display: 'flex', gap: 6, marginBottom: 8 }}>
        <select value={userId} onChange={(e) => setUserId(e.target.value)}>
          <option value="">مستخدم...</option>
          {users.map((u) => <option key={u.id} value={u.id}>{u.username}</option>)}
        </select>
        <button className="wh-btn" onClick={async () => { if (userId) { await employeesApi.create({ userId }); setUserId(''); load(); } }}>ربط موظف</button>
        <input type="number" value={openCash} onChange={(e) => setOpenCash(Number(e.target.value))} style={{ width: 110 }} placeholder="عهدة" />
        <button className="wh-btn" onClick={async () => { await shiftsApi.open(openCash); load(); }}>فتح وردية</button>
      </div>
      <h4>الموظفون</h4>
      <table className="wh-table">
        <thead><tr><th>المستخدم</th><th>الوظيفة</th><th>هاتف</th></tr></thead>
        <tbody>{emps.map((e) => <tr key={e.id} style={{ background: '#EDDDE7' }}><td>{e.user?.username}</td><td>{e.position ?? ''}</td><td>{e.phone ?? ''}</td></tr>)}</tbody>
      </table>
      <h4>الورديات</h4>
      <table className="wh-table">
        <thead><tr><th>الموظف</th><th>الحالة</th><th>افتتاحية</th><th>ختامية</th><th>متوقعة</th><th></th></tr></thead>
        <tbody>
          {shifts.map((s) => (
            <tr key={s.id}>
              <td>{s.employee?.user?.username}</td><td>{s.status}</td><td>{s.openingCash}</td>
              <td>{s.closingCash ?? '-'}</td><td>{s.expectedCash ?? '-'}</td>
              <td>{s.status === 'open' && <button className="wh-btn" onClick={async () => { const v = prompt('النقدية الفعلية:', '0'); if (v !== null) { await shiftsApi.close(s.id, Number(v)); load(); } }}>إغلاق</button>}</td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
