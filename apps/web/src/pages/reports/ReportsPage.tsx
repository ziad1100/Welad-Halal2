import { useEffect, useState } from 'react';
import { reportsApi } from '../../services/api/erp.api';

export function ReportsPage() {
  const [daily, setDaily] = useState<any[]>([]);
  const [top, setTop] = useState<any[]>([]);
  const [inv, setInv] = useState<any>(null);
  const [exp, setExp] = useState<any>(null);
  useEffect(() => {
    reportsApi.daily().then(setDaily).catch(() => {});
    reportsApi.top().then(setTop).catch(() => {});
    reportsApi.invVal().then(setInv).catch(() => {});
    reportsApi.exp().then(setExp).catch(() => {});
  }, []);
  return (
    <div style={{ padding: 8 }}>
      <h3>تقارير العمل</h3>
      <h4>المبيعات اليومية (14 يوم)</h4>
      <table className="wh-table">
        <thead><tr><th>اليوم</th><th>عدد الطلبات</th><th>الإجمالي</th></tr></thead>
        <tbody>{daily.map((d) => <tr key={d.day}><td>{d.day}</td><td>{d.count}</td><td>{Number(d.total).toFixed(2)}</td></tr>)}</tbody>
      </table>
      <h4>الأعلى مبيعاً</h4>
      <table className="wh-table">
        <thead><tr><th>الصنف</th><th>الكمية</th><th>الإيراد</th></tr></thead>
        <tbody>{top.map((t) => <tr key={t.productId}><td>{t.name}</td><td>{t.qty}</td><td>{Number(t.revenue).toFixed(2)}</td></tr>)}</tbody>
      </table>
      <h4>قيمة المخزون: {inv ? `${Number(inv.totalValue).toFixed(2)} (${inv.lines} بند)` : '...'}</h4>
      <h4>المصروفات (30 يوم): {exp ? `${Number(exp.total).toFixed(2)} (${exp.count})` : '...'}</h4>
    </div>
  );
}
